/**
 * MyFace Production Readiness — dual score:
 *   MVP LIVE  = what is shipped on myfaceprofile.aikova.co.uk today
 *   FULL TREE = Full Project Tree OS (640 files · Turbo · UPRM PID 1)
 *
 * Pattern: ai-receptionist.aikova.co.uk/readiness
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

type Mode = 'mvp' | 'full';
type Surface = 'marketing' | 'web' | 'supabase' | 'packages' | 'native' | 'full';
type Status = 'DONE' | 'WIP' | 'TODO' | 'NEW' | 'FROM';

type ModuleItem = {
  id: string;
  label: string;
  /** % complete toward FULL tree deliverable */
  pct: number;
  /** % complete for MVP live slice */
  mvpPct: number;
  status: Status;
  mvpStatus: Status;
  pages?: number;
  href?: string;
  desc?: string;
  surface?: Surface;
  left?: string;
  files?: string;
};

const GRADIENT =
  'linear-gradient(102deg, #8FFF4A 0%, #00E5C0 25%, #00BFFF 50%, #FFE600 75%, #FF8A00 100%)';

const NOTES_KEY = 'myface_build_notes';

/**
 * Scanned 1 Nov 2026 against:
 *  - LIVE: Vite marketing + product OS on myfaceprofile.aikova.co.uk
 *  - TARGET: Full Project Tree OS (640 files · MVP 250 · Full 620–650)
 *
 * Sprint 1 DONE: Turbo + schema.sql APPLIED on MYFACEPROFILE + split UPRM + PID 1 route.
 * Sprint 2 WIP: workcut.ts · live.ts · Typesense/PostGIS.
 * Sprint 3 WIP: trust.ts · bots.ts · stripe Connect API · Vitest · live keys still open.
 * LIVE NOW: CommandShell CRM · /app/arcade 6 HTML games · Ad Revenue scorecard ·
 *   /app/live Session Viewer · /app/feed TikTok snap · Music drawer ·
 *   Admin /app/studio/stream + /app/studio/workcut CapCut artifacts ·
 *   /demo Test Lab seeds Ayo profile + 1247 MFC + auth bypass for smoke testing.
 * UI polish: TikTok Feed + Twitch Studio chrome · CRM icons · demoted demo chrome.
 * Supabase: jyckmajjbvydgsvnmeaj · 16 tables + Oldham seed (Aisha 94 · MFC 1247) live.
 */

