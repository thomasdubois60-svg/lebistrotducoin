-- À exécuter une seule fois dans Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.club_members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  email text not null unique,
  birthday date,
  email_marketing boolean not null default false,
  notification_interest boolean not null default true,
  consent_updated_at timestamptz not null default now(),
  loyalty_points integer not null default 0 check (loyalty_points >= 0),
  reward_available boolean not null default false,
  personal_code uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.club_members enable row level security;
-- Aucun accès public direct : toutes les opérations passent par les routes serveur sécurisées du site.
