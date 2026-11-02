/** Jamendo Music API v3 — Creative Commons catalog for MyFace BGM. */

export type JamendoTrack = {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  album_image?: string;
  audio?: string;
  audiodownload?: string;
  audiodownload_allowed?: boolean;
  license_ccurl?: string;
  shareurl?: string;
};

type JamendoResponse = {
  headers: { status: string; code: number; error_message?: string; results_count?: number };
  results: JamendoTrack[];
};

const CLIENT_ID = (import.meta.env.VITE_JAMENDO_CLIENT_ID as string | undefined)?.trim() || '';

export function jamendoConfigured() {
  return Boolean(CLIENT_ID);
}

function formatDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
}

export async function searchJamendoTracks(query: string, limit = 20): Promise<
  {
    title: string;
    artist: string;
    duration: string;
    objectUrl: string;
    api: string;
    color: string;
    license?: string;
    jamendoId: string;
  }[]
> {
  if (!CLIENT_ID) return [];

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    format: 'json',
    limit: String(Math.min(50, Math.max(1, limit))),
    audioformat: 'mp32',
    include: 'licenses',
    orderby: 'popularity_total',
  });

  const q = query.trim();
  if (q) params.set('search', q);
  else params.set('tags', 'instrumental');

  const res = await fetch(`https://api.jamendo.com/v3.0/tracks/?${params.toString()}`);
  if (!res.ok) throw new Error(`Jamendo HTTP ${res.status}`);
  const data = (await res.json()) as JamendoResponse;
  if (data.headers?.status !== 'success') {
    throw new Error(data.headers?.error_message || 'Jamendo search failed');
  }

  return (data.results || [])
    .filter((t) => Boolean(t.audio))
    .map((t) => ({
      title: t.name,
      artist: t.artist_name,
      duration: formatDuration(t.duration),
      objectUrl: t.audio as string,
      api: 'Jamendo API v3',
      color: '#FF5E3A',
      license: t.license_ccurl,
      jamendoId: t.id,
    }));
}
