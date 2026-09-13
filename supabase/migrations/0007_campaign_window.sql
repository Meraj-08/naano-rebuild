-- Active booking window for campaigns.
-- start_date/end_date bound when new invites (collaborations) may be created for a campaign.
-- "ended" status is computed on read from these dates, not stored — so no background job is needed.
alter table public.campaigns add column if not exists start_date date;
alter table public.campaigns add column if not exists end_date date;

-- Backfill existing campaigns with a sensible open window (today → +14 days) so they stay bookable.
update public.campaigns
  set start_date = coalesce(start_date, current_date),
      end_date   = coalesce(end_date, current_date + interval '14 days')
  where start_date is null or end_date is null;
