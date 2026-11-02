import { useEffect, useState } from 'react';

type Props = {
  open: boolean;
  file: File | null;
  onClose: () => void;
  onPost: (opts: { file: File; title: string; caption: string }) => Promise<void>;
};

/** Caption + confirm sheet after picking a video to post on the feed. */
export default function UploadPostSheet({ open, file, onClose, onPost }: Props) {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !file) {
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setTitle(file.name.replace(/\.[^.]+$/, '').slice(0, 48));
    setCaption('');
    setErr(null);
    return () => URL.revokeObjectURL(url);
  }, [open, file]);

  if (!open || !file) return null;

  return (
    <div className="fixed inset-0 z-[92] flex items-end sm:items-center justify-center">
      <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" onClick={onClose} disabled={busy} />
      <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/12 bg-[#0B0B0B] p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl max-h-[92svh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-wider text-white/45">New post</div>
            <h2 className="text-[18px] font-extrabold tracking-tight">Upload & post</h2>
            <p className="mono text-[11px] text-white/50 mt-1">Publishes to For You + WorkCuts</p>
          </div>
          <button type="button" className="h-9 w-9 rounded-full border border-white/12" onClick={onClose} disabled={busy}>
            ✕
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-white/12 bg-black aspect-[9/14] max-h-[42svh] relative">
          {previewUrl ? (
            <video src={previewUrl} className="absolute inset-0 h-full w-full object-cover" controls playsInline muted={false} />
          ) : null}
        </div>

        <div className="mt-3 space-y-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full h-11 rounded-xl border border-white/15 bg-black/50 px-3 text-[14px] outline-none"
            maxLength={80}
          />
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption · hashtags…"
            rows={3}
            className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2.5 text-[13px] outline-none resize-none"
            maxLength={280}
          />
          <div className="mono text-[10px] text-white/40 truncate">{file.name} · {(file.size / (1024 * 1024)).toFixed(1)} MB</div>
          {err ? <div className="mono text-[11px] text-red-400">{err}</div> : null}
        </div>

        <div className="mt-4 grid gap-2">
          <button
            type="button"
            disabled={busy}
            className="w-full h-12 rounded-2xl bg-white text-black font-bold text-[14px] disabled:opacity-50"
            onClick={() => {
              void (async () => {
                setBusy(true);
                setErr(null);
                try {
                  await onPost({
                    file,
                    title: title.trim() || 'My WorkCut',
                    caption: caption.trim() || `Uploaded WorkCut ✂️ #MyFace`,
                  });
                } catch (e) {
                  setErr(e instanceof Error ? e.message : 'Could not post video');
                  setBusy(false);
                }
              })();
            }}
          >
            {busy ? 'Posting…' : 'Post to feed'}
          </button>
          <button type="button" className="w-full h-11 rounded-2xl border border-white/12 mono text-[11px] font-bold" onClick={onClose} disabled={busy}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
