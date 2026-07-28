-- Phase 1 : offre de bienvenue -10 %, suivi comptable et rappels ciblés.
create extension if not exists pgcrypto;
create table if not exists public.club_welcome_offers (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references public.club_members(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(24), 'hex'),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  used_at timestamptz,
  original_amount_ttc numeric(10,2),
  discount_rate numeric(5,2) not null default 10.00,
  discount_amount_ttc numeric(10,2),
  final_amount_ttc numeric(10,2),
  receipt_number text unique,
  reminder_sent_at timestamptz,
  check (discount_rate >= 0 and discount_rate <= 100)
);
create index if not exists club_welcome_offers_status on public.club_welcome_offers(used_at, expires_at);
create index if not exists club_welcome_offers_member on public.club_welcome_offers(member_id);
alter table public.club_welcome_offers enable row level security;
revoke all on table public.club_welcome_offers from anon, authenticated;

-- Lie facultativement un abonnement push à un membre pour les rappels ciblés.
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  subscription jsonb not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.push_subscriptions enable row level security;
revoke all on table public.push_subscriptions from anon, authenticated;
alter table public.push_subscriptions add column if not exists member_id uuid references public.club_members(id) on delete set null;
create index if not exists push_subscriptions_member_id on public.push_subscriptions(member_id);
