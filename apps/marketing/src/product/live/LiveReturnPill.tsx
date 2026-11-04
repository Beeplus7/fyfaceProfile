import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clearLocalBroadcastOnly, readBroadcast } from '../demo/testLab';
import { isLocalLiveHost, liveFeedEntryUrl } from './liveHost';
import { fetchRemoteLive } from './liveRemote';

/**
 * Persistent “Back to LIVE” when a session is active but the user left the feed stage.
 * Does not end the broadcast — only navigates back to the live card.
 */
export default function LiveReturnPill() {
  const loc = useLocation();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('LIVE');

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const local = readBroadcast();
      const hostingHere = isLocalLiveHost();
      // Never clear YouTube local hosts — they have no MediaStream
      if (local?.live && local.from !== 'remote' && !hostingHere && !local.youtubeId) {
        clearLocalBroadcastOnly();
      }
      const remote = hostingHere ? null : await fetchRemoteLive();
      if (cancelled) return;
      if (hostingHere && local?.live) {
        setActive(true);
        setLabel(local.youtubeId ? 'YT LIVE' : local.mode === 'audio' ? 'Audio LIVE' : 'Your LIVE');
        return;
      }
      if (remote?.live) {
        setActive(true);
        setLabel(remote.title?.slice(0, 18) || 'LIVE now');
        return;
      }
      setActive(false);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 2500);
    window.addEventListener('myface-broadcast', () => void tick());
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  const onFeed = loc.pathname.startsWith('/app/feed');
  const onLiveRoom = loc.pathname.startsWith('/app/live');

  // On feed, TimelineFeed owns jump-to-live; elsewhere always offer return
  if (!active || onFeed || onLiveRoom) return null;

  return (
    <Link
      to={liveFeedEntryUrl()}
      className="fixed z-[80] right-3 bottom-[calc(72px+env(safe-area-inset-bottom,0px))] flex items-center gap-2 rounded-full bg-red-600 pl-2.5 pr-3.5 py-2 shadow-[0_8px_28px_rgba(220,38,38,0.45)] border border-white/20"
      aria-label="Return to live feed"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-75" />
        <span className="relative rounded-full h-2.5 w-2.5 bg-white" />
      </span>
      <span className="text-[11px] font-extrabold tracking-wide text-white uppercase">
        Back · {label}
      </span>
    </Link>
  );
}
