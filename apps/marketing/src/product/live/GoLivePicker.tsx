import { useEffect, useId, useRef, useState } from 'react';
import type { BroadcastMode } from '../demo/testLab';
import {
  extractYoutubeId,
  normalizeYoutubePlaylistItems,
  type YoutubePlaylistItem,
} from '../music/youtube';
import {
  DEFAULT_LIVE_AUDIENCE,
  normalizeAudience,
  SEED_LIVE_CONTACTS,
  type LiveAudience,
  type LiveContactOption,
} from './liveAudience';

export type GoLivePick =
  | { kind: 'camera'; mode: BroadcastMode; audience: LiveAudience }
  | { kind: 'file'; file: File; audience: LiveAudience }
  | { kind: 'link'; url: string; audience: LiveAudience }
  | {
      kind: 'youtube';
      youtubeId: string;
      url: string;
      audience: LiveAudience;
      /** Planned live length — playlist/video loops if shorter */
      durationSec: number;
      /** Ordered videos with captions. Next plays when one ends. */
      playlist: YoutubePlaylistItem[];
    }
  /** Upload a video and publish it as a WorkCut on the feed (not live stream). */
  | { kind: 'post'; file: File };

type PendingLive =
  | { kind: 'camera'; mode: BroadcastMode }
  | { kind: 'file'; file: File }
  | { kind: 'link'; url: string }
  | {
      kind: 'youtube';
      youtubeId: string;
      url: string;
      durationSec: number;
      playlist: YoutubePlaylistItem[];
    };

const YT_DURATION_PRESETS: { label: string; sec: number }[] = [
  { label: '15m', sec: 15 * 60 },
  { label: '30m', sec: 30 * 60 },
  { label: '45m', sec: 45 * 60 },
  { label: '1h', sec: 60 * 60 },
  { label: '2h', sec: 2 * 60 * 60 },
];

const DEFAULT_YT_DURATION_SEC = 30 * 60;

function clampYtDurationSec(sec: number) {
  return Math.min(8 * 60 * 60, Math.max(60, Math.round(sec)));
}

function formatYtDurationLabel(sec: number) {
  if (sec >= 3600 && sec % 3600 === 0) return `${sec / 3600}h`;
  if (sec >= 60 && sec % 60 === 0) return `${sec / 60}m`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s ? `${m}m ${s}s` : `${m}m`;
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** @deprecated prefer onChoose — kept for older call sites */
  onPick?: (mode: BroadcastMode) => void;
  onChoose?: (pick: GoLivePick) => void | Promise<void>;
  title?: string;
  /** Light Axentra surface vs dark theater */
  theme?: 'light' | 'dark';
  /** Optional CRM contacts; falls back to seed list */
  contacts?: LiveContactOption[];
};

function withAudience(pending: PendingLive, audience: LiveAudience): GoLivePick {
  if (pending.kind === 'camera') return { kind: 'camera', mode: pending.mode, audience };
  if (pending.kind === 'file') return { kind: 'file', file: pending.file, audience };
  if (pending.kind === 'youtube') {
    const playlist = normalizeYoutubePlaylistItems([
      { id: pending.youtubeId, caption: '' },
      ...(pending.playlist || []),
    ]);
    // Keep captions from pending (pending.youtubeId may have been first with caption)
    const merged = normalizeYoutubePlaylistItems(pending.playlist?.length ? pending.playlist : playlist);
    const first = merged[0] || { id: pending.youtubeId, caption: '' };
    return {
      kind: 'youtube',
      youtubeId: first.id,
      url: pending.url || `https://www.youtube.com/watch?v=${first.id}`,
      audience,
      durationSec: clampYtDurationSec(pending.durationSec || DEFAULT_YT_DURATION_SEC),
      playlist: merged,
    };
  }
  return { kind: 'link', url: pending.url, audience };
}

