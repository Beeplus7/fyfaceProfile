import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { BroadcastMode } from '../demo/testLab';
import YoutubeEmbed from '../music/YoutubeEmbed';
import { switchStreamCamera, useLiveCamera } from './useLiveCamera';
import { getSharedLiveStream, sharedStreamIsLive } from './liveCameraBus';
import { liveFrameSrc, remoteFrameIsLive } from './liveFrameRelay';
import { createLiveAudioViewer } from './liveAudioRelay';
import { getLiveMediaElement, isLiveMediaSourceActive } from './liveMediaSource';
import { fetchRemoteLive, type LiveMusicPayload } from './liveRemote';
import {
  cancelJoinRequest,
  fetchLiveGuests,
  getOrCreateGuestIdentity,
  heartbeatGuest,
  leaveGuestLive,
  myGuestRole,
  requestJoinLive,
  type LiveGuestsState,
} from './liveGuests';
import {
  liveSlotFrameSrc,
  remoteSlotFrameIsLive,
  startSlotFramePublish,
  stopAllSlotFramePublish,
  stopSlotFramePublish,
} from './liveSlotFrameRelay';
import {
  createSlotAudioViewer,
  startSlotAudioPublish,
  stopAllSlotAudioPublish,
  stopSlotAudioPublish,
} from './liveSlotAudioRelay';
import { liveGuestVideoConstraints, liveMicConstraints } from './liveQuality';
import { fetchLiveChat, sendLiveChat, type LiveChatMessage } from './liveChat';
import LiveHostJoinInbox from './LiveHostJoinInbox';
import LiveGiftOverlay from './LiveGiftOverlay';
import LiveGiftShop from './LiveGiftShop';
import type { LiveGift } from './liveGifts';

type Props = {
  title: string;
  makerName: string;
  makerAvatar: string;
  makerColor: string;
  mode: BroadcastMode;
  viewers?: number;
  /** True when this device owns the camera stream; false for phone viewing PC host */
  isHost?: boolean;
};

const BADGE_TOP = { top: 'calc(var(--feed-chrome-h, 72px) + 8px)' } as const;

type Pane = {
  key: string;
  label: string;
  avatar: string;
  color?: string;
  kind: 'host' | 'guest' | 'self';
  /** Remote JPEG poll slot; omit for local video */
  slot?: string;
  local?: boolean;
};

