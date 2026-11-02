import type { WorkCategory } from './workCategories';
import { WORK_CATEGORIES } from './workCategories';

export type TemplateMaker = {
  id: string;
  handle: string;
  name: string;
  trade: WorkCategory;
  loc: string;
  color: string;
  /** Ready for 30s WorkCut upload — mediaId set after upload */
  templateSlot: true;
  bio: string;
};

const LOCS = ['OL1', 'OL2', 'OL3', 'OL4', 'OL8', 'OL9', 'M35', 'SK16'] as const;
const COLORS = [
  '#e11d48', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#a855f7', '#ef4444', '#22c55e', '#0ea5e9',
];

const FIRST = [
  'Ayo', 'Sarah', 'Nailah', 'Marcus', 'Priya', 'Jamal', 'Elena', 'Kai', 'Zoe', 'Omar',
  'Fatima', 'Leo', 'Amara', 'Noah', 'Imani', 'Ryan', 'Sofia', 'Dev', 'Maya', 'Chris',
  'Aisha', 'Ben', 'Chloe', 'Hassan', 'Jade', 'Tom', 'Nia', 'Alex', 'Rita', 'Sam',
  'Yasmin', 'Luke', 'Grace', 'Ade', 'Mia', 'Josh', 'Leila', 'Dan', 'Olivia', 'Will',
  'Tariq', 'Emma', 'Kofi', 'Anna', 'Pavel', 'Holly', 'Idris', 'Nora', 'Sean', 'Bola',
];

const TRADE_SUFFIX: Partial<Record<WorkCategory, string>> = {
  Plumbers: 'Plumbing',
  Engineers: 'Engineering',
  Electricians: 'Electrics',
  Mechanics: 'Garage',
  Builders: 'Builds',
  Carpenters: 'Joinery',
  Painters: 'Decor',
  Roofers: 'Roofing',
  Tailors: 'Tailors',
  Barbers: 'Barbers',
  Hairdressers: 'Salon',
  'Makeup Artists': 'Beauty',
  Wedding: 'Bridal',
  'Aso-Ebi': 'Aso-Ebi',
  Chefs: 'Kitchen',
  Caterers: 'Catering',
  Cleaners: 'Clean',
  Gardeners: 'Gardens',
  Locksmiths: 'Locks',
  Photographers: 'Photo',
  Videographers: 'Film',
  Tutors: 'Tutoring',
  'IT Support': 'IT',
  HVAC: 'HVAC',
  Tilers: 'Tiling',
  Plasterers: 'Plaster',
  Drivers: 'Drive',
  Movers: 'Movers',
  Security: 'Security',
  'Fitness Coaches': 'Fitness',
};

/** 50 template maker accounts — one WorkCut slot each for 30s uploads. */
export const TEMPLATE_MAKERS: TemplateMaker[] = Array.from({ length: 50 }, (_, i) => {
  const trade = WORK_CATEGORIES[i % WORK_CATEGORIES.length] as WorkCategory;
  const first = FIRST[i]!;
  const suffix = TRADE_SUFFIX[trade] ?? trade;
  const handle = `${first.toLowerCase()}_${trade.toLowerCase().replace(/\s+/g, '').slice(0, 6)}${i + 1}`;
  return {
    id: `tpl_${String(i + 1).padStart(2, '0')}`,
    handle,
    name: `${first.toUpperCase()} ${suffix.toUpperCase()}`,
    trade,
    loc: LOCS[i % LOCS.length]!,
    color: COLORS[i % COLORS.length]!,
    templateSlot: true as const,
    bio: `${trade} · Oldham ${LOCS[i % LOCS.length]} · Template account — upload a 30s WorkCut`,
  };
});

export const TEMPLATE_MAKER_BY_ID = Object.fromEntries(
  TEMPLATE_MAKERS.map((m) => [m.id, m]),
) as Record<string, TemplateMaker>;

export function getTemplateMaker(id: string): TemplateMaker | undefined {
  return TEMPLATE_MAKER_BY_ID[id];
}

export function makersByTrade(trade: string): TemplateMaker[] {
  const t = trade.toLowerCase();
  return TEMPLATE_MAKERS.filter(
    (m) => m.trade.toLowerCase() === t || m.trade.toLowerCase().includes(t) || t.includes(m.trade.toLowerCase()),
  );
}
