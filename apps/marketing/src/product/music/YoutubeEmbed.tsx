import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  normalizeYoutubePlaylistIds,
  normalizeYoutubePlaylistItems,
  youtubeEmbedUrl,
  type YoutubePlaylistItem,
} from './youtube';

type YtPlayer = {
  getVideoData?: () => { video_id?: string };
  destroy?: () => void;
};

type YtNamespace = {
  Player: new (
    el: string | HTMLElement,
    opts: {
      events?: {
        onReady?: () => void;
        onStateChange?: () => void;
      };
    },
  ) => YtPlayer;
  PlayerState?: { PLAYING?: number; ENDED?: number };
};

declare global {
  interface Window {
    YT?: YtNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YtNamespace> | null = null;

function loadYoutubeIframeApi(): Promise<YtNamespace> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (ytApiPromise) return ytApiPromise;
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      if (window.YT) resolve(window.YT);
    };
    if (!document.querySelector('script[data-myface-yt-api]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.dataset.myfaceYtApi = '1';
      document.head.appendChild(s);
    }
    const wait = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(wait);
        resolve(window.YT);
      }
    }, 200);
  });
  return ytApiPromise;
}

export default function YoutubeEmbed({
  youtubeId,
  title = 'YouTube',
  autoplay = false,
  loop = false,
  playlistIds,
  playlist,
  className = '',
  compact = false,
  fill = false,
  showCaptions = false,
}: {
  youtubeId: string;
  title?: string;
  autoplay?: boolean;
  /** Restart when the clip / playlist ends (used when live duration outlasts content) */
  loop?: boolean;
  /** Extra video ids to autoplay after the current one ends */
  playlistIds?: string[];
  /** Full playlist with captions (preferred over playlistIds when present) */
  playlist?: YoutubePlaylistItem[];
  className?: string;
  compact?: boolean;
  /** Full-bleed live stage (absolute inset-0) */
  fill?: boolean;
  /** Overlay the caption for the currently playing video */
  showCaptions?: boolean;
}) {
  const reactId = useId().replace(/:/g, '');
  const iframeDomId = `yt-embed-${reactId}`;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const playerRef = useRef<YtPlayer | null>(null);

  const items = useMemo(() => {
    if (playlist?.length) {
      const normalized = normalizeYoutubePlaylistItems(playlist);
      const first = normalized.find((i) => i.id === youtubeId) || {
        id: youtubeId,
        caption: '',
      };
      const rest = normalized.filter((i) => i.id !== youtubeId);
      return normalizeYoutubePlaylistItems([first, ...rest]);
    }
    const ids = normalizeYoutubePlaylistIds([youtubeId, ...(playlistIds || [])]);
    return ids.map((id) => ({ id, caption: '' }));
  }, [playlist, playlistIds, youtubeId]);

  const captionById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const item of items) {
      if (item.caption) map[item.id] = item.caption;
    }
    return map;
  }, [items]);

  const queueIds = useMemo(() => items.map((i) => i.id), [items]);
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const src = youtubeEmbedUrl(youtubeId, autoplay, {
    loop,
    playlistIds: queueIds,
    origin,
  });

  const [activeId, setActiveId] = useState(youtubeId);
  const activeCaption = (captionById[activeId] || captionById[youtubeId] || '').trim();
  const trackCaptions = showCaptions && Object.keys(captionById).length > 0;

  useEffect(() => {
    setActiveId(youtubeId);
  }, [youtubeId]);

  useEffect(() => {
    if (!trackCaptions || !fill) return;
    let cancelled = false;
    let pollId = 0;

    const sync = () => {
      try {
        const data = playerRef.current?.getVideoData?.();
        const id = data?.video_id;
        if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) setActiveId(id);
      } catch {
        /* ignore */
      }
    };

    void loadYoutubeIframeApi().then((YT) => {
      if (cancelled) return;
      const el = iframeRef.current || document.getElementById(iframeDomId);
      if (!el) return;
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = new YT.Player(el, {
        events: {
          onReady: () => sync(),
          onStateChange: () => sync(),
        },
      });
      pollId = window.setInterval(sync, 1200);
    });

    return () => {
      cancelled = true;
      if (pollId) window.clearInterval(pollId);
      try {
        playerRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      playerRef.current = null;
    };
  }, [trackCaptions, fill, iframeDomId, src]);

  const captionOverlay =
    showCaptions && activeCaption ? (
      <div className="absolute left-3 right-16 bottom-[22%] z-[8] pointer-events-none">
        <div className="max-w-[85%] rounded-2xl bg-black/55 border border-white/15 backdrop-blur-md px-3.5 py-2.5 shadow-lg">
          <div className="mono text-[9px] uppercase tracking-wider text-white/45 mb-1">Caption</div>
          <div className="text-[14px] font-semibold leading-snug text-white whitespace-pre-wrap break-words">
            {activeCaption}
          </div>
        </div>
      </div>
    ) : null;

  if (fill) {
    return (
      <div className={`absolute inset-0 overflow-hidden bg-black ${className}`}>
        <iframe
          id={iframeDomId}
          ref={iframeRef}
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        {captionOverlay}
      </div>
    );
  }

  return (
    <div
      className={
        compact
          ? `relative overflow-hidden rounded-lg border border-white/10 bg-black ${className}`
          : `relative overflow-hidden rounded-[14px] border border-white/10 bg-black aspect-video ${className}`
      }
      style={compact ? { width: 160, height: 90 } : undefined}
    >
      <iframe
        id={iframeDomId}
        ref={iframeRef}
        title={title}
        src={src}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
      {showCaptions && activeCaption && !compact ? (
        <div className="absolute left-2 right-2 bottom-2 z-[2] pointer-events-none">
          <div className="rounded-lg bg-black/60 border border-white/10 px-2 py-1.5 text-[12px] font-semibold text-white leading-snug whitespace-pre-wrap break-words">
            {activeCaption}
          </div>
        </div>
      ) : null}
    </div>
  );
}
