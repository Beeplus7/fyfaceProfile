import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  Check,
  X,
  Camera,
  Lightbulb,
  Mic,
  Hand,
  ShieldCheck,
  ChevronRight,
  MapPin,
  RotateCcw,
  Video,
  Eye,
  Lock,
  ArrowRight,
  HeartHandshake,
  Gift,
  Building2,
  Wallet,
  Coins,
  Sparkles,
} from 'lucide-react';
import logoM from '../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg';

type Trade = {
  id: string;
  name: string;
  short: string;
  work: string;
  places: string;
  emoji: string;
  grad: string;
  copy: string;
  scriptPidgin: string;
  scriptEnglish: string;
  duration: string;
};

const TRADES: Trade[] = [
  {
    id: 'tailor',
    name: 'Tailor',
    short: 'Tailor',
    work: 'Sewing Agbada / Ankara',
    places: 'Lagos + Oldham',
    emoji: '✂️',
    grad: 'linear-gradient(135deg,#8FFF4A,#00E5C0)',
    copy: 'Keep the needle, fabric and both hands in the centre. Show the cut, the stitch and the finished fold.',
    scriptPidgin: 'I dey fold am left to right, now I put am for shelf.',
    scriptEnglish: 'I am folding left to right, now I place it on the shelf.',
    duration: '0:60',
  },
  {
    id: 'mechanic',
    name: 'Mechanic',
    short: 'Mechanic',
    work: 'Fixing Tesla BMS / Engine',
    places: 'MOTRA',
    emoji: '🔧',
    grad: 'linear-gradient(135deg,#00E5C0,#1A7CFF)',
    copy: 'Show the tool touching the part. Name the part before you touch it. Keep the engine bay bright.',
    scriptPidgin: 'I dey check this wire now, make you see am well.',
    scriptEnglish: 'I am checking this wire now, so you can see it clearly.',
    duration: '0:60',
  },
  {
    id: 'chef',
    name: 'Chef',
    short: 'Chef',
    work: 'Cooking Jollof / Suya',
    places: 'Accra + Lagos',
    emoji: '🍲',
    grad: 'linear-gradient(135deg,#FFE600,#FF8A00)',
    copy: 'Hands over the pot. Steam is good, smoke is not. Say each ingredient as it goes in.',
    scriptPidgin: 'Now I put pepper, small salt, make e sweet.',
    scriptEnglish: 'Now I add pepper and a little salt, so it tastes right.',
    duration: '0:60',
  },
  {
    id: 'builder',
    name: 'Builder',
    short: 'Builder',
    work: 'Laying Bricks / Plastering',
    places: 'Nairobi',
    emoji: '🧱',
    grad: 'linear-gradient(135deg,#FF8A00,#FF4D6D)',
    copy: 'Trowel, brick and both hands stay in frame. Show the line, the mortar and the level check.',
    scriptPidgin: 'I dey lay am straight, check level now.',
    scriptEnglish: 'I am laying it straight, now I check the level.',
    duration: '0:60',
  },
  {
    id: 'braider',
    name: 'Hair Braider / Barber',
    short: 'Braider',
    work: 'Braiding / Fade',
    places: 'Lagos',
    emoji: '💈',
    grad: 'linear-gradient(135deg,#1A7CFF,#B24DFF)',
    copy: 'Show the parting, the hands and the tool. Slow down for the clean line. No face-only shots.',
    scriptPidgin: 'I dey part am clean, now I braid am down.',
    scriptEnglish: 'I am parting it cleanly, now I braid it down.',
    duration: '0:60',
  },
  {
    id: 'farmer',
    name: 'Farmer',
    short: 'Farmer',
    work: 'Cassava / Market Work',
    places: 'Ibadan',
    emoji: '🌾',
    grad: 'linear-gradient(135deg,#8FFF4A,#FFE600)',
    copy: 'Show the soil, the crop and the hands doing the work. Say what you harvested and what happens next.',
    scriptPidgin: 'I harvest cassava now, see how fresh e be.',
    scriptEnglish: 'I am harvesting cassava now, see how fresh it is.',
    duration: '0:60',
  },
];

const DO_LIST = [
  'Hands in view 100%',
  'Camera steady — chest mount',
  'Good light on hands + tool',
  'Say steps out loud in Yoruba / Pidgin / English',
  'Show Before / During / After',
];
const DONT_LIST = [
  'No face-only',
  'No shaky camera',
  'No dark room',
  'No back to camera',
  'No silent video',
  'No music over voice',
];
const CHECKLIST = [
  'Phone charged 80%+',
  'Light on hands',
  'Chest mount / stable',
  'Quiet room',
  'Say steps',
  'Before shot taken',
  'Consent toggle ON',
  'Face-blur chosen',
];

