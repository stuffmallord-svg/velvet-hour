create or replace function public.create_reservation(
  p_guest_name text,
  p_guest_email text,
  p_guest_phone text,
  p_reservation_date date,
  p_reservation_time time,
  p_guests integer,
  p_occasion text,
  p_idempotency_key uuid
)
returns table (
  id uuid,
  status text,
  reservation_date date,
  reservation_time time,
  duplicate boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation_record public.reservations%rowtype;
  guest_id uuid;
  table_capacity integer;
  booked_count integer;
begin
  select *
  into reservation_record
  from public.reservations
  where idempotency_key = p_idempotency_key;

  if found then
    return query
    select
      reservation_record.id,
      reservation_record.status,
      reservation_record.reservation_date,
      reservation_record.reservation_time,
      true;
    return;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(p_idempotency_key::text, 1)
  );

  select *
  into reservation_record
  from public.reservations
  where idempotency_key = p_idempotency_key;

  if found then
    return query
    select
      reservation_record.id,
      reservation_record.status,
      reservation_record.reservation_date,
      reservation_record.reservation_time,
      true;
    return;
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(
      format('%s:%s', p_reservation_date, p_reservation_time),
      0
    )
  );

  select *
  into reservation_record
  from public.reservations
  where idempotency_key = p_idempotency_key;

  if found then
    return query
    select
      reservation_record.id,
      reservation_record.status,
      reservation_record.reservation_date,
      reservation_record.reservation_time,
      true;
    return;
  end if;

  select count(*)
  into table_capacity
  from public.tables
  where active = true
    and capacity >= p_guests;

  select count(*)
  into booked_count
  from public.reservations
  where reservation_date = p_reservation_date
    and reservation_time = p_reservation_time
    and status in ('pending', 'confirmed');

  if booked_count >= table_capacity then
    raise exception using
      errcode = 'P0001',
      message = 'No tables available for this time.';
  end if;

  insert into public.guests (name, email, phone)
  values (p_guest_name, p_guest_email, p_guest_phone)
  on conflict (email) do update
    set name = excluded.name,
        phone = excluded.phone,
        updated_at = now()
  returning guests.id into guest_id;

  insert into public.reservations (
    guest_id,
    reservation_date,
    reservation_time,
    guests,
    occasion,
    phone,
    idempotency_key
  )
  values (
    guest_id,
    p_reservation_date,
    p_reservation_time,
    p_guests,
    p_occasion,
    p_guest_phone,
    p_idempotency_key
  )
  returning reservations.* into reservation_record;

  return query
  select
    reservation_record.id,
    reservation_record.status,
    reservation_record.reservation_date,
    reservation_record.reservation_time,
    false;
end;
$$;

revoke all on function public.create_reservation(
  text, text, text, date, time, integer, text, uuid
) from public, anon, authenticated;

grant execute on function public.create_reservation(
  text, text, text, date, time, integer, text, uuid
) to service_role;
