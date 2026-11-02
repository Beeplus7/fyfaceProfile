/** IndexedDB blob store for live session recordings (too big for localStorage). */

const DB_NAME = 'myface.live.media';
const DB_VERSION = 1;
const STORE = 'clips';

export type LiveClipMeta = {
  id: string;
  mimeType: string;
  bytes: number;
  createdAt: string;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('idb open failed'));
  });
}

export async function saveLiveClip(id: string, blob: Blob): Promise<LiveClipMeta> {
  const db = await openDb();
  const meta: LiveClipMeta & { blob: Blob } = {
    id,
    mimeType: blob.type || 'video/webm',
    bytes: blob.size,
    createdAt: new Date().toISOString(),
    blob,
  };
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(meta);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('idb put failed'));
  });
  db.close();
  return { id: meta.id, mimeType: meta.mimeType, bytes: meta.bytes, createdAt: meta.createdAt };
}

export async function readLiveClip(id: string): Promise<Blob | null> {
  const db = await openDb();
  const row = await new Promise<(LiveClipMeta & { blob: Blob }) | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => resolve(req.result as (LiveClipMeta & { blob: Blob }) | undefined);
    req.onerror = () => reject(req.error || new Error('idb get failed'));
  });
  db.close();
  return row?.blob || null;
}

export async function deleteLiveClip(id: string): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error || new Error('idb delete failed'));
  });
  db.close();
}

export async function liveClipUrl(id: string): Promise<string | null> {
  const blob = await readLiveClip(id);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/** Pick a MediaRecorder mime the browser actually supports. */
export function pickRecorderMime(preferVideo: boolean): string {
  const candidates = preferVideo
    ? [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
        'video/mp4',
      ]
    : ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'];
  for (const mime of candidates) {
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return preferVideo ? 'video/webm' : 'audio/webm';
}
