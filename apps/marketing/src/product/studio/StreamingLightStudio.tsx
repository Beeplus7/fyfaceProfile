import { useEffect, useState, type ComponentType, type SVGProps } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  L_BTN,
  L_BTN_GHOST,
  L_BTN_QUIET,
  L_CARD,
  L_CARD_IN,
  L_EYE,
  L_PAGE,
  L_PILL,
  L_RAIL_ACTIVE,
  L_RAIL_IDLE,
} from '../crmLight';
import { readBroadcast, setBroadcast, type BroadcastMode } from '../demo/testLab';
import GoLivePicker, { type GoLivePick } from '../live/GoLivePicker';
import { startLiveMediaSource, stopLiveMediaSource } from '../live/liveMediaSource';
import { saveLiveRecordingFromBroadcast } from '../live/liveRecordings';
import { saveLiveClip } from '../live/liveRecordingMedia';
import { startSessionRecording, stopSessionRecording, takePendingRecordingBlob } from '../live/liveSessionRecorder';
import { useLiveCamera } from '../live/useLiveCamera';
import { MusicDrawer, type Music, type MusicSource } from '../music/MusicDrawer';
import YoutubeEmbed from '../music/YoutubeEmbed';
import { loadProfile } from '../onboarding/storage';
import {
  IconCollapse,
  IconExpand,
  IconHome,
  IconLive,
  IconMusic,
  IconPeople,
  IconScissors,
  IconSettings,
  IconShare,
} from '../ui/icons';

