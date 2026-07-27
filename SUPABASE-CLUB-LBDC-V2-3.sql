-- V2.3 : historique, règle d'un passage par jour, récompenses et justificatifs.
create table if not exists public.club_loyalty_events (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.club_members(id) on delete cascade,
  event_type text not null check (event_type in ('passage','reward')),
  event_day date not null default current_date,
  created_at timestamptz not null default now(),
  receipt_number text unique,
  reward_value_ttc numeric(10,2),
  note text
);

create unique index if not exists club_loyalty_one_passage_per_day
  on public.club_loyalty_events(member_id,event_day)
  where event_type='passage';

create index if not exists club_loyalty_events_member_created
  on public.club_loyalty_events(member_id,created_at desc);
create index if not exists club_loyalty_events_type_created
  on public.club_loyalty_events(event_type,created_at desc);

alter table public.club_loyalty_events enable row level security;
revoke all on table public.club_loyalty_events from anon, authenticated;
