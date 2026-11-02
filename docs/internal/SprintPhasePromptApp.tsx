import React, { useEffect, useState, useMemo, useRef } from 'react';

type CheckRecord = {
  id: string;
  value: { kind: 'check' | 'note'; key?: string; checked?: boolean; text?: string; at?: string };
};

const SHIPPED = [
  "Turbo monorepo: pnpm-workspace.yaml, turbo.json, packages/{ui,types,config}, apps/web",
  "Supabase: supabase/schema.sql (12+ tables, RLS) + seed_oldham.sql + functions/onboarding-chat",
  "Split UPRM: 12 components BotArmy PipelineKanban ProjectCard GiftRain MFCWallet TrustScoreBadge LiveWorkshop ShopCard BookingCalendar WorkCutEditor UPRMContactsList QuantumBackground",
  "Live dashboard: /app/dashboard → UprmCommandCenter (composed splits)",
  "Next PID 1: apps/web/app/(dashboard)/uprm/page.tsx (:3001)",
  "Onboarding memory/conversation services wired into flow",
  "Stripe escrow stub apps/web/lib/stripe.ts",
  "Sprint2 WorkCut: apps/web/lib/workcut.ts + templates Before/After Timelapse Milestone Price Reveal",
  "Sprint2 Live: apps/web/lib/live.ts + Go Live gift rain record→project",
  "Sprint2 Feed: apps/web/app/(feed)/page.tsx + feed.ts + search.ts Findy 10mi",
  "Checklist + ZIP: OLDHAM_TEST_CHECKLIST.md Downloads/my-face-profile-sprint1.zip",
];

const CIRCLES = [
  { label: "Full Overall", pct: 70, note: "Sprint1 foundation", color: "#1A7CFF" },
  { label: "Marketing", pct: 92, note: "~120 files target", color: "#8FFF4A" },
  { label: "apps/web", pct: 78, note: "PID1 split comps", color: "#00E5C0" },
  { label: "Onboarding", pct: 72, note: "VisaguideOS port", color: "#FFE600" },
  { label: "Supabase", pct: 70, note: "schema.sql ready", color: "#1A7CFF" },
  { label: "Packages", pct: 18, note: "ui types tests", color: "#FF8A00" },
  { label: "Turbo root", pct: 80, note: "workspace live", color: "#8FFF4A" },
  { label: "Bots runtime", pct: 40, note: "UI ≠ workers", color: "#FF3B3B" },
  { label: "Native", pct: 68, note: "Expo + Guide", color: "#00E5C0" },
];

const PROGRESS = [
  { name: "Full Overall", now: 70, target: 95, was: 52, sub: "Sprint1 foundation" },
  { name: "Marketing", now: 92, target: 96, was: 88, sub: "~120 files target" },
  { name: "apps/web", now: 78, target: 95, was: 42, sub: "PID 1 split comps" },
  { name: "Onboarding", now: 72, target: 92, was: 68, sub: "VisaguideOS port" },
  { name: "Supabase", now: 70, target: 90, was: 28, sub: "schema.sql ready" },
  { name: "Packages", now: 18, target: 85, was: 12, sub: "ui types tests — stuck need 100 tests" },
  { name: "Turbo root", now: 80, target: 95, was: 15, sub: "workspace live" },
  { name: "Bots runtime", now: 40, target: 85, was: 25, sub: "UI ≠ workers — stuck" },
  { name: "WorkCut", now: 70, target: 85, was: 25, sub: "workcut.ts + templates · wasm optional" },
  { name: "Live", now: 72, target: 85, was: 55, sub: "live.ts Go Live · gift · record→project" },
  { name: "Feed", now: 68, target: 85, was: 15, sub: "Feed page · Findy · PostGIS stub" },
  { name: "Trust", now: 50, target: 95, was: 20, sub: "TODO trust_ledger runtime" },
  { name: "Stripe", now: 30, target: 95, was: 15, sub: "TODO live Connect escrow" },
];