function GuestTile({
  pane,
  frameUrl,
  bindVideo,
  fileMedia,
  localStream,
  mirrorLocal = true,
}: {
  pane: Pane;
  frameUrl: string | null;
  bindVideo?: (el: HTMLVideoElement | null) => void;
  fileMedia?: HTMLVideoElement | null;
  localStream?: MediaStream | null;
  /** Mirror selfie preview (off for rear camera). */
  mirrorLocal?: boolean;
}) {
  return (
    <div className="relative h-full min-h-0 min-w-0 overflow-hidden bg-black border border-white/10">
      {pane.local && pane.kind === 'host' && fileMedia ? (
        <video
          key={fileMedia.src || 'file-live'}
          ref={(el) => {
            if (!el || !fileMedia) return;
            if (el.src !== fileMedia.src) el.src = fileMedia.src;
            el.loop = true;
            el.muted = true;
            el.setAttribute('playsinline', 'true');
            void el.play().catch(() => undefined);
          }}
          className="absolute inset-0 h-full w-full object-cover bg-black"
          playsInline
          autoPlay
          muted
          loop
        />
      ) : pane.local ? (
        <video
          ref={(el) => {
            bindVideo?.(el);
            if (el && localStream && el.srcObject !== localStream) {
              el.srcObject = localStream;
              void el.play().catch(() => undefined);
            }
          }}
          className={`absolute inset-0 h-full w-full object-cover bg-black ${mirrorLocal ? 'scale-x-[-1]' : ''}`}
          playsInline
          autoPlay
          muted
        />
      ) : frameUrl ? (
        <img
          src={frameUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1] bg-black"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1A7CFF]/40 via-black to-[#8FFF4A]/20">
          <div
            className="h-14 w-14 rounded-full grid place-items-center text-black text-[18px] font-black"
            style={{ background: pane.color || '#FFE600' }}
          >
            {pane.avatar}
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
      <div className="absolute left-2 bottom-2 z-[2] flex items-center gap-1.5 pointer-events-none">
        {pane.kind === 'host' ? (
          <span className="rounded-full bg-red-500 px-1.5 h-5 inline-flex items-center mono text-[9px] font-bold">
            HOST
          </span>
        ) : null}
        <span className="rounded-full bg-black/60 border border-white/15 px-2 h-5 inline-flex items-center mono text-[10px] font-bold max-w-[70%] truncate">
          {pane.label}
        </span>
      </div>
    </div>
  );
}

/** Full-bleed live card on the For You feed — host cam OR immersive watch (never leaves feed). */
export default function FeedLiveNowStage({
  title,
  makerName,
  makerAvatar,
  makerColor,
  mode,
  viewers = 144,
  isHost = false,
}: Props) {
  const { videoRef, status, error, facing, switching, startCamera, switchCamera } = useLiveCamera();
  const guestCamRef = useRef<HTMLVideoElement | null>(null);
  const guestStreamRef = useRef<MediaStream | null>(null);
  const [guestFacing, setGuestFacing] = useState<'user' | 'environment'>('user');
  const [guestSwitching, setGuestSwitching] = useState(false);
  const videoMode = mode !== 'audio';
  const hostLive =
    isHost && (sharedStreamIsLive() || isLiveMediaSourceActive() || status === 'live');
  const fileMedia = isHost ? getLiveMediaElement() : null;
  const [watching, setWatching] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [frameUrl, setFrameUrl] = useState<string | null>(null);
  const [frameLive, setFrameLive] = useState(false);
  const [guestFrames, setGuestFrames] = useState<Record<string, string>>({});
  const [liveMusic, setLiveMusic] = useState<LiveMusicPayload | null>(null);
  const [guestState, setGuestState] = useState<LiveGuestsState>({ pending: [], guests: [] });
  const [joinBusy, setJoinBusy] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [guestCamError, setGuestCamError] = useState<string | null>(null);
  const [guestStreamTick, setGuestStreamTick] = useState(0);
  /** Set on Request tap so we can auto-open cam after Accept (user-gesture chain). */
  const mayAutoJoinRef = useRef(false);
  const prevGuestSlotRef = useRef<string | null>(null);
  const [chat, setChat] = useState<LiveChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [viewerCount, setViewerCount] = useState(viewers);
  const [giftShopOpen, setGiftShopOpen] = useState(false);
  const audioViewer = useRef<ReturnType<typeof createLiveAudioViewer> | null>(null);
  const guestAudioViewers = useRef<Map<string, ReturnType<typeof createSlotAudioViewer>>>(new Map());
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const identity = useRef(getOrCreateGuestIdentity()).current;
  const myRole = myGuestRole(guestState, identity.id);
  const amGuest = Boolean(myRole.guest);
  const amPending = myRole.pending;
  const multi = guestState.guests.length > 0;

  useEffect(() => {
    if (!videoMode || !isHost) return;
    if (getSharedLiveStream() && sharedStreamIsLive()) {
      void startCamera();
    }
  }, [videoMode, isHost, startCamera]);

  // Guest roster poll (host + viewers) — faster while waiting / in split
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const next = await fetchLiveGuests();
      if (!cancelled) setGuestState(next);
    };
    void tick();
    const ms = amPending || amGuest || multi ? 600 : 900;
    const id = window.setInterval(() => void tick(), ms);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [amPending, amGuest, multi]);

  // Shared live chat poll
  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      const next = await fetchLiveChat();
      if (!cancelled) setChat(next.messages);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 800);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  // Host frame poll
  useEffect(() => {
    if (isHost || hostLive) return;
    let cancelled = false;
    const tick = async () => {
      const ok = await remoteFrameIsLive();
      if (cancelled) return;
      setFrameLive(ok);
      if (ok) setFrameUrl(liveFrameSrc(Date.now()));
    };
    void tick();
    const id = window.setInterval(() => void tick(), 220);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isHost, hostLive]);

  // Guest slot frames (everyone except the guest who is publishing that slot locally)
  useEffect(() => {
    if (!guestState.guests.length) {
      setGuestFrames({});
      return;
    }
    let cancelled = false;
    const tick = async () => {
      const next: Record<string, string> = {};
      await Promise.all(
        guestState.guests.map(async (g) => {
          const slot = String(g.slot || '');
          if (!slot) return;
          if (myRole.guest?.id === g.id && myRole.guest.slot === slot) return;
          const ok = await remoteSlotFrameIsLive(slot);
          if (ok) next[slot] = liveSlotFrameSrc(slot, Date.now());
        }),
      );
      if (!cancelled) setGuestFrames(next);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 240);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [guestState.guests, myRole.guest?.id, myRole.guest?.slot]);

  // Keep heartbeat while pending OR approved so request/slot isn't pruned
  useEffect(() => {
    if (isHost) return;
    if (!amPending && !myRole.guest?.slot) return;
    const beat = () => {
      void heartbeatGuest(identity.id, identity.name);
    };
    beat();
    const hb = window.setInterval(beat, 2000);
    const onVis = () => {
      if (document.visibilityState === 'visible') beat();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pageshow', beat);
    return () => {
      window.clearInterval(hb);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pageshow', beat);
    };
  }, [isHost, amPending, myRole.guest?.slot, myRole.guest?.id, identity.id, identity.name]);

  // Tear down guest AV only when leaving the slot (not on every render)
  useEffect(() => {
    if (isHost || myRole.guest?.slot) return;
    stopAllSlotFramePublish();
    stopAllSlotAudioPublish();
    guestStreamRef.current?.getTracks().forEach((t) => t.stop());
    guestStreamRef.current = null;
    setGuestStreamTick((t) => t + 1);
  }, [isHost, myRole.guest?.slot]);

  // On unmount: stop guest *viewers* only — keep publishing so navigate-away does not kill the live slot
  useEffect(() => {
    return () => {
      guestAudioViewers.current.forEach((v) => v.stop());
      guestAudioViewers.current.clear();
    };
  }, []);

  // Viewers (and host): play guest slot audio while watching / hosting
  useEffect(() => {
    const wantAudio = watching || hostLive;
    const slots = guestState.guests
      .map((g) => String(g.slot || ''))
      .filter((s) => s && !(myRole.guest && String(myRole.guest.slot) === s));

    // Stop removed slots
    for (const [slot, viewer] of [...guestAudioViewers.current.entries()]) {
      if (!slots.includes(slot) || !wantAudio) {
        viewer.stop();
        guestAudioViewers.current.delete(slot);
      }
    }
    if (!wantAudio) return;

    const guestCount = guestState.guests.length;
    for (const slot of slots) {
      if (guestAudioViewers.current.has(slot)) continue;
      const viewer = createSlotAudioViewer(slot, guestCount);
      guestAudioViewers.current.set(slot, viewer);
      viewer.unlock();
      viewer.setMuted(!soundOn);
      viewer.start();
    }
  }, [guestState.guests, watching, hostLive, myRole.guest?.slot, soundOn]);

  useEffect(() => {
    guestAudioViewers.current.forEach((v) => v.setMuted(!soundOn));
  }, [soundOn]);

  // Poll live BGM metadata from host
  useEffect(() => {
    if (isHost || hostLive) return;
    let cancelled = false;
    const tick = async () => {
      const remote = await fetchRemoteLive();
      if (cancelled) return;
      setLiveMusic(remote?.music ?? null);
    };
    void tick();
    const id = window.setInterval(() => void tick(), 2500);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [isHost, hostLive]);

  // Mic / mixed BGM audio from host chunks
  useEffect(() => {
    if (isHost || hostLive || !watching) {
      audioViewer.current?.stop();
      return;
    }
    const player = createLiveAudioViewer();
    audioViewer.current = player;
    player.unlock();
    player.start();
    return () => {
      player.stop();
      if (audioViewer.current === player) audioViewer.current = null;
    };
  }, [isHost, hostLive, watching]);

  // Direct preview URL BGM (Jamendo)
  useEffect(() => {
    if (isHost || hostLive || !watching) {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      return;
    }
    const url = liveMusic?.previewUrl;
    if (!url || liveMusic?.youtubeId) {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
      return;
    }
    const el = new Audio(url);
    el.loop = true;
    el.volume = soundOn ? 0.55 : 0;
    el.setAttribute('playsinline', 'true');
    void el.play().catch(() => undefined);
    bgmRef.current = el;
    return () => {
      el.pause();
      if (bgmRef.current === el) bgmRef.current = null;
    };
  }, [isHost, hostLive, watching, liveMusic?.previewUrl, liveMusic?.youtubeId, soundOn]);

  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = soundOn ? 0.55 : 0;
    audioViewer.current?.setMuted(!soundOn);
  }, [soundOn]);

  useEffect(() => {
    if (!watching) return;
    const id = window.setInterval(() => {
      setViewerCount((v) => v + (Math.random() > 0.6 ? 1 : 0));
    }, 4000);
    return () => window.clearInterval(id);
  }, [watching]);

  const startWatching = () => {
    setWatching(true);
    setSoundOn(true);
    setViewerCount((v) => Math.max(v, viewers) + 1);
    if (frameLive) setFrameUrl(liveFrameSrc(Date.now()));
    if (!audioViewer.current) {
      const player = createLiveAudioViewer();
      audioViewer.current = player;
      player.unlock();
      player.start();
    } else {
      audioViewer.current.unlock();
    }
  };

  const chatWho = isHost ? makerName || 'Host' : identity.name;

  const onGiftSent = (gift: LiveGift) => {
    const line = `sent ${gift.emoji} ${gift.name}`;
    void sendLiveChat(chatWho, line).then((s) => {
      if (s.messages.length) setChat(s.messages);
    });
    setChat((prev) => [
      ...prev.slice(-40),
      { id: `gift_${Date.now()}`, who: chatWho, text: line, ts: Date.now() },
    ]);
  };

  const giftLayer = (
    <>
      <LiveGiftOverlay />
      <LiveGiftShop
        open={giftShopOpen}
        onClose={() => setGiftShopOpen(false)}
        fromName={chatWho}
        onSent={onGiftSent}
      />
    </>
  );

  const sendChat = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    // Optimistic local echo so chat feels instant
    const optimistic = {
      id: `local_${Date.now()}`,
      who: chatWho,
      text,
      ts: Date.now(),
    };
    setChat((prev) => [...prev.slice(-40), optimistic]);
    void sendLiveChat(chatWho, text).then((s) => {
      if (s.messages.length) setChat(s.messages);
    });
  };

  /** Must run from a tap — iOS/Safari block getUserMedia inside useEffect. */
  const enableGuestCamera = async () => {
    const slot = myRole.guest?.slot ? String(myRole.guest.slot) : null;
    if (!slot || guestSwitching) return;
    setGuestCamError(null);
    setGuestSwitching(true);
    setWatching(true);
    try {
      let stream: MediaStream | null = null;
      const multiMic = liveMicConstraints({ multiGuest: true });
      // Prefer mic+cam together; only drop audio as last resorts
      const attempts: MediaStreamConstraints[] = [
        { video: liveGuestVideoConstraints(), audio: multiMic },
        { video: liveGuestVideoConstraints(), audio: true },
        { video: { facingMode: { ideal: 'user' }, width: { ideal: 640 }, height: { ideal: 960 } }, audio: multiMic },
        { video: { facingMode: 'user' }, audio: true },
        { video: true, audio: true },
        { video: { facingMode: 'user' }, audio: false },
        { video: true, audio: false },
      ];
      let lastErr: unknown;
      for (const c of attempts) {
        try {
          stream = await navigator.mediaDevices.getUserMedia(c);
          break;
        } catch (err) {
          lastErr = err;
        }
      }
      if (!stream) {
        const name = lastErr instanceof DOMException ? lastErr.name : 'Error';
        setGuestCamError(
          name === 'NotAllowedError'
            ? 'Allow Camera (and Mic) in the browser prompt, then tap again'
            : `Could not open camera (${name}). Tap to retry.`,
        );
        return;
      }
      guestStreamRef.current = stream;
      if (guestCamRef.current) {
        guestCamRef.current.srcObject = stream;
        void guestCamRef.current.play().catch(() => undefined);
      }
      startSlotFramePublish(slot, stream, guestCamRef.current);
      const audioOk = await startSlotAudioPublish(slot, stream, {
        guestCount: Math.max(1, guestState.guests.length),
      });
      if (!audioOk) {
        setGuestCamError('Camera on · mic failed — tap again to retry mic');
      }
      setGuestStreamTick((t) => t + 1);
      void heartbeatGuest(identity.id, identity.name);
      void sendLiveChat('System', `${identity.name} joined the live`).then((s) => setChat(s.messages));
      mayAutoJoinRef.current = false;
    } catch (err) {
      const name = err instanceof DOMException ? err.name : 'Error';
      setGuestCamError(`Camera failed (${name}). Tap to retry.`);
    } finally {
      setGuestSwitching(false);
    }
  };

  // After Accept: auto-prompt camera if user recently tapped Request (gesture-friendly)
  useEffect(() => {
    const slot = myRole.guest?.slot ? String(myRole.guest.slot) : null;
    const prev = prevGuestSlotRef.current;
    prevGuestSlotRef.current = slot;
    if (!slot || slot === prev) return;
    if (guestStreamRef.current) return;
    if (!mayAutoJoinRef.current) return;
    void enableGuestCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on slot grant
  }, [myRole.guest?.slot]);

  const onRequestJoin = async () => {
    setJoinBusy(true);
    setJoinError(null);
    mayAutoJoinRef.current = true;
    try {
      if (!watching) startWatching();
      // Optimistic pending so UI doesn't flash empty on slow network
      setGuestState((prev) => {
        if (prev.pending.some((p) => p.id === identity.id) || prev.guests.some((g) => g.id === identity.id)) {
          return prev;
        }
        return {
          ...prev,
          pending: [
            ...prev.pending,
            { id: identity.id, name: identity.name, avatar: identity.avatar, ts: Date.now() },
          ],
        };
      });
      const next = await requestJoinLive(identity);
      if (!next.ok) {
        setJoinError(
          next.error === 'full'
            ? 'Live is full — try again later'
            : next.error === 'storage'
              ? 'Join server busy — tap Request again'
              : `Join failed (${next.error || 'network'}) — tap again`,
        );
        setGuestState(await fetchLiveGuests());
        return;
      }
      setGuestState(next);
      void sendLiveChat(identity.name, 'requested to join live ✋').then((s) => setChat(s.messages));
    } finally {
      setJoinBusy(false);
    }
  };

  const onCancelJoin = async () => {
    setJoinBusy(true);
    setJoinError(null);
    mayAutoJoinRef.current = false;
    try {
      const next = await cancelJoinRequest(identity.id);
      if (next.ok) setGuestState(next);
      else setGuestState(await fetchLiveGuests());
    } finally {
      setJoinBusy(false);
    }
  };

  const onLeaveGuest = async () => {
    setJoinBusy(true);
    mayAutoJoinRef.current = false;
    try {
      if (myRole.guest?.slot) {
        const slot = String(myRole.guest.slot);
        stopSlotFramePublish(slot);
        stopSlotAudioPublish(slot);
      }
      guestStreamRef.current?.getTracks().forEach((t) => t.stop());
      guestStreamRef.current = null;
      const next = await leaveGuestLive(identity.id);
      if (next.ok) setGuestState(next);
      else setGuestState(await fetchLiveGuests());
    } finally {
      setJoinBusy(false);
    }
  };

  const onSwitchGuestCamera = async () => {
    const stream = guestStreamRef.current;
    const slot = myRole.guest?.slot ? String(myRole.guest.slot) : null;
    if (!stream || !slot || guestSwitching) return;
    setGuestSwitching(true);
    try {
      const { stream: next, facing: face } = await switchStreamCamera(stream);
      guestStreamRef.current = next;
      setGuestFacing(face);
      if (guestCamRef.current) {
        guestCamRef.current.srcObject = next;
        void guestCamRef.current.play().catch(() => undefined);
      }
      startSlotFramePublish(slot, next, guestCamRef.current);
      setGuestStreamTick((t) => t + 1);
    } catch {
      setGuestCamError('Could not switch camera');
    } finally {
      setGuestSwitching(false);
    }
  };

  const flipBtn = (opts: {
    onClick: () => void;
    busy?: boolean;
    label: string;
    className?: string;
  }) => (
    <button
      type="button"
      disabled={opts.busy}
      className={
        opts.className ||
        'h-9 px-3 rounded-full bg-black/65 border border-white/20 mono text-[10px] font-bold backdrop-blur-md disabled:opacity-50'
      }
      onClick={(e) => {
        e.stopPropagation();
        opts.onClick();
      }}
      aria-label="Switch camera"
      title="Switch camera"
    >
      {opts.busy ? 'Switching…' : `Flip · ${opts.label}`}
    </button>
  );

  const buildPanes = (): Pane[] => {
    const panes: Pane[] = [];
    if (isHost && hostLive) {
      panes.push({
        key: 'host',
        label: 'You',
        avatar: makerAvatar,
        color: makerColor,
        kind: 'host',
        local: true,
      });
    } else {
      panes.push({
        key: 'host',
        label: makerName,
        avatar: makerAvatar,
        color: makerColor,
        kind: 'host',
        slot: 'host',
      });
    }
    for (const g of guestState.guests) {
      const isSelf = g.id === identity.id && !isHost;
      panes.push({
        key: g.id,
        label: isSelf ? 'You' : g.name,
        avatar: g.avatar || 'G',
        kind: isSelf ? 'self' : 'guest',
        slot: String(g.slot),
        local: isSelf,
      });
    }
    return panes;
  };

  const renderSplit = (panes: Pane[]) => {
    void guestStreamTick;
    const n = panes.length;
    const gridClass =
      n <= 1
        ? 'grid-cols-1 grid-rows-1'
        : n === 2
          ? 'grid-cols-2 grid-rows-1'
          : 'grid-cols-2 grid-rows-2';

    return (
      <div className={`absolute inset-0 grid ${gridClass} gap-px bg-white/10`}>
        {panes.map((pane, idx) => {
          const spanHostTop = n === 3 && idx === 0 ? 'col-span-2' : '';
          const url =
            pane.slot === 'host'
              ? frameUrl
              : pane.slot
                ? guestFrames[pane.slot] || null
                : null;
          const bindVideo =
            pane.local && pane.kind === 'host'
              ? videoRef
              : pane.local
                ? (el: HTMLVideoElement | null) => {
                    guestCamRef.current = el;
                  }
                : undefined;
          return (
            <div key={pane.key} className={`relative min-h-0 min-w-0 ${spanHostTop}`}>
              <GuestTile
                pane={pane}
                frameUrl={pane.local ? null : url}
                bindVideo={bindVideo}
                fileMedia={pane.kind === 'host' && pane.local ? fileMedia : null}
                localStream={
                  pane.local && pane.kind === 'self'
                    ? guestStreamRef.current
                    : pane.local && pane.kind === 'host'
                      ? getSharedLiveStream()
                      : null
                }
                mirrorLocal={
                  pane.kind === 'host'
                    ? facing !== 'environment'
                    : pane.kind === 'self'
                      ? guestFacing !== 'environment'
                      : true
                }
              />
            </div>
          );
        })}
        {n === 3 ? <div className="bg-black/80" aria-hidden /> : null}
      </div>
    );
  };

  // guestStreamTick forces re-render after enableGuestCamera / leave
  void guestStreamTick;
  const guestNeedsCam = Boolean(amGuest && !guestStreamRef.current);

  const chatComposer = (
    <div
      className="absolute bottom-[100px] left-3 right-16 z-[42] space-y-2 pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {guestNeedsCam ? (
        <div className="rounded-2xl border-2 border-[#8FFF4A] bg-black/85 px-3 py-3 space-y-2 shadow-xl">
          <div className="poppins text-[14px] font-extrabold text-[#8FFF4A]">You’re accepted — go on camera</div>
          <div className="mono text-[10px] text-white/65">
            Tap below to allow Camera + Mic. Required on iPhone/Safari.
          </div>
          {guestCamError ? <div className="mono text-[11px] text-red-300 font-bold">{guestCamError}</div> : null}
          <button
            type="button"
            disabled={guestSwitching}
            className="w-full h-12 rounded-full bg-[#8FFF4A] text-black font-bold text-[14px] disabled:opacity-50"
            onClick={() => void enableGuestCamera()}
          >
            {guestSwitching ? 'Opening camera…' : 'Enable camera & join split'}
          </button>
        </div>
      ) : null}
      <div className="max-h-[18svh] overflow-y-auto space-y-1.5 pr-1">
        {chat.slice(-16).map((c) => (
          <div
            key={c.id}
            className="rounded-2xl bg-black/65 border border-white/10 px-3 py-1.5 text-left backdrop-blur-md w-fit max-w-[92%]"
          >
            <span className="mono text-[10px] font-bold text-[#8FFF4A]">{c.who}</span>
            <span className="text-[12px] text-white/90 ml-2">{c.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 items-center">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendChat();
          }}
          placeholder={isHost ? 'Host chat…' : `Chat as ${identity.name}…`}
          className="flex-1 h-11 rounded-full border border-white/15 bg-black/65 px-4 text-[13px] outline-none backdrop-blur-md"
        />
        <button
          type="button"
          className="h-11 px-4 rounded-full bg-white text-black font-bold text-[12px]"
          onClick={() => sendChat()}
        >
          Send
        </button>
      </div>
    </div>
  );

  /* ——— Host camera / uploaded video on this device ——— */
  if (hostLive && videoMode) {
    const panes = buildPanes();
    const fromFile = Boolean(fileMedia || isLiveMediaSourceActive());
    return (
      <div className="absolute inset-0 flex flex-col bg-black">
        {multi ? (
          renderSplit(panes)
        ) : fromFile && fileMedia ? (
          <video
            key={fileMedia.src || 'file-live'}
            ref={(el) => {
              if (!el || !fileMedia) return;
              if (el.src !== fileMedia.src) el.src = fileMedia.src;
              el.loop = true;
              el.muted = true;
              el.setAttribute('playsinline', 'true');
              void el.play().catch(() => undefined);
            }}
            className="absolute inset-0 h-full w-full object-cover bg-black"
            playsInline
            autoPlay
            muted
            loop
          />
        ) : (
          <video
            ref={videoRef}
            className={`absolute inset-0 h-full w-full object-cover bg-black ${
              facing === 'environment' ? '' : 'scale-x-[-1]'
            }`}
            playsInline
            autoPlay
            muted
          />
        )}
        {!multi ? (
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80 pointer-events-none" />
        ) : null}
        <div className="absolute left-3 right-16 z-[5] flex items-center gap-2 pointer-events-none" style={BADGE_TOP}>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 h-7 text-[11px] font-bold tracking-wide shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />{' '}
            {multi ? `LIVE · ${1 + guestState.guests.length}` : fromFile ? 'FILE · LIVE' : 'LIVE · YOU'}
          </span>
          <span className="rounded-full bg-black/55 border border-white/15 px-2.5 h-7 inline-flex items-center mono text-[10px] shrink-0">
            {viewerCount}
          </span>
          {guestState.pending.length > 0 ? (
            <span className="rounded-full bg-[#FFE600] text-black px-2.5 h-7 inline-flex items-center mono text-[10px] font-black shrink-0">
              {guestState.pending.length} join
            </span>
          ) : null}
          {!fromFile ? (
            <span className="ml-auto pointer-events-auto">
              {flipBtn({
                onClick: () => void switchCamera(),
                busy: switching,
                label: facing === 'environment' ? 'Back' : 'Front',
              })}
            </span>
          ) : null}
        </div>
        <div
          className="absolute left-3 right-14"
          style={{ top: 'calc(var(--feed-chrome-h, 72px) + 44px)', zIndex: 80 }}
        >
          <LiveHostJoinInbox active />
        </div>
        <div
          className="absolute right-3 z-[43] pointer-events-auto"
          style={{ bottom: 'calc(100px + 28svh)' }}
        >
          <button
            type="button"
            className="h-10 px-3.5 rounded-full bg-[#FE2C55] text-white font-bold text-[12px] shadow-[0_2px_12px_rgba(254,44,85,0.45)]"
            onClick={(e) => {
              e.stopPropagation();
              setGiftShopOpen(true);
            }}
          >
            🎁 Gift
          </button>
        </div>
        {chatComposer}
        {giftLayer}
      </div>
    );
  }

  /* ——— Host needs to enable cam ——— */
  if (isHost && videoMode && status !== 'live') {
    return (
      <div className="absolute inset-0 flex flex-col bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-black to-black" />
        <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center px-6 text-center">
          <div
            className="h-20 w-20 rounded-full grid place-items-center text-black text-[24px] font-black mb-3 ring-4 ring-red-500/40"
            style={{ background: makerColor }}
          >
            {makerAvatar}
          </div>
          <div className="poppins text-[18px] font-extrabold">{makerName}</div>
          <div className="mono text-[11px] text-white/60 mt-2 max-w-xs">
            {error || 'Show your live camera + mic on the feed'}
          </div>
          <button
            type="button"
            className="mt-5 h-12 px-7 rounded-full bg-white text-black font-bold text-[14px]"
            onClick={(e) => {
              e.stopPropagation();
              void startCamera();
            }}
          >
            {status === 'requesting' ? 'Opening camera…' : 'Show my live on feed'}
          </button>
        </div>
      </div>
    );
  }

  /* ——— Audio live ——— */
  if (!videoMode) {
    if (isHost) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#0a1628] via-black to-black">
          <div
            className="h-20 w-20 rounded-full grid place-items-center text-black text-[24px] font-black mb-3 ring-4 ring-red-500/50"
            style={{ background: makerColor }}
          >
            {makerAvatar}
          </div>
          <div className="poppins text-[18px] font-extrabold">You are on Audio Live</div>
          <div className="mono text-[12px] text-white/70 mt-2">{title}</div>
          <div className="mt-4 mono text-[11px] text-[#8FFF4A] font-bold">Mic publishing to feed · {viewerCount}</div>
        </div>
      );
    }
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#0a1628] via-black to-black">
        <div
          className="h-20 w-20 rounded-full grid place-items-center text-black text-[24px] font-black mb-3"
          style={{ background: makerColor }}
        >
          {makerAvatar}
        </div>
        <div className="poppins text-[18px] font-extrabold">{makerName}</div>
        <div className="mono text-[12px] text-white/70 mt-2">{title}</div>
        <div className="mt-4 flex items-end gap-1 h-10" aria-hidden>
          {[6, 12, 8, 16, 10, 14, 7].map((h, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-[#8FFF4A] animate-pulse"
              style={{ height: h * 2, animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
        {!watching ? (
          <button
            type="button"
            className="mt-6 h-11 px-6 rounded-full bg-white text-black font-bold text-[13px]"
            onClick={(e) => {
              e.stopPropagation();
              startWatching();
            }}
          >
            Join audio live
          </button>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="mono text-[11px] text-[#8FFF4A] font-bold">Listening on feed · {viewerCount}</div>
            <button
              type="button"
              className="h-9 px-4 rounded-full bg-black/55 border border-white/15 mono text-[11px] font-bold"
              onClick={(e) => {
                e.stopPropagation();
                setSoundOn((v) => {
                  const next = !v;
                  audioViewer.current?.setMuted(!next);
                  if (next) audioViewer.current?.unlock();
                  return next;
                });
              }}
            >
              {soundOn ? 'Sound on' : 'Muted'}
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ——— Remote viewer / guest: frames + join ——— */
  const panes = buildPanes();
  const showSplit = multi || amGuest;

  return (
    <div className="absolute inset-0 flex flex-col bg-black">
      {showSplit ? (
        renderSplit(panes)
      ) : frameUrl && (watching || frameLive) ? (
        <img
          src={frameUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-x-[-1] bg-black"
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A7CFF]/50 via-[#0a0a0a] to-[#8FFF4A]/25" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_40%,#ff3b3b55,transparent_50%)]" />
        </>
      )}
      {!showSplit ? (
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/80 pointer-events-none" />
      ) : null}

      {/* Hidden local preview for guest publish when split uses local tile */}
      {amGuest && !showSplit ? (
        <video ref={guestCamRef} className="hidden" playsInline muted autoPlay />
      ) : null}

      <div className="absolute left-3 right-3 z-[5] flex items-center gap-2" style={BADGE_TOP}>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 h-7 text-[11px] font-bold tracking-wide shrink-0 pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />{' '}
          {multi ? `LIVE · ${1 + guestState.guests.length}` : 'LIVE · AYO'}
        </span>
        <span className="rounded-full bg-black/55 border border-white/15 px-2.5 h-7 inline-flex items-center mono text-[10px] shrink-0 pointer-events-none">
          {viewerCount}
        </span>
        {watching ? (
          <button
            type="button"
            className="ml-auto h-7 px-2.5 rounded-full bg-black/55 border border-white/15 mono text-[10px] font-bold"
            onClick={(e) => {
              e.stopPropagation();
              setSoundOn((v) => !v);
              if (!soundOn) audioViewer.current?.unlock();
            }}
          >
            {soundOn ? 'Sound on' : 'Muted'}
          </button>
        ) : null}
      </div>

      {watching && liveMusic?.youtubeId && soundOn ? (
        <div
          className="absolute left-3 z-[6] rounded-xl overflow-hidden border border-white/15 bg-black/70 shadow-lg"
          style={{ top: 'calc(var(--feed-chrome-h, 72px) + 44px)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <YoutubeEmbed
            key={`yt-${liveMusic.youtubeId}-${watching ? 'on' : 'off'}`}
            youtubeId={liveMusic.youtubeId}
            title={liveMusic.title || 'BGM'}
            autoplay
            compact
          />
        </div>
      ) : null}

      {!watching ? (
        <div className="absolute inset-0 z-[6] flex flex-col items-center justify-center px-6 text-center">
          {!frameLive && !multi ? (
            <div
              className="h-24 w-24 rounded-full grid place-items-center text-black text-[28px] font-black mb-3 ring-4 ring-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.45)]"
              style={{ background: makerColor }}
            >
              {makerAvatar}
            </div>
          ) : (
            <div className="h-16" />
          )}
          <div className="poppins text-[20px] font-extrabold drop-shadow">{makerName}</div>
          <div className="mono text-[12px] text-white/85 mt-2 max-w-xs drop-shadow">{title}</div>
          <div className="mono text-[11px] text-white/55 mt-1">
            {frameLive || multi
              ? 'Live from AYO · tap for video + sound'
              : 'AYO is live — camera connecting…'}
          </div>
          <button
            type="button"
            className="mt-6 h-12 px-10 rounded-full bg-white text-black font-bold text-[15px] shadow-lg"
            onClick={(e) => {
              e.stopPropagation();
              startWatching();
            }}
          >
            Watch Live
          </button>
          <button
            type="button"
            disabled={joinBusy || guestState.guests.length >= 3}
            className="mt-3 h-11 px-7 rounded-full bg-[#8FFF4A] text-black font-bold text-[13px] disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              void onRequestJoin();
            }}
          >
            {guestState.guests.length >= 3 ? 'Live full' : amPending ? 'Waiting for host…' : 'Request to join'}
          </button>
          {joinError ? (
            <div className="mt-2 max-w-xs rounded-xl border border-red-400/40 bg-red-500/25 px-3 py-2 mono text-[11px] font-bold text-red-100">
              {joinError}
            </div>
          ) : null}
          <Link
            to="/app/maker/ayo"
            className="mt-3 mono text-[11px] text-[#8FFF4A] font-bold"
            onClick={(e) => e.stopPropagation()}
          >
            Open AYO work profile →
          </Link>
        </div>
      ) : (
        <>
          {!frameLive && !multi && !amGuest ? (
            <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center pointer-events-none px-6">
              <div
                className="h-28 w-28 rounded-full grid place-items-center text-black text-[32px] font-black ring-4 ring-red-500/50 animate-pulse"
                style={{ background: makerColor }}
              >
                {makerAvatar}
              </div>
              <div className="mt-4 poppins text-[16px] font-extrabold drop-shadow">Connecting to AYO camera…</div>
              <div className="mono text-[11px] text-white/70 mt-2 text-center">Keep Mac live with camera + mic enabled</div>
            </div>
          ) : !multi && !amGuest ? (
            <div className="absolute bottom-[210px] inset-x-0 z-[5] px-4 text-center pointer-events-none">
              <div className="poppins text-[16px] font-extrabold drop-shadow">{makerName}</div>
              <div className="mono text-[11px] text-white/85 mt-1 drop-shadow">{title}</div>
              {liveMusic?.title ? (
                <div className="mono text-[10px] text-[#8FFF4A] mt-2 drop-shadow">
                  ♪ {liveMusic.title}
                  {liveMusic.artist ? ` · ${liveMusic.artist}` : ''}
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Join controls sit above shared chat composer */}
          <div
            className="absolute left-3 right-16 z-[43] flex flex-wrap gap-2 pointer-events-auto"
            style={{ bottom: guestNeedsCam ? 'calc(100px + 42svh)' : 'calc(100px + 28svh)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {joinError ? (
              <div className="w-full rounded-xl border border-red-400/40 bg-red-500/25 px-3 py-2 mono text-[11px] font-bold text-red-100">
                {joinError}
              </div>
            ) : null}
            {!amGuest && !amPending ? (
              <button
                type="button"
                disabled={joinBusy || guestState.guests.length >= 3}
                className="h-10 px-4 rounded-full bg-[#8FFF4A] text-black font-bold text-[12px] disabled:opacity-50"
                onClick={() => void onRequestJoin()}
              >
                {guestState.guests.length >= 3 ? 'Live full' : 'Request to join'}
              </button>
            ) : null}
            {amPending ? (
              <button
                type="button"
                disabled={joinBusy}
                className="h-10 px-4 rounded-full bg-[#FFE600] text-black font-bold text-[12px]"
                onClick={() => void onCancelJoin()}
              >
                Waiting for host… Cancel
              </button>
            ) : null}
            {amGuest && guestStreamRef.current ? (
              <>
                {flipBtn({
                  onClick: () => void onSwitchGuestCamera(),
                  busy: guestSwitching,
                  label: guestFacing === 'environment' ? 'Back' : 'Front',
                  className:
                    'h-10 px-4 rounded-full bg-black/55 border border-white/20 font-bold text-[12px] disabled:opacity-50',
                })}
                <button
                  type="button"
                  disabled={joinBusy}
                  className="h-10 px-4 rounded-full bg-white/15 border border-white/25 font-bold text-[12px]"
                  onClick={() => void onLeaveGuest()}
                >
                  Leave split live
                </button>
              </>
            ) : null}
            <button
              type="button"
              className="h-10 px-3.5 rounded-full bg-[#FE2C55] text-white font-bold text-[12px] shadow-[0_2px_12px_rgba(254,44,85,0.45)]"
              onClick={() => setGiftShopOpen(true)}
            >
              🎁 Gift
            </button>
          </div>
          {chatComposer}
        </>
      )}
      {giftLayer}
    </div>
  );
}