const STORAGE_KEY = 'myface-capture-guide-v1';

type GuideState = {
  checked: string[];
  faceBlur: boolean;
  handsOnly: boolean;
  allowSale: boolean;
  understood: Record<string, boolean>;
};

function loadGuide(): Partial<GuideState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<GuideState>;
  } catch {
    return {};
  }
}

function saveGuide(next: GuideState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota */
  }
}

export default function VideoToCashPage() {
  const saved = loadGuide();
  const [active, setActive] = useState('tailor');
  const [playing, setPlaying] = useState(false);
  const [understood, setUnderstood] = useState<Record<string, boolean>>(saved.understood || {});
  const [hands, setHands] = useState(96);
  const [light, setLight] = useState(94);
  const [audio, setAudio] = useState(92);
  const [checked, setChecked] = useState<string[]>(
    saved.checked || ['Phone charged 80%+', 'Light on hands', 'Chest mount / stable'],
  );
  const [faceBlur, setFaceBlur] = useState(saved.faceBlur ?? true);
  const [handsOnly, setHandsOnly] = useState(saved.handsOnly ?? true);
  const [allowSale, setAllowSale] = useState(saved.allowSale ?? false);
  const [saveNote, setSaveNote] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trade = TRADES.find((t) => t.id === active) || TRADES[0];
  const score = Math.min(96, Math.max(40, Math.round(40 + hands * 0.2 + light * 0.18 + audio * 0.18)));
  const progress = Math.round((checked.length / CHECKLIST.length) * 100);

  function queueSave(next: GuideState) {
    setSaveNote('Saving…');
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveGuide(next);
      setSaveNote('Saved ✓');
    }, 350);
  }

  function snapshot(over: Partial<GuideState>): GuideState {
    return {
      checked,
      faceBlur,
      handsOnly,
      allowSale,
      understood,
      ...over,
    };
  }

  function toggleCheck(item: string) {
    const next = checked.includes(item) ? checked.filter((x) => x !== item) : [...checked, item];
    setChecked(next);
    queueSave(snapshot({ checked: next }));
  }

  function toggleConsent(kind: 'face' | 'hands' | 'sale', val: boolean) {
    if (kind === 'face') setFaceBlur(val);
    if (kind === 'hands') setHandsOnly(val);
    if (kind === 'sale') setAllowSale(val);
    queueSave(
      snapshot({
        [kind === 'face' ? 'faceBlur' : kind === 'hands' ? 'handsOnly' : 'allowSale']: val,
      }),
    );
  }

  function markUnderstood() {
    const next = { ...understood, [trade.id]: true };
    setUnderstood(next);
    queueSave(snapshot({ understood: next }));
    setSaveNote('Saved ✓ — ready to film this trade.');
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const mistakes = [
    {
      title: 'Shaky',
      icon: '📱',
      fix: 'Use a chest mount or rest your phone. Test 10 seconds before you start.',
      tag: 'Camera',
    },
    {
      title: 'Dark',
      icon: '🌑',
      fix: 'Face a window or lamp. Light must fall on hands and tool, not behind you.',
      tag: 'Lighting',
    },
    {
      title: 'Face-only',
      icon: '🙂',
      fix: 'Tilt down 45°. Hands + tool in the centre. Face is optional.',
      tag: 'Framing',
    },
    {
      title: 'Silent',
      icon: '🔇',
      fix: 'Say every step out loud. No music over your voice.',
      tag: 'Audio',
    },
  ];

  return (
    <div
      data-safe-area-inset-root
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
      className="min-h-screen overflow-x-clip bg-[#FFFDF7] text-[#0A1931] selection:bg-[#FFC300]/35"
    >
      {/* Top rule banner */}
      <div className="bg-[#0A1931] text-white px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex gap-3 items-start sm:items-center">
          <span className="shrink-0 bg-[#FFC300] text-[#0A1931] font-mono2 text-[11px] font-bold px-2 py-1 rounded-md">
            IMPORTANT • OPTION 2 ONLY
          </span>
          <p className="text-[12px] sm:text-[13px] leading-relaxed text-white/90">
            <strong className="text-white">AI DEMO VIDEOS ON THIS PAGE ARE FOR TEACHING ONLY</strong> — They show HOW to
            film. They are <span className="text-[#FFC300] font-bold">NOT for sale.</span> Marketing + B2B Dataset Store
            use <strong className="text-white">ORIGINAL REAL VIDEOS ONLY</strong> from consent-cleared pros.
          </p>
        </div>
      </div>

      <header
        data-safe-area-sticky-top
        style={{ top: 'var(--safe-area-inset-top)' }}
        className="sticky z-40 bg-[#FFFDF7]/90 backdrop-blur border-b border-[#D4CBB8]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl overflow-hidden bg-[#0A1931] shrink-0 border border-[#D4CBB8]">
              <img src={logoM} alt="M" className="h-full w-full object-cover scale-[1.6]" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-extrabold leading-none text-[17px] sm:text-lg truncate text-[#0A1931]">
                Video → Cash <span className="rainbow-text">Capture Guide</span>
              </p>
              <p className="font-mono2 text-[10px] tracking-widest text-[#5B6470] mt-1">FILM LIKE THIS • EARN LIKE THIS</p>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-[13px] font-semibold">
            <span className="px-3 py-2 rounded-full bg-[#EFFAF6] border border-[#D4CBB8]">6 Trades</span>
            <span className="px-3 py-2 rounded-full bg-[#FFF8E1] border border-[#D4CBB8]">Dual pay</span>
            <span className="px-3 py-2 rounded-full bg-[#F0E9DB] border border-[#D4CBB8]">96% target</span>
          </div>
          <Link
            to="/signup"
            className="shrink-0 bg-[#FFC300] text-[#0A1931] px-4 py-2.5 rounded-full text-[13px] font-extrabold"
          >
            Go Live & Earn →
          </Link>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-7 sm:pt-10 pb-6">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-6 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#EFFAF6] border border-[#D4CBB8] rounded-full px-3 py-1.5 text-[12px] font-bold text-[#007A5C]">
                <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse" /> VIDEO → CASH • WATCH 60 SECONDS, EARN
                ON YOUR FIRST VIDEO
              </div>
              <h1
                className="font-display font-black leading-[0.96] mt-4 text-[#0A1931]"
                style={{ fontSize: 'clamp(38px,6vw,68px)' }}
              >
                Watch 60 Seconds.
                <br />
                Film It Right.
                <br />
                <span className="rainbow-text">Get Paid First Time.</span>
              </h1>
              <p className="mt-4 text-[16px] sm:text-lg text-[#5B6470] leading-relaxed max-w-xl">
                Don’t guess. Copy the demo. Hands in view. Tool visible. Say what you’re doing. That’s{' '}
                <strong className="text-[#0A1931]">96% Quality Score</strong> — then get paid twice: customers + dataset
                wallet.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href="#start" className="bg-[#0A1931] text-white px-5 py-3.5 rounded-full font-bold text-sm">
                  Got It — Go Live Now →
                </a>
                <a
                  href="#earn"
                  className="border-2 border-[#0A1931] bg-[#F0E9DB] px-5 py-3 rounded-full font-extrabold text-sm text-[#0A1931]"
                >
                  See One Video, Two Pays
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
                {[
                  ['6', 'Trades'],
                  ['60-sec', 'Demos'],
                  ['96%', 'Target Quality'],
                  ['2×', 'Pays per video'],
                ].map(([n, l]) => (
                  <div key={l} className="guide-card p-3">
                    <p className="font-display font-black text-xl text-[#0A1931]">{n}</p>
                    <p className="text-[12px] text-[#5B6470] leading-tight mt-1">{l}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="guide-card overflow-hidden">
              <div className="p-4 flex justify-between items-center gap-2">
                <span className="font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">
                  YOUR FIRST RECORDING • 4 STEPS
                </span>
                <span className="bg-[#FFC300] px-2 py-1 rounded text-[11px] font-bold text-[#0A1931] shrink-0">
                  AI DEMO • TEACHING ONLY
                </span>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {[
                  ['1', 'Watch Demo', 'Copy one trade below. 60 seconds is enough.'],
                  ['2', 'Copy Framing', 'Chest mount. Angle down 45°. Hands + tool centre.'],
                  ['3', 'Record 1hr', 'Say steps. Show Before / During / After.'],
                  ['4', 'Get Paid Twice', 'Customer escrow + dataset wallet after quality check.'],
                ].map(([n, t, d]) => (
                  <div key={t} className="flex gap-3 bg-[#FFFDF7] border border-[#D4CBB8] rounded-2xl p-3">
                    <span className="w-8 h-8 shrink-0 rounded-full rainbow grid place-items-center font-display font-black text-[#0A1931]">
                      {n}
                    </span>
                    <div>
                      <p className="font-bold text-sm text-[#0A1931]">{t}</p>
                      <p className="text-[13px] text-[#5B6470]">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rainbow h-2" />
            </div>
          </div>
        </section>

        {/* Merged from Home — One video, two pays */}
        <section id="earn" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-[#D4CBB8]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4CBB8] bg-[#F0E9DB] px-3.5 py-1.5 text-[11px] tracking-widest uppercase text-[#5B6470] font-bold">
            <Coins className="w-3.5 h-3.5 text-[#FFC300]" /> One video, two pays
          </div>
          <h2 className="mt-4 text-[28px] sm:text-[40px] font-extrabold tracking-tight leading-[1.02] text-[#0A1931] max-w-[720px]">
            We pay you for recording and going live while at work.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#5B6470] max-w-[640px]">
            No extra chores. Camera ON. Money COMING. Customers gift and book you — AI labs buy approved work video as
            training data. Film once with this guide; earn on both rails.
          </p>
          <div className="grid md:grid-cols-2 gap-5 mt-7">
            <div className="guide-card p-6 bg-[#E8DFCC]">
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-extrabold tracking-widest text-[#5B6470]">PAY 01 • CUSTOMERS</span>
                <Gift className="w-5 h-5 text-[#FFC300]" />
              </div>
              <h3 className="mt-3 text-[22px] font-extrabold text-[#0A1931]">Bookings, gifts & escrow</h3>
              <p className="mt-2 text-[14px] text-[#5B6470] leading-relaxed">
                Viewers gift MFC, book into escrow, and rebook high TrustScores on the same live.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] font-semibold text-[#0A1931]">
                {['MFC gift economy', 'Escrow-protected bookings', 'Boost when TrustScore rises'].map((t) => (
                  <li key={t} className="flex gap-2 items-center">
                    <Check className="w-4 h-4 text-[#00C896]" /> {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="guide-card p-6 bg-[#EFFAF6]">
              <div className="flex justify-between items-start">
                <span className="text-[12px] font-extrabold tracking-widest text-[#5B6470]">PAY 02 • AI LABS</span>
                <Building2 className="w-5 h-5 text-[#00C896]" />
              </div>
              <h3 className="mt-3 text-[22px] font-extrabold text-[#0A1931]">Dataset wallet · video-to-cash</h3>
              <p className="mt-2 text-[14px] text-[#5B6470] leading-relaxed">
                Anonymized, quality-checked work video sells as training data. You approve each sale. Withdraw from £5 /
                ₦5,000.
              </p>
              <ul className="mt-4 space-y-2 text-[13px] font-semibold text-[#0A1931]">
                {['Consent first — you choose what sells', 'Face-blur / hands-only', 'Transparent dataset split'].map(
                  (t) => (
                    <li key={t} className="flex gap-2 items-center">
                      <Check className="w-4 h-4 text-[#00C896]" /> {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            {[
              {
                n: '01',
                t: 'Go Live In WorkCut',
                d: 'Open Capture, tap Go Live. Steps called out. Hands in view checked.',
                i: Video,
              },
              {
                n: '02',
                t: 'Do What You Do Best',
                d: 'Sew, fix, cook, build. Customers watch, gift MFC, and book you.',
                i: Sparkles,
              },
              {
                n: '03',
                t: 'Get Paid Twice',
                d: 'Customer escrow + Dataset wallet. Withdraw from £5 / ₦5,000.',
                i: Wallet,
              },
            ].map((s) => (
              <div key={s.n} className="guide-card p-6 relative overflow-hidden">
                <span className="text-[64px] font-extrabold text-[#FFC300]/30 absolute right-3 top-1 leading-none">
                  {s.n}
                </span>
                <div className="w-11 h-11 rounded-2xl bg-[#0A1931] text-white grid place-items-center relative z-10">
                  <s.i size={20} />
                </div>
                <h3 className="text-xl font-extrabold mt-4 relative z-10 text-[#0A1931]">{s.t}</h3>
                <p className="mt-2 text-[13px] text-[#5B6470] relative z-10 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRADES */}
        <section id="trades" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-[#D4CBB8]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono2 text-[11px] font-bold tracking-widest text-[#1A7CFF]">CHOOSE YOUR TRADE</p>
              <h2 className="font-display font-black text-2xl sm:text-4xl mt-1 text-[#0A1931]">
                Copy the demo. Film like a pro.
              </h2>
            </div>
            <p className="text-sm text-[#5B6470] max-w-sm">
              Tap a trade. Watch the framing. Read what to copy. Then film your first hour.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 -mx-1 px-1" role="tablist" aria-label="Trades">
            {TRADES.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === t.id}
                onClick={() => {
                  setActive(t.id);
                  setPlaying(false);
                }}
                className={`shrink-0 px-4 py-3 rounded-full font-bold text-sm border-2 transition ${
                  active === t.id
                    ? 'bg-[#0A1931] text-white border-[#0A1931]'
                    : 'bg-[#F0E9DB] border-[#D4CBB8] text-[#0A1931]'
                }`}
              >
                {t.emoji} {t.short} {understood[t.id] ? '✓' : ''}
              </button>
            ))}
          </div>

          <div className="guide-card overflow-hidden">
            <div className="p-4 sm:p-6 grid lg:grid-cols-[1.25fr_.75fr] gap-6">
              <div>
                <div
                  className="relative rounded-[22px] overflow-hidden aspect-video text-white"
                  style={{ background: trade.grad }}
                >
                  <div className="absolute inset-0 bg-black/15" />
                  <div className="absolute top-3 left-3 right-3 flex justify-between gap-2">
                    <span className="bg-[#FFC300] text-[#0A1931] text-[11px] font-bold px-2.5 py-1.5 rounded-full">
                      AI DEMO — FOR TEACHING ONLY — NOT FOR SALE
                    </span>
                    <span className="bg-black/70 px-2 py-1.5 rounded-full text-[11px] font-mono2 text-white">
                      {trade.duration}
                    </span>
                  </div>
                  <div className="absolute inset-0 grid place-items-center text-center px-6">
                    {playing ? (
                      <div>
                        <div className="text-6xl mb-2">🎬</div>
                        <p className="font-display font-black text-xl sm:text-2xl">AI Demo Playing — Teaching Only</p>
                        <p className="text-sm opacity-90 mt-1">Watch the hands. Watch the tool. Listen to the steps.</p>
                      </div>
                    ) : (
                      <div>
                        <div className="text-6xl sm:text-7xl drop-shadow">{trade.emoji}</div>
                        <p className="font-display font-black text-2xl sm:text-3xl mt-2">
                          {trade.name} • {trade.work}
                        </p>
                        <p className="text-sm opacity-90">{trade.places}</p>
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlaying(!playing)}
                    aria-label={playing ? 'Pause demo' : 'Play demo'}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-[#0A1931] w-14 h-14 rounded-full grid place-items-center shadow-xl hover:scale-105 transition"
                  >
                    {playing ? <Pause /> : <Play className="ml-1" />}
                  </button>
                  <div className="absolute bottom-4 left-4 font-mono2 text-[11px] bg-black/55 px-2 py-1 rounded text-white">
                    HANDS + TOOL • CENTRE FRAME
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                  <div>
                    <h3 className="font-display font-extrabold text-xl text-[#0A1931]">
                      {trade.name} — {trade.work}
                    </h3>
                    <p className="text-sm text-[#5B6470] flex gap-2 items-center">
                      <MapPin size={14} />
                      {trade.places} • {trade.copy}
                    </p>
                  </div>
                  <span className="bg-[#EFFAF6] px-3 py-1.5 rounded-full text-xs font-bold text-[#007A5C]">
                    ✓ What to copy below
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-2xl border border-green-200 bg-green-50/60 p-4">
                    <p className="font-bold text-green-700 flex gap-2">
                      <Check /> DO — Copy this
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[#0A1931]">
                      {DO_LIST.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-green-600 font-bold">✓</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-red-200 bg-red-50/60 p-4">
                    <p className="font-bold text-red-600 flex gap-2">
                      <X /> DON’T — Skip this
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-[#0A1931]">
                      {DONT_LIST.map((x) => (
                        <li key={x} className="flex gap-2">
                          <span className="text-red-500 font-bold">✕</span>
                          {x}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-[#0A1931] text-white p-4 sm:p-5">
                  <p className="font-mono2 text-[11px] tracking-widest text-[#8FFF4A]">
                    VOICE SCRIPT EXAMPLE • SAY IT OUT LOUD
                  </p>
                  <p className="font-display font-bold text-lg mt-2">“{trade.scriptEnglish}”</p>
                  <p className="text-[#FFC300] mt-1 text-sm">Pidgin: “{trade.scriptPidgin}”</p>
                  <p className="text-xs text-white/70 mt-2">
                    Use Yoruba, Pidgin or English — your voice, your words. No music over voice.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-[#D4CBB8] bg-[#FFFDF7] p-4">
                  <p className="font-bold flex gap-2 text-[#0A1931]">
                    <Camera size={18} /> Framing Diagram
                  </p>
                  <div className="mt-3 bg-[#EFFAF6] rounded-2xl p-3 text-center">
                    <div className="mx-auto w-28 h-36 bg-[#F0E9DB] border-2 border-dashed border-[#D4CBB8] rounded-2xl relative">
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0A1931] text-white text-[10px] px-2 py-0.5 rounded-full">
                        PHONE • CHEST
                      </span>
                      <span className="absolute top-8 left-2 text-2xl">📱</span>
                      <span className="absolute bottom-2 right-2 text-2xl">✋</span>
                    </div>
                    <p className="font-display font-black text-lg mt-2 text-[#0A1931]">Angle down 45°</p>
                    <p className="text-[13px] text-[#5B6470]">
                      Hands + Tool in centre frame
                      <br />
                      Light behind camera
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-[#EFFAF6] border border-[#D4CBB8] p-4 text-center">
                  <p className="font-mono2 text-[11px] font-bold text-[#5B6470]">QUALITY SCORE PREVIEW</p>
                  <p className="font-display font-black text-5xl mt-1 text-[#0A1931]">96%</p>
                  <p className="text-sm mt-3 text-[#5B6470]">
                    This demo would score <strong className="text-[#0A1931]">96%</strong> — Copy it to score 96%.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={markUnderstood}
                  className="w-full bg-[#0A1931] text-white py-4 rounded-full font-bold flex items-center justify-center gap-2"
                >
                  {understood[trade.id] ? '✓ Understood — Ready to Film' : 'I Understand — Film This Trade'}{' '}
                  <ArrowRight size={18} />
                </button>
                {saveNote ? <p className="text-center text-xs text-[#5B6470]">{saveNote}</p> : null}
                <div className="rounded-2xl border border-[#D4CBB8] bg-[#F0E9DB] p-4">
                  <p className="font-bold text-sm text-[#0A1931]">Start this trade</p>
                  <p className="text-[13px] text-[#5B6470] mt-1">
                    Day 1: Watch guide → Film 1hr. Day 2: Quality check. Day 3: Get paid twice + sample pack.
                  </p>
                  <Link
                    to="/signup"
                    className="mt-3 inline-block bg-[#FFC300] text-[#0A1931] px-4 py-2.5 rounded-full text-sm font-extrabold"
                  >
                    Start My First Recording — {trade.name} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIMULATOR + CHECKLIST */}
        <section id="start" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-2 gap-5 border-t border-[#D4CBB8]">
          <div className="guide-card p-5 sm:p-6">
            <p className="font-mono2 text-[11px] font-bold tracking-widest text-[#FF8A00]">TRY IT • QUALITY SCORE SIMULATOR</p>
            <h3 className="font-display font-black text-2xl mt-1 text-[#0A1931]">Film like the demo, score like the demo.</h3>
            <div className="flex items-end gap-3 mt-4">
              <p className="font-display font-black text-6xl leading-none text-[#0A1931]">{score}%</p>
              <p className="text-sm text-[#5B6470] pb-1">
                {score >= 90 ? 'Excellent — ready to submit.' : score >= 70 ? 'Good — fix one thing.' : 'Keep improving — copy the demo.'}
              </p>
            </div>
            <div className="h-3 bg-[#E8DFCC] rounded-full overflow-hidden mt-3">
              <div className="h-full rainbow transition-all" style={{ width: `${score}%` }} />
            </div>
            <div className="space-y-5 mt-6">
              {(
                [
                  ['Hands in view', hands, setHands, Hand],
                  ['Lighting', light, setLight, Lightbulb],
                  ['Audio clear', audio, setAudio, Mic],
                ] as const
              ).map(([label, val, setFn, Icon]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm font-bold text-[#0A1931]">
                    <span className="flex gap-2">
                      <Icon size={17} />
                      {label}
                    </span>
                    <span>{val}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={val}
                    onChange={(e) => setFn(Number(e.target.value))}
                    aria-label={label}
                    className="w-full accent-[#1A7CFF]"
                  />
                </div>
              ))}
            </div>
            <p className="mt-4 bg-[#FFF8E1] border border-[#D4CBB8] rounded-2xl p-3 text-sm font-semibold text-[#0A1931]">
              If you film like the demo, you get 96%. Move the sliders to see how small fixes lift your score from 40% →
              96%.
            </p>
          </div>

          <div className="guide-card p-5 sm:p-6">
            <div className="flex justify-between gap-3">
              <div>
                <p className="font-mono2 text-[11px] font-bold tracking-widest text-[#00A66A]">FIRST RECORDING CHECKLIST</p>
                <h3 className="font-display font-black text-2xl mt-1 text-[#0A1931]">Ready? Check. Then go live.</h3>
              </div>
              <span className="bg-[#0A1931] text-white px-3 py-1.5 rounded-full text-sm font-bold h-fit">
                {checked.length}/8 ready
              </span>
            </div>
            <div className="h-3 bg-[#E8DFCC] rounded-full overflow-hidden mt-4">
              <div className="h-full bg-[#8FFF4A] transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 space-y-2">
              {CHECKLIST.map((item) => {
                const on = checked.includes(item);
                return (
                  <label
                    key={item}
                    className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer ${
                      on ? 'bg-[#EFFAF6] border-green-300' : 'bg-[#FFFDF7] border-[#D4CBB8]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggleCheck(item)}
                      className="w-5 h-5 accent-green-600"
                    />
                    <span className={`text-sm font-semibold text-[#0A1931] ${on ? 'line-through opacity-60' : ''}`}>
                      {item}
                    </span>
                    {on ? <Check className="ml-auto text-green-600" size={18} /> : null}
                  </label>
                );
              })}
            </div>
            <p className="text-xs text-[#5B6470] mt-3">
              {saveNote || 'Your checklist is saved on this device so you can pick up where you left off.'}
            </p>
          </div>
        </section>

        {/* MISTAKES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-[#D4CBB8]">
          <h3 className="font-display font-black text-2xl sm:text-3xl text-[#0A1931]">Common mistakes — quick fixes</h3>
          <p className="text-[#5B6470] text-sm mt-1">Everyone makes these at first. Fix one, and your score jumps.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {mistakes.map((m) => (
              <article key={m.title} className="guide-card p-5">
                <span className="text-4xl">{m.icon}</span>
                <p className="font-mono2 text-[10px] mt-3 text-[#5B6470]">{m.tag.toUpperCase()}</p>
                <h4 className="font-display font-extrabold text-lg text-[#0A1931]">{m.title}</h4>
                <p className="text-sm text-[#5B6470] mt-2">
                  <strong className="text-[#0A1931]">Fix:</strong> {m.fix}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('trades')?.scrollIntoView({ behavior: 'smooth' });
                    setPlaying(true);
                  }}
                  className="mt-4 text-sm font-bold text-[#1A7CFF] flex gap-1 items-center"
                >
                  <RotateCcw size={15} /> Watch demo again
                </button>
              </article>
            ))}
          </div>
        </section>

        {/* CONSENT */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-[#D4CBB8]">
          <div className="guide-card p-5 sm:p-7 grid lg:grid-cols-[1fr_.9fr] gap-6 bg-gradient-to-br from-[#F0E9DB] to-[#EFFAF6]">
            <div>
              <p className="font-mono2 text-[11px] font-bold tracking-widest text-[#1A7CFF]">YOUR CHOICE • CONSENT</p>
              <h3 className="font-display font-black text-2xl sm:text-3xl mt-1 text-[#0A1931]">
                You choose what to sell.
                <br />
                You can delete anytime.
              </h3>
              <p className="text-[#5B6470] mt-3">
                GDPR + NDPR. Your face, your hands, your work — your rules. Nothing is sold without your clear choice.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="bg-[#FFFDF7] border border-[#D4CBB8] px-3 py-1.5 rounded-full text-xs font-bold flex gap-1 text-[#0A1931]">
                  <ShieldCheck size={15} /> GDPR
                </span>
                <span className="bg-[#FFFDF7] border border-[#D4CBB8] px-3 py-1.5 rounded-full text-xs font-bold flex gap-1 text-[#0A1931]">
                  <ShieldCheck size={15} /> NDPR
                </span>
                <span className="bg-[#FFFDF7] border border-[#D4CBB8] px-3 py-1.5 rounded-full text-xs font-bold flex gap-1 text-[#0A1931]">
                  <Eye size={15} /> You control sale
                </span>
              </div>
            </div>
            <div className="space-y-3">
              {(
                [
                  ['Face-blur', 'Blur my face in the video.', faceBlur, () => toggleConsent('face', !faceBlur)],
                  ['Hands-only', 'Show hands + tool only.', handsOnly, () => toggleConsent('hands', !handsOnly)],
                  [
                    'Allow sale',
                    'I allow this video to be sold when it is original & quality-checked.',
                    allowSale,
                    () => toggleConsent('sale', !allowSale),
                  ],
                ] as const
              ).map(([label, desc, val, fn]) => (
                <div
                  key={label}
                  className="bg-[#FFFDF7] rounded-2xl border border-[#D4CBB8] p-4 flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-bold text-sm text-[#0A1931]">{label}</p>
                    <p className="text-[13px] text-[#5B6470]">{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={fn}
                    role="switch"
                    aria-checked={val}
                    aria-label={label}
                    className={`w-12 h-7 rounded-full p-1 shrink-0 transition ${val ? 'bg-green-500' : 'bg-slate-300'}`}
                  >
                    <span className={`block w-5 h-5 bg-white rounded-full transition ${val ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              ))}
              <p className="text-xs text-[#5B6470] flex gap-1 items-center">
                <Lock size={13} /> {saveNote || 'Consent choices are saved on this device.'}
              </p>
            </div>
          </div>
        </section>

        {/* OPTION 2 */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-[#D4CBB8]">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="font-display font-black text-2xl sm:text-4xl text-[#0A1931]">Why Option 2 Only?</h3>
            <p className="text-[#5B6470] mt-2">One clear rule. No confusion. No AI video is ever sold.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="guide-card p-6 border-2 border-[#FFC300]">
              <span className="bg-[#FFC300] px-3 py-1 rounded-full text-xs font-bold text-[#0A1931]">
                GUIDE PAGE • THIS PAGE
              </span>
              <h4 className="font-display font-extrabold text-xl mt-3 text-[#0A1931]">AI Demo — For Teaching</h4>
              <p className="text-sm text-[#5B6470] mt-2">
                ✅ Allowed. Shows how to film. Teaches framing, light, voice and steps.
              </p>
              <ul className="mt-3 space-y-1 text-sm font-semibold text-[#0A1931]">
                <li>✓ Teaching only</li>
                <li>✓ Not for sale</li>
                <li>✓ Clearly labelled</li>
              </ul>
            </div>
            <div className="guide-card p-6 border-2 border-[#00C896]">
              <span className="bg-[#00C896] px-3 py-1 rounded-full text-xs font-bold text-white">
                MARKETING / DATASET STORE
              </span>
              <h4 className="font-display font-extrabold text-xl mt-3 text-[#0A1931]">Original Real Videos Only</h4>
              <p className="text-sm text-[#5B6470] mt-2">
                When 100 test pros upload. ✅ Real, consent-cleared, quality-checked.
              </p>
              <ul className="mt-3 space-y-1 text-sm font-semibold text-[#0A1931]">
                <li>✓ Real pros, real work</li>
                <li>✓ Consent cleared</li>
                <li>✓ Quality checked</li>
              </ul>
            </div>
          </div>
          <p className="text-center font-bold mt-4 bg-[#0A1931] text-white rounded-full py-3 px-4 text-sm">
            No AI video ever sold to labs. Ever.
          </p>
        </section>

        {/* ONBOARDING */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-12 border-t border-[#D4CBB8]">
          <div className="guide-card p-5 sm:p-7">
            <div className="flex flex-wrap justify-between gap-3 items-end">
              <div>
                <p className="font-mono2 text-[11px] font-bold tracking-widest text-[#5B6470]">
                  FOR 100 TEST PROS • ONBOARDING
                </p>
                <h3 className="font-display font-black text-2xl sm:text-3xl mt-1 text-[#0A1931]">
                  Day 1 → Day 3: Watch. Film. Get paid twice.
                </h3>
              </div>
              <a href="#trades" className="bg-[#0A1931] text-white px-4 py-2.5 rounded-full text-sm font-bold">
                Choose my trade →
              </a>
            </div>
            <div className="grid sm:grid-cols-4 gap-3 mt-6">
              {[
                ['DAY 1', 'Watch Guide', 'Watch your trade demo. Copy framing + script.'],
                ['DAY 1', 'Film 1hr', 'Record one hour. Hands, tool, voice, light.'],
                ['DAY 2', 'Quality Check', 'We check hands, audio, light and steps.'],
                ['DAY 3', 'Get Paid Twice', 'Customer escrow + dataset wallet when you pass.'],
              ].map(([d, t, txt]) => (
                <div key={t} className="bg-[#FFFDF7] border border-[#D4CBB8] rounded-2xl p-4">
                  <span className="font-mono2 text-[11px] font-bold text-[#1A7CFF]">{d}</span>
                  <p className="font-bold mt-1 text-[#0A1931]">{t}</p>
                  <p className="text-[13px] text-[#5B6470] mt-1">{txt}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 bg-[#FFC300] text-[#0A1931] px-5 py-3 rounded-full font-extrabold text-sm"
              >
                <Video size={16} /> Go Live & Earn Now
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 border-2 border-[#0A1931] bg-[#F0E9DB] text-[#0A1931] px-5 py-3 rounded-full font-extrabold text-sm"
              >
                <Building2 size={16} /> B2B Dataset Store
              </Link>
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-[#5B6470] hover:text-[#0A1931]">
                <HeartHandshake size={16} /> Back to Home <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#0A1931] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid sm:grid-cols-3 gap-6">
          <div>
            <p className="font-display font-black text-xl">
              MyFaceProfile <span className="rainbow-text">• AiKOVA</span>
            </p>
            <p className="text-white/70 text-sm mt-2">Your Work Is Your Face. Not Your CV.</p>
            <p className="text-sm mt-3 text-white/80">
              Oldham OL1 • Lagos • Nairobi
            </p>
          </div>
          <div>
            <p className="font-bold text-sm">Original videos only for dataset sales</p>
            <p className="text-white/70 text-sm mt-2">AI demos teach. Real pros earn. That is Option 2.</p>
            <p className="text-sm mt-3 flex gap-1 items-center text-[#FFC300]">
              <HeartHandshake size={16} /> Africa Pay-You-Live
            </p>
          </div>
          <div>
            <p className="font-bold text-sm">Go further</p>
            <Link to="/pricing" className="block text-[#8FFF4A] text-sm mt-2 font-bold">
              Pricing & Dataset Store →
            </Link>
            <a href="#earn" className="block text-[#FFC300] text-sm mt-1 font-bold">
              One Video, Two Pays →
            </a>
            <p className="text-white/50 text-xs mt-4">© MyFaceProfile • AiKOVA • Video → Cash Capture Guide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