const OLDHAM_CHECKS = [
  { group: "Pre-flight (Dev)", items: [
    { k: "pf_schema", t: "Apply supabase/schema.sql in Supabase SQL editor — Verify 12+ tables profiles professional_profiles projects posts services shop_items bookings live_sessions uprm_contacts interaction_events journey_states mfc_wallet trust_ledger gift_ledger onboarding_memory onboarding_conversations — RLS enabled" },
    { k: "pf_seed", t: "Run supabase/seed_oldham.sql — Verify seed 12 projects AYO'S TAILORS etc 47 contacts Aisha 94 etc 1247 MFC 4.9 Trust" },
    { k: "pf_pnpm", t: "pnpm install at repo root — Verify turbo.json pnpm-workspace.yaml packages/ui types config apps/web" },
    { k: "pf_dev", t: "pnpm --filter @myface/web dev — Verify :3001 /app/dashboard UprmCommandCenter composed splits — Pipeline draggable — GiftRain — BotArmy 9 chips" },
    { k: "pf_pid1", t: "Verify /uprm PID 1 apps/web/app/(dashboard)/uprm/page.tsx :3001 Next route — Same components as Vite dashboard" },
  ]},
  { group: "Oldham Field Test — AYO'S TAILORS Spindlegate Oldham OL1 luxury Aso-Ebi", items: [
    { k: "ot_signup", t: "Signup 32 fields — Trade Tailor → fabrics Aso-Ebi lace etc — Shop items → Materials £45/m — Onboarding companion one-Q-at-a-time deterministic gating fieldGating.ts gatingEngine.ts tradeProfiles.ts — Completion → /uprm-command → /app/dashboard — 3 projects auto-created" },
    { k: "ot_project", t: "Project create killer object — Before fabric stack green yellow pink fuchsia blue gold sequins — After final wedding dress — Milestone cutting sewing fitting — Materials £45/m — Team — Cost £320 — Shop link — Booking link — Gift count — SEO slug /projects/[id] — Verify ProjectCard.tsx Before/After slider milestone timeline materials team cost gift shop booking" },
    { k: "ot_shop", t: "Shop + Booking — ShopCard Aso-Ebi lace £45/m stock delivery 10mi Oldham escrow 5% — BookingCalendar week view Discovery→Repeat calendar_date revenue £8420 pipeline escrow 10% Timi buffer — Verify Stripe escrow stub apps/web/lib/stripe.ts" },
    { k: "ot_uprm", t: "UPRM Contacts + Pipeline — UPRMContactsList Aisha Bridal 94/100 Relationship bar M gradient — PipelineKanban 8 columns Discovery Engagement Inquiry Quote Booked In Progress Final Review Repeat DnD @dnd-kit/core — Drag Aisha Discovery→Repeat — Verify journey_state Supabase uprm_contacts + interaction_events event-sourced" },
    { k: "ot_gift", t: "Gift + MFC Wallet — MFCWallet Balance 1247 gift feed realtime Supabase Realtime packs Starter 100 £0.99 Creator 500 £19.99 etc — Gift Crown 100 to Aisha project — Verify GiftRain Hammer Scissors Heart Crown Trophy animation Framer Motion — Gift split 70% pro 30% platform — gift_ledger mfc_wallet" },
    { k: "ot_trustlive", t: "Trust + Live — TrustScoreBadge 4.9 badge verified green event-sourced trust_ledger — LiveWorkshop Go Live red pulse PiP phone tripod viewers gift rain recording to Project — Verify Mux LiveKit stub" },
  ]},
  { group: "Production Testing — To 95%+", items: [
    { k: "pt_workcut", t: "WorkCut FFmpeg.wasm — WorkCutEditor templates Before/After Timelapse Milestone Price Reveal auto-tools trim captions Yoruba Hausa English blur trust badge stickers Material Cost Duration Tool Export Work Feed TikTok Instagram Cutty bot — Verify apps/web/lib/workcut.ts FFmpeg.wasm — Oldham tailor exports WorkCut video" },
    { k: "pt_live", t: "Live Mux LiveKit — LiveWorkshop full Mux or LiveKit Go Live flow Hands-free PiP phone tripod Gift rain realtime viewers 0→100 recording to Project Chat Findy bot discovery 10mi Oldham — Verify apps/web/lib/live.ts — Oldham tailor Go Live 5 min workshop gift rain" },
    { k: "pt_feed", t: "Feed Work Graph — Feed TikTok style Work Graph not User Graph Project must have work_ref infinite scroll Gift Boosted discovery £5/500 reach Search Typesense + pgvector semantic Aso-Ebi lace PostGIS radius search 10mi Oldham Findy bot — Verify apps/web/app/(feed)/page.tsx Typesense pgvector PostGIS — Search Aso-Ebi lace Oldham 10mi returns AYO'S TAILORS" },
    { k: "pt_trust", t: "Trust Ledger runtime — trust_ledger append-only event-sourced Verification 4 steps ID Trade cert Gas Safe register 123456 BS 7671 Part P Insurance Portfolio video TrustScore Verified x Reviews x Completion x Response =4.9 No fake reviews verified via booking Veri bot — Verify apps/web/lib/trust.ts — Verify AYO'S TAILORS Verified Pro badge" },
    { k: "pt_bots", t: "Bot Army 9 workers — 9 micro-bots Milo onboarding 32 fields Cutty WorkCut Quoto quotes £45/m Timi availability buffer Findy discovery 10mi Helpy FAQ Veri Gas Safe BS 7671 Growy boost £5/500 views Lingo Yoruba Hausa Kiswahili BullMQ OpenAI Supabase edge functions supabase/functions/bots/* autonomous workers — Verify apps/web/lib/bots.ts — Growy boost Supplier Ads B&Q Wickes Howdens Lead Unlock £3 Pro Sub £29/mo Monetization 6 ways £9620/week → £618K ARR" },
    { k: "pt_stripe", t: "Stripe Connect live — Stripe Connect escrow live test — Onboarding pro — Escrow hold 10% Jobs 5% Shop — MFC packs purchase — Gift split 70/30 — Withdraw — Payment received — Verify live keys testmode → live — Test £320 Aisha Bridal escrow flow" },
    { k: "pt_tests", t: "100 tests — Vitest + Playwright — Coverage 80%+ — Unit tests onboarding gating 32 fields trade rules Tailor Electrician Plumber — Integration tests ProjectCard killer object Shop Booking Pipeline — E2E Playwright onboarding → project → shop → booking → gift → UPRM → Pipeline — Verify packages/types + 100 tests" },
    { k: "pt_deploy", t: "Production deploy — Vercel deploy apps/marketing + apps/web — Supabase prod project env — Domain myfaceprofile.aikova.co.uk — HTTPS — Sentry — Analytics — Verify OLDHAM_TEST_CHECKLIST.md all green — Ready for field test AYO'S TAILORS tomorrow" },
  ]},
];

