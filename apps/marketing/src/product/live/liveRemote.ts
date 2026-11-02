import type { BroadcastMode, BroadcastState } from '../demo/testLab';
import type { Music } from '../music/MusicDrawer';

const LIVE_STATUS_URL = '/api/live-status';

export type LiveMusicPayload = {
  title?: string;
  artist?: string;
  source?: string;
  youtubeId?: string;
  jamendoId?: string;
  /** Direct playable URL (Jamendo preview / https upload mirror) */
  previewUrl?: string;
};

export type RemoteLiveStatus = {
  live: boolean;
  title?: string;
  viewers?: number;
  startedAt?: string;
  mode?: BroadcastMode;
  makerId?: string;
  updatedAt?: string;
  hasAudio?: boolean;
  music?: LiveMusicPayload | null;
};

export type RemoteLiveBroadcast = BroadcastState & {
  music?: LiveMusicPayload | null;
  hasAudio?: boolean;
};

function musicToPayload(music: Music | null | undefined): LiveMusicPayload | null {
  if (!music) return null;
  const previewUrl =
    music.objectUrl && /^https?:\/\//i.test(music.objectUrl) ? music.objectUrl : undefined;
  return {
    title: music.title,
    artist: music.artist,
    source: music.source,
    youtubeId: music.youtubeId,
    jamendoId: music.jamendoId,
    previewUrl,
  };
}

/** Push live state so phone / other browsers can see PC host. */
export async function publishRemoteLive(
  state: BroadcastState | null,
  extras?: { music?: Music | null; hasAudio?: boolean; replaceMusic?: boolean },
): Promise<void> {
  try {
    if (!state?.live) {
      await fetch(LIVE_STATUS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ live: false }),
        keepalive: true,
      });
      void fetch('/api/live-frame?clear=1', { method: 'POST' }).catch(() => undefined);
      void fetch('/api/live-audio?clear=1', { method: 'POST' }).catch(() => undefined);
      for (const s of ['g1', 'g2', 'g3'] as const) {
        void fetch(`/api/live-audio?slot=${s}&clear=1`, { method: 'POST' }).catch(() => undefined);
      }
      // Clear guests/chat only on explicit end-live (not on every status miss)
      void fetch('/api/live-guests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
        keepalive: true,
      }).catch(() => undefined);
      void fetch('/api/live-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear' }),
        keepalive: true,
      }).catch(() => undefined);
      return;
    }

    let musicPayload: LiveMusicPayload | null | undefined;
    if (extras?.replaceMusic || extras?.music !== undefined) {
      musicPayload = musicToPayload(extras.music ?? null);
    } else {
      // Keep existing BGM when Go Live / heartbeat republishes status
      try {
        const cur = await fetch(LIVE_STATUS_URL, { cache: 'no-store' }).then((r) =>
          r.ok ? (r.json() as Promise<RemoteLiveStatus>) : null,
        );
        musicPayload = cur?.music ?? null;
      } catch {
        musicPayload = null;
      }
    }

    await fetch(LIVE_STATUS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        live: true,
        title: state.title,
        viewers: state.viewers,
        startedAt: state.startedAt,
        mode: state.mode,
        makerId: 'ayo',
        hasVideo: true,
        hasAudio: extras?.hasAudio !== false,
        music: musicPayload,
      }),
      keepalive: true,
    });
  } catch {
    /* offline / blocked — local still works */
  }
}

/** Update only the BGM field while staying live. */
export async function publishRemoteLiveMusic(music: Music | null): Promise<void> {
  try {
    let cur = await fetchRemoteLive();
    if (!cur?.live) {
      // Host may only have local broadcast — push status + music together
      const { readBroadcast } = await import('../demo/testLab');
      const local = readBroadcast();
      if (!local?.live) return;
      cur = local;
    }
    await publishRemoteLive(cur, { music, hasAudio: true, replaceMusic: true });
  } catch {
    /* ignore */
  }
}

export async function fetchRemoteLive(): Promise<RemoteLiveBroadcast | null> {
  try {
    const res = await fetch(LIVE_STATUS_URL, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = (await res.json()) as RemoteLiveStatus;
    if (!data?.live) return null;
    return {
      live: true,
      title: data.title || 'Video Live · OL1',
      viewers: data.viewers ?? 12,
      startedAt: data.startedAt || new Date().toISOString(),
      mode: data.mode === 'audio' ? 'audio' : 'video',
      from: 'remote',
      hasAudio: Boolean(data.hasAudio),
      music: data.music || null,
    };
  } catch {
    return null;
  }
}
