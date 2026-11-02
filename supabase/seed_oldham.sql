-- Oldham test seed — applied against MYFACEPROFILE (jyckmajjbvydgsvnmeaj)
-- Demo auth user: ayo@oldham.demo  (uuid below)
-- Re-run safe: upserts + delete/reinsert for demo rows.

-- uuid: 0a089a80-9ec2-4921-8235-62bdab6487d6

insert into public.profiles (id, trade_type, shop_name, location, verification_status, trust_score)
values (
  '0a089a80-9ec2-4921-8235-62bdab6487d6',
  'Tailor',
  'AYO''S TAILORS',
  'Spindlegate, Oldham OL1',
  'verified',
  4.9
)
on conflict (id) do update set
  trade_type = excluded.trade_type,
  shop_name = excluded.shop_name,
  location = excluded.location,
  verification_status = excluded.verification_status,
  trust_score = excluded.trust_score,
  updated_at = now();

insert into public.professional_profiles (user_id, display_name, bio, trades, radius_mi)
select
  '0a089a80-9ec2-4921-8235-62bdab6487d6',
  'Ayo Tailor',
  'Bridal & Aso-Ebi specialist · Spindlegate OL1',
  array['Tailor', 'Bridal'],
  12
where not exists (
  select 1 from public.professional_profiles
  where user_id = '0a089a80-9ec2-4921-8235-62bdab6487d6'
);

delete from public.uprm_contacts
where user_id = '0a089a80-9ec2-4921-8235-62bdab6487d6'
  and name in (
    'Aisha Bridal', 'Mrs Okafor', 'Cooper Levin', 'Anika Rosser',
    'Tunde Mensah', 'Fatima Bello', 'James Okoro', 'Ngozi Eze'
  );

insert into public.uprm_contacts (user_id, name, relationship_strength, journey_state, role, last_interaction) values
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Aisha Bridal', 94, 'Quote', 'Aso-Ebi client', now() - interval '2 days'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Mrs Okafor', 87, 'Repeat', 'Repeat bridal', now() - interval '5 days'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Cooper Levin', 72, 'Inquiry', 'Suit alteration', now() - interval '1 day'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Anika Rosser', 65, 'Engagement', 'Prom dress', now() - interval '3 days'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Tunde Mensah', 58, 'Discovery', 'Agbada client', now() - interval '8 days'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Fatima Bello', 81, 'Booked', 'Gele + wrap', now() - interval '12 hours'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'James Okoro', 44, 'Discovery', 'Corporate suit', now() - interval '10 days'),
('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Ngozi Eze', 76, 'In Progress', 'Bridesmaid set', now() - interval '6 hours');

delete from public.projects
where user_id = '0a089a80-9ec2-4921-8235-62bdab6487d6' and slug = 'aso-ebi-wedding';

insert into public.projects (
  user_id, title, description, cost, gift_count, milestones, materials, team, location_label, slug
) values (
  '0a089a80-9ec2-4921-8235-62bdab6487d6',
  'Aso-Ebi Wedding Dress',
  'Before fabric stack green yellow pink fuchsia blue gold sequins → After final wedding dress',
  320,
  12,
  '[{"label":"Cutting","done":true},{"label":"Sewing","done":true},{"label":"Fitting","done":false}]'::jsonb,
  '[{"name":"Lace","cost":45}]'::jsonb,
  '[{"name":"Ayo"},{"name":"+2"}]'::jsonb,
  'Spindlegate OL1',
  'aso-ebi-wedding'
);

insert into public.mfc_wallet (user_id, balance)
values ('0a089a80-9ec2-4921-8235-62bdab6487d6', 1247)
on conflict (user_id) do update set balance = excluded.balance, updated_at = now();

delete from public.shop_items
where user_id = '0a089a80-9ec2-4921-8235-62bdab6487d6' and title = 'Aso-Ebi lace';

insert into public.shop_items (user_id, title, price, stock, delivery_radius_mi, escrow_pct)
values ('0a089a80-9ec2-4921-8235-62bdab6487d6', 'Aso-Ebi lace', 45, 24, 10, 5);

insert into public.trust_ledger (user_id, event_type, payload)
values (
  '0a089a80-9ec2-4921-8235-62bdab6487d6',
  'seed_applied',
  '{"source":"seed_oldham","shop":"AYO''S TAILORS"}'::jsonb
);

select 'seed_ok' as note;
