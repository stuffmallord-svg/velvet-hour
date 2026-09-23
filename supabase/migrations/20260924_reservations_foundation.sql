create extension if not exists pgcrypto;

create table if not exists public.guests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 120),
  email text not null unique check (char_length(email) <= 254),
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tables (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  capacity integer not null check (capacity between 1 and 50),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references public.guests(id) on delete restrict,
  reservation_date date not null,
  reservation_time time not null,
  guests integer not null check (guests between 1 and 20),
  occasion text not null check (char_length(trim(occasion)) between 1 and 80),
  phone text not null check (char_length(trim(phone)) between 3 and 40),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  idempotency_key uuid not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_date_time_idx
  on public.reservations (reservation_date, reservation_time);

create index if not exists reservations_guest_id_idx
  on public.reservations (guest_id);

alter table public.guests enable row level security;
alter table public.tables enable row level security;
alter table public.reservations enable row level security;

insert into public.tables (name, capacity)
values
  ('THE RED ROOM', 8),
  ('THE CELLAR', 14),
  ('THE SALON', 28),
  ('THE LONG TABLE', 50)
on conflict (name) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists guests_set_updated_at on public.guests;
create trigger guests_set_updated_at
before update on public.guests
for each row execute function public.set_updated_at();

drop trigger if exists reservations_set_updated_at on public.reservations;
create trigger reservations_set_updated_at
before update on public.reservations
for each row execute function public.set_updated_at();