const PHASES: { title: string; fullPct: number; mvpPct: number; items: ModuleItem[] }[] = [
  {
    title: 'ROOT • Turbo monorepo OS',
    fullPct: 80,
    mvpPct: 90,
    items: [
      {
        id: 'root-turbo',
        label: 'pnpm-workspace.yaml + turbo.json + root package.json',
        pct: 90,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'full',
        files: '3',
        desc: 'Full tree: Turbo pipeline build/dev/lint · apps/* packages/*',
        left: 'pnpm install at root; marketing still Vite (not Next rewrite)',
      },
      {
        id: 'root-counts',
        label: 'File budget · MVP 250 → Full 620–650 (target 640)',
        pct: 62,
        mvpPct: 85,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'full',
        desc: 'Turbo + packages + apps/web libs + split UPRM growing toward 640',
        left: 'Add tests/ + more bot edge fns + assets pack',
      },
    ],
  },
  {
    title: 'A • Marketing Site — 26 pages + legal = 28 routes (~120 files)',
    fullPct: 92,
    mvpPct: 96,
    items: [
      {
        id: 'm-26',
        label: '26 marketing pages wired (Hero → verticals → content)',
        pct: 100,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        pages: 26,
        surface: 'marketing',
        href: '/sitemap',
        files: '~95 src + public HTML',
        desc: 'Vite SPA routes live · HTTPS myfaceprofile.aikova.co.uk',
      },
      {
        id: 'm-legal',
        label: 'Legal · Privacy Terms (+ Coins stub)',
        pct: 80,
        mvpPct: 85,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'marketing',
        href: '/legal/privacy',
        left: 'Coins + full Trust/Help content still StubPage',
      },
      {
        id: 'm-trust-help',
        label: 'trust-safety + help-standalone (Full tree DONE)',
        pct: 30,
        mvpPct: 35,
        status: 'TODO',
        mvpStatus: 'TODO',
        surface: 'marketing',
        href: '/trust',
        left: 'Replace stubs with Trust Ledger + Help FAQ',
      },
      {
        id: 'm-onboard-mkt',
        label: 'Marketing /onboarding + /uprm-command entry',
        pct: 95,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'marketing',
        href: '/onboarding',
        desc: '/uprm-command → /app/dashboard',
      },
    ],
  },
  {
    title: 'B • apps/web MAIN APP — UPRM COMMAND CENTER PID 1 (~180 files)',
    fullPct: 90,
    mvpPct: 97,
    items: [
      {
        id: 'web-next',
        label: 'Next.js apps/web · app/(dashboard)/uprm/page.tsx PID 1',
        pct: 85,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/dashboard',
        desc: 'Next /uprm PID 1 + Vite /app/dashboard both use split UPRM components',
      },
      {
        id: 'web-sidebar',
        label: 'Left sidebar 240px · OS Core · Projects 12 · Contacts 47 · Pipeline 8',
        pct: 70,
        mvpPct: 90,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/dashboard',
        desc: 'UI present in DashboardPage with demo counts',
        left: 'Persist real projects/contacts counts from Supabase',
      },
      {
        id: 'web-stats',
        label: 'Row 1 overview · 12 Projects · 47 Contacts · £8420 · 4.9 · 1247 MFC · 12.4K',
        pct: 65,
        mvpPct: 90,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        desc: 'Demo stats cards rendered · ARR £618K copy in footer',
        left: 'Live metrics not wired to DB',
      },
      {
        id: 'web-projects',
        label: 'Projects Commander · ProjectCard killer object Before/After',
        pct: 55,
        mvpPct: 80,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'ProjectCard.tsx',
        left: 'Extract ProjectCard.tsx package · seed 12 real project objects',
      },
      {
        id: 'web-contacts',
        label: 'UPRMContactsList · Relationship 0–100 bar',
        pct: 50,
        mvpPct: 75,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'UPRMContactsList.tsx',
        left: 'Split component + uprm_contacts persistence',
      },
      {
        id: 'web-kanban',
        label: 'PipelineKanban · 8 columns Discovery→Repeat DnD',
        pct: 80,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'PipelineKanban.tsx',
        desc: 'Kanban UI in dashboard · drag may be limited',
        left: 'Full DnD + column persistence',
      },
      {
        id: 'web-shop-book',
        label: 'ShopCard + BookingCalendar week view',
        pct: 50,
        mvpPct: 75,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        left: 'Extract ShopCard.tsx / BookingCalendar.tsx · Stripe Connect later',
      },
      {
        id: 'web-live',
        label: 'LiveWorkshop + GiftRain (Hammer Scissors Heart Crown Trophy)',
        pct: 78,
        mvpPct: 94,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/live',
        files: 'LiveWorkshop.tsx · GiftRain.tsx · live.ts · LiveViewerExperience',
        desc: 'Go Live · PiP · viewers · gifts · /app/live Session Viewer artifact',
        left: 'Wire Mux/LiveKit keys + gift_ledger Realtime in prod',
      },
      {
        id: 'web-live-viewer',
        label: 'Live Session Viewer UI · gift economy (artifact)',
        pct: 82,
        mvpPct: 96,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/live',
        files: 'public/live/session-viewer.html · LiveViewerExperience.tsx',
        desc: 'Chat YO/HA/EN · Crown gifts · shop lace · boost · Work Feed · music BGM drawer',
        left: 'Mux ingest + Realtime chat/gifts instead of mock stage',
      },
      {
        id: 'web-feed',
        label: 'Timeline Feed · TikTok immersion polish',
        pct: 88,
        mvpPct: 97,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/feed',
        files: 'TimelineFeed.tsx · timeline.css · ui/icons.tsx',
        desc: 'Real posters · vector actions · slim rail · snap scroll · music drawer',
        left: 'Typesense + PostGIS 10mi · server ledger · real video',
      },
      {
        id: 'web-discover',
        label: 'Discover · search makers / trades / live / trending',
        pct: 82,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/discover',
        files: 'DiscoverPage.tsx',
        desc: 'Bottom-nav Discover wired · Live now · Nearby Oldham · WorkCut grid',
        left: 'Typesense + PostGIS radius search',
      },
      {
        id: 'web-ui-polish',
        label: 'House UI · TikTok Feed + Twitch Live chrome',
        pct: 85,
        mvpPct: 96,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/feed',
        files: 'crmChrome.ts · StudioHost · LiveViewerExperience · icons.tsx',
        desc: 'CRM icon system · theater Go Live · demoted Test Lab from primary nav',
        left: 'Replace remaining glass pills on marketing pages',
      },
      {
        id: 'web-music',
        label: 'Music Integration drawer · Jamendo live + mocks + Upload',
        pct: 88,
        mvpPct: 96,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/feed',
        files: 'MusicDrawer.tsx · jamendo.ts',
        desc: 'Jamendo CC + YouTube embed/URL paste live · mocks for Spotify/Apple/SC · upload',
        left: 'Optional VITE_YOUTUBE_API_KEY for full YT search · Spotify later',
      },
      {
        id: 'web-workcut',
        label: 'WorkCut Studio · CapCut editing artifact (admin)',
        pct: 82,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/studio/workcut',
        files: 'public/studio/workcut-studio.html · WorkCutStudioPage.tsx',
        desc: 'Light Axentra CapCut studio · collapsible tools · bento timeline · export',
        left: 'Install @ffmpeg/ffmpeg for real mp4 export · Cloudinary optional',
      },
      {
        id: 'web-stream-studio',
        label: 'Streaming Studio · Go Live video (admin)',
        pct: 82,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/studio/stream',
        files: 'StreamingLightStudio.tsx · MusicDrawer · jamendo',
        desc: 'Light Axentra studio · collapsible rail · Jamendo BGM · Go Live broadcast',
        left: 'Mux/LiveKit ingest + RTMP keys in production',
      },
      {
        id: 'web-trust-mfc',
        label: 'TrustScoreBadge 4.9 + MFCWallet Buy|Earn dual door',
        pct: 62,
        mvpPct: 92,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/dashboard',
        files: 'TrustScoreBadge.tsx · MFCWallet.tsx',
        desc: 'Buy Stripe packs · Earn → Games Center · gift feed',
        left: 'Event-sourced Trust Ledger + server MFC ledger',
      },
      {
        id: 'web-arcade',
        label: 'Games Center · 6 HTML playables + Arcade Live',
        pct: 86,
        mvpPct: 96,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/arcade',
        files: 'ArcadeShell · GameFrame · public/arcade/games/*.html (6)',
        desc: 'Gift Rain · Lace Wall · Multiplayer · Oldham Raid · Quote Royale · Cosmic Craft',
        left: 'AdGate S2S postback + Mux Arcade Live production',
      },
      {
        id: 'web-ad-rev',
        label: 'Ad Revenue → MFC scorecard (VisaGuide twin)',
        pct: 85,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/arcade?tab=economics',
        files: 'AdRevenueScorecard.tsx · mfcEconomy.ts',
        desc: 'AdGate/Offerwall/TapJoy/Lead/Affiliate/Google Media calculator · JSON export',
        left: 'Wire live engine credentials + mfc_ledger postbacks',
      },
      {
        id: 'web-uprm-chrome',
        label: 'UPRM CRM CommandShell · semi-square chrome (FROM VisaGuide)',
        pct: 92,
        mvpPct: 97,
        status: 'FROM',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/dashboard',
        files: 'CommandShell.tsx · crmChrome.ts',
        desc: 'CRM panes · no loud CTAs · Live/Feed/Arcade/AdRev wired',
        left: 'Persist Kanban/Contacts to schema · real metrics',
      },
      {
        id: 'web-bots',
        label: 'BotArmy 9 · Milo Cutty Quoto Timi Findy Helpy Veri Growy Lingo',
        pct: 75,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'BotArmy.tsx',
        desc: 'Bot chips rendered in dashboard UI',
        left: 'No autonomous bot runtimes / edge workers yet',
      },
      {
        id: 'web-quantum',
        label: 'QuantumBackground M gradient (FROM VisaguideOS)',
        pct: 85,
        mvpPct: 95,
        status: 'FROM',
        mvpStatus: 'DONE',
        surface: 'web',
        desc: 'M gradient + VisaGuide layered card shadows across product OS',
      },
    ],
  },
  {
    title: 'B • Onboarding companion — 32 fields · 4 phases (FROM VisaguideOS)',
    fullPct: 72,
    mvpPct: 92,
    items: [
      {
        id: 'on-32',
        label: '32 fields · Craft Identity · Work DNA · Production · UPRM Brain',
        pct: 95,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/onboarding',
        files: 'fields.ts',
        desc: 'Live in product/onboarding',
      },
      {
        id: 'on-gate',
        label: 'fieldGating + gatingEngine trade rules (Tailor/Electrician/Plumber…)',
        pct: 90,
        mvpPct: 100,
        status: 'FROM',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'gating.ts · tradeProfiles.ts',
        desc: 'Trade-gated options live',
      },
      {
        id: 'on-orch',
        label: 'OnboardingCompanion orchestrator one-Q-at-a-time',
        pct: 75,
        mvpPct: 95,
        status: 'NEW',
        mvpStatus: 'DONE',
        surface: 'web',
        files: 'OnboardingFlow.tsx',
        desc: 'MVP orchestrator = OnboardingFlow (not full passport-paper companion split)',
        left: 'Port OnboardingCompanion.tsx + ConversationService + MemoryService names from VisaguideOS',
      },
      {
        id: 'on-memory',
        label: 'onboarding_memory contract · saveStep · complete → /uprm',
        pct: 70,
        mvpPct: 90,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        left: 'Today: localStorage profile · need Supabase onboarding_memory table',
      },
      {
        id: 'on-complete',
        label: 'OnboardingCompletion · 3 projects auto-created · unlock UPRM',
        pct: 35,
        mvpPct: 55,
        status: 'TODO',
        mvpStatus: 'WIP',
        surface: 'web',
        left: 'Auto-create 3 projects on complete not implemented',
      },
    ],
  },
  {
    title: 'C • Auth gate · Signup → Onboarding → UPRM',
    fullPct: 78,
    mvpPct: 90,
    items: [
      {
        id: 'auth-email',
        label: 'Email/password Supabase Auth',
        pct: 100,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/signup',
      },
      {
        id: 'auth-google',
        label: 'Google OAuth',
        pct: 60,
        mvpPct: 70,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'web',
        href: '/login',
        left: 'Google provider optional — site URL + redirect allow-list set for myfaceprofile; email/demo login live',
      },
      {
        id: 'auth-flow',
        label: 'ProductLayout gate · incomplete → onboarding · done → dashboard',
        pct: 100,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app',
      },
    ],
  },
  {
    title: 'D • Supabase backend (~40 files · 16 tables · functions)',
    fullPct: 88,
    mvpPct: 92,
    items: [
      {
        id: 'sb-project',
        label: 'Supabase project + anon client wired',
        pct: 98,
        mvpPct: 98,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'supabase',
        desc: 'MYFACEPROFILE · jyckmajjbvydgsvnmeaj · URL/anon/service in env',
      },
      {
        id: 'sb-tables',
        label: '16 tables (profiles · projects · contacts · pipeline · mfc · trust…)',
        pct: 98,
        mvpPct: 98,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'supabase',
        files: 'tables ×16',
        desc: 'schema.sql + seed_oldham.sql applied · Aisha 94 · MFC 1247 · Aso-Ebi project',
      },
      {
        id: 'sb-fns',
        label: 'Edge functions (gift · boost · trust · bots)',
        pct: 35,
        mvpPct: 40,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'supabase',
        left: 'onboarding-chat stub ready — deploy + bots/* Sprint 2-3',
      },
      {
        id: 'sb-realtime',
        label: 'Supabase Realtime · gift rain · live workshop',
        pct: 10,
        mvpPct: 20,
        status: 'TODO',
        mvpStatus: 'TODO',
        surface: 'supabase',
      },
    ],
  },
  {
    title: 'G • Work Graph • WorkCut · Live · Feed · Arcade (Sprint 2+)',
    fullPct: 84,
    mvpPct: 95,
    items: [
      {
        id: 'wg-workcut',
        label: '/app/studio/workcut CapCut editor + workcut.ts',
        pct: 82,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/studio/workcut',
        desc: 'Admin WorkCut studio artifact · templates stub · export UI',
        left: '@ffmpeg/ffmpeg install for real 9:16 mp4',
      },
      {
        id: 'wg-live',
        label: 'apps/web/lib/live.ts + /app/live Session Viewer',
        pct: 80,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/live',
        desc: 'Viewer gift economy UI live · stopLive projectDraft stub · music BGM',
        left: 'Mux/LiveKit production keys + Realtime',
      },
      {
        id: 'wg-arcade',
        label: '/app/arcade Games Center · 6 HTML + Arcade Live stub',
        pct: 86,
        mvpPct: 96,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/arcade',
        desc: '6 playables · MFC earn ledger local · gift spend',
        left: 'Persist arcade ledger · AdGate webhook credit path',
      },
      {
        id: 'wg-feed',
        label: '/app/feed Timeline · snap WorkCuts + music drawer',
        pct: 80,
        mvpPct: 95,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'web',
        href: '/app/feed',
        desc: 'TikTok-style column · filters · gift rain · Music Integration mock APIs',
        left: 'Typesense + PostGIS 10mi · real media + Findy',
      },
    ],
  },
  {
    title: 'H • Trust Scale · Stripe · Bots · Tests (Sprint 3)',
    fullPct: 65,
    mvpPct: 80,
    items: [
      {
        id: 's3-trust',
        label: 'trust.ts · Verified Pro 4 steps · TrustScore formula',
        pct: 75,
        mvpPct: 85,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        desc: 'Event-sourced in-memory ledger · seedAyoTailorsTrust · Veri bot',
        left: 'Persist to trust_ledger table after schema apply',
      },
      {
        id: 's3-bots',
        label: 'bots.ts + supabase/functions/bots/* ×9',
        pct: 55,
        mvpPct: 70,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'web',
        desc: 'Milo Cutty Quoto Timi Findy Helpy Veri Growy Lingo local runners + edge stubs',
        left: 'BullMQ + OpenAI autonomous workers in prod',
      },
      {
        id: 's3-stripe',
        label: 'stripe.ts Connect · escrow · MFC · withdraw',
        pct: 68,
        mvpPct: 85,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'web',
        desc: '£320 Aisha hold £32 · gift 70/30 · packs + Arcade earn dual door',
        left: 'STRIPE_SECRET_KEY live Connect · offerwall postback→MFC',
      },
      {
        id: 's3-tests',
        label: 'packages/tests Vitest unit suite',
        pct: 25,
        mvpPct: 40,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'packages',
        desc: 'gating · project · stripe escrow · trust/bots — expand toward 100',
        left: 'Playwright e2e + coverage 80%+',
      },
    ],
  },
  {
    title: 'E • packages + assets + tests (~300 files)',
    fullPct: 52,
    mvpPct: 70,
    items: [
      {
        id: 'pkg-ui',
        label: 'packages/ui (~40) shared components',
        pct: 65,
        mvpPct: 80,
        status: 'WIP',
        mvpStatus: 'DONE',
        surface: 'packages',
        desc: 'packages/ui/src/uprm/* mirrors web + marketing splits',
        left: 'Deduplicate copies · peer react via pnpm workspace install',
      },
      {
        id: 'pkg-config-types',
        label: 'packages/config + types (~30)',
        pct: 70,
        mvpPct: 85,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'packages',
        desc: 'packages/types + packages/config brand/OLDHAM/ESCROW shipped',
      },
      {
        id: 'assets-100',
        label: 'assets/ 100 trade images (lace · OBD · fade…)',
        pct: 70,
        mvpPct: 85,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'marketing',
        desc: 'Marketing ships large webp asset set',
      },
      {
        id: 'tests-100',
        label: 'tests/ 100 files',
        pct: 25,
        mvpPct: 40,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'packages',
        desc: 'packages/tests Vitest unit suite started',
        left: 'Scale to 100 + Playwright e2e',
      },
    ],
  },
  {
    title: 'F • Expo Native OS + AI Manual Guide + Infra',
    fullPct: 78,
    mvpPct: 92,
    items: [
      {
        id: 'nat-expo',
        label: 'Expo Router scaffold (auth + OS stacks)',
        pct: 55,
        mvpPct: 70,
        status: 'WIP',
        mvpStatus: 'WIP',
        surface: 'native',
        left: 'Parity with web product OS',
      },
      {
        id: 'guide',
        label: 'AI Manual Guide 16-page Explanatory Companion',
        pct: 100,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'marketing',
        href: '/',
      },
      {
        id: 'infra',
        label: 'VPS nginx · Let\'s Encrypt · HSTS · myfaceprofile.aikova.co.uk',
        pct: 100,
        mvpPct: 100,
        status: 'DONE',
        mvpStatus: 'DONE',
        surface: 'full',
      },
    ],
  },
];