/** Modal: camera / audio / upload / YouTube / link + contacts-only audience. */
export default function GoLivePicker({
  open,
  onClose,
  onPick,
  onChoose,
  title = 'Go Live',
  theme = 'dark',
  contacts,
}: Props) {
  const fileId = useId();
  const postFileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const postFileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [ytUrl, setYtUrl] = useState('');
  const [ytCaptionDraft, setYtCaptionDraft] = useState('');
  const [ytQueue, setYtQueue] = useState<YoutubePlaylistItem[]>([]);
  const [ytDurationSec, setYtDurationSec] = useState(DEFAULT_YT_DURATION_SEC);
  const [ytCustomMin, setYtCustomMin] = useState('');
  const [linkErr, setLinkErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');
  const [pending, setPending] = useState<PendingLive | null>(null);
  const [visibility, setVisibility] = useState<'contacts' | 'public'>('contacts');
  const [publicFeed, setPublicFeed] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const contactList = contacts?.length ? contacts : SEED_LIVE_CONTACTS;

  useEffect(() => {
    if (!open) {
      setPending(null);
      setVisibility('contacts');
      setPublicFeed(false);
      setSelectedIds([]);
      setLinkErr(null);
      setBusy(false);
      setYtDurationSec(DEFAULT_YT_DURATION_SEC);
      setYtCustomMin('');
      setYtQueue([]);
      setYtUrl('');
      setYtCaptionDraft('');
    }
  }, [open]);

  useEffect(() => {
    if (pending && selectedIds.length === 0 && contactList.length) {
      setSelectedIds(contactList.slice(0, 3).map((c) => c.id));
    }
  }, [pending, contactList, selectedIds.length]);

  if (!open) return null;

  const dark = theme === 'dark';
  const shell = dark
    ? 'bg-[#0B0B0B] border-white/12 text-white'
    : 'bg-white border-[#E7EBF0] text-[#0F172A]';
  const muted = dark ? 'text-white/50' : 'text-[#64748B]';
  const card = dark
    ? 'border-white/12 bg-white/[0.04] hover:bg-white/[0.08]'
    : 'border-[#E7EBF0] bg-[#F7F8FA] hover:bg-[#EEF2F7]';
  const ghost = dark
    ? 'border-white/12 text-white/70 hover:bg-white/5'
    : 'border-[#E7EBF0] text-[#64748B] hover:bg-[#F7F8FA]';
  const field = dark
    ? 'border-white/15 bg-black/40 text-white placeholder:text-white/35'
    : 'border-[#E7EBF0] bg-white text-[#0F172A] placeholder:text-[#94A3B8]';

  const runChoose = async (pick: GoLivePick, label: string) => {
    if (busy) return;
    setBusy(true);
    setBusyLabel(label);
    try {
      if (onChoose) await onChoose(pick);
      else if (pick.kind === 'camera') onPick?.(pick.mode);
      else onPick?.('video');
    } finally {
      setBusy(false);
      setBusyLabel('');
    }
  };

  const beginAudience = (next: PendingLive) => {
    setLinkErr(null);
    setPending(next);
    setVisibility('contacts');
    setPublicFeed(false);
  };

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const confirmAudience = () => {
    if (!pending) return;
    if (visibility === 'contacts' && selectedIds.length === 0) {
      setLinkErr('Select at least one contact for a private live');
      return;
    }
    const audience = normalizeAudience({
      visibility,
      publicFeed: visibility === 'public' ? true : publicFeed,
      contactIds: visibility === 'contacts' ? selectedIds : [],
    });
    const pick = withAudience(pending, audience);
    const label =
      pick.kind === 'camera'
        ? pick.mode === 'audio'
          ? 'Starting audio…'
          : 'Opening camera…'
        : pick.kind === 'file'
          ? 'Uploading video to stream…'
          : pick.kind === 'youtube'
            ? 'Starting YouTube live…'
            : 'Starting link stream…';
    void runChoose(pick, label);
  };

  const onFilePicked = (file: File | undefined) => {
    if (!file) return;
    const type = (file.type || '').toLowerCase();
    const name = file.name.toLowerCase();
    const ok =
      type.startsWith('video/') ||
      /\.(mp4|webm|mov|m4v|mpeg|mpg|avi|mkv)$/i.test(name);
    if (!ok) {
      setLinkErr('Please choose a video file (mp4, webm, mov…)');
      return;
    }
    beginAudience({ kind: 'file', file });
  };

  const submitLink = () => {
    const url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      setLinkErr('Paste a full https:// link to an mp4/webm file');
      return;
    }
    const yt = extractYoutubeId(url);
    if (yt) {
      const playlist = normalizeYoutubePlaylistItems([
        ...ytQueue,
        { id: yt, caption: ytCaptionDraft.trim().slice(0, 160) },
      ]);
      const first = playlist[0] || { id: yt, caption: '' };
      beginAudience({
        kind: 'youtube',
        youtubeId: first.id,
        url,
        durationSec: clampYtDurationSec(ytDurationSec || DEFAULT_YT_DURATION_SEC),
        playlist,
      });
      return;
    }
    if (/vimeo\.com|tiktok\.com/i.test(url)) {
      setLinkErr('Use YouTube Live option, or a direct …/video.mp4 URL');
      return;
    }
    beginAudience({ kind: 'link', url });
  };

  const addYtToQueue = () => {
    const raw = ytUrl.trim();
    if (!raw) {
      setLinkErr('Paste a YouTube URL, then tap Add');
      return;
    }
    const yt = extractYoutubeId(raw);
    if (!yt) {
      setLinkErr('Paste a YouTube watch / youtu.be / Shorts / Live URL');
      return;
    }
    const caption = ytCaptionDraft.trim().slice(0, 160);
    setYtQueue((prev) => {
      if (prev.some((x) => x.id === yt)) {
        return prev.map((x) => (x.id === yt ? { ...x, caption: caption || x.caption } : x));
      }
      if (prev.length >= 25) return prev;
      return [...prev, { id: yt, caption }];
    });
    setYtUrl('');
    setYtCaptionDraft('');
    setLinkErr(null);
  };

  const updateQueueCaption = (id: string, caption: string) => {
    const next = caption.slice(0, 160);
    setYtQueue((prev) => prev.map((x) => (x.id === id ? { ...x, caption: next } : x)));
    setPending((p) =>
      p?.kind === 'youtube'
        ? {
            ...p,
            playlist: p.playlist.map((x) => (x.id === id ? { ...x, caption: next } : x)),
          }
        : p,
    );
  };

  const removeYtFromQueue = (id: string) => {
    setYtQueue((prev) => prev.filter((x) => x.id !== id));
    setPending((p) => {
      if (p?.kind !== 'youtube') return p;
      const playlist = normalizeYoutubePlaylistItems(p.playlist.filter((x) => x.id !== id));
      if (!playlist.length) return null;
      return {
        ...p,
        youtubeId: playlist[0]!.id,
        url: `https://www.youtube.com/watch?v=${playlist[0]!.id}`,
        playlist,
      };
    });
  };

  const submitYoutube = () => {
    const raw = ytUrl.trim();
    const typed = raw ? extractYoutubeId(raw) : null;
    const playlist = normalizeYoutubePlaylistItems([
      ...ytQueue,
      ...(typed
        ? [{ id: typed, caption: ytCaptionDraft.trim().slice(0, 160) }]
        : []),
    ]);
    if (!playlist.length) {
      setLinkErr('Add at least one YouTube video to the playlist');
      return;
    }
    const custom = Number(ytCustomMin);
    const durationSec = clampYtDurationSec(
      Number.isFinite(custom) && custom > 0 ? custom * 60 : ytDurationSec || DEFAULT_YT_DURATION_SEC,
    );
    if (durationSec < 60) {
      setLinkErr('Set a live duration of at least 1 minute');
      return;
    }
    const first = playlist[0]!;
    const url = `https://www.youtube.com/watch?v=${first.id}`;
    setYtQueue(playlist);
    setYtUrl('');
    setYtCaptionDraft('');
    beginAudience({ kind: 'youtube', youtubeId: first.id, url, durationSec, playlist });
  };

  const setPendingYtDuration = (sec: number) => {
    const next = clampYtDurationSec(sec);
    setYtDurationSec(next);
    setPending((p) => (p?.kind === 'youtube' ? { ...p, durationSec: next } : p));
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close" onClick={onClose} disabled={busy} />
      <div className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl p-5 pb-[max(20px,env(safe-area-inset-bottom))] max-h-[92svh] overflow-y-auto ${shell}`}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className={`mono text-[10px] uppercase tracking-wider ${muted}`}>
              {pending ? 'Step 2 · audience' : 'Optional · pick one'}
            </div>
            <h2 className="text-[18px] font-extrabold tracking-tight mt-0.5">
              {pending ? 'Who can watch?' : title}
            </h2>
            <p className={`text-[12px] mt-1 leading-relaxed ${muted}`}>
              {pending
                ? 'Private with selected contacts by default. Switch on public For You only if you want everyone to see it.'
                : 'Post a WorkCut, or go live with camera / file / YouTube / link.'}
            </p>
          </div>
          <button type="button" className={`h-9 w-9 rounded-full border text-[14px] shrink-0 ${ghost}`} onClick={onClose} disabled={busy}>
            ✕
          </button>
        </div>

        {busy ? (
          <div className={`mt-4 rounded-2xl border px-4 py-6 text-center ${dark ? 'border-white/12 bg-white/[0.04]' : 'border-[#E7EBF0] bg-[#F7F8FA]'}`}>
            <div className="mono text-[12px] font-bold animate-pulse">{busyLabel || 'Starting…'}</div>
            <div className={`mono text-[10px] mt-2 ${muted}`}>Keep this screen open</div>
          </div>
        ) : pending ? (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setVisibility('contacts');
                  setPublicFeed(false);
                }}
                className={`rounded-2xl border p-3 text-left transition ${
                  visibility === 'contacts'
                    ? dark
                      ? 'border-[#8FFF4A]/50 bg-[#8FFF4A]/10'
                      : 'border-[#8FFF4A] bg-[#8FFF4A]/15'
                    : card
                }`}
              >
                <div className="text-[13px] font-bold">Selected contacts</div>
                <div className={`mono text-[9px] mt-1 ${muted}`}>Private · not on public feed</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setVisibility('public');
                  setPublicFeed(true);
                }}
                className={`rounded-2xl border p-3 text-left transition ${
                  visibility === 'public'
                    ? dark
                      ? 'border-red-400/50 bg-red-500/10'
                      : 'border-red-400 bg-red-50'
                    : card
                }`}
              >
                <div className="text-[13px] font-bold">Everyone</div>
                <div className={`mono text-[9px] mt-1 ${muted}`}>Public For You feed</div>
              </button>
            </div>

            {visibility === 'contacts' ? (
              <>
                <div className={`rounded-2xl border max-h-[36svh] overflow-y-auto ${dark ? 'border-white/12' : 'border-[#E7EBF0]'}`}>
                  {contactList.map((c) => {
                    const on = selectedIds.includes(c.id);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleContact(c.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left border-b last:border-b-0 ${
                          dark ? 'border-white/8' : 'border-[#E7EBF0]'
                        } ${on ? (dark ? 'bg-white/[0.06]' : 'bg-[#F0FDF4]') : ''}`}
                      >
                        <span
                          className={`h-5 w-5 rounded-md border grid place-items-center text-[11px] font-black shrink-0 ${
                            on
                              ? 'bg-[#8FFF4A] text-black border-[#8FFF4A]'
                              : dark
                                ? 'border-white/25 text-transparent'
                                : 'border-[#CBD5E1] text-transparent'
                          }`}
                        >
                          ✓
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-semibold truncate">{c.name}</span>
                          <span className={`mono text-[9px] ${muted}`}>
                            {[c.trade, c.status].filter(Boolean).join(' · ') || 'Contact'}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <label className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 cursor-pointer ${dark ? 'border-white/12' : 'border-[#E7EBF0]'}`}>
                  <input
                    type="checkbox"
                    checked={publicFeed}
                    onChange={(e) => setPublicFeed(e.target.checked)}
                    className="accent-[#8FFF4A]"
                  />
                  <span className="text-[12px] font-semibold">Also show on public For You feed</span>
                </label>
                <div className={`mono text-[9px] px-1 ${muted}`}>
                  Off by default — only selected contacts see this live until you switch public on.
                </div>
              </>
            ) : (
              <div className={`rounded-2xl border px-3 py-3 mono text-[11px] ${dark ? 'border-white/12 bg-white/[0.04]' : 'border-[#E7EBF0] bg-[#F7F8FA]'}`}>
                This live will appear on the public For You feed for everyone.
              </div>
            )}

            {pending.kind === 'youtube' ? (
              <div className={`rounded-2xl border p-3 space-y-2 ${dark ? 'border-white/12 bg-white/[0.04]' : 'border-[#E7EBF0] bg-[#F7F8FA]'}`}>
                <div className="text-[13px] font-bold">
                  Playlist · {pending.playlist.length} video{pending.playlist.length === 1 ? '' : 's'}
                </div>
                <div className={`mono text-[10px] leading-relaxed ${muted}`}>
                  Plays in order — next starts when one ends. Captions show on the live stage for the
                  playing clip. Runs for {formatYtDurationLabel(pending.durationSec)}.
                </div>
                <div className="space-y-2 max-h-[28svh] overflow-y-auto">
                  {pending.playlist.map((item, i) => (
                    <div
                      key={item.id}
                      className={`rounded-xl border px-2.5 py-2 space-y-1.5 ${
                        dark ? 'border-white/10' : 'border-[#E7EBF0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`mono text-[9px] w-5 shrink-0 ${muted}`}>{i + 1}</span>
                        <span className="mono text-[11px] font-bold truncate flex-1">{item.id}</span>
                        {pending.playlist.length > 1 ? (
                          <button
                            type="button"
                            className={`mono text-[9px] font-bold px-2 h-6 rounded-md border ${ghost}`}
                            onClick={() => removeYtFromQueue(item.id)}
                          >
                            Remove
                          </button>
                        ) : null}
                      </div>
                      <input
                        value={item.caption}
                        onChange={(e) => updateQueueCaption(item.id, e.target.value)}
                        placeholder="Caption for this video…"
                        maxLength={160}
                        className={`w-full h-9 rounded-lg border px-2.5 text-[12px] outline-none ${field}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {YT_DURATION_PRESETS.map((p) => {
                    const on = pending.durationSec === p.sec;
                    return (
                      <button
                        key={p.sec}
                        type="button"
                        onClick={() => setPendingYtDuration(p.sec)}
                        className={`h-8 px-2.5 rounded-lg border mono text-[10px] font-bold ${
                          on
                            ? dark
                              ? 'border-[#FF6666]/60 bg-[#FF0000]/20 text-white'
                              : 'border-[#FF0000] bg-red-50 text-[#B91C1C]'
                            : ghost
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {linkErr ? <div className="mono text-[10px] text-red-400 px-1">{linkErr}</div> : null}

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className={`flex-1 h-11 rounded-xl border mono text-[11px] font-bold ${ghost}`}
                onClick={() => {
                  setPending(null);
                  setLinkErr(null);
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="flex-[1.4] h-11 rounded-xl bg-white text-black font-bold text-[13px]"
                onClick={confirmAudience}
              >
                Start {visibility === 'contacts' && !publicFeed ? 'private' : 'live'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5">
            <label
              htmlFor={postFileId}
              className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer block ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8FFF4A] to-[#FFE600] grid place-items-center text-[18px] text-black shrink-0 font-black">
                  +
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Upload & post to feed</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>WorkCut on For You · not a live stream</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#8FFF4A]">POST</span>
              </div>
            </label>
            <input
              id={postFileId}
              ref={postFileRef}
              type="file"
              accept="video/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                if (!file) return;
                const type = (file.type || '').toLowerCase();
                const name = file.name.toLowerCase();
                const ok =
                  type.startsWith('video/') ||
                  /\.(mp4|webm|mov|m4v|mpeg|mpg|avi|mkv)$/i.test(name);
                if (!ok) {
                  setLinkErr('Please choose a video file (mp4, webm, mov…)');
                  return;
                }
                setLinkErr(null);
                void runChoose({ kind: 'post', file }, 'Opening post…');
              }}
            />

            <label
              htmlFor={fileId}
              className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer block ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FFE600] to-[#FF8A00] grid place-items-center text-[20px] text-black shrink-0">
                  ⬆
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Upload video + your camera</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Split screen · flip video ↔ cam live</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#FFE600]">LIVE</span>
              </div>
            </label>
            <input
              id={fileId}
              ref={fileRef}
              type="file"
              accept="video/*,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov,.m4v"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = '';
                onFilePicked(file);
              }}
            />

            <button
              type="button"
              onClick={() => beginAudience({ kind: 'camera', mode: 'video' })}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 grid place-items-center text-[20px] shrink-0">
                  ◉
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Video Live (camera)</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Then invite selected contacts</div>
                </div>
                <span className="mono text-[10px] font-bold text-red-400">CAM</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => beginAudience({ kind: 'camera', mode: 'audio' })}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1A7CFF] to-[#8FFF4A] grid place-items-center text-[20px] text-black shrink-0">
                  ♪
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Audio Live</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Mic only · contacts or public</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#1A7CFF]">AUDIO</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setYtOpen((v) => !v);
                setLinkOpen(false);
                setLinkErr(null);
              }}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FF0000] to-[#CC0000] grid place-items-center text-[18px] text-white shrink-0 font-black">
                  ▶
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">YouTube Live / playlist</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Queue videos · auto-plays next when one ends</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#FF6666]">YT</span>
              </div>
            </button>

            {ytOpen ? (
              <div className={`rounded-2xl border p-3 space-y-2.5 ${dark ? 'border-white/12 bg-black/30' : 'border-[#E7EBF0] bg-[#F7F8FA]'}`}>
                <div className="flex gap-2">
                  <input
                    value={ytUrl}
                    onChange={(e) => {
                      setYtUrl(e.target.value);
                      setLinkErr(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addYtToQueue();
                      }
                    }}
                    placeholder="https://www.youtube.com/watch?v=… or youtu.be/…"
                    className={`flex-1 h-11 rounded-xl border px-3 text-[13px] outline-none ${field}`}
                    inputMode="url"
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                  <button
                    type="button"
                    onClick={addYtToQueue}
                    className="h-11 px-3 rounded-xl border border-white/15 mono text-[11px] font-bold shrink-0"
                  >
                    Add
                  </button>
                </div>
                <input
                  value={ytCaptionDraft}
                  onChange={(e) => setYtCaptionDraft(e.target.value.slice(0, 160))}
                  placeholder="Caption for this video (shown while it plays)"
                  maxLength={160}
                  className={`w-full h-10 rounded-xl border px-3 text-[13px] outline-none ${field}`}
                />
                {ytQueue.length ? (
                  <div className="space-y-2 max-h-[28svh] overflow-y-auto">
                    <div className={`mono text-[9px] ${muted}`}>
                      Playlist · {ytQueue.length} · next autoplays · captions overlay on live
                    </div>
                    {ytQueue.map((item, i) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border px-2.5 py-2 space-y-1.5 ${
                          dark ? 'border-white/10' : 'border-[#E7EBF0]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`mono text-[9px] w-5 shrink-0 ${muted}`}>{i + 1}</span>
                          <span className="mono text-[11px] font-bold truncate flex-1">{item.id}</span>
                          <button
                            type="button"
                            className={`mono text-[9px] font-bold px-2 h-6 rounded-md border ${ghost}`}
                            onClick={() => removeYtFromQueue(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                        <input
                          value={item.caption}
                          onChange={(e) => updateQueueCaption(item.id, e.target.value)}
                          placeholder="Caption for this video…"
                          maxLength={160}
                          className={`w-full h-9 rounded-lg border px-2.5 text-[12px] outline-none ${field}`}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`mono text-[10px] leading-relaxed ${muted}`}>
                    Paste a link, write a caption, tap Add. Or Continue with one link + caption.
                  </div>
                )}
                <div>
                  <div className="text-[12px] font-bold mb-1">Live duration</div>
                  <div className={`mono text-[9px] mb-2 leading-relaxed ${muted}`}>
                    How long the live runs. Playlist auto-advances; loops from the start if still under duration.
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {YT_DURATION_PRESETS.map((p) => {
                      const on = ytDurationSec === p.sec && !ytCustomMin.trim();
                      return (
                        <button
                          key={p.sec}
                          type="button"
                          onClick={() => {
                            setYtDurationSec(p.sec);
                            setYtCustomMin('');
                            setLinkErr(null);
                          }}
                          className={`h-8 px-2.5 rounded-lg border mono text-[10px] font-bold ${
                            on
                              ? dark
                                ? 'border-[#FF6666]/60 bg-[#FF0000]/20 text-white'
                                : 'border-[#FF0000] bg-red-50 text-[#B91C1C]'
                              : ghost
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      value={ytCustomMin}
                      onChange={(e) => {
                        setYtCustomMin(e.target.value.replace(/[^\d]/g, '').slice(0, 4));
                        setLinkErr(null);
                      }}
                      placeholder="Custom minutes"
                      className={`flex-1 h-10 rounded-xl border px-3 text-[13px] outline-none ${field}`}
                      inputMode="numeric"
                    />
                    <span className={`mono text-[10px] shrink-0 ${muted}`}>min</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={submitYoutube}
                  className="w-full h-11 rounded-xl bg-[#FF0000] text-white font-bold text-[13px]"
                >
                  Continue · choose audience
                </button>
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => {
                setLinkOpen((v) => !v);
                setYtOpen(false);
                setLinkErr(null);
              }}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8FFF4A] to-[#1A7CFF] grid place-items-center text-[18px] text-black shrink-0">
                  🔗
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Video link + your camera</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Direct https://…mp4 · split with flip</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#8FFF4A]">LINK</span>
              </div>
            </button>

            {linkOpen ? (
              <div className={`rounded-2xl border p-3 space-y-2 ${dark ? 'border-white/12 bg-black/30' : 'border-[#E7EBF0] bg-[#F7F8FA]'}`}>
                <input
                  value={linkUrl}
                  onChange={(e) => {
                    setLinkUrl(e.target.value);
                    setLinkErr(null);
                  }}
                  placeholder="https://cdn.example.com/clip.mp4"
                  className={`w-full h-11 rounded-xl border px-3 text-[13px] outline-none ${field}`}
                  inputMode="url"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                <button
                  type="button"
                  onClick={submitLink}
                  className="w-full h-11 rounded-xl bg-white text-black font-bold text-[13px]"
                >
                  Continue · choose audience
                </button>
              </div>
            ) : null}

            {linkErr ? <div className="mono text-[10px] text-red-400 px-1">{linkErr}</div> : null}
          </div>
        )}

        <button type="button" className={`mt-4 w-full h-11 rounded-2xl border mono text-[11px] font-bold ${ghost}`} onClick={onClose} disabled={busy}>
          Not now
        </button>
      </div>
    </div>
  );
}

export { DEFAULT_LIVE_AUDIENCE, normalizeAudience };
export type { LiveAudience };
