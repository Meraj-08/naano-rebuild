-- Manually-entered creator & brand profiles (no LinkedIn API — fields stored as-is).
create table if not exists public.profiles (
  user_id      uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  role         text,                 -- 'creator' | 'brand'
  -- creator fields
  name         text,
  bio          text,
  tags         text,                 -- comma-joined categories, stored as-is
  rate         text,                 -- per-post price, e.g. "€100"
  avatar       text,                 -- local path or uploaded URL
  linkedin_url text,                 -- plain link, NOT verified or fetched
  -- brand fields
  company_name text,
  website_url  text,                 -- plain link, informational only
  description  text,                 -- short tagline shown to creators on invitations
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists own_select on public.profiles;
drop policy if exists own_insert on public.profiles;
drop policy if exists own_update on public.profiles;
create policy own_select on public.profiles for select using (auth.uid() = user_id);
create policy own_insert on public.profiles for insert with check (auth.uid() = user_id);
create policy own_update on public.profiles for update using (auth.uid() = user_id);
