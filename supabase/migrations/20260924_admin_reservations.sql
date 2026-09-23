create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.reservation_status_audit (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  admin_user_id uuid not null references auth.users(id) on delete restrict,
  old_status text not null check (old_status in ('pending', 'confirmed', 'cancelled')),
  new_status text not null check (new_status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now(),
  check (old_status <> new_status)
);

create index if not exists reservation_status_audit_reservation_idx
  on public.reservation_status_audit (reservation_id, created_at desc);

create index if not exists reservation_status_audit_admin_idx
  on public.reservation_status_audit (admin_user_id, created_at desc);

create index if not exists reservations_admin_date_status_idx
  on public.reservations (reservation_date, status, reservation_time);

alter table public.admin_users enable row level security;
alter table public.reservation_status_audit enable row level security;

revoke all on table public.admin_users from anon, authenticated;
grant select on table public.admin_users to authenticated;

create policy admin_users_select_self
on public.admin_users
for select
to authenticated
using (user_id = (select auth.uid()));

revoke all on table public.reservation_status_audit from anon, authenticated;

create or replace function public.admin_update_reservation_status(
  p_reservation_id uuid,
  p_admin_user_id uuid,
  p_new_status text
)
returns table (
  id uuid,
  status text,
  reservation_date date,
  reservation_time time,
  old_status text,
  new_status text,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_status text;
begin
  if p_new_status is null or p_new_status not in ('pending', 'confirmed', 'cancelled') then
    raise exception using
      errcode = '22023',
      message = 'Invalid reservation status.';
  end if;

  if not exists (
    select 1
    from public.admin_users as a
    where a.user_id = p_admin_user_id
  ) then
    raise exception using
      errcode = '42501',
      message = 'Admin authorization required.';
  end if;

  select r.status
  into current_status
  from public.reservations as r
  where r.id = p_reservation_id
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Reservation not found.';
  end if;

  if not (
    (current_status = 'pending' and p_new_status in ('confirmed', 'cancelled'))
    or (current_status = 'confirmed' and p_new_status = 'cancelled')
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'Invalid reservation status transition.';
  end if;

  update public.reservations as r
  set status = p_new_status,
      updated_at = now()
  where r.id = p_reservation_id
  returning
    r.id,
    r.status,
    r.reservation_date,
    r.reservation_time,
    r.updated_at
  into id, status, reservation_date, reservation_time, updated_at;

  insert into public.reservation_status_audit (
    reservation_id,
    admin_user_id,
    old_status,
    new_status
  )
  values (
    p_reservation_id,
    p_admin_user_id,
    current_status,
    p_new_status
  );

  old_status := current_status;
  new_status := p_new_status;
  return next;
end;
$$;

revoke all on function public.admin_update_reservation_status(uuid, uuid, text)
  from public, anon, authenticated;

grant execute on function public.admin_update_reservation_status(uuid, uuid, text)
  to service_role;