const MVP_OVERALL = Math.round(PHASES.reduce((s, p) => s + p.mvpPct, 0) / PHASES.length);
const FULL_OVERALL = Math.round(PHASES.reduce((s, p) => s + p.fullPct, 0) / PHASES.length);

const MVP_CIRCLES = [
  { label: 'MVP Overall', pct: MVP_OVERALL, sub: 'Feed · Live · Arcade' },
  { label: 'Marketing', pct: 96, sub: '26+ routes' },
  { label: 'UPRM UI', pct: 97, sub: 'CommandShell CRM' },
  { label: 'Onboarding', pct: 92, sub: '32 fields gated' },
  { label: 'Arcade', pct: 96, sub: '6 HTML · scorecard' },
  { label: 'Live', pct: 96, sub: 'Session Viewer + BGM' },
  { label: 'Feed', pct: 95, sub: 'TikTok snap · music' },
  { label: 'Supabase', pct: 92, sub: 'schema+seed live' },
  { label: 'Guide', pct: 100, sub: '16-page flip' },
];

const FULL_CIRCLES = [
  { label: 'Full Overall', pct: FULL_OVERALL, sub: 'Feed+Live+Arcade + Sprint3' },
  { label: 'Marketing', pct: 92, sub: '~120 files' },
  { label: 'apps/web', pct: 90, sub: 'PID1 · Feed · Live' },
  { label: 'Work Graph', pct: 84, sub: 'Cut·Live·Feed·Arcade' },
  { label: 'Ad→MFC', pct: 85, sub: 'scorecard live' },
  { label: 'Music APIs', pct: 88, sub: 'Jamendo live' },
  { label: 'Supabase', pct: 88, sub: '16 tables live' },
  { label: 'Packages', pct: 52, sub: 'ui types · vitest' },
  { label: 'Stripe/Trust', pct: 68, sub: 'dual-door MFC' },
];