type PaneId = 'scenes' | 'camera' | 'chat' | 'guests' | 'music' | 'settings';
type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const PANES: { id: PaneId; label: string; Icon: IconCmp }[] = [
  { id: 'scenes', label: 'Scenes', Icon: IconLive },
  { id: 'camera', label: 'Camera', Icon: IconShare },
  { id: 'chat', label: 'Chat', Icon: IconPeople },
  { id: 'guests', label: 'Guests', Icon: IconPeople },
  { id: 'music', label: 'Music', Icon: IconMusic },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

const SCENES = [
  { id: 'workshop', label: 'Workshop floor', blurb: 'Main cam · lace table' },
  { id: 'closeup', label: 'Close-up stitch', blurb: 'Detail · 9:16 crop' },
  { id: 'guest', label: 'Guest + host', blurb: 'Split · dual mic' },
  { id: 'replay', label: 'WorkCut replay', blurb: 'Clip from editor' },
];

const CHAT = [
  { user: 'Aisha Bridal', text: 'That lace colour is perfect 💛', mfc: 50 },
  { user: 'Mrs Okafor', text: 'How many days for fitting?', mfc: 0 },
  { user: 'Cooper Levin', text: 'Gifted 🔨 Hammer', mfc: 10 },
  { user: 'Fatima Bello', text: 'Book me for Gele next week', mfc: 0 },
];

const MUSIC_KEY = 'myface.live.music';

export default function StreamingLightStudio() {
  const profile = loadProfile();
  const shop = profile?.shopName || "AYO'S TAILORS";
  const loc = profile?.location || 'Spindlegate OL1';
  const [params] = useSearchParams();
  const queryMode = params.get('mode') === 'audio' ? 'audio' : params.get('mode') === 'video' ? 'video' : null;

  const [collapsed, setCollapsed] = useState(false);
  const [pane, setPane] = useState<PaneId>('scenes');
  const [scene, setScene] = useState('workshop');
  const [broadcast, setBc] = useState(readBroadcast());
  const [viewers, setViewers] = useState(144);
  const [liveMode, setLiveMode] = useState<BroadcastMode>(
    () => readBroadcast()?.mode || queryMode || 'video',
  );
  const [goLiveOpen, setGoLiveOpen] = useState(false);
  const [camOn, setCamOn] = useState(() => (queryMode === 'audio' ? false : true));
  const [micOn, setMicOn] = useState(true);
  const cameraEnabled = liveMode === 'video' && camOn;
  const { videoRef, status: camStatus, error: camError, startCamera, stopCamera } = useLiveCamera();

  const [musicOpen, setMusicOpen] = useState(false);
  const [tab, setTab] = useState<MusicSource>('Jamendo');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Music | null>(null);
  const [studioMusic, setStudioMusic] = useState<Music | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(MUSIC_KEY);
      if (raw) setStudioMusic(JSON.parse(raw) as Music);
    } catch {
      /* ignore */
    }
    const sync = () => {
      const b = readBroadcast();
      setBc(b);
      if (b?.mode) setLiveMode(b.mode);
    };
    window.addEventListener('myface-broadcast', sync);
    return () => window.removeEventListener('myface-broadcast', sync);
  }, []);

  useEffect(() => {
    if (queryMode === 'audio') {
      setLiveMode('audio');
      setCamOn(false);
    } else if (queryMode === 'video') {
      setLiveMode('video');
      setCamOn(true);
    }
  }, [queryMode]);

  useEffect(() => {
    if (!broadcast?.live) return;
    const id = window.setInterval(() => {
      setViewers((v) => Math.max(40, v + Math.floor(Math.random() * 7) - 2));
    }, 4000);
    return () => window.clearInterval(id);
  }, [broadcast?.live]);

  const uptime = (() => {
    if (!broadcast?.live || !broadcast.startedAt) return null;
    const sec = Math.max(0, Math.floor((Date.now() - Date.parse(broadcast.startedAt)) / 1000));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  })();

  const startLive = async (mode: BroadcastMode) => {
    setLiveMode(mode);
    if (mode === 'audio') {
      setCamOn(false);
      stopCamera();
      await startSessionRecording({ mode: 'audio' });
    } else {
      setCamOn(true);
      await startCamera();
      await startSessionRecording({ mode: 'video' });
    }
    setBroadcast(true, {
      viewers,
      mode,
      title: mode === 'audio' ? `${shop} · Audio Live · ${loc}` : `${shop} · Video Live · ${loc}`,
    });
    setBc(readBroadcast());
    setGoLiveOpen(false);
  };

  const toggleLive = () => {
    if (broadcast?.live) {
      const current = readBroadcast();
      void (async () => {
        await stopSessionRecording();
        stopCamera();
        stopLiveMediaSource();
        setBroadcast(false);
        setBc(null);
        if (current?.live) {
          const publish = window.confirm('Save this live recording?\n\nOK = save draft (edit/post later)\nCancel = discard');
          if (publish) {
            const alsoPublic = window.confirm('Post this recording to the public For You feed now?');
            const blob = takePendingRecordingBlob();
            const rec = saveLiveRecordingFromBroadcast(current, {
              publicFeed: alsoPublic,
              hasMedia: Boolean(blob && blob.size > 0),
              mimeType: blob?.type,
            });
            if (blob && blob.size > 0) {
              try {
                await saveLiveClip(rec.id, blob);
              } catch {
                /* ignore */
              }
            }
          }
        }
      })();
      return;
    }
    setGoLiveOpen(true);
  };

  const saveMusic = () => {
    if (!selected) return;
    setStudioMusic(selected);
    setMusicOpen(false);
    try {
      localStorage.setItem(MUSIC_KEY, JSON.stringify(selected));
    } catch {
      /* ignore */
    }
  };

  const openMusic = () => {
    setPane('music');
    setMusicOpen(true);
  };

  const Panel = (
    <div className="space-y-3">
      {pane === 'scenes' ? (
        <>
          <div className={L_EYE}>Scenes</div>
          {SCENES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScene(s.id)}
              className={`w-full text-left rounded-xl border px-3 py-3 transition ${
                scene === s.id
                  ? 'border-[#2F6BFF] bg-[#EEF3FF]'
                  : 'border-[#E7EBF0] bg-white hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="text-[13px] font-semibold text-[#0F172A]">{s.label}</div>
              <div className="text-[11px] text-[#64748B] mt-0.5">{s.blurb}</div>
            </button>
          ))}
        </>
      ) : null}

      {pane === 'camera' ? (
        <>
          <div className={L_EYE}>Sources</div>
          <div className={L_CARD_IN + ' p-3 space-y-3'}>
            <label className="flex items-center justify-between text-[12px] text-[#334155]">
              Camera
              <button type="button" className={camOn ? L_BTN : L_BTN_GHOST} onClick={() => setCamOn((v) => !v)}>
                {camOn ? 'On' : 'Off'}
              </button>
            </label>
            <label className="flex items-center justify-between text-[12px] text-[#334155]">
              Mic
              <button type="button" className={micOn ? L_BTN : L_BTN_GHOST} onClick={() => setMicOn((v) => !v)}>
                {micOn ? 'On' : 'Off'}
              </button>
            </label>
            <div className="text-[11px] text-[#64748B]">Mux / LiveKit keys still stub — preview is local studio chrome.</div>
          </div>
        </>
      ) : null}

      {pane === 'chat' ? (
        <>
          <div className={L_EYE}>Live chat</div>
          <div className="space-y-2 max-h-[360px] overflow-y-auto">
            {CHAT.map((c) => (
              <div key={c.user + c.text} className={L_CARD_IN + ' p-3'}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-semibold text-[#0F172A]">{c.user}</div>
                  {c.mfc ? <span className={L_PILL}>{c.mfc} MFC</span> : null}
                </div>
                <div className="text-[12px] text-[#475569] mt-1">{c.text}</div>
              </div>
            ))}
          </div>
        </>
      ) : null}

      {pane === 'guests' ? (
        <>
          <div className={L_EYE}>Invite guest</div>
          <div className={L_CARD_IN + ' p-3 text-[12px] text-[#475569] space-y-2'}>
            <div>Guest link stub · share to co-host</div>
            <button type="button" className={L_BTN_GHOST + ' w-full'}>
              Copy invite
            </button>
          </div>
        </>
      ) : null}

      {pane === 'music' ? (
        <>
          <div className={L_EYE}>Studio BGM · Jamendo</div>
          {studioMusic ? (
            <div className={L_CARD_IN + ' p-3 space-y-2'}>
              <div className="text-[13px] font-semibold text-[#0F172A] truncate">{studioMusic.title}</div>
              <div className="text-[11px] text-[#64748B]">
                {studioMusic.artist} · {studioMusic.source}
              </div>
              {studioMusic.youtubeId ? (
                <YoutubeEmbed youtubeId={studioMusic.youtubeId} title={studioMusic.title} autoplay />
              ) : studioMusic.objectUrl ? (
                <audio src={studioMusic.objectUrl} controls loop className="w-full" />
              ) : null}
            </div>
          ) : (
            <div className={L_CARD_IN + ' p-3 text-[12px] text-[#64748B]'}>No BGM yet — pick a Jamendo track.</div>
          )}
          <button type="button" className={L_BTN + ' w-full'} onClick={() => setMusicOpen(true)}>
            Open music drawer
          </button>
        </>
      ) : null}

      {pane === 'settings' ? (
        <>
          <div className={L_EYE}>Studio</div>
          <div className={L_CARD_IN + ' p-3 text-[12px] text-[#475569] space-y-2'}>
            <div>Title · {shop} · {loc}</div>
            <div>Output · 1080p / 9:16 vertical stub</div>
            <div>Latency · low (preview)</div>
          </div>
          <a
            href="/studio/streaming-studio.html"
            target="_blank"
            rel="noreferrer"
            className={L_BTN_GHOST + ' w-full'}
          >
            Open classic studio HTML
          </a>
          <Link to="/app/live" className={L_BTN_GHOST + ' w-full'}>
            Open Live Viewer
          </Link>
        </>
      ) : null}
    </div>
  );

  return (
    <div className={L_PAGE + ' flex flex-col h-dvh overflow-hidden'}>
      <header className="shrink-0 border-b border-[#E7EBF0] bg-white/95 backdrop-blur-xl">
        <div className="h-12 md:h-14 px-2 md:px-5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link to="/app/dashboard" className={L_BTN_GHOST + ' shrink-0 !px-2.5'}>
            ←
          </Link>
          <div className="w-8 h-8 shrink-0 rounded-xl bg-[#2F6BFF] grid place-items-center text-[11px] font-bold text-white">
            SS
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <div className="text-[13px] font-semibold truncate text-[#0F172A]">Streaming Studio</div>
            <div className="text-[11px] text-[#94A3B8] truncate">{shop} · {loc}</div>
          </div>
          {broadcast?.live ? (
            <span className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] px-2.5 py-1 text-[11px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EF4444] animate-pulse" />
              <span className="md:hidden">{(broadcast.mode || liveMode) === 'audio' ? 'AUD' : 'VID'}</span>
              <span className="hidden md:inline">
                {(broadcast.mode || liveMode) === 'audio' ? 'AUDIO' : 'VIDEO'} LIVE · {viewers}
                {uptime ? ` · ${uptime}` : ''}
              </span>
            </span>
          ) : (
            <span className={L_PILL + ' shrink-0 hidden sm:inline-flex'}>Idle</span>
          )}
          <button
            type="button"
            className={L_BTN_QUIET + ' hidden md:inline-flex shrink-0'}
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand tools' : 'Collapse tools'}
          >
            {collapsed ? <IconExpand size={14} /> : <IconCollapse size={14} />}
          </button>
          <button type="button" className={L_BTN_GHOST + ' shrink-0 !px-2.5'} onClick={openMusic}>
            <IconMusic size={14} />
          </button>
          <Link to="/app/studio/workcut" className={L_BTN_GHOST + ' shrink-0 hidden sm:inline-flex'}>
            WorkCut
          </Link>
          <button
            type="button"
            className={(broadcast?.live ? L_BTN_GHOST : L_BTN) + ' shrink-0 !px-3'}
            onClick={toggleLive}
          >
            {broadcast?.live ? 'End' : 'Live'}
          </button>
        </div>
      </header>

      {studioMusic ? (
        <div className="shrink-0 border-b border-[#E7EBF0] bg-white px-3 md:px-5 py-2 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-[#EEF3FF] text-[#2F6BFF] grid place-items-center">
            <IconMusic size={14} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-[#0F172A] truncate">
              BGM · {studioMusic.title} · {studioMusic.artist}
            </div>
            <div className="h-1 mt-1 rounded-full bg-[#E2E8F0] overflow-hidden">
              <div className="h-full w-[40%] bg-[#2F6BFF] animate-pulse" />
            </div>
          </div>
          {studioMusic.youtubeId ? (
            <YoutubeEmbed youtubeId={studioMusic.youtubeId} title={studioMusic.title} autoplay compact />
          ) : studioMusic.objectUrl ? (
            <audio src={studioMusic.objectUrl} autoPlay loop controls className="h-8 max-w-[180px]" />
          ) : null}
          <button type="button" className={L_BTN_QUIET} onClick={() => setMusicOpen(true)}>
            Change
          </button>
        </div>
      ) : null}

      <div className="flex flex-1 min-h-0 max-w-[1600px] mx-auto w-full">
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-[#E7EBF0] bg-[#F7F8FA] overflow-hidden transition-[width] duration-200 ease-out ${
            collapsed ? 'w-[72px]' : 'w-[248px]'
          }`}
        >
          <div className={`flex flex-col h-full ${collapsed ? 'px-2' : 'px-3'} py-3 gap-3`}>
            <div className="flex items-center justify-between px-1">
              {!collapsed ? (
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Studio</div>
              ) : (
                <span className="sr-only">Studio</span>
              )}
              <button
                type="button"
                className={L_RAIL_IDLE}
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? 'Expand' : 'Collapse'}
              >
                {collapsed ? <IconExpand size={16} /> : <IconCollapse size={16} />}
              </button>
            </div>
            <nav className="space-y-1">
              {PANES.map((item) => {
                const active = pane === item.id;
                const Icon = item.Icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPane(item.id);
                      if (item.id === 'music') setMusicOpen(true);
                    }}
                    className={
                      collapsed
                        ? active
                          ? L_RAIL_ACTIVE
                          : L_RAIL_IDLE
                        : active
                          ? 'w-full flex items-center gap-3 rounded-xl px-2.5 h-10 text-left bg-[#2F6BFF] text-white shadow-sm'
                          : 'w-full flex items-center gap-3 rounded-xl px-2.5 h-10 text-left text-[#64748B] hover:bg-[#EEF2F7] hover:text-[#0F172A] transition'
                    }
                    title={item.label}
                  >
                    <Icon size={18} />
                    {!collapsed ? <span className="text-[13px] font-medium">{item.label}</span> : null}
                  </button>
                );
              })}
            </nav>
            <div className="mt-auto space-y-1">
              <Link
                to="/app/studio/workcut"
                className={
                  collapsed
                    ? L_RAIL_IDLE + ' w-full'
                    : 'w-full flex items-center gap-3 rounded-xl px-2.5 h-10 text-[#64748B] hover:bg-[#EEF2F7]'
                }
                title="WorkCut"
              >
                <IconScissors size={18} />
                {!collapsed ? <span className="text-[13px] font-medium">WorkCut</span> : null}
              </Link>
              <Link
                to="/app/dashboard"
                className={
                  collapsed
                    ? L_RAIL_IDLE + ' w-full'
                    : 'w-full flex items-center gap-3 rounded-xl px-2.5 h-10 text-[#64748B] hover:bg-[#EEF2F7]'
                }
                title="Dashboard"
              >
                <IconHome size={18} />
                {!collapsed ? <span className="text-[13px] font-medium">Dashboard</span> : null}
              </Link>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 p-3 md:p-5 overflow-auto">
          <div className="grid lg:grid-cols-12 gap-4 items-start">
            <section className={L_CARD + ' lg:col-span-7 p-4'}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className={L_EYE}>Program preview</div>
                  <div className="text-[15px] font-semibold text-[#0F172A] mt-0.5">
                    {SCENES.find((s) => s.id === scene)?.label}
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={L_PILL}>{liveMode === 'audio' ? 'Audio room' : 'Video stage'}</span>
                  <span className={L_PILL}>{camOn ? 'Cam on' : 'Cam off'}</span>
                  <span className={L_PILL}>{micOn ? 'Mic on' : 'Mic off'}</span>
                </div>
              </div>
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#E7EBF0] bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] text-white">
                {cameraEnabled ? (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover scale-x-[-1] bg-black"
                    playsInline
                    autoPlay
                    muted
                  />
                ) : (
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,#2F6BFF,transparent_45%),radial-gradient(circle_at_80%_70%,#8FFF4A33,transparent_40%)]" />
                )}
                <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                  {broadcast?.live ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-2.5 py-1 text-[11px] font-bold">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />{' '}
                      {(broadcast.mode || liveMode) === 'audio' ? 'AUDIO LIVE' : 'VIDEO LIVE'}
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold">Preview</span>
                  )}
                  <span className="rounded-full bg-black/40 px-2.5 py-1 text-[11px]">{viewers} watching</span>
                  {camStatus === 'live' ? (
                    <span className="rounded-full bg-[#8FFF4A]/20 border border-[#8FFF4A]/40 text-[#8FFF4A] px-2.5 py-1 text-[10px] font-bold">
                      YOU · CAM
                    </span>
                  ) : null}
                </div>
                {(!cameraEnabled || camStatus !== 'live') && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-[1]">
                    {liveMode === 'audio' || (!camOn && broadcast?.live) ? (
                      <>
                        <div
                          className="w-20 h-20 rounded-full grid place-items-center text-black text-[22px] font-black mb-3 shadow-[0_0_40px_rgba(143,255,74,0.35)]"
                          style={{ background: 'linear-gradient(135deg,#8FFF4A,#1A7CFF,#FFE600)' }}
                        >
                          {shop.slice(0, 2)}
                        </div>
                        <div className="flex items-end justify-center gap-1 h-10 mb-3" aria-hidden>
                          {[4, 10, 6, 14, 8, 12, 5, 11, 7].map((h, i) => (
                            <span
                              key={i}
                              className="w-1.5 rounded-full bg-[#8FFF4A]/90 animate-pulse"
                              style={{ height: h * 2, animationDelay: `${i * 80}ms` }}
                            />
                          ))}
                        </div>
                        <div className="text-[16px] font-semibold">{shop}</div>
                        <div className="text-[12px] text-white/70 mt-1">Audio Live · mic only · {loc}</div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur grid place-items-center mb-3 border border-white/15">
                          <IconLive size={28} />
                        </div>
                        <div className="text-[16px] font-semibold">{shop}</div>
                        <div className="text-[12px] text-white/70 mt-1">
                          {camStatus === 'requesting'
                            ? 'Waiting for camera permission…'
                            : camError || `${loc} · ${SCENES.find((s) => s.id === scene)?.blurb}`}
                        </div>
                        {cameraEnabled ? (
                          <button
                            type="button"
                            className="mt-3 h-9 px-4 rounded-xl bg-white text-[#0F172A] text-[12px] font-bold"
                            onClick={() => void startCamera()}
                          >
                            Enable camera
                          </button>
                        ) : null}
                        {!camOn ? (
                          <div className="mt-3 text-[12px] text-amber-200">Camera muted in studio</div>
                        ) : null}
                      </>
                    )}
                  </div>
                )}
                <div className="absolute bottom-3 inset-x-3 flex flex-wrap gap-2 z-10">
                  {liveMode !== 'audio' ? (
                    <button
                      type="button"
                      className="h-9 px-3 rounded-xl bg-white/15 text-[12px] font-semibold hover:bg-white/25"
                      onClick={() => {
                        setCamOn((v) => {
                          const next = !v;
                          if (!next) stopCamera();
                          else void startCamera();
                          return next;
                        });
                      }}
                    >
                      {camOn ? 'Mute cam' : 'Unmute cam'}
                    </button>
                  ) : null}
                  <button type="button" className="h-9 px-3 rounded-xl bg-white/15 text-[12px] font-semibold hover:bg-white/25" onClick={() => setMicOn((v) => !v)}>
                    {micOn ? 'Mute mic' : 'Unmute mic'}
                  </button>
                  <button type="button" className="h-9 px-3 rounded-xl bg-white text-[#0F172A] text-[12px] font-semibold" onClick={openMusic}>
                    BGM
                  </button>
                  <button type="button" className="h-9 px-3 rounded-xl bg-[#2F6BFF] text-white text-[12px] font-semibold ml-auto" onClick={toggleLive}>
                    {broadcast?.live ? 'End' : 'Go Live'}
                  </button>
                </div>
              </div>
            </section>

            <section className="lg:col-span-5 space-y-4">
              <div className={L_CARD + ' p-4'}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[14px] font-semibold text-[#0F172A]">
                    {PANES.find((p) => p.id === pane)?.label}
                  </div>
                  <div className="flex md:hidden flex-wrap gap-1">
                    {PANES.slice(0, 4).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        className={pane === p.id ? L_BTN : L_BTN_QUIET}
                        onClick={() => {
                          setPane(p.id);
                          if (p.id === 'music') setMusicOpen(true);
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {Panel}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { k: 'Viewers', v: String(viewers) },
                  { k: 'Gifts', v: '£42' },
                  { k: 'Uptime', v: uptime || '00:00' },
                ].map((stat) => (
                  <div key={stat.k} className={L_CARD + ' p-3'}>
                    <div className={L_EYE}>{stat.k}</div>
                    <div className="text-[15px] font-semibold text-[#0F172A] mt-1">{stat.v}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>

      <MusicDrawer
        open={musicOpen}
        onClose={() => setMusicOpen(false)}
        activeTab={tab}
        onTabChange={setTab}
        searchQuery={query}
        onSearchChange={setQuery}
        selected={selected}
        onSelect={setSelected}
        onSave={saveMusic}
        contextLabel="streaming studio"
        allowUpload
      />

      <GoLivePicker
        open={goLiveOpen}
        onClose={() => setGoLiveOpen(false)}
        title="Go Live"
        theme="light"
        onChoose={(pick: GoLivePick) => {
          void (async () => {
            if (pick.kind === 'post') {
              setGoLiveOpen(false);
              window.location.href = '/app/feed?upload=1';
              return;
            }
            if (pick.kind === 'camera') {
              await startLive(pick.mode);
              return;
            }
            try {
              stopCamera();
              await startLiveMediaSource(pick.kind === 'file' ? pick.file : pick.url);
              setLiveMode('video');
              setCamOn(true);
              setBroadcast(true, {
                viewers,
                mode: 'video',
                title:
                  pick.kind === 'file'
                    ? `${shop} · File Live · ${loc}`
                    : `${shop} · Link Live · ${loc}`,
              });
              setBc(readBroadcast());
              setGoLiveOpen(false);
            } catch (err) {
              window.alert(err instanceof Error ? err.message : 'Could not start media stream');
            }
          })();
        }}
      />
    </div>
  );
}
