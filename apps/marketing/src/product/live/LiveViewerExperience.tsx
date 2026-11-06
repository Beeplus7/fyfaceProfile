import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { CRM_BTN, CRM_BTN_GHOST, CRM_BTN_QUIET, CRM_EYE, CRM_LIVE_PILL } from '../crmChrome';
import {
  clearLocalBroadcastOnly,
  patchBroadcast,
  readBroadcast,
  setBroadcast,
  type BroadcastMode,
  type BroadcastState,
} from '../demo/testLab';
import { MusicDrawer, type Music, type MusicSource } from '../music/MusicDrawer';
import YoutubeEmbed from '../music/YoutubeEmbed';
import { IconMore, IconMusic } from '../ui/icons';
import GoLivePicker, { type GoLivePick } from './GoLivePicker';
import LiveRecordingsPanel from './LiveRecordingsPanel';
import { saveLiveRecordingFromBroadcast } from './liveRecordings';
import { saveLiveClip } from './liveRecordingMedia';
import { liveFramePublishStats } from './liveFrameRelay';
import { fetchRemoteLive, publishRemoteLiveMusic } from './liveRemote';
import {
  isLiveAudioPublishing,
  setLiveMusicBed,
  startLiveAudioOnlyPublish,
  stopLiveAudioPublish,
} from './liveAudioRelay';
import { isLiveMediaSourceActive, startLiveMediaSource, stopLiveMediaSource } from './liveMediaSource';
import { startSessionRecording, stopSessionRecording, takePendingRecordingBlob } from './liveSessionRecorder';
import { sharedStreamIsLive } from './liveCameraBus';
import { isLocalLiveHost } from './liveHost';
import { useLiveCamera } from './useLiveCamera';
import LiveHostJoinInbox from './LiveHostJoinInbox';
import LiveGiftPortal from './LiveGiftPortal';
import { openLiveGiftShop } from './liveGifts';
import { compressLiveWallpaper } from './liveWallpaper';
import { setLiveDualWallpaper } from './liveDualCompose';

const LIVE_SRC = '/live/session-viewer.html';

const WORK_CLIPS = [
  { id: 'w1', title: 'Lace cutting 15s', meta: '42♥ · 3 gifts', live: false },
  { id: 'w2', title: 'Dress #46 reveal', meta: '128♥ · 12 gifts', live: false },
  { id: 'w3', title: 'Live sewing now', meta: '47 gifts', live: true },
  { id: 'w4', title: 'Gele wrap demo', meta: '61♥ · 8 gifts', live: false },
  { id: 'w5', title: 'Fuchsia wall 5m', meta: '90♥ · 15 gifts', live: false },
  { id: 'w6', title: 'Fitting night', meta: '33♥ · 4 gifts', live: false },
];

const TIMELINE = [
  { id: 'p1', label: 'Dress #47 lace wall 5m', at: 'Now' },
  { id: 'p2', label: 'Dress #46 hem + gele', at: '12m' },
  { id: 'p3', label: 'Aso-Ebi cut batch', at: '38m' },
  { id: 'p4', label: 'Fitting slot OL1', at: '1h' },
];

