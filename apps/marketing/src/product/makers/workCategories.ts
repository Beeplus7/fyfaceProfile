/** Work categories + search aliases for feed / discover. */

export const WORK_CATEGORIES = [
  'Plumbers',
  'Engineers',
  'Electricians',
  'Mechanics',
  'Builders',
  'Carpenters',
  'Painters',
  'Roofers',
  'Tailors',
  'Barbers',
  'Hairdressers',
  'Makeup Artists',
  'Wedding',
  'Aso-Ebi',
  'Chefs',
  'Caterers',
  'Cleaners',
  'Gardeners',
  'Locksmiths',
  'Photographers',
  'Videographers',
  'Tutors',
  'IT Support',
  'HVAC',
  'Tilers',
  'Plasterers',
  'Drivers',
  'Movers',
  'Security',
  'Fitness Coaches',
] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

/** Keyword → category for search autocomplete */
export const WORK_CATEGORY_KEYWORDS: Record<string, WorkCategory | WorkCategory[]> = {
  plumber: 'Plumbers',
  plumbing: 'Plumbers',
  pipe: 'Plumbers',
  boiler: 'Plumbers',
  engineer: 'Engineers',
  engineering: 'Engineers',
  civil: 'Engineers',
  structural: 'Engineers',
  electrician: 'Electricians',
  electric: 'Electricians',
  wiring: 'Electricians',
  fuse: 'Electricians',
  mechanic: 'Mechanics',
  garage: 'Mechanics',
  car: 'Mechanics',
  mot: 'Mechanics',
  builder: 'Builders',
  building: 'Builders',
  construction: 'Builders',
  carpenter: 'Carpenters',
  joinery: 'Carpenters',
  wood: 'Carpenters',
  painter: 'Painters',
  decorating: 'Painters',
  decorator: 'Painters',
  roofer: 'Roofers',
  roofing: 'Roofers',
  tailor: 'Tailors',
  sewing: 'Tailors',
  dress: ['Tailors', 'Wedding', 'Aso-Ebi'],
  barber: 'Barbers',
  fade: 'Barbers',
  hairdresser: 'Hairdressers',
  salon: 'Hairdressers',
  makeup: 'Makeup Artists',
  bridal: 'Wedding',
  wedding: 'Wedding',
  asoebi: 'Aso-Ebi',
  'aso-ebi': 'Aso-Ebi',
  gele: 'Aso-Ebi',
  chef: 'Chefs',
  cook: 'Chefs',
  catering: 'Caterers',
  cleaner: 'Cleaners',
  cleaning: 'Cleaners',
  gardener: 'Gardeners',
  landscaping: 'Gardeners',
  locksmith: 'Locksmiths',
  keys: 'Locksmiths',
  photographer: 'Photographers',
  photo: 'Photographers',
  videographer: 'Videographers',
  film: 'Videographers',
  tutor: 'Tutors',
  teacher: 'Tutors',
  it: 'IT Support',
  laptop: 'IT Support',
  hvac: 'HVAC',
  heating: 'HVAC',
  tiler: 'Tilers',
  tiling: 'Tilers',
  plasterer: 'Plasterers',
  plastering: 'Plasterers',
  driver: 'Drivers',
  courier: 'Drivers',
  mover: 'Movers',
  removals: 'Movers',
  security: 'Security',
  fitness: 'Fitness Coaches',
  gym: 'Fitness Coaches',
  personal: 'Fitness Coaches',
};

export function suggestWorkCategories(query: string, limit = 12): WorkCategory[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...WORK_CATEGORIES].slice(0, limit);
  const hits = new Set<WorkCategory>();
  for (const cat of WORK_CATEGORIES) {
    if (cat.toLowerCase().includes(q) || q.includes(cat.toLowerCase().slice(0, 4))) hits.add(cat);
  }
  for (const [kw, mapped] of Object.entries(WORK_CATEGORY_KEYWORDS)) {
    if (!kw.includes(q) && !q.includes(kw)) continue;
    const list = Array.isArray(mapped) ? mapped : [mapped];
    list.forEach((c) => hits.add(c));
  }
  return [...hits].slice(0, limit);
}

export const FEED_TOP_TABS = [
  'For You',
  'Following',
  'WorkCuts',
  'Live Replays',
  'Oldham OL1',
  ...WORK_CATEGORIES.slice(0, 14),
] as const;
