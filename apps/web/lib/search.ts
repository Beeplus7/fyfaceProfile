/**
 * Search — Typesense + pgvector stub + PostGIS 10mi Oldham — Findy bot
 */

import { SEED_FEED, type FeedProject } from './feed';

const OLDHAM = { lat: 53.5409, lng: -2.1114 };

function haversineMi(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Semantic-ish token overlap stand-in for pgvector/Typesense */
export function searchProjects(query: string, radiusMi = 10): FeedProject[] {
  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/).filter(Boolean);
  return SEED_FEED.filter((p) => {
    const dist = haversineMi(OLDHAM, p);
    if (dist > radiusMi) return false;
    if (!tokens.length) return true;
    const hay = `${p.title} ${p.shop} ${p.tags.join(' ')} ${p.location}`.toLowerCase();
    return tokens.every((t) => hay.includes(t));
  }).sort((a, b) => haversineMi(OLDHAM, a) - haversineMi(OLDHAM, b));
}

export function findySuggest(query = 'Aso-Ebi lace') {
  const hits = searchProjects(query, 10);
  return {
    bot: 'Findy',
    query,
    radiusMi: 10,
    center: 'Oldham OL1',
    results: hits,
    note: hits[0]?.shop === "AYO'S TAILORS" ? 'Top hit Spindlegate OL1' : 'Expand radius',
  };
}
