import { useId, useRef, useState } from 'react';
import type { BroadcastMode } from '../demo/testLab';

export type GoLivePick =
  | { kind: 'camera'; mode: BroadcastMode }
  | { kind: 'file'; file: File }
  | { kind: 'link'; url: string }
  /** Upload a video and publish it as a WorkCut on the feed (not live stream). */
  | { kind: 'post'; file: File };

type Props = {
  open: boolean;
  onClose: () => void;
  /** @deprecated prefer onChoose — kept for older call sites */
  onPick?: (mode: BroadcastMode) => void;
  onChoose?: (pick: GoLivePick) => void | Promise<void>;
  title?: string;
  /** Light Axentra surface vs dark theater */
  theme?: 'light' | 'dark';
};

/** Modal: camera / audio / upload video file / video link before going on air. */
export default function GoLivePicker({
  open,
  onClose,
  onPick,
  onChoose,
  title = 'Go Live',
  theme = 'dark',
}: Props) {
  const fileId = useId();
  const postFileId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const postFileRef = useRef<HTMLInputElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkErr, setLinkErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [busyLabel, setBusyLabel] = useState('');

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

  const emitCamera = (mode: BroadcastMode) => {
    void runChoose({ kind: 'camera', mode }, mode === 'audio' ? 'Starting audio…' : 'Opening camera…');
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
    setLinkErr(null);
    void runChoose({ kind: 'file', file }, 'Uploading video to stream…');
  };

  const submitLink = () => {
    const url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      setLinkErr('Paste a full https:// link to an mp4/webm file');
      return;
    }
    if (/youtube\.com|youtu\.be|vimeo\.com|tiktok\.com/i.test(url)) {
      setLinkErr('Need a direct file URL (…/video.mp4), not a YouTube page');
      return;
    }
    setLinkErr(null);
    void runChoose({ kind: 'link', url }, 'Starting link stream…');
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-label="Close" onClick={onClose} disabled={busy} />
      <div className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border shadow-2xl p-5 pb-[max(20px,env(safe-area-inset-bottom))] max-h-[92svh] overflow-y-auto ${shell}`}>
        <div className="flex items-start justify-between gap-3 mb-1">
          <div>
            <div className={`mono text-[10px] uppercase tracking-wider ${muted}`}>Optional · pick one</div>
            <h2 className="text-[18px] font-extrabold tracking-tight mt-0.5">{title}</h2>
            <p className={`text-[12px] mt-1 leading-relaxed ${muted}`}>
              Post a WorkCut to the feed, or go live with camera / file / link.
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
        ) : (
          <div className="mt-4 grid gap-2.5">
            {/* Post to feed (not live) */}
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

            {/* Live: stream an uploaded file */}
            <label
              htmlFor={fileId}
              className={`w-full text-left rounded-2xl border p-4 transition cursor-pointer block ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#FFE600] to-[#FF8A00] grid place-items-center text-[20px] text-black shrink-0">
                  ⬆
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Upload video to live stream</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Broadcast a file live to viewers</div>
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
              onClick={() => emitCamera('video')}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 grid place-items-center text-[20px] shrink-0">
                  ◉
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Video Live (camera)</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Live camera + mic</div>
                </div>
                <span className="mono text-[10px] font-bold text-red-400">CAM</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => emitCamera('audio')}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#1A7CFF] to-[#8FFF4A] grid place-items-center text-[20px] text-black shrink-0">
                  ♪
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Audio Live</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Mic only · no camera</div>
                </div>
                <span className="mono text-[10px] font-bold text-[#1A7CFF]">AUDIO</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setLinkOpen((v) => !v);
                setLinkErr(null);
              }}
              className={`w-full text-left rounded-2xl border p-4 transition ${card}`}
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#8FFF4A] to-[#1A7CFF] grid place-items-center text-[18px] text-black shrink-0">
                  🔗
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] font-bold">Video link</div>
                  <div className={`text-[11px] mt-0.5 ${muted}`}>Direct https://…mp4 URL</div>
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
                  Start link stream
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