const PROMPTS = [
  {
    id: "workcut",
    title: "P0 Work Graph Day 4-5 WorkCut",
    sprint: "Sprint 2 Day 4-5",
    color: "#8FFF4A",
    prompt: `You are closing readiness gap MVP 82% Full 70% → 85% — Task WorkCut FFmpeg.wasm — Current state WorkCutEditor.tsx 25% TODO stub — Missing: FFmpeg.wasm or Cloudinary video processing templates Before/After Timelapse Milestone Price Reveal auto-tools trim captions trade dictionary Yoruba Hausa English blur trust badge stickers Material Cost Duration Tool Export Work Feed TikTok Instagram — Create apps/web/components/uprm/WorkCutEditor.tsx full — Use @ffmpeg/ffmpeg wasm — Templates array: {id:before-after, layers:[beforeImg afterImg slider]}, {id:timelapse, layers:[images[] speed]}, {id:milestone, layers:[milestone[] price cost]}, {id:price-reveal, layers:[materials cost £45/m team]} — Tools: trim, captions auto Yoruba Hausa English, trade dictionary Tailor Electrician Plumber, blur faces, trust badge 4.9 sticker, Material Cost Duration Tool overlay £45/m, duration — Export mp4 1080x1920 9:16 Work Feed — Integrate Cutty bot auto-tools — Create apps/web/lib/workcut.ts — Functions: loadFFmpeg, createTimeline, applyTemplate, exportVideo, uploadToSupabase — Acceptance: AYO'S TAILORS creates WorkCut Before fabric stack + After dress → exports 15s video with Price Reveal £320 — Plays in Feed — Gift button — Oldham test pass — Reference VisaguideOS WorkCut pattern.`
  },
  {
    id: "livefeed",
    title: "P0 Work Graph Day 6-8 Live Mux + Feed PostGIS",
    sprint: "Sprint 2 Day 6-8",
    color: "#00E5C0",
    prompt: `You are closing readiness gap 70%→85% — Tasks Live Mux LiveKit + Feed Work Graph PostGIS — Current LiveWorkshop 55% WIP stub GiftRain 55% — Missing: Mux or LiveKit Go Live flow Hands-free PiP phone tripod gift rain realtime viewers recording to Project — Feed Work Graph Typesense pgvector PostGIS 10mi — Create apps/web/components/uprm/LiveWorkshop.tsx full — Use Mux Live or LiveKit — Flow: Click Go Live Now red pulse → Request camera mic → Show PiP phone tripod overlay → Show viewers 0→100 realtime Supabase Realtime → Show gift rain Hammer Scissors Heart Crown Trophy realtime gift_ledger → Show chat → Record → On stop save recording to projects table recording_url mux_id → Auto-create Project from recording — Create apps/web/lib/live.ts — Functions: startLive, stopLive, sendGift, updateViewers — Create apps/web/app/(feed)/page.tsx — Work Graph not User Graph — Project must have work_ref — Infinite scroll — Gift button — Boosted discovery £5/500 reach — Search Typesense + pgvector semantic Aso-Ebi lace — PostGIS radius search 10mi Oldham — Findy bot discovery — Create apps/web/lib/feed.ts + search.ts — Functions: getFeed, searchProjects, boostProject — Acceptance: AYO'S TAILORS Go Live 5 min workshop viewers 0→23 gift Crown 100 → recording saves as Project — Feed shows Projects within 10mi Oldham search Aso-Ebi returns AYO'S TAILORS — Oldham test pass.`
  },
  {
    id: "trustbots",
    title: "P1 Trust Scale Day 9-14 to 95%+",
    sprint: "Sprint 3 Day 9-14",
    color: "#FFE600",
    prompt: `You are closing readiness gap 85%→95%+ Production — Tasks trust_ledger runtime 9 bot workers 100 tests live Stripe Connect — Current TrustScoreBadge 50% WIP MFCWallet 50% WIP BotArmy 75% DONE UI chips no autonomous workers Stripe escrow stub — Missing: trust_ledger event-sourced Verified Pro runtime 4 steps verification TrustScore formula Bot Army 9 autonomous BullMQ OpenAI edge functions 100 tests Stripe live — Create apps/web/lib/trust.ts — trust_ledger append-only event-sourced — Functions: createTrustEvent, verifyPro, calculateTrustScore — Verification flow 4 steps ID Trade cert Gas Safe register 123456 BS 7671 Part P Insurance Portfolio video — TrustScore formula Verified x Reviews x Completion x Response =4.9 — No fake reviews verified via booking — Veri bot — Create supabase/functions/bots/* — 9 bots: Milo onboarding 32 fields (onboarding-chat edge fn) Cutty WorkCut auto-tools (workcut.ts) Quoto quotes £45/m (quote calc) Timi availability buffer (calendar) Findy discovery 10mi (feed search PostGIS) Helpy FAQ (help chat) Veri Gas Safe BS 7671 (trust verification) Growy boost £5/500 views (boost.ts) Lingo Yoruba Hausa Kiswahili (translate) — Use BullMQ + OpenAI + Supabase edge functions — Autonomous workers — Create apps/web/lib/bots.ts — Create apps/web/lib/stripe.ts full live — Stripe Connect onboarding pro Escrow hold 10% Jobs 5% Shop MFC packs Starter 100 £0.99 Creator 500 £19.99 Business 1000 £49 Pro 5000 £199 Gift split 70% pro 30% platform Withdraw Payment received — Use @stripe/stripe-js @stripe/connect — Functions: createConnectAccount, createEscrowPayment, releaseEscrow, purchaseMFC, sendGiftSplit, withdraw — Create 100 tests Vitest + Playwright — tests/unit/onboarding-gating.test.ts 32 fields trade rules — tests/unit/project-card.test.ts killer object — tests/integration/shop-booking.test.ts — tests/e2e/oldham-flow.spec.ts Playwright onboarding → project → shop → booking → gift → UPRM → Pipeline — Coverage 80%+ — Create OLDHAM_TEST_CHECKLIST.md full testing checklist + production deploy Vercel Supabase prod env domain HTTPS Sentry Analytics — Acceptance: Trust AYO'S TAILORS Verified Pro badge 4.9 — Bot Army 9 autonomous — Growy boost £5/500 views works Supplier Ads — Lead Unlock £3 Pro Sub £29/mo Monetization 6 ways £9620/week → £618K ARR — Stripe live escrow £320 Aisha Bridal flow works — 100 tests green — Oldham field test all green — Production deploy myfaceprofile.aikova.co.uk — Ready for AYO'S TAILORS Spindlegate Oldham OL1 tomorrow.`
  }
];

