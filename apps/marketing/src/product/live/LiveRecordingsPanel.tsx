import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { CRM_BTN, CRM_BTN_GHOST, CRM_BTN_QUIET } from '../crmChrome';
import {
  deleteLiveRecording,
  formatDuration,
  LIVE_RECORDINGS_EVENT,
  publishLiveRecording,
  readLiveRecordings,
  unpublishLiveRecording,
  updateLiveRecording,
  type LiveRecording,
} from './liveRecordings';
import { readLiveClip } from './liveRecordingMedia';
import { ensureStandInClip } from './makeStandInClip';

type Props = {
  highlightId?: string | null;
};

/** Manage saved live sessions: play, edit, delete, post to public feed, open WorkCut. */
export default function LiveRecordingsPanel({ highlightId }: Props) {
  const [rows, setRows] = useState<LiveRecording[]>(() => readLiveRecordings());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [playing, setPlaying] = useState<LiveRecording | null>(null);
  const [playUrl, setPlayUrl] = useState<string | null>(null);
  const [playBusy, setPlayBusy] = useState(false);
  const playUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const sync = () => setRows(readLiveRecordings());
    sync();
    window.addEventListener(LIVE_RECORDINGS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(LIVE_RECORDINGS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (highlightId) setEditingId(null);
  }, [highlightId]);

  useEffect(
    () => () => {
      if (playUrlRef.current) URL.revokeObjectURL(playUrlRef.current);
    },
    [],
  );

  const flash = (msg: string) => {
    setNote(msg);
    window.setTimeout(() => setNote(null), 2200);
  };

  const startEdit = (rec: LiveRecording) => {
    setEditingId(rec.id);
    setTitle(rec.title);
    setCaption(rec.caption);
  };

  const saveEdit = (id: string) => {
    updateLiveRecording(id, { title, caption });
    setEditingId(null);
    flash('Recording updated');
  };

  const closePlayer = () => {
    if (playUrlRef.current) {
      URL.revokeObjectURL(playUrlRef.current);
      playUrlRef.current = null;
    }
    setPlayUrl(null);
    setPlaying(null);
    setPlayBusy(false);
  };

  const openPlayer = async (rec: LiveRecording) => {
    setPlayBusy(true);
    setPlaying(rec);
    try {
      let blob = await readLiveClip(rec.id);
      if (!blob) {
        flash('Building playable clip…');
        blob = await ensureStandInClip(rec);
        setRows(readLiveRecordings());
      }
      if (playUrlRef.current) URL.revokeObjectURL(playUrlRef.current);
      const url = URL.createObjectURL(blob);
      playUrlRef.current = url;
      setPlayUrl(url);
    } catch {
      flash('Could not open clip — go live again to capture video');
      closePlayer();
    } finally {
      setPlayBusy(false);
    }
  };

  return (
    <section className="px-3 md:px-5 pt-2 pb-[max(24px,env(safe-area-inset-bottom))] space-y-3 border-t border-white/10 bg-[#050505]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="poppins text-[14px] font-extrabold">Live recordings</h2>
          <div className="mono text-[10px] text-white/45 mt-0.5">
            Play · edit · delete · post to public For You · open in WorkCut
          </div>
        </div>
        <span className="mono text-[10px] text-white/40">{rows.length} saved</span>
      </div>

      {note ? (
        <div className="rounded-xl border border-[#8FFF4A]/30 bg-[#8FFF4A]/10 px-3 py-2 mono text-[11px] text-[#8FFF4A]">
          {note}
        </div>
      ) : null}

      {!rows.length ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center mono text-[11px] text-white/45">
          End a Video or Audio Live to save a recording here.
        </div>
      ) : (
        <div className="space-y-2.5">
          {rows.map((rec) => {
            const hot = highlightId === rec.id;
            const editing = editingId === rec.id;
            return (
              <div
                key={rec.id}
                className={`rounded-2xl border p-3 ${
                  hot ? 'border-[#8FFF4A]/50 bg-[#8FFF4A]/10' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => void openPlayer(rec)}
                    className="relative h-16 w-12 rounded-xl overflow-hidden border border-white/15 bg-gradient-to-br from-[#1E293B] to-black grid place-items-center shrink-0 group"
                    aria-label={`Play ${rec.title}`}
                  >
                    <span className="text-[18px] opacity-70">{rec.mode === 'audio' ? '♪' : '◉'}</span>
                    <span className="absolute inset-0 grid place-items-center bg-black/35 group-hover:bg-black/50 transition">
                      <span className="h-8 w-8 rounded-full bg-white text-black grid place-items-center text-[12px] font-black shadow-lg">
                        ▶
                      </span>
                    </span>
                    {rec.hasMedia ? (
                      <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
                    ) : null}
                  </button>
                  <div className="min-w-0 flex-1">
                    {editing ? (
                      <div className="space-y-2">
                        <input
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full h-9 rounded-xl border border-white/15 bg-black/40 px-3 text-[13px] outline-none"
                          placeholder="Title"
                        />
                        <textarea
                          value={caption}
                          onChange={(e) => setCaption(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-[12px] outline-none resize-none"
                          placeholder="Caption for public feed"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button type="button" className={CRM_BTN} onClick={() => saveEdit(rec.id)}>
                            Save edits
                          </button>
                          <button type="button" className={CRM_BTN_GHOST} onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <div className="text-[13px] font-bold truncate">{rec.title}</div>
                          <span
                            className={`rounded-full px-2 py-0.5 mono text-[8px] font-bold ${
                              rec.publicFeed
                                ? 'bg-[#8FFF4A]/20 text-[#8FFF4A]'
                                : 'bg-white/10 text-white/50'
                            }`}
                          >
                            {rec.publicFeed ? 'PUBLIC FEED' : 'DRAFT'}
                          </span>
                          <span className="rounded-full bg-white/10 px-2 py-0.5 mono text-[8px]">
                            {rec.mode.toUpperCase()}
                          </span>
                        </div>
                        <div className="mono text-[10px] text-white/45 mt-1 line-clamp-2">{rec.caption}</div>
                        <div className="mono text-[9px] text-white/35 mt-1.5">
                          {formatDuration(rec.durationSec)} · {rec.viewers} viewers · {rec.gifts ?? 0} gifts
                          {rec.hasMedia ? ' · clip ready' : ' · tap ▶ to open'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {!editing ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" className={CRM_BTN} onClick={() => void openPlayer(rec)} disabled={playBusy}>
                      {playBusy && playing?.id === rec.id ? 'Loading…' : 'Play'}
                    </button>
                    <button type="button" className={CRM_BTN_QUIET} onClick={() => startEdit(rec)}>
                      Edit
                    </button>
                    <Link
                      to={`/app/studio/workcut?from=live&rec=${encodeURIComponent(rec.id)}`}
                      className={CRM_BTN_QUIET}
                      onClick={() => {
                        try {
                          sessionStorage.setItem('myface.workcut.importRec', rec.id);
                        } catch {
                          /* ignore */
                        }
                      }}
                    >
                      Edit in WorkCut
                    </Link>
                    {rec.publicFeed ? (
                      <button
                        type="button"
                        className={CRM_BTN_GHOST}
                        onClick={() => {
                          unpublishLiveRecording(rec.id);
                          flash('Removed from public feed');
                        }}
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={CRM_BTN}
                        onClick={() => {
                          publishLiveRecording(rec.id);
                          flash('Posted to public For You feed');
                        }}
                      >
                        Post to public feed
                      </button>
                    )}
                    {rec.publicFeed ? (
                      <Link to="/app/feed" className={CRM_BTN_GHOST}>
                        Open feed
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="h-9 px-3 rounded-xl border border-red-500/30 text-red-300 text-[11px] font-semibold hover:bg-red-500/10"
                      onClick={() => {
                        if (!window.confirm('Delete this live recording?')) return;
                        deleteLiveRecording(rec.id);
                        flash('Recording deleted');
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {playing && playUrl ? (
        <div className="fixed inset-0 z-[95] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
          <button type="button" className="absolute inset-0" aria-label="Close player" onClick={closePlayer} />
          <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/12 bg-[#0B0B0B] overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="min-w-0">
                <div className="mono text-[10px] text-white/45 uppercase tracking-wider">Replay</div>
                <div className="text-[14px] font-bold truncate">{playing.title}</div>
              </div>
              <button type="button" className={CRM_BTN_GHOST + ' !px-3'} onClick={closePlayer}>
                Close
              </button>
            </div>
            <div className="bg-black aspect-[9/16] max-h-[70svh] relative">
              {playing.mode === 'audio' && !(playUrl.includes('video') || playing.hasMedia) ? null : null}
              <video
                key={playUrl}
                src={playUrl}
                className="absolute inset-0 h-full w-full object-contain bg-black"
                controls
                autoPlay
                playsInline
              />
            </div>
            <div className="p-3 flex flex-wrap gap-2 border-t border-white/10">
              <Link
                to={`/app/studio/workcut?from=live&rec=${encodeURIComponent(playing.id)}`}
                className={CRM_BTN}
                onClick={() => {
                  try {
                    sessionStorage.setItem('myface.workcut.importRec', playing.id);
                  } catch {
                    /* ignore */
                  }
                  closePlayer();
                }}
              >
                Edit in WorkCut
              </Link>
              <button type="button" className={CRM_BTN_GHOST} onClick={closePlayer}>
                Done
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
