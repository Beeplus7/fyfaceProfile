-- MyFaceProfile B2B Dataset Marketplace
-- Apply after supabase/schema.sql (needs public.profiles).
-- Catalogue + supplier listings + lab orders + payout requests.

create extension if not exists "pgcrypto";

-- ── Catalogue (curated packs labs browse) ───────────────────────────
create table if not exists public.dataset_catalog (
  id text primary key,
  title text not null,
  category text not null,
  capture_type text not null check (capture_type in ('Live Capture','Recorded','Bundle','Language')),
  badge text,
  price_hr numeric(12,2) not null,
  total_price numeric(12,2) not null,
  hours numeric(12,2) not null,
  pros_count int not null default 0,
  quality_score numeric(5,2) not null default 90,
  languages text not null default '',
  hands_pct int not null default 80,
  blurred_pct int not null default 20,
  seller text not null,
  trust_score numeric(3,1) not null default 4.5,
  location text not null,
  emoji text default '🧵',
  gradient text,
  sample_labels jsonb not null default '[]'::jsonb,
  buyers text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dataset_catalog_category_idx on public.dataset_catalog (category);
create index if not exists dataset_catalog_type_idx on public.dataset_catalog (capture_type);
create index if not exists dataset_catalog_published_idx on public.dataset_catalog (is_published);

-- ── Supplier listings (pros list their own packs) ───────────────────
create table if not exists public.dataset_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  title text not null,
  category text not null,
  capture_type text not null default 'Recorded',
  hours numeric(12,2) not null default 1,
  location text,
  language text,
  price_hr numeric(12,2) not null default 60,
  seller text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','paused','sold_out')),
  consent_face_blur boolean not null default true,
  consent_hands_only boolean not null default false,
  consent_allow_sale boolean not null default true,
  quality_score numeric(5,2),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dataset_listings_status_idx on public.dataset_listings (status);
create index if not exists dataset_listings_owner_idx on public.dataset_listings (owner_id);

-- ── Lab buyer profiles (optional, for future KYC) ───────────────────
create table if not exists public.dataset_lab_buyers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  lab_name text not null,
  contact_email text,
  website text,
  notes text,
  created_at timestamptz not null default now()
);

-- ── Orders ──────────────────────────────────────────────────────────
create table if not exists public.dataset_orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles(id) on delete set null,
  lab_name text,
  license_type text not null default 'Single lab'
    check (license_type in ('Single lab','Multi-lab','Exclusive')),
  currency text not null default 'USD',
  total numeric(12,2) not null default 0,
  status text not null default 'draft'
    check (status in ('draft','pending_payment','paid','fulfilled','cancelled')),
  stripe_session_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dataset_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.dataset_orders(id) on delete cascade,
  catalog_id text references public.dataset_catalog(id) on delete set null,
  listing_id uuid references public.dataset_listings(id) on delete set null,
  title text not null,
  hours numeric(12,2),
  price_hr numeric(12,2),
  line_total numeric(12,2) not null,
  created_at timestamptz not null default now()
);

create index if not exists dataset_orders_buyer_idx on public.dataset_orders (buyer_id);
create index if not exists dataset_order_items_order_idx on public.dataset_order_items (order_id);

