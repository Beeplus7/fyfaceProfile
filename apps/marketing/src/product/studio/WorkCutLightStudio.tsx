import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from 'react';
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
import { getLiveRecording } from '../live/liveRecordings';
import { readLiveClip } from '../live/liveRecordingMedia';
import { ensureStandInClip } from '../live/makeStandInClip';
import { MusicDrawer, type Music, type MusicSource } from '../music/MusicDrawer';
import YoutubeEmbed from '../music/YoutubeEmbed';
import { loadProfile } from '../onboarding/storage';
import {
  IconCollapse,
  IconCommand,
  IconExpand,
  IconHome,
  IconLive,
  IconMusic,
  IconPlay,
  IconScissors,
  IconSettings,
  IconShare,
} from '../ui/icons';

const WORKCUT_MUSIC_KEY = 'myface.workcut.music';

type ToolId = 'media' | 'templates' | 'text' | 'audio' | 'effects' | 'export' | 'settings';
type IconCmp = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const TOOLS: { id: ToolId; label: string; Icon: IconCmp }[] = [
  { id: 'media', label: 'Media', Icon: IconCommand },
  { id: 'templates', label: 'Templates', Icon: IconScissors },
  { id: 'text', label: 'Captions', Icon: IconShare },
  { id: 'audio', label: 'Audio', Icon: IconMusic },
  { id: 'effects', label: 'Effects', Icon: IconPlay },
  { id: 'export', label: 'Export', Icon: IconLive },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

const TEMPLATES = [
  { id: 'before-after', label: 'Before / After', blurb: 'Split reveal · OL1 lace', dur: '15s' },
  { id: 'timelapse', label: 'Timelapse', blurb: 'Stitch → finish', dur: '30s' },
  { id: 'milestone', label: 'Milestone', blurb: 'Cutting · Sewing · Fitting', dur: '20s' },
  { id: 'price-reveal', label: 'Price Reveal', blurb: '£320 Aso-Ebi', dur: '12s' },
] as const;

const CLIPS = [
  { id: 'c1', label: 'Before fabric', hue: 'from-[#93C5FD] to-[#60A5FA]', len: 4 },
  { id: 'c2', label: 'Cutting table', hue: 'from-[#A5B4FC] to-[#818CF8]', len: 6 },
  { id: 'c3', label: 'Sewing pass', hue: 'from-[#C4B5FD] to-[#A78BFA]', len: 8 },
  { id: 'c4', label: 'Final dress', hue: 'from-[#2F6BFF] to-[#1D4ED8]', len: 5 },
];

const MEDIA = [
  { id: 'm1', label: 'Lace stack', tag: 'Before' },
  { id: 'm2', label: 'Hem detail', tag: 'Clip' },
  { id: 'm3', label: 'Client try-on', tag: 'After' },
  { id: 'm4', label: 'Shop front OL1', tag: 'B-roll' },
  { id: 'm5', label: 'Gift moment', tag: 'MFC' },
  { id: 'm6', label: 'Live replay', tag: 'Live' },
];

const EFFECTS = ['Auto captions EN/YO/HA', 'Blur trust badge', 'Sticker · Material', 'Sticker · Cost', 'Sticker · Duration', 'BG remove stub'];

export default function WorkCutLightStudio() {
  const [params] = useSearchParams();
  const profile = loadProfile();
  const shop = profile?.shopName || "AYO'S TAILORS";
  const [collapsed, setCollapsed] = useState(false);
  const [tool, setTool] = useState<ToolId>('media');
  const [template, setTemplate] = useState<(typeof TEMPLATES)[number]['id']>('before-after');
  const [playing, setPlaying] = useState(false);
  const [selectedClip, setSelectedClip] = useState('c1');
  const [captionLang, setCaptionLang] = useState<'EN' | 'YO' | 'HA'>('EN');
  const [exported, setExported] = useState<string | null>(null);
  const [musicOpen, setMusicOpen] = useState(false);
  const [musicTab, setMusicTab] = useState<MusicSource>('Jamendo');
  const [musicQuery, setMusicQuery] = useState('');
  const [musicSelected, setMusicSelected] = useState<Music | null>(null);
  const [bgm, setBgm] = useState<Music | null>(null);
  const [importRecId, setImportRecId] = useState<string | null>(null);
  const [importTitle, setImportTitle] = useState<string | null>(null);
  const [importUrl, setImportUrl] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WORKCUT_MUSIC_KEY);
      if (raw) setBgm(JSON.parse(raw) as Music);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    const vids = document.querySelectorAll<HTMLVideoElement>('video[data-workcut-import="1"]');
    vids.forEach((v) => {
      if (playing) void v.play().catch(() => undefined);
      else v.pause();
    });
  }, [playing, importUrl]);

  // Import live recording clip into CapCut-style preview/timeline
  useEffect(() => {
    let revoked: string | null = null;
    let cancelled = false;
    const recId = params.get('rec') || (() => {
      try {
        return sessionStorage.getItem('myface.workcut.importRec');
      } catch {
        return null;
      }
    })();
    if (!recId) return;

    void (async () => {
      const meta = getLiveRecording(recId);
      setImportRecId(recId);
      setImportTitle(meta?.title || 'Live recording');
      setTool('media');
      setSelectedClip('live');
      try {
        let blob = await readLiveClip(recId);
        if (!blob && meta) blob = await ensureStandInClip(meta);
        if (!blob) throw new Error('No clip');
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        revoked = url;
        setImportUrl(url);
        setImportError(null);
        setPlaying(true);
        try {
          sessionStorage.removeItem('myface.workcut.importRec');
        } catch {
          /* ignore */
        }
      } catch {
        if (!cancelled) setImportError('Could not load live clip into WorkCut.');
      }
    })();

    return () => {
      cancelled = true;
      if (revoked) URL.revokeObjectURL(revoked);
    };
  }, [params]);

  const activeTemplate = TEMPLATES.find((t) => t.id === template) || TEMPLATES[0];
  const totalLen = useMemo(() => {
    const base = CLIPS.reduce((s, c) => s + c.len, 0);
    return importUrl ? base + 8 : base;
  }, [importUrl]);

  const PreviewBody = (
    <>
      {importUrl ? (
        <video
          key={importUrl}
          data-workcut-import="1"
          src={importUrl}
          className="absolute inset-0 h-full w-full object-cover bg-black"
          playsInline
          muted
          autoPlay
          loop
          controls={false}
          onClick={() => setPlaying((p) => !p)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2F6BFF] text-white grid place-items-center mb-2 md:mb-4 shadow-md shadow-[#2F6BFF]/25">
            <IconScissors size={26} />
          </div>
          <div className="text-[12px] md:text-[14px] font-semibold text-[#0F172A]">
            {CLIPS.find((c) => c.id === selectedClip)?.label || 'Clip'}
          </div>
          <div className="text-[10px] md:text-[11px] text-[#64748B] mt-0.5">{activeTemplate.blurb}</div>
          <div className="mt-2 md:mt-4 text-[10px] md:text-[11px] font-medium text-[#2F6BFF]">
            {playing ? 'Playing…' : 'Paused'} · {captionLang}
          </div>
        </div>
      )}
      {importUrl ? (
        <div className="absolute top-2 left-2 right-2 flex gap-1.5 z-[2]">
          <span className="rounded-full bg-black/55 text-white px-2.5 py-1 text-[10px] font-bold">
            LIVE IMPORT
          </span>
          <span className="rounded-full bg-white/90 text-[#0F172A] px-2.5 py-1 text-[10px] font-semibold truncate max-w-[70%]">
            {importTitle}
          </span>
        </div>
      ) : null}
      {importError ? (
        <div className="absolute bottom-14 inset-x-2 rounded-xl bg-red-500/90 text-white text-[11px] px-3 py-2 z-[2]">
          {importError}
        </div>
      ) : null}
    </>
  );

  const saveWorkcutMusic = () => {
    if (!musicSelected) return;
    setBgm(musicSelected);
    setMusicOpen(false);
    try {
      localStorage.setItem(WORKCUT_MUSIC_KEY, JSON.stringify(musicSelected));
    } catch {
      /* ignore */
    }
  };

  const Panel = (
    <div className="space-y-3">
      {tool === 'media' ? (
        <>
          <div className={L_EYE}>Library · Oldham WorkCuts</div>
          {importRecId ? (
            <div className={L_CARD_IN + ' p-3 border-[#2F6BFF]/40 bg-[#EEF3FF]'}>
              <div className="text-[12px] font-semibold text-[#0F172A]">Imported live clip</div>
              <div className="text-[11px] text-[#64748B] mt-0.5 truncate">{importTitle || importRecId}</div>
              {importUrl ? (
                <div className="mt-2 text-[11px] font-semibold text-[#2F6BFF]">On timeline · play in preview</div>
              ) : (
                <div className="mt-2 text-[11px] text-[#94A3B8]">Loading clip…</div>
              )}
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-2">
            {MEDIA.map((m) => (
              <button
                key={m.id}
                type="button"
                className={`${L_CARD_IN} p-2 text-left hover:border-[#2F6BFF]/40 transition`}
              >
                <div className="aspect-[4/5] rounded-lg bg-gradient-to-br from-[#E8EEF8] to-[#D6E0F2] mb-2" />
                <div className="text-[11px] font-semibold text-[#0F172A] truncate">{m.label}</div>
                <div className="text-[10px] text-[#94A3B8]">{m.tag}</div>
              </button>
            ))}
          </div>
          <button type="button" className={L_BTN_GHOST + ' w-full'}>
            + Import media
          </button>
        </>
      ) : null}

      {tool === 'templates' ? (
        <>
          <div className={L_EYE}>CapCut templates · Cutty</div>
          <div className="space-y-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id)}
                className={`w-full text-left rounded-xl border px-3 py-3 transition ${
                  template === t.id
                    ? 'border-[#2F6BFF] bg-[#EEF3FF] shadow-sm'
                    : 'border-[#E7EBF0] bg-white hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[13px] font-semibold text-[#0F172A]">{t.label}</div>
                  <span className={L_PILL}>{t.dur}</span>
                </div>
                <div className="text-[11px] text-[#64748B] mt-1">{t.blurb}</div>
              </button>
            ))}
          </div>
        </>
      ) : null}

      {tool === 'text' ? (
        <>
          <div className={L_EYE}>Auto captions</div>
          <div className="flex gap-2">
            {(['EN', 'YO', 'HA'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setCaptionLang(lang)}
                className={
                  captionLang === lang
                    ? 'h-9 px-3 rounded-xl bg-[#2F6BFF] text-white text-[12px] font-semibold'
                    : L_BTN_GHOST
                }
              >
                {lang}
              </button>
            ))}
          </div>
          <div className={L_CARD_IN + ' p-3 text-[12px] text-[#475569] leading-relaxed'}>
            “Aso-Ebi wedding dress · Spindlegate OL1 · £320 · Fitting next.” Auto-burn captions in{' '}
            <b>{captionLang}</b> on export.
          </div>
        </>
      ) : null}

      {tool === 'audio' ? (
        <>
          <div className={L_EYE}>BGM · Jamendo</div>
          {bgm ? (
            <div className={L_CARD_IN + ' p-3 space-y-2'}>
              <div className="text-[13px] font-semibold text-[#0F172A] truncate">{bgm.title}</div>
              <div className="text-[11px] text-[#64748B]">
                {bgm.artist} · {bgm.source}
              </div>
              {bgm.youtubeId ? (
                <YoutubeEmbed youtubeId={bgm.youtubeId} title={bgm.title} autoplay />
              ) : bgm.objectUrl ? (
                <audio src={bgm.objectUrl} controls loop className="w-full" />
              ) : null}
            </div>
          ) : (
            <div className={L_CARD_IN + ' p-3 text-[12px] text-[#64748B]'}>No soundtrack yet.</div>
          )}
          <button type="button" className={L_BTN + ' w-full'} onClick={() => setMusicOpen(true)}>
            Open music drawer
          </button>
        </>
      ) : null}

      {tool === 'effects' ? (
        <>
          <div className={L_EYE}>Auto-tools</div>
          <div className="flex flex-wrap gap-2">
            {EFFECTS.map((e) => (
              <button key={e} type="button" className={L_PILL + ' hover:bg-[#E2E8F0]'}>
                {e}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {tool === 'export' ? (
        <>
          <div className={L_EYE}>Export · 1080×1920</div>
          <div className={L_CARD_IN + ' p-3 space-y-2 text-[12px] text-[#475569]'}>
            <div className="flex justify-between">
              <span>Template</span>
              <b className="text-[#0F172A]">{activeTemplate.label}</b>
            </div>
            <div className="flex justify-between">
              <span>Duration</span>
              <b className="text-[#0F172A]">{totalLen}s</b>
            </div>
            <div className="flex justify-between">
              <span>Captions</span>
              <b className="text-[#0F172A]">{captionLang}</b>
            </div>
          </div>
          <button
            type="button"
            className={L_BTN + ' w-full'}
            onClick={() => setExported(`${activeTemplate.label} · ${totalLen}s · ${captionLang}`)}
          >
            Export to Work Feed
          </button>
          <Link to="/app/feed" className={L_BTN_GHOST + ' w-full'}>
            Open Timeline Feed
          </Link>
          {exported ? (
            <div className="rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-2 text-[11px] text-[#047857]">
              Queued · {exported}
            </div>
          ) : null}
        </>
      ) : null}

      {tool === 'settings' ? (
        <>
          <div className={L_EYE}>Studio</div>
          <div className={L_CARD_IN + ' p-3 text-[12px] text-[#475569] space-y-2'}>
            <div>Aspect · 9:16 vertical</div>
            <div>Codec stub · FFmpeg path in workcut.ts</div>
            <div>Shop · {shop}</div>
          </div>
          <a href="/studio/workcut-studio.html" target="_blank" rel="noreferrer" className={L_BTN_GHOST + ' w-full'}>
            Open classic CapCut HTML
          </a>
        </>
      ) : null}
    </div>
  );

  const doExport = () => {
    setTool('export');
    setExported(`${activeTemplate.label} · ${totalLen}s · ${captionLang}`);
  };

  return (
    <div className={L_PAGE + ' flex flex-col h-dvh overflow-hidden'}>
      {/* Compact CapCut-style top bar — scrolls on narrow phones */}
      <header className="shrink-0 border-b border-[#E7EBF0] bg-white/95 backdrop-blur-xl">
        <div className="h-12 md:h-14 px-2 md:px-5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <Link to="/app/dashboard" className={L_BTN_GHOST + ' shrink-0 !px-2.5'}>
            ←
          </Link>
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-xl bg-[#2F6BFF] grid place-items-center text-[10px] font-bold text-white shrink-0">
            WC
          </div>
          <div className="min-w-0 leading-tight shrink hidden xs:block sm:block">
            <div className="text-[12px] md:text-[13px] font-semibold truncate text-[#0F172A] max-w-[28vw] md:max-w-none">
              WorkCut
            </div>
            <div className="text-[10px] text-[#94A3B8] truncate hidden md:block">CapCut · {shop}</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5 md:gap-2 shrink-0">
            <button
              type="button"
              className={L_BTN_QUIET + ' hidden md:inline-flex'}
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? <IconExpand size={14} /> : <IconCollapse size={14} />}
            </button>
            <button
              type="button"
              className={L_BTN_GHOST + ' !h-9 !w-9 !px-0 shrink-0'}
              onClick={() => {
                setTool('audio');
                setMusicOpen(true);
              }}
              aria-label="Music"
            >
              <IconMusic size={14} />
            </button>
            <Link to="/app/studio/stream" className={L_BTN_GHOST + ' !text-[11px] !px-2.5 shrink-0'}>
              Live
            </Link>
            <Link to="/app/feed" className={L_BTN_GHOST + ' !text-[11px] !px-2.5 shrink-0'}>
              Feed
            </Link>
            <button type="button" className={L_BTN + ' !text-[11px] !px-3 shrink-0'} onClick={doExport}>
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 max-w-[1600px] mx-auto w-full">
        <aside
          className={`hidden md:flex flex-col shrink-0 border-r border-[#E7EBF0] bg-[#F7F8FA] overflow-hidden transition-[width] duration-200 ease-out ${
            collapsed ? 'w-[72px]' : 'w-[248px]'
          }`}
        >
          <div className={`flex flex-col h-full ${collapsed ? 'px-2' : 'px-3'} py-3 gap-3`}>
            <div className="flex items-center justify-between px-1">
              {!collapsed ? (
                <div className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Tools</div>
              ) : (
                <span className="sr-only">Tools</span>
              )}
              <button type="button" className={L_RAIL_IDLE} onClick={() => setCollapsed((c) => !c)}>
                {collapsed ? <IconExpand size={16} /> : <IconCollapse size={16} />}
              </button>
            </div>
            <nav className="space-y-1">
              {TOOLS.map((item) => {
                const active = tool === item.id;
                const Icon = item.Icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setTool(item.id);
                      if (item.id === 'audio') setMusicOpen(true);
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
            <div className="mt-auto">
              <Link
                to="/app/dashboard"
                className={collapsed ? L_RAIL_IDLE + ' w-full' : 'w-full flex items-center gap-3 rounded-xl px-2.5 h-10 text-[#64748B] hover:bg-[#EEF2F7]'}
              >
                <IconHome size={18} />
                {!collapsed ? <span className="text-[13px] font-medium">Dashboard</span> : null}
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile CapCut column: preview → timeline → tools dock */}
        <main className="flex-1 min-w-0 flex flex-col md:block md:p-5 md:overflow-auto">
          {/* Mobile preview — capped height so tools stay reachable */}
          <section className="md:hidden shrink-0 px-3 pt-2 pb-2 bg-[#F7F8FA] border-b border-[#E7EBF0]">
            <div className="flex items-center justify-between mb-2">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Preview · 9:16
                </div>
                <div className="text-[13px] font-semibold text-[#0F172A] truncate">{activeTemplate.label}</div>
              </div>
              <span className={L_PILL}>{totalLen}s</span>
            </div>
            <div className="mx-auto w-full max-w-[220px] max-h-[42svh] aspect-[9/16] rounded-2xl overflow-hidden border border-[#E7EBF0] bg-gradient-to-b from-[#EEF3FF] via-white to-[#F8FAFC] relative shadow-sm">
              {PreviewBody}
              <div className="absolute bottom-2 inset-x-2 z-[3]">
                <button type="button" className={L_BTN + ' w-full !h-9 !text-[12px]'} onClick={() => setPlaying((p) => !p)}>
                  {playing ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>
          </section>

          {/* Mobile timeline strip */}
          <section className="md:hidden shrink-0 px-3 py-2 border-b border-[#E7EBF0] bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12px] font-semibold text-[#0F172A]">Timeline</div>
              <button type="button" className="text-[11px] font-semibold text-[#2F6BFF]" onClick={() => setTool('media')}>
                + Clip
              </button>
            </div>
            <div className="overflow-x-auto scrollbar-none -mx-1 px-1">
              <div className="flex gap-2 w-max pb-1">
                {importUrl ? (
                  <button
                    type="button"
                    onClick={() => setSelectedClip('live')}
                    className={`w-[96px] h-14 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white text-left px-2 py-1.5 shadow-sm border-2 ${
                      selectedClip === 'live' ? 'border-[#0F172A]' : 'border-transparent'
                    }`}
                  >
                    <div className="text-[9px] font-bold truncate">Live import</div>
                    <div className="text-[9px] opacity-80 mt-0.5">8s+</div>
                  </button>
                ) : null}
                {CLIPS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedClip(c.id)}
                    className={`w-[76px] h-14 rounded-xl bg-gradient-to-br ${c.hue} text-white text-left px-2 py-1.5 shadow-sm border-2 ${
                      selectedClip === c.id ? 'border-[#0F172A]' : 'border-transparent'
                    }`}
                  >
                    <div className="text-[9px] font-bold truncate">{c.label}</div>
                    <div className="text-[9px] opacity-80 mt-0.5">{c.len}s</div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile tool sheet (scrollable) */}
          <section className="md:hidden flex-1 min-h-0 overflow-y-auto px-3 pt-3 pb-[calc(72px+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[13px] font-semibold text-[#0F172A]">
                {TOOLS.find((t) => t.id === tool)?.label}
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  className={tool === 'media' ? L_BTN + ' !h-8 !text-[10px] !px-2.5' : L_BTN_QUIET + ' !h-8 !text-[10px] !px-2.5'}
                  onClick={() => setTool('media')}
                >
                  Media
                </button>
                <button
                  type="button"
                  className={tool === 'templates' ? L_BTN + ' !h-8 !text-[10px] !px-2.5' : L_BTN_QUIET + ' !h-8 !text-[10px] !px-2.5'}
                  onClick={() => setTool('templates')}
                >
                  Templates
                </button>
              </div>
            </div>
            <div className={L_CARD + ' p-3'}>{Panel}</div>
          </section>

          {/* Mobile CapCut bottom dock */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#E7EBF0] bg-white/95 backdrop-blur-xl px-1 pt-1.5 pb-[max(6px,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around">
              {TOOLS.filter((t) => t.id !== 'settings').map((t) => {
                const Icon = t.Icon;
                const active = tool === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => {
                      if (t.id === 'audio') {
                        setTool('audio');
                        setMusicOpen(true);
                        return;
                      }
                      if (t.id === 'export') {
                        doExport();
                        return;
                      }
                      setTool(t.id);
                    }}
                    className="flex flex-col items-center gap-0.5 min-w-[48px] py-1"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        active ? 'bg-[#2F6BFF] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                      }`}
                    >
                      <Icon size={15} />
                    </div>
                    <span className={`text-[9px] font-semibold ${active ? 'text-[#2F6BFF]' : 'text-[#94A3B8]'}`}>
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Desktop layout unchanged */}
          <div className="hidden md:grid lg:grid-cols-12 gap-4 items-start">
            <section className={L_CARD + ' lg:col-span-5 p-4'}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className={L_EYE}>Preview · 9:16</div>
                  <div className="text-[15px] font-semibold text-[#0F172A] mt-0.5">{activeTemplate.label}</div>
                </div>
                <span className={L_PILL}>{totalLen}s</span>
              </div>
              <div className="mx-auto w-full max-w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border border-[#E7EBF0] bg-gradient-to-b from-[#EEF3FF] via-white to-[#F8FAFC] relative shadow-inner">
                <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#2F6BFF]/15 to-transparent pointer-events-none z-[1]" />
                {PreviewBody}
                <div className="absolute bottom-3 inset-x-3 flex gap-2 z-[3]">
                  <button type="button" className={L_BTN + ' flex-1'} onClick={() => setPlaying((p) => !p)}>
                    {playing ? 'Pause' : 'Play'}
                  </button>
                </div>
              </div>
            </section>

            <section className="lg:col-span-7 space-y-4">
              <div className={L_CARD + ' p-4'}>
                <div className="text-[14px] font-semibold text-[#0F172A] mb-3">
                  {TOOLS.find((t) => t.id === tool)?.label}
                </div>
                {Panel}
              </div>

              <div className={L_CARD + ' p-4'}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className={L_EYE}>Timeline</div>
                    <div className="text-[14px] font-semibold text-[#0F172A]">Clip track · CapCut style</div>
                  </div>
                  <button type="button" className={L_BTN_GHOST} onClick={() => setTool('media')}>
                    + Clip
                  </button>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] border border-[#E7EBF0] p-3 overflow-x-auto">
                  <div className="flex gap-2 min-w-[520px]">
                    {CLIPS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedClip(c.id)}
                        style={{ flex: c.len }}
                        className={`min-w-[88px] h-16 rounded-xl bg-gradient-to-br ${c.hue} text-white text-left px-2.5 py-2 shadow-sm border-2 transition ${
                          selectedClip === c.id ? 'border-[#0F172A]' : 'border-transparent'
                        }`}
                      >
                        <div className="text-[10px] font-bold truncate">{c.label}</div>
                        <div className="text-[10px] opacity-80 mt-1">{c.len}s</div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-[#E2E8F0] relative">
                    <div className="absolute left-[28%] top-1/2 -translate-y-1/2 w-0.5 h-4 bg-[#2F6BFF] rounded-full" />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { k: 'Template', v: activeTemplate.label },
                  { k: 'Gifts on cut', v: '12' },
                  { k: 'Export', v: '1080×1920' },
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
        activeTab={musicTab}
        onTabChange={setMusicTab}
        searchQuery={musicQuery}
        onSearchChange={setMusicQuery}
        selected={musicSelected}
        onSelect={setMusicSelected}
        onSave={saveWorkcutMusic}
        contextLabel="workcut studio"
        allowUpload
      />
    </div>
  );
}
