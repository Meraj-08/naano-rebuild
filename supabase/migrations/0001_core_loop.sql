-- Naano core-loop slice: campaigns + collaborations, two-sided (brand ↔ creator).
-- Run once in Supabase → SQL Editor. Idempotent.

create table if not exists public.campaigns (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name        text not null,
  brief       text,
  status      text not null default 'active',
  created_at  timestamptz not null default now()
);

create table if not exists public.collaborations (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null default auth.uid() references auth.users(id) on delete cascade,  -- brand (owner)
  creator_user_id uuid references auth.users(id) on delete set null,                             -- who receives the invite
  campaign_id     uuid references public.campaigns(id) on delete set null,
  creator_name    text not null,
  creator_avatar  text,
  creator_tags    text,
  rate            text,
  status          text not null default 'invited',   -- invited → active → completed
  next_action     text default 'Awaiting creator',
  due_date        date,
  net             text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
alter table public.collaborations add column if not exists creator_user_id uuid references auth.users(id) on delete set null;
alter table public.collaborations add column if not exists updated_at timestamptz not null default now();

alter table public.campaigns      enable row level security;
alter table public.collaborations enable row level security;

-- campaigns: owner-only
drop policy if exists own_select on public.campaigns;
drop policy if exists own_insert on public.campaigns;
drop policy if exists own_update on public.campaigns;
drop policy if exists own_delete on public.campaigns;
create policy own_select on public.campaigns for select using (auth.uid() = user_id);
create policy own_insert on public.campaigns for insert with check (auth.uid() = user_id);
create policy own_update on public.campaigns for update using (auth.uid() = user_id);
create policy own_delete on public.campaigns for delete using (auth.uid() = user_id);

-- collaborations: brand OR the invited creator can see; brand creates; either side can update (creator accepts)
drop policy if exists collab_select on public.collaborations;
drop policy if exists collab_insert on public.collaborations;
drop policy if exists collab_update on public.collaborations;
drop policy if exists collab_delete on public.collaborations;
create policy collab_select on public.collaborations for select using (auth.uid() = user_id or auth.uid() = creator_user_id);
create policy collab_insert on public.collaborations for insert with check (auth.uid() = user_id);
create policy collab_update on public.collaborations for update using (auth.uid() = user_id or auth.uid() = creator_user_id);
create policy collab_delete on public.collaborations for delete using (auth.uid() = user_id);

create index if not exists collaborations_brand_idx   on public.collaborations (user_id, created_at desc);
create index if not exists collaborations_creator_idx on public.collaborations (creator_user_id, created_at desc);
create index if not exists campaigns_user_idx         on public.campaigns (user_id, created_at desc);
