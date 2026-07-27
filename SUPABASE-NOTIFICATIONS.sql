create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  subscription jsonb not null,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;

-- Aucun accès public : seules les routes serveur utilisant la clé service_role peuvent lire ou écrire.
revoke all on table public.push_subscriptions from anon, authenticated;
