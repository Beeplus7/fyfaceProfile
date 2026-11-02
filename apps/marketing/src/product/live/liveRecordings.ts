import type { BroadcastMode, BroadcastState } from '../demo/testLab';

export const LIVE_RECORDINGS_KEY = 'myface.live.recordings.v1';
export const LIVE_RECORDINGS_EVENT = 'myface-live-recordings';

export type LiveRecordingStatus = 'draft' | 'published' | 'archived';

export type LiveRecording = {
  id: string;
  title: string;
  caption: string;
  mode: BroadcastMode;
  viewers: number;
  durationSec: number;
  startedAt: string;
  endedAt: string;
  status: LiveRecordingStatus;
  /** When true, appears on public For You feed */
  publicFeed: boolean;
  gifts?: number;
  trade?: string;
  /** Real MediaRecorder clip stored in IndexedDB under this id */
  hasMedia?: boolean;
  mimeType?: string;
};

function emit() {
  window.dispatchEvent(new Event(LIVE_RECORDINGS_EVENT));
}

export function readLiveRecordings(): LiveRecording[] {
  try {
    const raw = localStorage.getItem(LIVE_RECORDINGS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as LiveRecording[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function writeLiveRecordings(list: LiveRecording[]) {
  localStorage.setItem(LIVE_RECORDINGS_KEY, JSON.stringify(list));
  emit();
}

export function formatDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/** Save a finished live session as an editable recording (draft by default). */
export function saveLiveRecordingFromBroadcast(
  broadcast: BroadcastState,
  opts?: {
    title?: string;
    caption?: string;
    publicFeed?: boolean;
    hasMedia?: boolean;
    mimeType?: string;
    durationSec?: number;
  },
): LiveRecording {
  const endedAt = new Date().toISOString();
  const durationSec =
    opts?.durationSec ??
    Math.max(1, Math.floor((Date.parse(endedAt) - Date.parse(broadcast.startedAt)) / 1000));
  const rec: LiveRecording = {
    id: `rec_${Date.now().toString(36)}`,
    title: opts?.title?.trim() || broadcast.title || 'Live session recording',
    caption:
      opts?.caption?.trim() ||
      (broadcast.mode === 'audio'
        ? 'Audio Live recording · ready to edit or post'
        : 'Video Live recording · ready to edit or post'),
    mode: broadcast.mode || 'video',
    viewers: broadcast.viewers || 0,
    durationSec,
    startedAt: broadcast.startedAt,
    endedAt,
    status: opts?.publicFeed ? 'published' : 'draft',
    publicFeed: Boolean(opts?.publicFeed),
    gifts: 12 + Math.floor(Math.random() * 40),
    trade: 'Tailors',
    hasMedia: Boolean(opts?.hasMedia),
    mimeType: opts?.mimeType,
  };
  const next = [rec, ...readLiveRecordings()].slice(0, 40);
  writeLiveRecordings(next);
  return rec;
}

export function updateLiveRecording(
  id: string,
  patch: Partial<Pick<LiveRecording, 'title' | 'caption' | 'status' | 'publicFeed'>>,
): LiveRecording | null {
  const list = readLiveRecordings();
  const idx = list.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  const updated: LiveRecording = {
    ...list[idx],
    ...patch,
    title: patch.title !== undefined ? patch.title.trim() || list[idx].title : list[idx].title,
    caption: patch.caption !== undefined ? patch.caption.trim() : list[idx].caption,
  };
  if (patch.publicFeed === true) updated.status = 'published';
  if (patch.publicFeed === false && updated.status === 'published') updated.status = 'draft';
  list[idx] = updated;
  writeLiveRecordings(list);
  return updated;
}

export function deleteLiveRecording(id: string) {
  writeLiveRecordings(readLiveRecordings().filter((r) => r.id !== id));
  void import('./liveRecordingMedia').then((m) => m.deleteLiveClip(id)).catch(() => undefined);
}

export function getLiveRecording(id: string): LiveRecording | null {
  return readLiveRecordings().find((r) => r.id === id) || null;
}

export function publishLiveRecording(id: string) {
  return updateLiveRecording(id, { publicFeed: true, status: 'published' });
}

export function unpublishLiveRecording(id: string) {
  return updateLiveRecording(id, { publicFeed: false, status: 'draft' });
}

export function readPublishedLiveRecordings(): LiveRecording[] {
  return readLiveRecordings().filter((r) => r.publicFeed && r.status === 'published');
}
