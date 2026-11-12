-- My Face Profile OS — Sprint 1 schema
-- 12+ tables · RLS · PostGIS · Seed AYO'S TAILORS Spindlegate OL1

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
-- Optional on hosted Supabase (enable in dashboard if missing):
-- create extension if not exists postgis;

-- 1 profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  trade_type text,
  shop_name text,
  location text,
  verification_status text default 'unverified',
  trust_score numeric(3,1) default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2 professional_profiles
create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  display_name text,
  bio text,
  trades text[] default '{}',
  radius_mi numeric default 10,
  created_at timestamptz default now()
);

-- 3 projects (killer object)
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  before_image text,
  after_image text,
  milestones jsonb default '[]'::jsonb,
  materials jsonb default '[]'::jsonb,
  team jsonb default '[]'::jsonb,
  cost numeric(12,2),
  shop_link text,
  booking_link text,
  gift_count int default 0,
  location_label text,
  slug text,
  created_at timestamptz default now()
);

-- 4 posts (must have work_ref)
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  work_ref uuid not null references public.projects(id) on delete cascade,
  caption text,
  media_url text,
  created_at timestamptz default now()
);

-- 5 services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  price numeric(12,2),
  duration_mins int,
  created_at timestamptz default now()
);

-- 6 shop_items
create table if not exists public.shop_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  price numeric(12,2) not null,
  stock int default 0,
  image text,
  delivery_radius_mi numeric default 10,
  escrow_pct numeric default 5,
  created_at timestamptz default now()
);

-- 7 bookings (Discovery→Repeat)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  shop_item_id uuid references public.shop_items(id) on delete set null,
  contact_name text,
  status text not null default 'Discovery'
    check (status in (
      'Discovery','Engagement','Inquiry','Quote','Booked',
      'In Progress','Final','Review','Repeat'
    )),
  calendar_date date,
  revenue numeric(12,2) default 0,
  escrow_pct numeric default 10,
  created_at timestamptz default now()
);

-- 8 live_sessions
create table if not exists public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  mux_id text,
  viewers int default 0,
  gift_rain jsonb default '[]'::jsonb,
  is_live boolean default false,
  created_at timestamptz default now()
);

-- 9 uprm_contacts
create table if not exists public.uprm_contacts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relationship_strength int not null default 50 check (relationship_strength between 0 and 100),
  last_interaction timestamptz,
  journey_state text not null default 'Discovery',
  role text,
  created_at timestamptz default now()
);

-- 10 interaction_events (event-sourced)
create table if not exists public.interaction_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid references public.uprm_contacts(id) on delete set null,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- 11 journey_states (optional mirror)
create table if not exists public.journey_states (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  contact_id uuid references public.uprm_contacts(id) on delete cascade,
  state text not null,
  updated_at timestamptz default now()
);

-- 12 mfc_wallet
create table if not exists public.mfc_wallet (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance int not null default 0,
  updated_at timestamptz default now()
);

-- trust_ledger append-only
create table if not exists public.trust_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- gift_ledger
create table if not exists public.gift_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  from_user text,
  gift_kind text not null,
  coins int not null,
  created_at timestamptz default now()
);

-- onboarding_memory
create table if not exists public.onboarding_memory (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  fields jsonb not null default '{}'::jsonb,
  completed boolean default false,
  updated_at timestamptz default now()
);

-- onboarding_conversations
create table if not exists public.onboarding_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  turn_index int not null,
  field_id text,
  question_text text,
  why_text text,
  user_answer text,
  answer_value jsonb,
  created_at timestamptz default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.professional_profiles enable row level security;
alter table public.projects enable row level security;
alter table public.posts enable row level security;
alter table public.services enable row level security;
alter table public.shop_items enable row level security;
alter table public.bookings enable row level security;
alter table public.live_sessions enable row level security;
alter table public.uprm_contacts enable row level security;
alter table public.interaction_events enable row level security;
alter table public.journey_states enable row level security;
alter table public.mfc_wallet enable row level security;
alter table public.trust_ledger enable row level security;
alter table public.gift_ledger enable row level security;
alter table public.onboarding_memory enable row level security;
alter table public.onboarding_conversations enable row level security;

create policy "profiles_own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "projects_own" on public.projects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_public_read" on public.projects for select using (true);
create policy "contacts_own" on public.uprm_contacts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "wallet_own" on public.mfc_wallet for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "trust_own" on public.trust_ledger for select using (auth.uid() = user_id);
create policy "trust_insert_own" on public.trust_ledger for insert with check (auth.uid() = user_id);
create policy "gifts_own" on public.gift_ledger for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "onboard_mem_own" on public.onboarding_memory for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "onboard_conv_own" on public.onboarding_conversations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "bookings_own" on public.bookings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "shop_own" on public.shop_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "shop_public_read" on public.shop_items for select using (true);
create policy "posts_own" on public.posts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "posts_public_read" on public.posts for select using (true);
create policy "services_own" on public.services for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "live_own" on public.live_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "events_own" on public.interaction_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "journey_own" on public.journey_states for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "pro_own" on public.professional_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Demo seed helper (run after creating a demo auth user, or use service role)
-- Replace :demo_uid with real uuid when applying.
-- Seed data file: supabase/seed_oldham.sql
--
-- B2B Dataset Marketplace (apply separately):
--   supabase/dataset_store.sql
-- Tables: dataset_catalog, dataset_listings, dataset_orders,
--         dataset_order_items, dataset_wallets, dataset_payout_requests
