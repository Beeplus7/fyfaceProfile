/** User-uploaded videos posted to the For You / WorkCuts feed. */

import { saveLiveClip, deleteLiveClip } from '../live/liveRecordingMedia';

export const FEED_USER_POSTS_KEY = 'myface.feed.userPosts.v1';
export const FEED_USER_POSTS_EVENT = 'myface-feed-user-posts';

export type FeedUserPost = {
  id: string;
  title: string;
  caption: string;
  hashtags: string[];
  createdAt: string;
  durationSec?: number;
  mimeType?: string;
  /** IndexedDB clip id (same store as live recordings) */
  mediaId: string;
  likes: number;
  comments: number;
  gifts: number;
};

function emit() {
  window.dispatchEvent(new Event(FEED_USER_POSTS_EVENT));
}

export function readFeedUserPosts(): FeedUserPost[] {
  try {
    const raw = localStorage.getItem(FEED_USER_POSTS_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as FeedUserPost[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function writeFeedUserPosts(list: FeedUserPost[]) {
  localStorage.setItem(FEED_USER_POSTS_KEY, JSON.stringify(list));
  emit();
}

function formatDuration(sec: number) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

export function probeVideoDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => {
      const d = Number.isFinite(v.duration) ? v.duration : 0;
      URL.revokeObjectURL(url);
      resolve(Math.max(1, Math.round(d)));
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(15);
    };
    v.src = url;
  });
}

export async function createFeedUserPost(opts: {
  file: File;
  title?: string;
  caption?: string;
}): Promise<FeedUserPost> {
  const id = `post_${Date.now().toString(36)}`;
  const durationSec = await probeVideoDuration(opts.file);
  await saveLiveClip(id, opts.file);
  const title =
    opts.title?.trim() ||
    opts.file.name.replace(/\.[^.]+$/, '').slice(0, 48) ||
    'My WorkCut';
  const caption =
    opts.caption?.trim() ||
    `Posted from upload · ${formatDuration(durationSec)} ✂️ #WorkCut #MyFace`;
  const post: FeedUserPost = {
    id,
    title,
    caption,
    hashtags: ['#WorkCut', '#Upload', '#MyFace', '#Oldham'],
    createdAt: new Date().toISOString(),
    durationSec,
    mimeType: opts.file.type || 'video/mp4',
    mediaId: id,
    likes: 1,
    comments: 0,
    gifts: 0,
  };
  writeFeedUserPosts([post, ...readFeedUserPosts()].slice(0, 60));
  return post;
}

export async function deleteFeedUserPost(id: string) {
  writeFeedUserPosts(readFeedUserPosts().filter((p) => p.id !== id));
  try {
    await deleteLiveClip(id);
  } catch {
    /* ignore */
  }
}

export { formatDuration as formatPostDuration };