-- ── Pro dataset wallet (separate from MFC gift wallet) ──────────────
create table if not exists public.dataset_wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  balance_gbp numeric(12,2) not null default 0,
  balance_usd numeric(12,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.dataset_payout_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  method text not null
    check (method in ('Opay','PalmPay','M-Pesa','Bank','Airtime','Stripe')),
  amount_gbp numeric(12,2) not null check (amount_gbp >= 5),
  currency text not null default 'GBP',
  status text not null default 'pending'
    check (status in ('pending','processing','paid','rejected')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dataset_payout_user_idx on public.dataset_payout_requests (user_id);

-- ── Seed curated catalogue ──────────────────────────────────────────
insert into public.dataset_catalog (
  id, title, category, capture_type, badge, price_hr, total_price, hours, pros_count,
  quality_score, languages, hands_pct, blurred_pct, seller, trust_score, location,
  emoji, gradient, sample_labels, buyers
) values
  ('d1','500 hrs Tailor Sewing — Aso-Ebi + Agbada','Tailor','Recorded','RECORDED $60/hr',60,30000,500,124,96,'Yoruba / Pidgin / English',82,18,'AYO''S TAILORS',4.9,'Lagos + Oldham',E'\U0001F9F5','linear-gradient(135deg,#8FFF4A,#00E5C0)','["[00:01] hand reaches for towel, folds left to right","[00:09] needle guides ankara seam, presser foot down"]'::jsonb,'Figure AI · Dyna'),
  ('d2','Mechanic EV — Tesla BMS Diagnostics + Battery Swap','Mechanic','Live Capture','LIVE CAPTURE $50/hr',50,25000,500,86,97,'English / Pidgin',91,9,'EV WORKS MANCHESTER',4.8,'Manchester',E'\U0001F50B','linear-gradient(135deg,#1A7CFF,#00E5C0)','["[00:01] technician lifts BMS cover with torque driver","[00:12] multimeter probes cell group, reading checked"]'::jsonb,'Physical Intelligence · Troveo'),
  ('d3','Chef — Jollof, Suya + Small-Chop Service','Chef','Recorded','RECORDED $60/hr',60,18000,300,98,95,'Yoruba / Hausa / English',88,12,'LAGOS KITCHEN COLLECTIVE',4.9,'Lagos',E'\U0001F372','linear-gradient(135deg,#FFE600,#FF8A00)','["[00:01] hand stirs tomato base, steam rises","[00:08] spoon tastes broth, adjusts seasoning"]'::jsonb,'Scale AI · Encord'),
  ('d4','Builder — Block Laying, Plaster + Scaffold Work','Builder','Live Capture','LIVE CAPTURE $50/hr',50,20000,400,74,94,'Pidgin / English',94,6,'ABUJA BUILD CREW',4.7,'Abuja',E'\U0001F9F1','linear-gradient(135deg,#FF8A00,#FFE600)','["[00:01] trowel spreads mortar in a straight bed","[00:10] block set, level checked both ways"]'::jsonb,'Kinetic Blocks · Surge AI'),
  ('d5','Braider — Knotless, Cornrows + Wig Install','Tailor','Recorded','RECORDED $60/hr',60,12000,200,112,96,'Igbo / English',97,3,'OLDHAM BRAID STUDIO',5.0,'Oldham',E'\U0001F9D1','linear-gradient(135deg,#00E5C0,#1A7CFF)','["[00:01] fingers part hair into clean sections","[00:07] braid tension even, feed-in added"]'::jsonb,'Mercor · Defined.ai'),
  ('d6','Farmer — Cassava Harvest, Peeling + Processing','Farmer','Recorded','RECORDED $60/hr',60,15000,250,68,93,'Igbo / Pidgin',89,11,'ENUGU FARM NETWORK',4.8,'Accra + Enugu',E'\U0001F33E','linear-gradient(135deg,#8FFF4A,#FFE600)','["[00:01] hand pulls cassava stem, root lifted","[00:09] peeler removes skin in long strokes"]'::jsonb,'Troveo · Scale AI'),
  ('d7','Barber — Fades, Line-Ups + Hot-Towel Shave','Barber','Live Capture','LIVE CAPTURE $50/hr',50,10000,200,76,95,'English / Yoruba',93,7,'OLDHAM FADE HOUSE',4.9,'Oldham',E'\U0001F488','linear-gradient(135deg,#0A1931,#1A7CFF)','["[00:01] clipper moves upward, fade blended","[00:08] razor defines hairline, brush clears"]'::jsonb,'Dyna · Figure AI'),
  ('d8','Tailor Bundle — 1,000 hrs Sewing + Pattern Cutting','Tailor','Bundle','BUNDLE $100k',100,100000,1000,210,97,'Yoruba / English',85,15,'MYFACE ATELIER NETWORK',4.9,'Lagos + Oldham',E'\u2702','linear-gradient(135deg,#FF8A00,#1A7CFF)','["[00:01] pattern chalked on ankara, scissors cut","[00:14] seam pinned, machine stitch started"]'::jsonb,'Figure AI · Physical Intelligence'),
  ('d9','Language — Yoruba Market Talk + Cooking Narration','Language','Language','LANGUAGE $120/hr',120,12000,100,42,98,'Yoruba / English',76,24,'YORUBA VOICE LAB',4.9,'Lagos',E'\U0001F5E3','linear-gradient(135deg,#00E5C0,#FFE600)','["[00:01] speaker names ingredients in Yoruba","[00:06] repeats phrase, then English gloss"]'::jsonb,'Mercor · Encord'),
  ('d10','Mechanic Bundle — 1,000 hrs EV + Engine Rebuild','Mechanic','Bundle','BUNDLE $100k',100,100000,1000,145,96,'English / Hausa',90,10,'NAIROBI + MANCHESTER GARAGE',4.8,'Nairobi + Manchester',E'\U0001F527','linear-gradient(135deg,#1A7CFF,#8FFF4A)','["[00:01] socket removes engine mount bolts","[00:11] gasket inspected, surface cleaned"]'::jsonb,'Defined.ai · Kinetic Blocks'),
  ('d11','Chef Bundle — 1,000 hrs West African + UK Kitchens','Chef','Bundle','BUNDLE $100k',100,100000,1000,180,95,'Hausa / Yoruba / English',87,13,'CHEF COLLECTIVE UK + NG',4.9,'Lagos + Manchester',E'\U0001F468','linear-gradient(135deg,#FFE600,#00E5C0)','["[00:01] knife dices onion, board wiped","[00:08] pan deglazed, stock added"]'::jsonb,'Surge AI · Scale AI'),
  ('d12','Language — Swahili + Pidgin Work Talk','Language','Language','LANGUAGE $120/hr',120,9600,80,38,94,'Swahili / Pidgin / English',72,28,'NAIROBI VOICE LAB',4.8,'Nairobi',E'\U0001F3A4','linear-gradient(135deg,#8FFF4A,#1A7CFF)','["[00:01] speaker greets customer in Swahili","[00:07] work instruction repeated in Pidgin"]'::jsonb,'Troveo · Mercor')
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  capture_type = excluded.capture_type,
  badge = excluded.badge,
  price_hr = excluded.price_hr,
  total_price = excluded.total_price,
  hours = excluded.hours,
  pros_count = excluded.pros_count,
  quality_score = excluded.quality_score,
  languages = excluded.languages,
  hands_pct = excluded.hands_pct,
  blurred_pct = excluded.blurred_pct,
  seller = excluded.seller,
  trust_score = excluded.trust_score,
  location = excluded.location,
  emoji = excluded.emoji,
  gradient = excluded.gradient,
  sample_labels = excluded.sample_labels,
  buyers = excluded.buyers,
  updated_at = now();

-- ── RLS ─────────────────────────────────────────────────────────────
alter table public.dataset_catalog enable row level security;
alter table public.dataset_listings enable row level security;
alter table public.dataset_lab_buyers enable row level security;
alter table public.dataset_orders enable row level security;
alter table public.dataset_order_items enable row level security;
alter table public.dataset_wallets enable row level security;
alter table public.dataset_payout_requests enable row level security;

drop policy if exists "dataset_catalog_public_read" on public.dataset_catalog;
create policy "dataset_catalog_public_read" on public.dataset_catalog
  for select using (is_published = true);

drop policy if exists "dataset_listings_public_approved" on public.dataset_listings;
create policy "dataset_listings_public_approved" on public.dataset_listings
  for select using (status = 'approved' or owner_id = auth.uid() or owner_id is null);

drop policy if exists "dataset_listings_insert_anon_or_own" on public.dataset_listings;
create policy "dataset_listings_insert_anon_or_own" on public.dataset_listings
  for insert with check (owner_id is null or owner_id = auth.uid());

drop policy if exists "dataset_listings_update_own" on public.dataset_listings;
create policy "dataset_listings_update_own" on public.dataset_listings
  for update using (owner_id = auth.uid() or owner_id is null)
  with check (owner_id = auth.uid() or owner_id is null);

drop policy if exists "dataset_listings_delete_own" on public.dataset_listings;
create policy "dataset_listings_delete_own" on public.dataset_listings
  for delete using (owner_id = auth.uid() or owner_id is null);

drop policy if exists "dataset_orders_own" on public.dataset_orders;
create policy "dataset_orders_own" on public.dataset_orders
  for all using (buyer_id = auth.uid() or buyer_id is null)
  with check (buyer_id = auth.uid() or buyer_id is null);

drop policy if exists "dataset_order_items_via_order" on public.dataset_order_items;
create policy "dataset_order_items_via_order" on public.dataset_order_items
  for all using (
    exists (
      select 1 from public.dataset_orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.buyer_id is null)
    )
  )
  with check (
    exists (
      select 1 from public.dataset_orders o
      where o.id = order_id and (o.buyer_id = auth.uid() or o.buyer_id is null)
    )
  );

drop policy if exists "dataset_wallets_own" on public.dataset_wallets;
create policy "dataset_wallets_own" on public.dataset_wallets
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "dataset_payouts_own" on public.dataset_payout_requests;
create policy "dataset_payouts_own" on public.dataset_payout_requests
  for all using (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

drop policy if exists "dataset_lab_buyers_own" on public.dataset_lab_buyers;
create policy "dataset_lab_buyers_own" on public.dataset_lab_buyers
  for all using (user_id = auth.uid() or user_id is null)
  with check (user_id = auth.uid() or user_id is null);

-- Public insert for demo storefront (anonymous lead capture) — tighten later.
drop policy if exists "dataset_orders_public_insert" on public.dataset_orders;
create policy "dataset_orders_public_insert" on public.dataset_orders
  for insert with check (true);

drop policy if exists "dataset_order_items_public_insert" on public.dataset_order_items;
create policy "dataset_order_items_public_insert" on public.dataset_order_items
  for insert with check (true);

drop policy if exists "dataset_payouts_public_insert" on public.dataset_payout_requests;
create policy "dataset_payouts_public_insert" on public.dataset_payout_requests
  for insert with check (true);

drop policy if exists "dataset_listings_public_insert" on public.dataset_listings;
create policy "dataset_listings_public_insert" on public.dataset_listings
  for insert with check (true);

comment on table public.dataset_catalog is 'Curated B2B work-video packs for Physical AI labs';
comment on table public.dataset_listings is 'Pro-submitted supplier listings for the Dataset Store';
comment on table public.dataset_orders is 'Lab licence checkout orders';
comment on table public.dataset_payout_requests is 'Pro dataset-wallet withdrawal requests';