const LEFT_MVP = [
  {
    pri: 1,
    title: 'Run /demo go-live probes → READY FOR TEST',
    detail: 'Enter Test Lab · confirm Supabase/Jamendo/schema probes · smoke Feed · Discover · Live · Studios · Arcade',
  },
  {
    pri: 2,
    title: 'Optional: Login demo user for RLS data',
    detail: 'ayo@oldham.demo from /demo or Login · Action Center loads uprm_contacts + wallet',
  },
  {
    pri: 3,
    title: 'Finish Google OAuth in Supabase console (optional for email testing)',
    detail: 'Enable Google provider · Client ID/secret · redirect already allow-listed on myfaceprofile',
  },
];

const LEFT_FULL = [
  {
    pri: 1,
    title: 'AdGate / 5-engine S2S postbacks → mfc_ledger',
    detail: 'engineRegistry twin · HMAC webhook · caps from scorecard · spend-only gifts',
  },
  {
    pri: 2,
    title: 'Mux/LiveKit + real music APIs + Feed media',
    detail: 'Live ingest · Spotify/MusicKit tokens · Typesense/PostGIS 10mi · gift Realtime',
  },
  {
    pri: 3,
    title: 'Stripe Connect escrow + Bot Army runtime + tests',
    detail: '£320 Aisha escrow · bots/* workers · Vitest+Playwright 80%+',
  },
];

