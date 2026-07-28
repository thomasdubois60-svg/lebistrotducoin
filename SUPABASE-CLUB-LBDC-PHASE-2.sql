create table if not exists public.club_promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  discount_label text not null default '',
  product_label text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists club_promotions_active_dates_idx on public.club_promotions(active,start_at,end_at);
alter table public.club_promotions enable row level security;
