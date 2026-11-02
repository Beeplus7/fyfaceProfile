/**
 * Work Feed — Work Graph not User Graph — Sprint 2 Day 8
 */

export type FeedProject = {
  id: string;
  title: string;
  shop: string;
  location: string;
  lat: number;
  lng: number;
  cost: number;
  gift_count: number;
  work_ref: string; // required
  tags: string[];
  trust: number;
};

/** Seed AYO'S TAILORS + nearby Oldham projects */
export const SEED_FEED: FeedProject[] = [
  {
    id: 'aso-ebi',
    title: 'Aso-Ebi Wedding Dress',
    shop: "AYO'S TAILORS",
    location: 'Spindlegate, Oldham OL1',
    lat: 53.5409,
    lng: -2.1114,
    cost: 320,
    gift_count: 12,
    work_ref: 'proj_aso_ebi',
    tags: ['aso-ebi', 'lace', 'tailor', 'oldham'],
    trust: 4.9,
  },
  {
    id: 'lace-shop',
    title: 'Aso-Ebi lace £45/m',
    shop: "AYO'S TAILORS",
    location: 'Oldham OL1',
    lat: 53.5412,
    lng: -2.112,
    cost: 45,
    gift_count: 3,
    work_ref: 'proj_lace',
    tags: ['lace', 'shop', 'aso-ebi'],
    trust: 4.9,
  },
  {
    id: 'fade',
    title: 'Fade + Beard £25',
    shop: 'OL1 Barbers',
    location: 'Oldham OL1',
    lat: 53.544,
    lng: -2.118,
    cost: 25,
    gift_count: 8,
    work_ref: 'proj_fade',
    tags: ['barber', 'fade'],
    trust: 4.7,
  },
  {
    id: 'p0302',
    title: 'Corolla OBD2 P0302',
    shop: 'JM Autos',
    location: 'Oldham OL8',
    lat: 53.52,
    lng: -2.13,
    cost: 180,
    gift_count: 2,
    work_ref: 'proj_p0302',
    tags: ['mechanic', 'obd2'],
    trust: 4.6,
  },
];

export function getFeed(opts?: { boostedOnly?: boolean; cursor?: number; limit?: number }) {
  const limit = opts?.limit ?? 12;
  const start = opts?.cursor ?? 0;
  const items = SEED_FEED.filter((p) => !!p.work_ref);
  return {
    items: items.slice(start, start + limit),
    nextCursor: start + limit < items.length ? start + limit : null,
  };
}

export function boostProject(projectId: string, gbp = 5) {
  const reach = Math.round((gbp / 5) * 500);
  return { ok: true, projectId, gbp, reach, note: 'Boosted Discovery stub' };
}
