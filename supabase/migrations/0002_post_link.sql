-- Extend collaborations with the submitted post link (status flow: invited → active → submitted → completed)
alter table public.collaborations add column if not exists post_url text;
