/** YouTube music helpers — URL paste, curated catalog, optional Data API search. */

export type YoutubeHit = {
  youtubeId: string;
  title: string;
  artist: string;
  duration?: string;
  thumbnail?: string;
};

const API_KEY = (import.meta.env.VITE_YOUTUBE_API_KEY as string | undefined)?.trim() || '';

/** Curated playable BGM / ambient streams (embeddable). */
export const YOUTUBE_CATALOG: YoutubeHit[] = [
  {
    youtubeId: 'jfKfPfyJRdk',
    title: 'lofi hip hop radio — beats to relax/study to',
    artist: 'Lofi Girl',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/hqdefault.jpg',
  },
  {
    youtubeId: 'lTRiuFIWV54',
    title: '1 A.M Study Session [lofi hip hop]',
    artist: 'Lofi Girl',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/lTRiuFIWV54/hqdefault.jpg',
  },
  {
    youtubeId: 'DWcJFNfaw9c',
    title: 'lofi hip hop radio — beats to sleep/chill to',
    artist: 'Lofi Girl',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/DWcJFNfaw9c/hqdefault.jpg',
  },
  {
    youtubeId: '5qap5aO4i9A',
    title: 'lofi hip hop radio — classic stream',
    artist: 'Lofi Girl',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/5qap5aO4i9A/hqdefault.jpg',
  },
  {
    youtubeId: '7NOSDKb0HlU',
    title: 'Coffee Shop Radio — 24/7 lofi & jazzhop',
    artist: 'STEEZYASFUCK',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/7NOSDKb0HlU/hqdefault.jpg',
  },
  {
    youtubeId: '4xDzrJKXOOY',
    title: 'synthwave radio — beats to chill / game to',
    artist: 'Lofi Girl',
    duration: 'live',
    thumbnail: 'https://i.ytimg.com/vi/4xDzrJKXOOY/hqdefault.jpg',
  },
];

export function youtubeApiConfigured() {
  return Boolean(API_KEY);
}

export function extractYoutubeId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace(/^\//, '').slice(0, 11);
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
      const m = url.pathname.match(/\/(embed|shorts|live)\/([a-zA-Z0-9_-]{11})/);
      if (m?.[2]) return m[2];
    }
  } catch {
    /* not a URL */
  }

  const loose = raw.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([a-zA-Z0-9_-]{11})/);
  return loose?.[1] || null;
}

export function youtubeEmbedUrl(id: string, autoplay = false) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  });
  if (autoplay) {
    params.set('autoplay', '1');
    // Unmuted autoplay works after a user gesture (Watch Live / Save music)
    params.set('mute', '0');
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
}

export async function resolveYoutubeUrl(input: string): Promise<YoutubeHit | null> {
  const id = extractYoutubeId(input);
  if (!id) return null;

  try {
    const res = await fetch(
      `https://noembed.com/embed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}`,
    );
    if (res.ok) {
      const data = (await res.json()) as { title?: string; author_name?: string; error?: string };
      if (!data.error) {
        return {
          youtubeId: id,
          title: data.title || `YouTube ${id}`,
          artist: data.author_name || 'YouTube',
          duration: 'video',
          thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        };
      }
    }
  } catch {
    /* fall through */
  }

  return {
    youtubeId: id,
    title: `YouTube video`,
    artist: 'YouTube',
    duration: 'video',
    thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
  };
}

async function searchYoutubeApi(query: string, limit = 12): Promise<YoutubeHit[]> {
  if (!API_KEY) return [];
  const params = new URLSearchParams({
    part: 'snippet',
    type: 'video',
    maxResults: String(Math.min(25, Math.max(1, limit))),
    q: query,
    videoEmbeddable: 'true',
    key: API_KEY,
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/search?${params.toString()}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`YouTube API ${res.status}: ${body.slice(0, 160)}`);
  }
  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string } } };
    }>;
  };
  return (data.items || [])
    .map((item) => {
      const youtubeId = item.id?.videoId;
      if (!youtubeId) return null;
      return {
        youtubeId,
        title: item.snippet?.title || 'YouTube video',
        artist: item.snippet?.channelTitle || 'YouTube',
        duration: 'video',
        thumbnail: item.snippet?.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      } satisfies YoutubeHit;
    })
    .filter(Boolean) as YoutubeHit[];
}

export async function searchYoutubeTracks(query: string): Promise<YoutubeHit[]> {
  const q = query.trim();

  // Paste / ID path
  if (extractYoutubeId(q)) {
    const hit = await resolveYoutubeUrl(q);
    return hit ? [hit] : [];
  }

  // Live Data API when key present
  if (API_KEY && q) {
    return searchYoutubeApi(q || 'lofi hip hop', 16);
  }

  // Curated catalog filter (always works, no key)
  const pool = YOUTUBE_CATALOG;
  if (!q) return pool;
  const needle = q.toLowerCase();
  return pool.filter(
    (t) => t.title.toLowerCase().includes(needle) || t.artist.toLowerCase().includes(needle),
  );
}
