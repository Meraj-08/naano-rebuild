-- Wallet bookkeeping (real DB rows; NOT connected to any payment processor).
create table if not exists public.wallet_transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount      numeric not null,
  type        text not null check (type in ('credit','debit')),
  description text,
  created_at  timestamptz not null default now()
);
alter table public.wallet_transactions enable row level security;

-- Owners read their own ledger; owners may insert their own credits (e.g. Add budget).
drop policy if exists wallet_select on public.wallet_transactions;
drop policy if exists wallet_insert on public.wallet_transactions;
create policy wallet_select on public.wallet_transactions for select using (auth.uid() = user_id);
create policy wallet_insert on public.wallet_transactions for insert with check (auth.uid() = user_id);

create index if not exists wallet_user_idx on public.wallet_transactions (user_id, created_at desc);

-- Completing a collaboration: flip status + write brand debit AND creator credit atomically.
-- SECURITY DEFINER so the brand can create the creator's credit row (bypasses owner-only insert),
-- but only for a collaboration the caller actually owns.
create or replace function public.complete_collaboration(p_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  c public.collaborations%rowtype;
  amt numeric;
begin
  select * into c from public.collaborations where id = p_id and user_id = auth.uid();
  if not found then raise exception 'collaboration not found or not owned by caller'; end if;
  if c.status = 'completed' then return; end if;

  amt := coalesce(nullif(regexp_replace(coalesce(c.net, c.rate, '0'), '[^0-9]', '', 'g'), ''), '0')::numeric;

  update public.collaborations
    set status = 'completed', next_action = 'Done', updated_at = now()
    where id = p_id;

  insert into public.wallet_transactions (user_id, amount, type, description)
    values (c.user_id, amt, 'debit', 'Payment for collaboration with ' || coalesce(c.creator_name, 'creator'));

  if c.creator_user_id is not null then
    insert into public.wallet_transactions (user_id, amount, type, description)
      values (c.creator_user_id, amt, 'credit', 'Earnings from a brand collaboration');
  end if;
end $$;

grant execute on function public.complete_collaboration(uuid) to authenticated;
