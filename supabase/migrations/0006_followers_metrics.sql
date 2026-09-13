-- Follower count on profiles + mock post metrics on collaborations.
alter table public.profiles add column if not exists followers integer not null default 0;

alter table public.collaborations add column if not exists post_impressions integer;
alter table public.collaborations add column if not exists post_reactions integer;
alter table public.collaborations add column if not exists post_comments integer;
alter table public.collaborations add column if not exists post_clicks integer;

-- Give the demo seed creators realistic follower counts (idempotent: only touches seeds still at 0).
update public.profiles set followers = case name
  when 'Ava Bennett'     then 12400
  when 'Diego Martins'   then 48200
  when 'Priya Nair'      then 21800
  when 'Liam O''Sullivan' then 33500
  when 'Sofia Rossi'     then 8600
  when 'Noah Kim'        then 74100
  when 'Maya Haddad'     then 15200
  when 'Tom Fischer'     then 52700
  else followers end
where is_seed = true and followers = 0;
