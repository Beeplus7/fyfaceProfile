import { readBroadcast } from '../demo/testLab';
import { isLiveAudioPublishing } from './liveAudioRelay';
import { sharedStreamIsLive } from './liveCameraBus';
import { isLiveMediaSourceActive } from './liveMediaSource';

/**
 * True when THIS browser owns the live session.
 * YouTube / playlist lives have no MediaStream — ownership is the local broadcast
 * record (from !== 'remote' + youtubeId). Do not treat those as "viewer only".
 */
export function isLocalLiveHost(): boolean {
  const local = readBroadcast();
  if (!local?.live || local.from === 'remote') return false;
  if (sharedStreamIsLive() || isLiveAudioPublishing() || isLiveMediaSourceActive()) return true;
  if (local.youtubeId) return true;
  return false;
}