function Circular({ pct, color, size = 84 }: { pct: number; color: string; size?: number }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth="6" fill="none" />
        <circle cx={size/2} cy={size/2} r={r} stroke={color} strokeWidth="6" fill="none" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${color}66)` }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="poppins font-extrabold text-[18px] tracking-tight" style={{ color }}>{pct}%</span>
      </div>
    </div>
  );
}

export default function SprintPhasePage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [records, setRecords] = useState<CheckRecord[]>([]);
  const [noteText, setNoteText] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("workcut");
  const [loadingChecks, setLoadingChecks] = useState(true);
  const hiddenCopyRef = useRef<HTMLTextAreaElement>(null);

  const STORAGE_KEY = 'myface_closure_logs';

  const loadRecords = async () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const list = JSON.parse(raw) as CheckRecord[];
        setRecords(list);
        const map: Record<string, boolean> = {};
        list.forEach((r) => {
          if (r.value.kind === 'check' && r.value.key) map[r.value.key] = !!r.value.checked;
        });
        setChecks(map);
      }
    } catch {}
    setLoadingChecks(false);
  };
  useEffect(() => { void loadRecords(); }, []);

  const persistAll = (next: CheckRecord[]) => {
    setRecords(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const persistCheck = async (key: string, checked: boolean) => {
    setChecks((prev) => ({ ...prev, [key]: checked }));
    const existing = records.find((r) => r.value.kind === 'check' && r.value.key === key);
    const value = { kind: 'check' as const, key, checked, at: new Date().toISOString() };
    if (existing) {
      persistAll(records.map((r) => (r.id === existing.id ? { ...r, value } : r)));
    } else {
      persistAll([...records, { id: `c_${Date.now()}`, value }]);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    persistAll([
      ...records,
      {
        id: `n_${Date.now()}`,
        value: { kind: 'note', text: noteText.trim(), at: new Date().toISOString() },
      },
    ]);
    setNoteText('');
    setToast('Note saved locally');
    setTimeout(() => setToast(null), 2200);
  };

  const copyToClipboard = (text: string) => {
    if (hiddenCopyRef.current) {
      hiddenCopyRef.current.value = text;
      hiddenCopyRef.current.select();
      try { document.execCommand('copy'); setToast("Copied prompt!"); setTimeout(() => setToast(null), 2000); } catch {}
    }
  };

  const exportJSON = () => {
    const payload = {
      brand: "MyFace Profile OS",
      dualScore: { mvp_before: "~76%", mvp_after: "~87% Sprint1+2", full_before: "~52%", full_after: "~74% Work Graph", mvp: 87, full: 74, target: 95 },
      shipped: SHIPPED,
      stillOpen: ["WorkCut FFmpeg", "Mux Live", "Feed/PostGIS", "trust_ledger runtime", "9 bot workers", "100 tests", "live Stripe Connect"],
      progress: PROGRESS,
      circles: CIRCLES,
      sprints: {
        sprint1: { days: "3 days Foundation", pct: "52%→70%", done: "16 DONE 15 WIP 6 TODO", mvp: "76→82%", note: "Oldham-test ready not full 95%" },
        sprint2: { days: "5 days Work Graph", pct: "70%→85%", focus: "WorkCut FFmpeg Mux Live Feed PostGIS", daysDetail: "Day4-5 WorkCut FFmpeg.wasm CapCut Day6-7 Live Mux LiveKit gift rain Day8 Feed Work Graph Typesense pgvector PostGIS 10mi" },
        sprint3: { days: "4 days Trust Scale + Testing", pct: "85%→95%+", focus: "trust_ledger runtime 9 bot workers 100 tests live Stripe Connect", daysDetail: "Day9-10 Trust Ledger event-sourced Day11-12 Bot Army 9 autonomous Day13-14 Tests 100 Stripe live Oldham field test prod deploy" },
      },
      oldhamChecklist: OLDHAM_CHECKS,
      prompts: PROMPTS,
      exportedAt: new Date().toISOString(),
      domain: "myfaceprofile.aikova.co.uk/readiness /app/dashboard",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "myface-sprint2-3-phase-plan.json"; a.click();
    URL.revokeObjectURL(url);
    setToast("Exported JSON");
    setTimeout(() => setToast(null), 2000);
  };

  const checkedCount = useMemo(() => Object.values(checks).filter(Boolean).length, [checks]);
  const totalChecks = useMemo(() => OLDHAM_CHECKS.reduce((a,g)=>a+g.items.length,0), []);

  return (
    <div data-safe-area-inset-root className="min-h-screen w-full bg-[#050505] text-white overflow-x-clip" style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)', ['--m-grad' as string]: 'linear-gradient(90deg,#8FFF4A,#00E5C0,#1A7CFF,#FFE600,#FF8A00)' }}>
      <style>{`
        ::selection { background: #8FFF4A; color: #050505; }
        .poppins { font-family: Poppins, Inter, system-ui, sans-serif; }
      `}</style>
      {/* Header */}
      <header data-safe-area-sticky-top className="sticky z-30 border-b border-white/10 bg-[#050505]/80 backdrop-blur-xl" style={{ top: 'var(--safe-area-inset-top)' }}>
        <div className="mx-auto max-w-[1280px] px-4 md:px-6 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full" style={{ background: 'var(--m-grad)' }} />
            <div className="leading-none">
              <div className="poppins font-extrabold text-[15px] tracking-tight">MyFace — Sprint 2-3 Phase Plan to Production</div>
              <div className="mono text-[10px] text-white/60 tracking-widest uppercase mt-[2px]">From 87%/74% → 95%+ — Prompt Agent What Next — Oldham Test → Production OS — MVP 87% Full 74%</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-[11px] mono">M · #8FFF4A → #00E5C0 → #1A7CFF → #FFE600 → #FF8A00</div>
            <button onClick={exportJSON} className="poppins text-[12px] font-bold px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 transition">Export JSON</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] px-4 md:px-6 py-6 space-y-6">
        {/* Dual Score Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.15fr_.85fr] gap-4">
          <div className="glass p-5 md:p-7 drop">
            <div className="flex items-center justify-between">
              <h2 className="poppins font-extrabold text-[22px] md:text-[28px] leading-[0.95]">Dual score · MVP live vs Full Project Tree OS</h2>
              <span className="mono text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10">OLDHAM READY</span>
            </div>
            <div className="mt-5 overflow-x-auto scrollbar-hide -mx-1 px-1">
              <div className="min-w-[560px] grid grid-cols-[110px_110px_1fr] text-[12px] mono border border-white/10 rounded-xl overflow-hidden">
                <div className="bg-white/5 px-3 py-2 font-bold">Mode</div><div className="bg-white/5 px-3 py-2 font-bold border-l border-white/10">Before</div><div className="bg-white/5 px-3 py-2 font-bold border-l border-white/10">After Sprint 1</div>
                <div className="px-3 py-3 border-t border-white/10">MVP</div><div className="px-3 py-3 border-t border-l border-white/10">~76%</div><div className="px-3 py-3 border-t border-l border-white/10">~82–90% (split UPRM live on site)</div>
                <div className="px-3 py-3 border-t border-white/10">Full Tree</div><div className="px-3 py-3 border-t border-l border-white/10">~52%</div><div className="px-3 py-3 border-t border-l border-white/10">~70–80% (Turbo + schema + PID 1 route)</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="glass-strong p-4 flex items-center gap-4">
                <Circular pct={82} color="#8FFF4A" />
                <div>
                  <div className="mono text-[10px] tracking-widest text-white/60">MVP LIVE</div>
                  <div className="poppins font-extrabold text-[20px] leading-none mt-1">87% <span className="text-[11px] font-medium text-white/60">Shipped slice</span></div>
                  <div className="mono text-[10px] text-white/70 mt-2 leading-tight">Split UPRM live on site<br/>/app/dashboard → UprmCommandCenter<br/>composed splits — Next PID 1<br/>apps/web/app/(dashboard)/uprm/page.tsx :3001</div>
                </div>
              </div>
              <div className="glass-strong p-4 flex items-center gap-4">
                <Circular pct={70} color="#1A7CFF" />
                <div>
                  <div className="mono text-[10px] tracking-widest text-white/60">FULL TREE</div>
                  <div className="poppins font-extrabold text-[20px] leading-none mt-1">74% <span className="text-[11px] font-medium text-white/60">vs 640 files</span></div>
                  <div className="mono text-[10px] text-white/70 mt-2 leading-tight">Turbo monorepo pnpm-workspace.yaml<br/>turbo.json packages/ui types config apps/web</div>
                </div>
              </div>
            </div>
            <div className="mt-4 mono text-[10px] text-white/50 leading-relaxed">
              Production Readiness — vs Full Project Tree OS<br/>
              Full Production Tree score 70% — scored against the Full Project Tree OS you defined (Turbo monorepo · apps/web PID 1 · 12 tables · BotArmy split · 100 tests). Live code covers marketing deeply and UPRM as one DashboardPage — not the full 640-file tree yet.<br/><br/>
              Supabase supabase/schema.sql 12+ tables RLS seed_oldham.sql functions/onboarding-chat — Split UPRM 12 components — Live dashboard /app/dashboard — Onboarding memory/conversation services wired — Stripe escrow stub apps/web/lib/stripe.ts — Checklist ZIP OLDHAM_TEST_CHECKLIST.md — Redeployed myfaceprofile.aikova.co.uk/readiness /app/dashboard
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass p-5">
              <div className="flex items-center justify-between">
                <h3 className="poppins font-bold text-[14px]">Shipped P0 Day 1-3</h3>
                <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#8FFF4A]/20 text-[#8FFF4A] border border-[#8FFF4A]/30">16 DONE 15 WIP 6 TODO</span>
              </div>
              <div className="mt-4 space-y-2.5">
                {SHIPPED.map(s => (
                  <div key={s} className="flex gap-2.5 text-[12px] leading-[1.35] text-white/90">
                    <div className="mt-[2px] h-4 w-4 rounded-full bg-[#8FFF4A] text-black grid place-items-center text-[10px] font-bold">✓</div>
                    <span className="mono text-[11px]">{s}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <div className="mono text-[10px] tracking-widest text-white/50">YOUR NEXT ACTIONS</div>
                <div className="mt-2 space-y-1.5 mono text-[11px]">
                  <div><span className="text-white/40">1</span> Apply supabase/schema.sql in Supabase SQL editor</div>
                  <div><span className="text-white/40">2</span> pnpm install at repo root → pnpm --filter @myface/web dev</div>
                  <div><span className="text-white/40">3</span> Run Oldham checklist (AYO'S TAILORS · Aisha 94 · £320)</div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[24px] border border-[#FF3B3B]/30 p-4" style={{ background: "linear-gradient(135deg, rgba(255,59,59,0.18), rgba(255,138,0,0.14))" }}>
              <div className="mono text-[10px] tracking-widest text-[#FF8A00]">STILL OPEN FOR 95%+ — SPRINT 2-3</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["WorkCut FFmpeg","Mux Live","Feed/PostGIS","trust_ledger runtime","9 bot workers","100 tests","live Stripe Connect"].map(t => (
                  <span key={t} className="mono text-[10px] px-2.5 py-1 rounded-full bg-black/60 border border-white/10">{t}</span>
                ))}
              </div>
              <div className="mt-3 h-1 w-full rounded-full overflow-hidden bg-black/40">
                <div className="h-full" style={{ width: "70%", background: "var(--m-grad)" }} />
              </div>
              <div className="mt-1.5 mono text-[10px] text-white/60">Target 70% → 95%+ production</div>
            </div>
          </div>
        </section>

        {/* Phase Plan Visual */}
        <section className="glass p-5 md:p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="poppins font-extrabold text-[18px] md:text-[22px]">Phase Plan Visual — 3 Sprints timeline</h2>
            <div className="mono text-[10px] px-2 py-1 rounded-full bg-white/10">TARGET 70% → 95%+</div>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { sprint: "Sprint 1", state: "DONE 3 days Foundation", pct: "52%→70%", note: "Turbo + schema + PID 1 route — 16 DONE 15 WIP 6 TODO — MVP 76→82% — Oldham-test ready not full 95%", color: "#8FFF4A", grad: "from-[#8FFF4A]/20 to-[#00E5C0]/20" },
              { sprint: "Sprint 2", state: "WIP libs shipped", pct: "70%→74%→85%", note: "workcut.ts · live.ts · feed/search · (feed)/page live — FFmpeg/Mux keys + Typesense still open for 85%", color: "#00E5C0", grad: "from-[#00E5C0]/20 to-[#1A7CFF]/20" },
              { sprint: "Sprint 3", state: "NEXT 4 days Trust Scale + Testing", pct: "85%→95%+", note: "trust_ledger runtime 9 bot workers 100 tests live Stripe Connect production testing — Day 9-10 Trust Ledger event-sourced Verified Day 11-12 Bot Army 9 autonomous Day 13-14 Tests 100 Stripe live Oldham field test production deploy", color: "#FFE600", grad: "from-[#FFE600]/20 to-[#FF8A00]/20" },
            ].map(c => (
              <div key={c.sprint} className={`rounded-[20px] border border-white/10 p-4 bg-gradient-to-br ${c.grad} relative overflow-hidden`}>
                <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.color }} />
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: c.color }} />
                  <div className="poppins font-extrabold text-[13px]">{c.sprint}</div>
                  <div className="mono text-[10px] px-2 py-0.5 rounded-full bg-black/40 border border-white/10">{c.pct}</div>
                </div>
                <div className="mono text-[11px] font-bold mt-2 text-white/90">{c.state}</div>
                <div className="mono text-[10px] mt-2 leading-relaxed text-white/65">{c.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Progress Bars */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass p-5">
            <h3 className="poppins font-bold text-[14px]">Progress TARGET 70% → 95%+</h3>
            <div className="mt-4 space-y-3 max-h-[560px] overflow-auto pr-1 scrollbar-hide">
              {PROGRESS.map(p => (
                <div key={p.name} className="group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="mono text-[11px] font-bold">{p.name}</span>
                      <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-white/10">{p.sub}</span>
                    </div>
                    <span className="mono text-[10px] text-white/60">{p.now}% → {p.target}%</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-white/10 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: `${p.now}%`, background: p.now < 40 ? "#FF3B3B" : p.now < 70 ? "#FFE600" : "var(--m-grad)" }} />
                    <div className="absolute inset-y-0 rounded-full border border-white/20 border-dashed" style={{ left: `${p.target}%`, width: `2px` }} />
                  </div>
                  <div className="mt-1 flex justify-between mono text-[9px] text-white/40">
                    <span>was {p.was}%</span><span>target {p.target}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <div className="flex items-center justify-between">
              <h3 className="poppins font-bold text-[14px]">Circle board — Readiness</h3>
              <span className="mono text-[10px] text-white/50">{checkedCount}/{totalChecks} checks</span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-4">
              {CIRCLES.map(c => (
                <div key={c.label} className="flex flex-col items-center text-center">
                  <Circular pct={c.pct} color={c.color} size={72} />
                  <div className="mono text-[10px] font-bold mt-2 leading-tight">{c.label}</div>
                  <div className="mono text-[9px] text-white/50 leading-tight">{c.pct}% {c.note}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 p-3 rounded-xl bg-black/40 border border-white/10">
              <div className="mono text-[10px] tracking-widest text-white/40">FULL PROJECT TREE OS FILTER</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {["full","marketing","web","supabase","packages","native"].map(f => (
                  <span key={f} className="mono text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testing Plan Oldham */}
        <section className="glass p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="poppins font-extrabold text-[18px] md:text-[22px]">Testing Plan — Oldham Test to Production</h2>
            <div className="flex items-center gap-2">
              <span className="mono text-[10px] px-2 py-1 rounded-full bg-[#8FFF4A]/15 text-[#8FFF4A] border border-[#8FFF4A]/20">{checkedCount}/{totalChecks} completed</span>
              {loadingChecks && <span className="mono text-[10px] text-white/40">loading closure_logs…</span>}
            </div>
          </div>

          <div className="mt-5 space-y-6">
            {OLDHAM_CHECKS.map(group => (
              <div key={group.group} className="rounded-[18px] border border-white/10 bg-white/[0.03] p-4">
                <div className="poppins font-bold text-[13px]">{group.group}</div>
                <div className="mt-3 space-y-2.5">
                  {group.items.map(it => {
                    const checked = !!checks[it.k];
                    return (
                      <label key={it.k} className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer transition ${checked ? "bg-[#8FFF4A]/10 border-[#8FFF4A]/30" : "bg-black/20 border-white/10 hover:border-white/20"}`}>
                        <input type="checkbox" checked={checked} onChange={e => persistCheck(it.k, e.target.checked)} className="mt-0.5 h-4 w-4 rounded accent-[#8FFF4A]" />
                        <span className={`mono text-[11px] leading-[1.4] ${checked ? "text-white" : "text-white/70"}`}>{it.t}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Agent Prompts */}
        <section className="glass p-5 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="poppins font-extrabold text-[18px] md:text-[22px]">Agent Prompts — What Next — 3 Prompts with Copy Buttons</h2>
            <div className="mono text-[10px] text-white/50">Highlight missing parts based on readiness 70%→95%</div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {PROMPTS.map(p => (
              <button key={p.id} onClick={() => setActiveTab(p.id)} className={`shrink-0 mono text-[11px] font-bold px-4 py-2 rounded-full border transition ${activeTab===p.id ? "bg-white text-black border-white" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"}`}>
                <span className="inline-block h-2 w-2 rounded-full mr-2" style={{ background: p.color }} />{p.sprint} · {p.title}
              </button>
            ))}
          </div>

          {PROMPTS.filter(p=>p.id===activeTab).map(p => (
            <div key={p.id} className="mt-4 rounded-[18px] border border-white/10 bg-[#0F0F0F] p-4 md:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ background: p.color }} />
                  <div className="poppins font-bold text-[13px]">{p.title}</div>
                  <span className="mono text-[10px] px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{p.sprint}</span>
                </div>
                <button onClick={() => copyToClipboard(p.prompt)} className="poppins text-[11px] font-bold px-4 py-2 rounded-full bg-white text-black hover:bg-white/90 flex items-center gap-2">
                  <span className="h-4 w-4 grid place-items-center rounded-full bg-black text-white text-[10px]">⎘</span> Copy Prompt
                </button>
              </div>
              <div className="mt-4 rounded-xl bg-black/60 border border-white/10 p-4 max-h-[380px] overflow-auto">
                <pre className="mono text-[11px] leading-[1.5] whitespace-pre-wrap text-white/80">{p.prompt}</pre>
              </div>
              <div className="mt-3 mono text-[10px] text-white/40">Missing highlights: {p.id==="workcut" ? "WorkCut FFmpeg.wasm templates Before/After Timelapse" : p.id==="livefeed" ? "Live Mux LiveKit PiP gift rain + Feed Work Graph PostGIS Typesense" : "trust_ledger runtime + 9 bot workers BullMQ OpenAI + 100 tests + Stripe Connect live"}</div>
            </div>
          ))}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            {PROMPTS.map(p => (
              <div key={p.id+"card"} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mono text-[10px] tracking-widest" style={{ color: p.color }}>{p.sprint}</div>
                <div className="poppins text-[12px] font-bold mt-1">{p.title}</div>
                <button onClick={() => { setActiveTab(p.id); copyToClipboard(p.prompt); }} className="mt-2 mono text-[10px] px-3 py-1.5 rounded-full bg-white/10 border border-white/10 hover:bg-white/15">Copy {p.id}</button>
              </div>
            ))}
          </div>
        </section>

        {/* Build monitor notes + circle board footer */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4">
          <div className="glass p-5">
            <h3 className="poppins font-bold text-[14px]">Build monitor notes — closure_logs</h3>
            <div className="mono text-[10px] text-white/50 mt-1">e.g. Split BotArmy.tsx from DashboardPage — Add notes persisted to closure_logs collection</div>
            <div className="mt-4 flex gap-2">
              <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} placeholder="Add note — saved in this browser. Circle board — e.g. Implement WorkCutEditor FFmpeg.wasm..." className="flex-1 min-h-[88px] rounded-xl bg-black/40 border border-white/10 p-3 mono text-[11px] placeholder:text-white/30 outline-none focus:border-white/20" />
              <button onClick={addNote} className="self-start poppins text-[12px] font-bold px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90">Add</button>
            </div>
            <div className="mt-4 space-y-2 max-h-[220px] overflow-auto pr-1">
              {records.filter(r=>r.value.kind==='note').length===0 && <div className="mono text-[11px] text-white/30">No notes yet — saved in this browser. Circle board</div>}
              {records.filter(r=>r.value.kind==='note').slice().reverse().map(r => (
                <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex justify-between gap-3">
                  <span className="mono text-[11px] text-white/80 leading-snug">{r.value.text}</span>
                  <span className="mono text-[9px] text-white/40 shrink-0">{r.value.at ? new Date(r.value.at).toLocaleTimeString() : ""}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-5">
            <h3 className="poppins font-bold text-[14px]">Export Report</h3>
            <div className="mt-3 space-y-2 mono text-[11px] text-white/60">
              <div>• mvp 82 full 70 target 95</div>
              <div>• sprints 2-3 missing parts highlighted</div>
              <div>• Oldham checklist testing plan prompts</div>
              <div>• Touch of GOD — Holy workshop — M gradient glass</div>
            </div>
            <button onClick={exportJSON} className="mt-4 w-full poppins font-bold text-[13px] py-3 rounded-full text-black" style={{ background: "var(--m-grad)" }}>Export Report JSON</button>
            <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-3">
              <div className="mono text-[10px] tracking-widest text-white/40">PRODUCTION READINESS TARGET</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "70%", background: "var(--m-grad)" }} />
                </div>
                <span className="poppins font-bold text-[12px]">70% → 95%+</span>
              </div>
              <div className="mt-2 mono text-[9px] text-white/40">myfaceprofile.aikova.co.uk/readiness · /app/dashboard · PID1 :3001</div>
            </div>
          </div>
        </section>

        <footer className="py-6 text-center mono text-[10px] text-white/30">
          MyFace Profile OS — Black #050505 · M gradient #8FFF4A → #00E5C0 → #1A7CFF → #FFE600 → #FF8A00 · Poppins Bold 800 · Glass white/5 backdrop-blur rounded 24px · Touch of GOD — Holy workshop · Production ready — Prompt agent what next
        </footer>
      </main>

      <textarea ref={hiddenCopyRef} className="fixed -top-[9999px] left-0 opacity-0" aria-hidden />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-white text-black poppins text-[12px] font-bold shadow-xl drop">
          {toast}
        </div>
      )}
    </div>
  );
}