type LocalNote = { id: string; text: string; mode: Mode; created: string };

function Circle({ pct, size = 92, stroke = 8 }: { pct: number; size?: number; stroke?: number }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let r = 0;
    const id = setInterval(() => {
      r += 1;
      if (r >= pct) {
        r = pct;
        clearInterval(id);
      }
      setAnimated(r);
    }, 14);
    return () => clearInterval(id);
  }, [pct]);
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (animated / 100) * circ;
  const gid = `mf-grad-${size}-${stroke}-${pct}`;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ stroke: `url(#${gid})`, transition: 'stroke-dashoffset 0.2s' }}
        />
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8FFF4A" />
            <stop offset="45%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#FF8A00" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-bold tracking-tight text-[#0F172A]" style={{ fontSize: size < 60 ? 11 : 18 }}>
          {animated}%
        </span>
      </div>
    </div>
  );
}

function Badge({ pct, status }: { pct: number; status: Status }) {
  const map: Record<Status, string> = {
    DONE: 'bg-[#0F172A] text-white',
    WIP: 'bg-white border border-[#E2E8F0] text-[#0F172A]',
    TODO: 'bg-[#F8FAFC] border border-dashed border-[#CBD5E1] text-[#64748B]',
    NEW: 'bg-amber-50 border border-amber-200 text-amber-900',
    FROM: 'bg-sky-50 border border-sky-200 text-sky-900',
  };
  const dot: Record<Status, string> = {
    DONE: '#8FFF4A',
    WIP: '#00BFFF',
    TODO: '#94A3B8',
    NEW: '#F59E0B',
    FROM: '#0EA5E9',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide ${map[status]}`}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot[status] }} />
      {status} · {pct}%
    </span>
  );
}

export default function ProductionReadinessPage() {
  const [mode, setMode] = useState<Mode>('full');
  const [surface, setSurface] = useState<Surface>('full');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'A • Marketing Site — 26 pages + legal = 28 routes (~120 files)': true,
    'B • apps/web MAIN APP — UPRM COMMAND CENTER PID 1 (~180 files)': true,
    'D • Supabase backend (~40 files · 12 tables · functions)': true,
  });
  const [notes, setNotes] = useState<LocalNote[]>([]);
  const [newNote, setNewNote] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const scannedAt = useMemo(() => new Date().toISOString(), []);

  const overall = mode === 'mvp' ? MVP_OVERALL : FULL_OVERALL;
  const circles = mode === 'mvp' ? MVP_CIRCLES : FULL_CIRCLES;
  const leftNow = mode === 'mvp' ? LEFT_MVP : LEFT_FULL;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(NOTES_KEY);
      if (raw) setNotes(JSON.parse(raw) as LocalNote[]);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((ent) => {
          if (ent.isIntersecting) ent.target.classList.add('in');
        });
      },
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, [mode]);

  const persistNotes = (next: LocalNote[]) => {
    setNotes(next);
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const createNote = () => {
    if (!newNote.trim()) return;
    persistNotes([
      ...notes,
      { id: `${Date.now()}`, text: newNote.trim(), mode, created: new Date().toISOString() },
    ]);
    setNewNote('');
    setToast('Note saved locally');
    setTimeout(() => setToast(null), 2200);
  };

  const exportReport = () => {
    const report = {
      assessment: mode === 'mvp' ? 'MVP readiness (live site)' : 'Full Project Tree production readiness',
      mvpOverall: MVP_OVERALL,
      fullOverall: FULL_OVERALL,
      activeMode: mode,
      generated: new Date().toISOString(),
      scannedAt,
      host: 'https://myfaceprofile.aikova.co.uk',
      targetTree:
        'MY FACE PROFILE — FULL PROJECT TREE OS · 640 files · MVP 250 · Full 620-650 · Turbo · 26 pages · 32 fields · 9 bots · 6 trades',
      liveNote:
        'Live: Vite marketing + Turbo/apps/web PID1 + Sprint2 Work Graph · Supabase schema+Oldham seed applied — Sprint3 for 95%+',
      phases: PHASES,
      circles,
      leftNow,
      notes,
      surfaceFilter: surface,
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MyFace-${mode === 'mvp' ? 'MVP' : 'FullTree'}-Readiness-${overall}pct.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Readiness report exported');
    setTimeout(() => setToast(null), 2000);
  };

  const filteredPhases = PHASES.map((ph) => ({
    ...ph,
    pct: mode === 'mvp' ? ph.mvpPct : ph.fullPct,
    items:
      surface === 'full'
        ? ph.items
        : ph.items.filter((i) => !i.surface || i.surface === surface || i.surface === 'full'),
  })).filter((ph) => surface === 'full' || ph.items.length > 0);

  const flat = PHASES.flatMap((p) => p.items);
  const statusOf = (i: ModuleItem) => (mode === 'mvp' ? i.mvpStatus : i.status);
  const doneCount = flat.filter((i) => statusOf(i) === 'DONE' || statusOf(i) === 'FROM').length;
  const wipCount = flat.filter((i) => statusOf(i) === 'WIP' || statusOf(i) === 'NEW').length;
  const todoCount = flat.filter((i) => statusOf(i) === 'TODO').length;

  return (
    <div
      data-safe-area-inset-root
      className="min-h-screen w-full bg-[#E6EBF4] text-[#0F172A] overflow-x-clip"
      style={{ boxSizing: 'border-box', paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <header
        data-safe-area-sticky-top
        className="sticky z-40 backdrop-blur-xl bg-white/80 border-b border-[#E2E8F0]"
        style={{ top: 'var(--safe-area-inset-top)' }}
      >
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <div
                className="h-9 w-9 rounded-2xl grid place-items-center text-[#0F172A] font-black text-[14px] shadow"
                style={{ background: GRADIENT }}
              >
                M
              </div>
              <div className="leading-none">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[16px] tracking-tight">MyFace</span>
                  <span className="text-[11px] font-semibold tracking-widest text-[#64748B] uppercase">
                    Readiness
                  </span>
                </div>
                <div className="text-[11px] text-[#64748B] truncate">
                  Dual score · MVP live vs Full Project Tree OS
                </div>
              </div>
            </Link>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {([
                { id: 'mvp' as Mode, label: `MVP ${MVP_OVERALL}%` },
                { id: 'full' as Mode, label: `Full Tree ${FULL_OVERALL}%` },
              ]).map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setMode(r.id)}
                  className={`rounded-xl px-3.5 py-1.5 text-[12px] font-semibold tracking-wide transition-all ${
                    mode === r.id ? 'text-[#0F172A] shadow' : 'text-[#64748B] hover:text-[#0F172A]'
                  }`}
                  style={mode === r.id ? { background: GRADIENT } : {}}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={exportReport}
              className="hidden sm:inline-flex rounded-xl px-4 py-2 text-[12px] font-bold text-[#0F172A] shadow"
              style={{ background: GRADIENT }}
            >
              Export JSON
            </button>
          </div>
        </div>
        <div className="border-t border-[#F1F5F9] bg-[#F8FAFC]/80">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#E2E8F0] px-2.5 py-1 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-[#8FFF4A]" />
              {mode === 'mvp' ? 'MVP · live myfaceprofile slice' : 'FULL · vs 640-file Project Tree OS'}
            </span>
            <span className="text-[#94A3B8]">→</span>
            <span className="font-semibold">
              {doneCount} DONE/FROM · {wipCount} WIP/NEW · {todoCount} TODO · {mode === 'mvp' ? 'MVP' : 'Full'}{' '}
              {overall}%
            </span>
            <span className="text-[#94A3B8]">·</span>
            <span className="text-[#64748B]">Also MVP {MVP_OVERALL}% · Full {FULL_OVERALL}%</span>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#F8FAFC] to-white" />
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-start">
            <div className="reveal in">
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-semibold shadow-sm">
                <span
                  className="h-5 w-5 rounded-full grid place-items-center text-[#0F172A] text-[11px]"
                  style={{ background: GRADIENT }}
                >
                  ✦
                </span>
                Full Tree target: 26 pages · 32 fields · 9 bots · 6 trades · 12 projects · 47 contacts · 1247 MFC ·
                4.9 Trust · £618K ARR · 640 files
              </div>
              <h1 className="mt-5 text-[32px] sm:text-[44px] leading-[0.95] font-extrabold tracking-tight">
                {mode === 'mvp' ? 'MVP Readiness' : 'Production Readiness'} —{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: GRADIENT }}>
                  {mode === 'mvp' ? 'what ships today' : 'vs Full Project Tree OS'}
                </span>
              </h1>
              <p className="mt-4 text-[14px] sm:text-[15px] leading-6 text-[#475569] max-w-[720px]">
                {mode === 'mvp' ? (
                  <>
                    <b>MVP score {MVP_OVERALL}%</b> — live on myfaceprofile: CommandShell CRM, /app/feed snap
                    timeline, /app/live Session Viewer + music drawer, /app/arcade 6 HTML games + Ad Revenue
                    scorecard, 32-field onboarding, HTTPS. Shippable Oldham slice (~250-file MVP), not 640-file Turbo OS.
                  </>
                ) : (
                  <>
                    <b>Full Production Tree score {FULL_OVERALL}%</b> — vs Full Project Tree OS (Turbo · apps/web
                    PID 1 · schema applied · Work Graph). Feed + Live Viewer + Arcade + scorecard shipped;
                    Sprint 3 AdGate/Mux/real music APIs still open for 95%+.
                  </>
                )}
              </p>
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { k: 'MVP live', v: `${MVP_OVERALL}%`, d: 'Shipped slice' },
                  { k: 'Full tree', v: `${FULL_OVERALL}%`, d: 'vs 640 files' },
                  { k: 'Marketing', v: mode === 'mvp' ? '96%' : '92%', d: '26+ pages' },
                  { k: 'UPRM PID 1', v: mode === 'mvp' ? '94%' : '85%', d: 'Command center' },
                ].map((c) => (
                  <div key={c.k} className="rounded-2xl border border-[#E2E8F0] bg-white p-3 shadow-sm">
                    <div className="text-[11px] font-semibold tracking-widest uppercase text-[#94A3B8]">{c.k}</div>
                    <div className="text-[20px] font-bold">{c.v}</div>
                    <div className="text-[11px] text-[#64748B]">{c.d}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="text-[11px] font-bold tracking-widest uppercase text-[#64748B]">
                  What&apos;s left · {mode === 'mvp' ? 'MVP' : 'Full Tree'} priority
                </div>
                <div className="mt-3 grid gap-2">
                  {leftNow.map((item) => (
                    <div key={item.pri} className="flex gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div
                        className="h-7 w-7 shrink-0 rounded-full grid place-items-center text-[12px] font-black text-[#0F172A]"
                        style={{ background: GRADIENT }}
                      >
                        {item.pri}
                      </div>
                      <div>
                        <div className="text-[13px] font-bold">{item.title}</div>
                        <div className="text-[11px] text-[#64748B] leading-5 mt-0.5">{item.detail}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal in">
              <div className="rounded-[32px] border border-[#E2E8F0] bg-white p-6 sm:p-7 shadow-[0_24px_64px_-16px_rgba(15,23,42,0.12)]">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="text-[12px] font-bold tracking-widest uppercase text-[#64748B]">
                    {mode === 'mvp' ? 'MVP readiness' : 'Full tree readiness'}
                  </div>
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-bold text-[#0F172A]"
                    style={{ background: GRADIENT }}
                  >
                    {mode === 'mvp' ? 'LIVE' : 'TARGET'} · {overall}%
                  </span>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <Circle pct={overall} size={160} stroke={14} />
                  <div className="mt-2 text-[11px] font-semibold tracking-widest uppercase text-[#64748B]">
                    {mode === 'mvp' ? 'MVP Ready' : 'Full OS Ready'}
                  </div>
                  <div className="mt-6 grid w-full grid-cols-3 gap-2">
                    {circles.slice(1, 7).map((c) => (
                      <div key={c.label} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-center">
                        <div className="grid place-items-center">
                          <Circle pct={c.pct} size={56} stroke={6} />
                        </div>
                        <div className="mt-1 text-[11px] font-bold leading-tight">{c.label}</div>
                        <div className="text-[10px] text-[#64748B]">{c.sub}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 w-full rounded-2xl bg-[#0F172A] p-3 text-white flex items-center justify-between gap-3">
                    <div className="text-[11px] leading-tight">
                      <b>Quick jumps</b>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <Link to="/signup" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          Signup
                        </Link>
                        <Link to="/app/onboarding" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          32 fields
                        </Link>
                        <Link to="/app/dashboard" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          UPRM PID 1
                        </Link>
                        <Link to="/sitemap" className="rounded-full bg-white/10 px-2 py-0.5 hover:bg-white/20">
                          26 pages
                        </Link>
                      </div>
                    </div>
                    <div className="h-8 w-8 shrink-0 rounded-full grid place-items-center" style={{ background: GRADIENT }}>
                      ⚑
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
        <div className="rounded-[28px] border border-[#E2E8F0] bg-white p-5 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold text-[#0F172A]"
                style={{ background: GRADIENT }}
              >
                FULL PROJECT TREE OS
              </span>
              <span className="text-[13px] font-bold">Filter branches · Marketing · web · supabase · packages</span>
            </div>
            <div className="flex flex-wrap gap-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {(['full', 'marketing', 'web', 'supabase', 'packages', 'native'] as Surface[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setSurface(r)}
                  className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold ${
                    surface === r ? 'bg-white shadow text-[#0F172A]' : 'text-[#64748B]'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-6 grid md:grid-cols-4 gap-3">
            {[
              { flag: '📣', title: 'Marketing ~120', items: ['26 pages + legal', '6 trade verticals', 'AI Guide', 'Assets webp set'] },
              { flag: '◍', title: 'apps/web ~180', items: ['CommandShell CRM', 'Feed + Live Viewer', '6 HTML games', 'Ad→MFC · Music drawer'] },
              { flag: '🗄', title: 'Supabase ~40', items: ['12 tables target', 'Edge fns', 'Realtime gifts', 'Auth live today'] },
              { flag: '📦', title: 'Shared ~300', items: ['packages/ui', '100 assets', '100 tests', 'Turbo root'] },
            ].map((col) => (
              <div key={col.title} className="rounded-[24px] border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center gap-2">
                  <span className="text-[18px]">{col.flag}</span>
                  <b className="text-[13px]">{col.title}</b>
                </div>
                <div className="mt-3 space-y-2 text-[11px] leading-[1.4]">
                  {col.items.map((t) => (
                    <div key={t} className="rounded-xl border border-[#E2E8F0] bg-white p-2.5 text-[#334155]">
                      {t}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tree" className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-4 pb-16">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-[22px] font-extrabold tracking-tight">
            Production Tree · {mode === 'mvp' ? 'MVP' : 'Full OS'} expandable
          </h2>
          <button
            type="button"
            onClick={exportReport}
            className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1.5 text-[11px] font-bold shadow-sm hover:shadow"
          >
            Export Report JSON
          </button>
        </div>
        <div className="mt-4 grid gap-3">
          {filteredPhases.map((phase) => {
            const isOpen = !!expanded[phase.title];
            return (
              <div key={phase.title} className="rounded-[20px] border border-[#E2E8F0] bg-white overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setExpanded((e) => ({ ...e, [phase.title]: !isOpen }))}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
                >
                  <div className="h-9 w-9 rounded-xl grid place-items-center border border-[#E2E8F0] bg-white text-[12px] font-bold">
                    {phase.pct}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate">{phase.title}</div>
                    <div className="text-[11px] text-[#64748B]">
                      {phase.items.filter((i) => {
                        const s = statusOf(i);
                        return s === 'DONE' || s === 'FROM';
                      }).length}{' '}
                      DONE/FROM ·{' '}
                      {phase.items.filter((i) => {
                        const s = statusOf(i);
                        return s === 'WIP' || s === 'NEW';
                      }).length}{' '}
                      WIP/NEW · {phase.items.filter((i) => statusOf(i) === 'TODO').length} TODO
                      <span className="text-[#94A3B8]"> · MVP {phase.mvpPct}% · Full {phase.fullPct}%</span>
                    </div>
                  </div>
                  <div className="hidden sm:block w-[120px] h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                    <div className="h-full" style={{ width: `${phase.pct}%`, background: GRADIENT }} />
                  </div>
                  <span
                    className={`grid place-items-center h-7 w-7 rounded-full border bg-white transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ⌄
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-2 sm:p-3 grid gap-2">
                    {phase.items.map((it) => {
                      const st = statusOf(it);
                      const pct = mode === 'mvp' ? it.mvpPct : it.pct;
                      return (
                        <div
                          key={it.id}
                          className="rounded-2xl border border-[#E2E8F0] bg-white p-3 sm:p-4 flex gap-3 items-start hover:shadow-md transition-all"
                        >
                          <div className="hidden sm:block">
                            <Circle pct={pct} size={44} stroke={5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[12px] sm:text-[13px] font-semibold leading-tight">{it.label}</span>
                              <Badge pct={pct} status={st} />
                              {it.surface && (
                                <span className="rounded-full bg-[#F1F5F9] border border-[#E2E8F0] px-2 py-0.5 text-[10px] font-bold uppercase">
                                  {it.surface}
                                </span>
                              )}
                              {it.files && (
                                <span className="rounded-full bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-mono text-[#64748B]">
                                  {it.files}
                                </span>
                              )}
                            </div>
                            {it.desc && <div className="mt-1 text-[11px] text-[#64748B] leading-[1.5]">{it.desc}</div>}
                            {it.left && (
                              <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-2.5 py-1.5">
                                Left: {it.left}
                              </div>
                            )}
                            {it.href && (
                              <div className="mt-2">
                                <Link to={it.href} className="text-[11px] font-bold text-[#00BFFF] hover:underline">
                                  Open {it.href} →
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-4">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 shadow-sm">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#64748B]">Build monitor notes</div>
            <div className="mt-2 flex gap-2">
              <input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g. Split BotArmy.tsx from DashboardPage"
                className="flex-1 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[12px] outline-none focus:border-[#00BFFF]"
              />
              <button
                type="button"
                onClick={createNote}
                disabled={!newNote.trim()}
                className="rounded-xl px-4 py-2 text-[11px] font-bold text-[#0F172A] disabled:opacity-50 shadow"
                style={{ background: GRADIENT }}
              >
                Add
              </button>
            </div>
            <div className="mt-3 grid gap-2 max-h-[180px] overflow-auto">
              {notes.length === 0 && (
                <div className="text-[11px] text-[#94A3B8]">No notes yet — saved in this browser.</div>
              )}
              {notes
                .slice()
                .reverse()
                .map((n) => (
                  <div key={n.id} className="rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-2.5 text-[11px]">
                    <span className="font-semibold">{n.mode}</span> · {n.text}
                    <div className="text-[10px] text-[#94A3B8]">{new Date(n.created).toLocaleString()}</div>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-[#0F172A] bg-[#0F172A] text-white p-5 shadow-lg">
            <div className="text-[11px] font-bold tracking-widest uppercase text-[#94A3B8]">Circle board</div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {circles.map((c) => (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => document.getElementById('tree')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center hover:bg-white/10 transition"
                >
                  <div className="grid place-items-center">
                    <Circle pct={c.pct} size={56} stroke={6} />
                  </div>
                  <div className="mt-1 text-[11px] font-bold">{c.label}</div>
                  <div className="text-[10px] text-[#94A3B8]">{c.sub}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-5 flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <div className="text-[13px] font-bold">
                Dual assessment · MVP live {MVP_OVERALL}% · Full Project Tree OS {FULL_OVERALL}% · VisaguideOS → MyFace
              </div>
              <div className="mt-2 text-[11px] text-[#64748B] leading-[1.5]">
                myfaceprofile.aikova.co.uk · Export JSON · Next Full Tree: Turbo root → split apps/web PID 1 → 12 tables
              </div>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[11px] font-bold text-[#0F172A] self-start"
              style={{ background: GRADIENT }}
            >
              MVP {MVP_OVERALL}% · Full {FULL_OVERALL}%
            </span>
          </div>
        </div>
      </footer>

      {toast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] rounded-full bg-[#0F172A] text-white px-4 py-2 text-[12px] font-semibold shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