/** Twitch-style theater: real camera when Video Live + Work Feed / Project Timeline on mobile. */
export default function LiveViewerExperience() {
  const [params] = useSearchParams();
  const [musicOpen, setMusicOpen] = useState(false);
  const [tab, setTab] = useState<MusicSource>('Jamendo');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Music | null>(null);
  const [liveMusic, setLiveMusic] = useState<Music | null>(null);
  const [broadcast, setBc] = useState(readBroadcast());
  const [remoteLive, setRemoteLive] = useState<BroadcastState | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [showTheater, setShowTheater] = useState(false);
  const [tick, setTick] = useState(0);
  const [endSheet, setEndSheet] = useState<BroadcastState | null>(null);
  const [savedRecId, setSavedRecId] = useState<string | null>(null);
  const [postPublic, setPostPublic] = useState(false);
  const [wallpaperUrl, setWallpaperUrl] = useState<string | undefined>(
    () => readBroadcast()?.wallpaperUrl,
  );
  const wallpaperInputRef = useRef<HTMLInputElement | null>(null);

  const watchIntent = params.get('watch') === '1' || params.get('view') === '1';
  // Include YouTube hosts (no MediaStream) — camera-only checks wrongly treated them as viewers
  const localHost = isLocalLiveHost();
  const session = localHost && broadcast?.live ? broadcast : remoteLive || broadcast;
  const mode: BroadcastMode =
    session?.mode || (params.get('mode') === 'audio' ? 'audio' : 'video');
  const audioLive = Boolean(session?.live && mode === 'audio');
  const videoHosting = Boolean(localHost && broadcast?.live && mode === 'video');
  /** Viewers watch on For You — hosts (incl. YouTube) keep Live Workshop */
  const redirectWatchToFeed = Boolean(!localHost && (watchIntent || remoteLive?.live));
  const watchingRemote = false;
  const {
    videoRef,
    status: camStatus,
    error: camError,
    facing: camFacing,
    switching: camSwitching,
    startCamera,
    stopCamera,
    switchCamera,
  } = useLiveCamera();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('myface.live.music');
      if (raw) setLiveMusic(JSON.parse(raw) as Music);
    } catch {
      /* ignore */
    }
    const syncLocal = () => {
      const next = readBroadcast();
      setBc(next);
      if (next?.wallpaperUrl) setWallpaperUrl(next.wallpaperUrl);
    };
    const syncRemote = async () => {
      const local = readBroadcast();
      const hostingHere = isLocalLiveHost();
      // Only drop stale local flags when this device is clearly not the host
      // (YouTube hosts have no camera — never clear them here)
      if (local?.live && local.from !== 'remote' && !hostingHere && !local.youtubeId) {
        clearLocalBroadcastOnly();
      }
      if (hostingHere && local?.live) {
        setBc(local);
        setRemoteLive(null);
        return;
      }
      if (hostingHere) {
        setBc(local);
        return;
      }
      setBc(null);
      const remote = await fetchRemoteLive();
      setRemoteLive(remote);
    };
    syncLocal();
    void syncRemote();
    window.addEventListener('myface-broadcast', syncLocal);
    window.addEventListener('storage', syncLocal);
    const id = window.setInterval(() => void syncRemote(), 2000);
    return () => {
      window.removeEventListener('myface-broadcast', syncLocal);
      window.removeEventListener('storage', syncLocal);
      window.clearInterval(id);
    };
  }, []);

  // Arrived from feed/command with Video Live already flagged — keep Enable camera front-and-center
  useEffect(() => {
    try {
      if (sessionStorage.getItem('myface.live.needCamera') === '1' && videoHosting) {
        sessionStorage.removeItem('myface.live.needCamera');
      }
    } catch {
      /* ignore */
    }
  }, [videoHosting]);

  useEffect(() => {
    if (!session?.live) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, [session?.live]);

  const save = () => {
    if (!selected) return;
    const bedUrl =
      selected.objectUrl &&
      (/^https?:\/\//i.test(selected.objectUrl) || selected.objectUrl.startsWith('blob:'))
        ? selected.objectUrl
        : null;
    const hasYt = Boolean(selected.youtubeId);
    if (!bedUrl && !hasYt) {
      window.alert('For live BGM pick Jamendo, YouTube, or Upload. Spotify/Apple stubs have no playable audio.');
      return;
    }
    setLiveMusic(selected);
    setMusicOpen(false);
    try {
      localStorage.setItem('myface.live.music', JSON.stringify(selected));
    } catch {
      /* ignore */
    }
    // Cross-device metadata + mix playable beds into mic WAV for viewers
    void publishRemoteLiveMusic(selected);
    if (bedUrl) setLiveMusicBed(bedUrl, { volume: 0.45, loop: true });
    else setLiveMusicBed(null);
  };

  const uptime = (() => {
    void tick;
    if (!session?.live || !session.startedAt) return null;
    const sec = Math.max(0, Math.floor((Date.now() - Date.parse(session.startedAt)) / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  })();

  const endLive = () => {
    const current = readBroadcast();
    void (async () => {
      await stopSessionRecording();
      stopCamera();
      stopLiveAudioPublish();
      stopLiveMediaSource();
      setBroadcast(false);
      setBc(null);
      setShowTheater(false);
      if (current?.live) setEndSheet(current);
    })();
  };

  const confirmSaveRecording = (publish: boolean) => {
    if (!endSheet) return;
    void (async () => {
      const blob = takePendingRecordingBlob();
      const rec = saveLiveRecordingFromBroadcast(endSheet, {
        publicFeed: publish,
        hasMedia: Boolean(blob && blob.size > 0),
        mimeType: blob?.type,
      });
      if (blob && blob.size > 0) {
        try {
          await saveLiveClip(rec.id, blob);
        } catch {
          /* IndexedDB may be blocked in private mode */
        }
      }
      setSavedRecId(rec.id);
      setEndSheet(null);
      setPostPublic(false);
    })();
  };

  const discardRecording = () => {
    setEndSheet(null);
    setPostPublic(false);
  };

  const applyWallpaper = (url: string | undefined) => {
    setWallpaperUrl(url);
    setLiveDualWallpaper(url || null);
    if (readBroadcast()?.live) {
      patchBroadcast({ wallpaperUrl: url || null });
      setBc(readBroadcast());
    }
  };

  const onPickWallpaper = async (file: File | null) => {
    if (!file) return;
    try {
      const url = await compressLiveWallpaper(file);
      applyWallpaper(url);
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Could not use that image');
    }
  };

  const beginVideoLive = async (
    audience?: import('./liveAudience').LiveAudience,
    nextWallpaper?: string,
  ) => {
    const { broadcastMetaFromAudience } = await import('./liveAudience');
    const audienceMeta = broadcastMetaFromAudience(audience);
    // Camera FIRST while click is still a user gesture (Mac Chrome/Safari).
    const ok = await startCamera();
    if (nextWallpaper) {
      setWallpaperUrl(nextWallpaper);
      setLiveDualWallpaper(nextWallpaper);
    }
    setBroadcast(true, {
      mode: 'video',
      viewers: 144,
      title: audienceMeta.publicFeed
        ? "AYO'S TAILORS · Video Live · OL1"
        : "AYO'S TAILORS · Private Live",
      ...(nextWallpaper ? { wallpaperUrl: nextWallpaper } : {}),
      ...audienceMeta,
    });
    setBc(readBroadcast());
    setGoLiveOpen(false);
    setShowTheater(false);
    if (!ok) {
      void startCamera().then((again) => {
        if (again) void startSessionRecording({ mode: 'video' });
      });
    } else {
      void startSessionRecording({ mode: 'video' });
    }
  };

  const beginAudioLive = (
    audience?: import('./liveAudience').LiveAudience,
    nextWallpaper?: string,
  ) => {
    // stopCamera also clears frame/audio relays — start mic publish after
    stopCamera();
    void (async () => {
      const { broadcastMetaFromAudience } = await import('./liveAudience');
      const audienceMeta = broadcastMetaFromAudience(audience);
      const ok = await startLiveAudioOnlyPublish();
      if (nextWallpaper) {
        setWallpaperUrl(nextWallpaper);
        setLiveDualWallpaper(nextWallpaper);
      }
      setBroadcast(true, {
        mode: 'audio',
        viewers: 144,
        title: audienceMeta.publicFeed
          ? "AYO'S TAILORS · Audio Live · OL1"
          : "AYO'S TAILORS · Private Audio",
        ...(nextWallpaper ? { wallpaperUrl: nextWallpaper } : {}),
        ...audienceMeta,
      });
      setBc(readBroadcast());
      setGoLiveOpen(false);
      setShowTheater(false);
      if (ok) void startSessionRecording({ mode: 'audio' });
    })();
  };

  if (redirectWatchToFeed) {
    return <Navigate to="/app/feed?live=1" replace />;
  }

  return (
    <div className="h-dvh min-h-0 bg-[#050505] text-white flex flex-col overflow-hidden">
      <header className="shrink-0 border-b border-white/10 bg-black/60">
        <div className="h-12 md:h-14 px-2 md:px-4 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link to="/app/feed" className={CRM_BTN_GHOST + ' shrink-0 !px-2.5'}>
            ←
          </Link>
          <div className="min-w-0 flex-1 leading-tight">
            <div className={CRM_EYE + ' hidden sm:block'}>
              {watchingRemote ? 'Watching live' : localHost ? 'Hosting live' : 'Live session'}
            </div>
            <div className="font-display text-[13px] md:text-[15px] tracking-tight truncate">
              {session?.live ? session.title : "AYO'S · OL1"}
            </div>
          </div>
          {session?.live ? (
            <span className={CRM_LIVE_PILL + ' shrink-0'}>
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              <span className="md:hidden">{watchingRemote ? 'WATCH' : audioLive ? 'AUD' : 'VID'}</span>
              <span className="hidden md:inline">
                {watchingRemote ? 'Watching' : audioLive ? 'Audio' : 'Video'} · {session.viewers}
                {uptime ? ` · ${uptime}` : ''}
              </span>
            </span>
          ) : (
            <span className="mono text-[10px] text-white/40 shrink-0 hidden sm:inline">Offline</span>
          )}
          <Link to="/app/studio/stream" className={CRM_BTN_GHOST + ' shrink-0 !text-[11px] !px-2.5 hidden sm:inline-flex'}>
            Studio
          </Link>
          {watchingRemote ? (
            <Link to="/app/feed" className={CRM_BTN + ' shrink-0 !text-[11px] !px-3'}>
              Leave
            </Link>
          ) : (
            <button
              type="button"
              className={CRM_BTN + ' shrink-0 !text-[11px] !px-3'}
              onClick={() => {
                if (broadcast?.live) {
                  endLive();
                  return;
                }
                setGoLiveOpen(true);
              }}
            >
              {broadcast?.live ? 'End' : 'Go Live'}
            </button>
          )}
          <button type="button" className={CRM_BTN_GHOST + ' shrink-0 !h-9 !w-9 !px-0'} onClick={() => setMusicOpen(true)} aria-label="BGM">
            <IconMusic size={14} />
          </button>
          <div className="relative shrink-0">
            <button type="button" className={CRM_BTN_QUIET} onClick={() => setMenuOpen((v) => !v)} aria-label="More">
              <IconMore size={16} />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] rounded-lg border border-white/12 bg-[#0F0F0F] p-1 shadow-xl">
                <button
                  type="button"
                  className="w-full text-left rounded-md px-3 py-2 mono text-[11px] text-white/70 hover:bg-white/[0.06]"
                  onClick={() => {
                    setShowTheater((v) => !v);
                    setMenuOpen(false);
                  }}
                >
                  {showTheater ? 'Hide gift theater' : 'Show gift theater'}
                </button>
                <Link
                  to="/app/feed"
                  className="block rounded-md px-3 py-2 mono text-[11px] text-white/70 hover:bg-white/[0.06]"
                  onClick={() => setMenuOpen(false)}
                >
                  {broadcast?.live ? 'View on Feed' : 'Open Feed'}
                </Link>
                <a
                  href={LIVE_SRC}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-md px-3 py-2 mono text-[11px] text-white/70 hover:bg-white/[0.06]"
                  onClick={() => setMenuOpen(false)}
                >
                  Open theater HTML
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {localHost && broadcast?.live ? (
        <div className="shrink-0 px-3 pt-2 pb-1">
          <LiveHostJoinInbox active />
        </div>
      ) : null}

      {liveMusic ? (
        <div className="shrink-0 border-b border-white/10 px-3 py-2 flex items-center gap-3 bg-black/40">
          <div className="h-7 w-7 rounded-lg m-gradient flex items-center justify-center text-black">
            <IconMusic size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mono text-[11px] font-bold truncate">
              BGM · {liveMusic.title} · {liveMusic.artist}
            </div>
            <div className="h-1 mt-1 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[42%] m-gradient animate-pulse" />
            </div>
          </div>
          {liveMusic.youtubeId ? (
            <YoutubeEmbed youtubeId={liveMusic.youtubeId} title={liveMusic.title} autoplay compact />
          ) : liveMusic.objectUrl ? (
            <audio src={liveMusic.objectUrl} autoPlay loop controls className="h-8 max-w-[180px]" />
          ) : (
            <span className="mono text-[9px] text-white/40">{liveMusic.source}</span>
          )}
          <button type="button" className={CRM_BTN_GHOST} onClick={() => setMusicOpen(true)}>
            Change
          </button>
        </div>
      ) : null}

      {/* Scrollable body so Work Feed + Project Timeline stay visible on mobile */}
      <div className="relative flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {watchingRemote ? (
          <div className="relative w-full bg-black">
            <div className="relative aspect-[9/16] max-h-[70svh] md:aspect-video md:max-h-[min(62svh,720px)] mx-auto w-full overflow-hidden bg-gradient-to-br from-[#0a1628] via-black to-[#1a2e1a]">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_35%,#1A7CFF88,transparent_55%)]" />
              <iframe
                title="AYO live room"
                src={`${LIVE_SRC}?watch=1`}
                className="absolute inset-0 w-full h-full border-0 opacity-90"
                allow="autoplay; fullscreen; clipboard-write"
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/50 via-transparent to-black/70" />
              <div className="absolute top-3 left-3 right-3 z-[2] flex flex-wrap gap-2 pointer-events-none">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> WATCHING LIVE
                </span>
                <span className="rounded-full bg-black/55 border border-white/15 px-2.5 py-1 mono text-[10px]">
                  {(session?.viewers ?? remoteLive?.viewers ?? 144)} · {uptime || 'live'}
                </span>
                <span className="rounded-full bg-[#8FFF4A]/15 border border-[#8FFF4A]/35 text-[#8FFF4A] px-2.5 py-1 mono text-[10px] font-bold">
                  AYO · OL1
                </span>
              </div>
              <div className="absolute bottom-4 inset-x-4 z-[3] pointer-events-auto space-y-2">
                <div className="poppins text-[16px] font-extrabold drop-shadow">
                  {session?.title || remoteLive?.title || "AYO'S TAILORS · Video Live"}
                </div>
                <div className="mono text-[11px] text-white/70">You're in the live room · gifts & chat below</div>
                <div className="flex flex-wrap gap-2">
                  <Link to="/app/feed" className="h-10 px-4 rounded-full bg-white text-black font-bold text-[12px] grid place-items-center">
                    Back to feed
                  </Link>
                  <Link to="/app/maker/ayo" className="h-10 px-4 rounded-full border border-white/20 bg-black/50 font-semibold text-[12px] grid place-items-center">
                    AYO profile
                  </Link>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-full bg-[#FE2C55] text-white font-bold text-[12px] shadow-[0_2px_12px_rgba(254,44,85,0.45)]"
                    onClick={() => openLiveGiftShop({ fromName: localHost ? 'Host' : 'Viewer' })}
                  >
                    🎁 Gift
                  </button>
                  <button
                    type="button"
                    className="h-10 px-4 rounded-full border border-white/20 bg-black/50 font-semibold text-[12px]"
                    onClick={() => setShowTheater((v) => !v)}
                  >
                    {showTheater ? 'Hide theater' : 'Gift theater'}
                  </button>
                </div>
              </div>
            </div>
            {showTheater ? (
              <div className="border-t border-white/10 h-[36svh] relative bg-black">
                <iframe
                  title="Gift theater"
                  src={LIVE_SRC}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="autoplay; fullscreen; clipboard-write"
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
                />
              </div>
            ) : null}
          </div>
        ) : audioLive && session?.live ? (
          <div className="relative min-h-[52svh] flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#0a1628] via-black to-black py-10 overflow-hidden">
            {wallpaperUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${wallpaperUrl})` }}
                aria-hidden
              >
                <div className="absolute inset-0 bg-black/25" />
              </div>
            ) : (
              <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_30%,#1A7CFF66,transparent_55%)] pointer-events-none" />
            )}
            <div
              className="relative h-28 w-28 rounded-full grid place-items-center text-black text-[28px] font-black mb-5 shadow-[0_0_50px_rgba(26,124,255,0.45)]"
              style={{ background: 'linear-gradient(135deg,#8FFF4A,#1A7CFF,#FFE600)' }}
            >
              AT
            </div>
            <div className="relative flex items-end justify-center gap-1.5 h-14 mb-4" aria-hidden>
              {[6, 14, 9, 18, 11, 16, 8, 15, 10, 13, 7].map((h, i) => (
                <span
                  key={i}
                  className="w-2 rounded-full bg-[#8FFF4A] animate-pulse"
                  style={{ height: `${h * 3}px`, animationDelay: `${i * 70}ms` }}
                />
              ))}
            </div>
            <div className="relative poppins text-[20px] font-extrabold">{session.title}</div>
            <div className="relative mono text-[11px] text-white/50 mt-2">
              {isLiveAudioPublishing()
                ? 'Voice-only · mic publishing to feed'
                : 'Voice-only · tap Enable mic to publish sound'}
            </div>
            {!isLiveAudioPublishing() ? (
              <button
                type="button"
                className={`${CRM_BTN} relative mt-4`}
                onClick={() => void startLiveAudioOnlyPublish()}
              >
                Enable mic
              </button>
            ) : null}
            <div className="relative mt-6 rounded-full border border-white/15 bg-white/5 px-4 py-2 mono text-[11px]">
              {session.viewers} listening · {uptime}
            </div>
            {localHost ? (
              <div className="relative mt-4 flex flex-wrap gap-2 justify-center">
                <input
                  ref={wallpaperInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    e.target.value = '';
                    void onPickWallpaper(f);
                  }}
                />
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold"
                  onClick={() => wallpaperInputRef.current?.click()}
                >
                  {wallpaperUrl ? 'Change wallpaper' : 'Add wallpaper'}
                </button>
                {wallpaperUrl ? (
                  <button
                    type="button"
                    className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold"
                    onClick={() => applyWallpaper(undefined)}
                  >
                    Clear wallpaper
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : videoHosting ? (
          <div className="relative w-full bg-black">
            <div className="relative aspect-[9/16] max-h-[70svh] md:aspect-video md:max-h-[min(62svh,720px)] mx-auto w-full overflow-hidden bg-[#0a0a0a]">
              {wallpaperUrl ? (
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: `url(${wallpaperUrl})` }}
                  aria-hidden
                >
                  <div className="absolute inset-0 bg-black/20" />
                </div>
              ) : null}
              {/* TikTok-style: floating cam tile over wallpaper so the image stays visible */}
              <div
                className={
                  wallpaperUrl
                    ? 'absolute z-[1] left-3 right-3 top-[12%] bottom-[18%] rounded-[22px] overflow-hidden border border-white/25 shadow-[0_12px_40px_rgba(0,0,0,0.4)] bg-black/30'
                    : 'absolute inset-0 z-[1]'
                }
              >
              <video
                ref={videoRef}
                className={`absolute inset-0 h-full w-full object-cover ${
                  wallpaperUrl ? 'bg-transparent' : 'bg-black'
                } ${camFacing === 'environment' ? '' : 'scale-x-[-1]'}`}
                playsInline
                autoPlay
                muted
              />
              </div>
              {camStatus !== 'live' ? (
                <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-6 text-center bg-gradient-to-br from-[#0F172A] via-black to-[#1E293B]">
                  <div className="h-16 w-16 rounded-2xl border border-white/15 bg-white/5 grid place-items-center text-[22px]">
                    {camStatus === 'requesting' ? '…' : '📷'}
                  </div>
                  <div className="poppins text-[16px] font-extrabold">
                    {camStatus === 'requesting' ? 'Waiting for camera permission…' : 'Turn on your Mac camera'}
                  </div>
                  <div className="mono text-[11px] text-white/55 max-w-sm leading-relaxed">
                    {camError ||
                      'Tap Enable camera — Chrome/Safari will ask for Camera access. Also check macOS System Settings → Privacy & Security → Camera → enable your browser.'}
                  </div>
                  {camStatus === 'denied' ? (
                    <div className="mono text-[10px] text-amber-300/90 max-w-sm leading-relaxed rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2">
                      Site was blocked before. Address bar lock → Site settings → Camera = Allow → reload → Enable camera.
                    </div>
                  ) : null}
                  <button type="button" className={CRM_BTN} onClick={() => void startCamera()} disabled={camStatus === 'requesting'}>
                    {camStatus === 'requesting' ? 'Requesting…' : 'Enable camera'}
                  </button>
                </div>
              ) : null}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> VIDEO LIVE
                </span>
                <span className="rounded-full bg-black/55 border border-white/15 px-2.5 py-1 mono text-[10px]">
                  {broadcast?.viewers ?? 0} · {uptime}
                </span>
                {camStatus === 'live' ? (
                  <span className="rounded-full bg-[#8FFF4A]/20 border border-[#8FFF4A]/40 text-[#8FFF4A] px-2.5 py-1 mono text-[10px] font-bold">
                    YOU · CAM ON
                    {liveFramePublishStats().lastOkAt && Date.now() - liveFramePublishStats().lastOkAt! < 3000
                      ? ' · FEED'
                      : ' · sending…'}
                  </span>
                ) : null}
              </div>
              <div className="absolute bottom-3 inset-x-3 flex flex-wrap gap-2 z-[3]">
                <input
                  ref={wallpaperInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    e.target.value = '';
                    void onPickWallpaper(f);
                  }}
                />
                {camStatus === 'live' ? (
                  <>
                    <button
                      type="button"
                      className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold disabled:opacity-50"
                      disabled={camSwitching}
                      onClick={() => void switchCamera()}
                    >
                      {camSwitching
                        ? 'Switching…'
                        : `Flip cam · ${camFacing === 'environment' ? 'Back' : 'Front'}`}
                    </button>
                    <button type="button" className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold" onClick={() => void startCamera()}>
                      Restart cam
                    </button>
                  </>
                ) : (
                  <button type="button" className="h-9 px-3 rounded-xl bg-[#8FFF4A] text-black text-[12px] font-bold" onClick={() => void startCamera()}>
                    Enable camera
                  </button>
                )}
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold"
                  onClick={() => wallpaperInputRef.current?.click()}
                >
                  {wallpaperUrl ? 'Wallpaper ✓' : 'Wallpaper'}
                </button>
                <button
                  type="button"
                  className="h-9 px-3 rounded-xl bg-[#FE2C55] text-white text-[12px] font-bold shadow-[0_2px_12px_rgba(254,44,85,0.4)]"
                  onClick={() => openLiveGiftShop({ fromName: localHost ? 'Host' : 'Viewer' })}
                >
                  🎁 Gift
                </button>
                <button type="button" className="h-9 px-3 rounded-xl bg-black/55 border border-white/15 text-[12px] font-semibold" onClick={() => setShowTheater((v) => !v)}>
                  {showTheater ? 'Hide theater' : 'Gift theater'}
                </button>
                <button type="button" className="h-9 px-3 rounded-xl bg-white text-black text-[12px] font-semibold ml-auto" onClick={endLive}>
                  End
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative min-h-[48svh] md:min-h-[56svh] flex flex-col items-center justify-center px-6 text-center bg-gradient-to-b from-[#0F172A] via-black to-black py-12">
            <div className="h-20 w-20 rounded-full bg-[#8FFF4A] text-black grid place-items-center text-[24px] font-black mb-4">
              AT
            </div>
            <div className="poppins text-[18px] font-extrabold">Nobody hosting right now</div>
            <div className="mono text-[11px] text-white/50 mt-2 max-w-xs">
              When AYO goes live on PC, Watch Live opens this room. Or host your own stream.
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              <button type="button" className={CRM_BTN} onClick={() => setGoLiveOpen(true)}>
                Go Live — Video or Audio
              </button>
              <Link to="/app/feed" className={CRM_BTN_GHOST}>
                Back to feed
              </Link>
            </div>
          </div>
        )}

        {showTheater && videoHosting ? (
          <div className="border-t border-white/10 h-[42svh] md:h-[360px] relative bg-black">
            <iframe
              title="Gift theater"
              src={LIVE_SRC}
              className="absolute inset-0 w-full h-full border-0"
              allow="autoplay; fullscreen; clipboard-write"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-popups allow-forms"
            />
          </div>
        ) : null}

        {/* Work Feed + Project Timeline — always visible below stage (mobile scroll) */}
        <section className="px-3 md:px-5 pt-4 pb-4 space-y-5 border-t border-white/10 bg-[#050505]">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="poppins text-[14px] font-extrabold">Work Feed</h2>
              <span className="mono text-[10px] text-white/45">{WORK_CLIPS.length} clips</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
              {WORK_CLIPS.map((clip) => (
                <div
                  key={clip.id}
                  className="shrink-0 w-[118px] rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]"
                >
                  <div className="aspect-[3/4] relative bg-gradient-to-br from-[#1E293B] to-black grid place-items-center">
                    {clip.live ? (
                      <span className="absolute top-2 left-2 rounded-full bg-red-500 px-1.5 py-0.5 text-[8px] font-bold">LIVE</span>
                    ) : null}
                    <span className="text-[22px] opacity-70">✂</span>
                  </div>
                  <div className="p-2">
                    <div className="text-[11px] font-bold truncate">{clip.title}</div>
                    <div className="mono text-[9px] text-white/45 mt-0.5">{clip.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="poppins text-[14px] font-extrabold">Project Timeline</h2>
              <Link to="/app/dashboard?pane=projects" className="mono text-[10px] text-[#8FFF4A]">
                Open projects →
              </Link>
            </div>
            <div className="space-y-2">
              {TIMELINE.map((row) => (
                <div
                  key={row.id}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-3"
                >
                  <div className="h-9 w-9 rounded-xl m-gradient grid place-items-center text-black text-[11px] font-black shrink-0">
                    ◆
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold truncate">{row.label}</div>
                    <div className="mono text-[10px] text-white/45">Auto-clipped from live · escrow ready</div>
                  </div>
                  <span className="mono text-[10px] text-white/40 shrink-0">{row.at}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <LiveRecordingsPanel highlightId={savedRecId} />
      </div>

      {endSheet ? (
        <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center">
          <button type="button" className="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-label="Close" onClick={discardRecording} />
          <div className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/12 bg-[#0B0B0B] p-5 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl">
            <div className="mono text-[10px] uppercase tracking-wider text-white/45">Live ended</div>
            <h2 className="poppins text-[18px] font-extrabold mt-1">Save this session?</h2>
            <p className="mono text-[11px] text-white/50 mt-2 leading-relaxed">
              Keep a recording to edit, delete later, open in WorkCut, or post to the public For You feed.
            </p>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="text-[13px] font-bold truncate">{endSheet.title}</div>
              <div className="mono text-[10px] text-white/45 mt-1">
                {(endSheet.mode || 'video').toUpperCase()} · {endSheet.viewers} viewers
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={postPublic}
                onChange={(e) => setPostPublic(e.target.checked)}
                className="accent-[#8FFF4A]"
              />
              <span className="text-[12px] font-semibold">Also post to public feed now</span>
            </label>
            <div className="mt-4 grid gap-2">
              <button type="button" className={CRM_BTN + ' w-full h-11'} onClick={() => confirmSaveRecording(postPublic)}>
                Save recording
              </button>
              <button
                type="button"
                className={CRM_BTN_GHOST + ' w-full h-11'}
                onClick={() => confirmSaveRecording(true)}
              >
                Save & post to public feed
              </button>
              <button type="button" className={CRM_BTN_QUIET + ' w-full h-11'} onClick={discardRecording}>
                Don&apos;t save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MusicDrawer
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
        activeTab={tab}
        onTabChange={setTab}
        searchQuery={query}
        onSearchChange={setQuery}
        selected={selected}
        onSelect={setSelected}
        onSave={save}
        contextLabel="live session"
        allowUpload
      />

      <LiveGiftPortal />

      <GoLivePicker
        open={goLiveOpen}
        onClose={() => setGoLiveOpen(false)}
        title="Go Live"
        onChoose={(pick: GoLivePick) => {
          void (async () => {
            if (pick.kind === 'post') {
              setGoLiveOpen(false);
              // Caption sheet lives on the feed
              window.location.href = '/app/feed?upload=1';
              return;
            }
            const wp = 'wallpaperUrl' in pick ? pick.wallpaperUrl : undefined;
            if (pick.kind === 'camera' && pick.mode === 'audio') {
              beginAudioLive(pick.audience, wp);
              return;
            }
            if (pick.kind === 'camera') {
              void beginVideoLive(pick.audience, wp);
              return;
            }
            try {
              const { broadcastMetaFromAudience } = await import('./liveAudience');
              const audienceMeta = broadcastMetaFromAudience(pick.audience);
              if (wp) {
                setWallpaperUrl(wp);
                setLiveDualWallpaper(wp);
              }
              if (pick.kind === 'youtube') {
                stopLiveMediaSource();
                const mins = Math.round(pick.durationSec / 60);
                const n = pick.playlist.length;
                setBroadcast(true, {
                  mode: 'video',
                  viewers: 144,
                  youtubeId: pick.youtubeId,
                  youtubePlaylistIds: pick.playlist.map((p) => p.id),
                  youtubePlaylist: pick.playlist,
                  youtubeDurationSec: pick.durationSec,
                  title: `YouTube · ${n} vid · ${mins}m`,
                  ...(wp ? { wallpaperUrl: wp } : {}),
                  ...audienceMeta,
                });
                setBc(readBroadcast());
                setGoLiveOpen(false);
                setShowTheater(false);
                return;
              }
              const src = pick.kind === 'file' ? pick.file : pick.url;
              await startLiveMediaSource(src);
              void startSessionRecording({ mode: 'video' });
              setBroadcast(true, {
                mode: 'video',
                viewers: 144,
                title:
                  pick.kind === 'file'
                    ? `File Live · ${pick.file.name.slice(0, 28)}`
                    : 'Link Live · AYO stream',
                ...(wp ? { wallpaperUrl: wp } : {}),
                ...audienceMeta,
              });
              setBc(readBroadcast());
              setGoLiveOpen(false);
              setShowTheater(false);
            } catch (err) {
              window.alert(err instanceof Error ? err.message : 'Could not start media stream');
            }
          })();
        }}
      />
    </div>
  );
}
