import { readBroadcast } from '../demo/testLab';

/**
 * True when THIS browser owns the live session.
 * Ownership is the local broadcast record (from !== 'remote'), not MediaStream
 * presence — camera may still be starting, and YouTube/file hosts have no cam.
 */
export function isLocalLiveHost(): boolean {
  const local = readBroadcast();
  return Boolean(local?.live && local.from !== 'remote');
}

/** Feed URL that keeps private contacts group live visible (split video stage). */
export function liveFeedEntryUrl(opts?: { invitePrivate?: boolean }): string {
  const local = readBroadcast();
  const privateLive =
    opts?.invitePrivate ||
    Boolean(local?.live && !local.publicFeed && local.visibility !== 'public');
  return privateLive ? '/app/feed?live=1&invite=private' : '/app/feed?live=1';
}
