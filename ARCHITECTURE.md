# MyFace Profile — Project Tree & Architecture

```
myface/
├── app/                          # Expo Router (iOS / Android / Expo web OS)
│   ├── _layout.tsx               # AuthProvider + root stack
│   ├── index.tsx                 # Gate → marketing hint / OS home
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── signup.tsx
│   └── (os)/
│       ├── _layout.tsx
│       ├── home.tsx              # Command home after auth
│       ├── onboarding.tsx        # 32-field UPRM companion
│       └── uprm.tsx              # UPRM command center shell
├── apps/
│   └── marketing/                # Vite + React + Tailwind (24+ pages)
│       ├── public/pages|legal/   # HTML verticals + legal
│       └── src/pages/            # Wired marketing routes
├── src/
│   ├── config/env.ts
│   ├── lib/supabase.ts
│   ├── lib/auth/                 # Email + Google OAuth
│   └── onboarding/               # Steps, gating, companion (VisaGuide format)
├── .env                          # LOCAL ONLY — gitignored
└── .env.example
```

## Surfaces

| Surface | Stack | URL / entry |
|---------|--------|-------------|
| Marketing site | Vite + RR + Tailwind | `apps/marketing` → `myfaceprofile.aikova.co.uk` |
| Product OS (web) | `apps/marketing/src/product/` | `/signup` → `/app/onboarding` → `/app/dashboard` |
| Product OS (native) | Expo Router | `npm start` / `npm run ios|android|web` |
| Backend | Supabase Auth + Postgres + REST | `jyckmajjbvydgsvnmeaj.supabase.co` |

### Product folder (`apps/marketing/src/product/`)

```
product/
  auth/          SignupPage, LoginPage, AuthProvider, RequireAuth
  onboarding/    fields, gating, OnboardingFlow, storage, services/*
  dashboard/     DashboardShell + UprmCommandCenter + uprm/* split comps
  ProductLayout.tsx
```

Flow: **Signup/Login → UPRM Onboarding (32 fields) → Dashboard**

### Sprint 1 foundation (Close Readiness Gap)

- Turbo: `pnpm-workspace.yaml` · `turbo.json` · `packages/{ui,types,config}` · `apps/web` (Next `/uprm`)
- Supabase: `supabase/schema.sql` + `seed_oldham.sql` + `functions/onboarding-chat`
- Split UPRM: BotArmy, PipelineKanban, ProjectCard, GiftRain, MFCWallet, TrustScoreBadge, LiveWorkshop, ShopCard, BookingCalendar, WorkCutEditor, UPRMContactsList, QuantumBackground
- Stripe stub: `apps/web/lib/stripe.ts` (escrow 10%/5%, gift 70/30)
- Checklist: `OLDHAM_TEST_CHECKLIST.md` · ZIP: `Downloads/my-face-profile-sprint1.zip`

### Sprint 2 Work Graph (next prompts)

- `apps/web/lib/workcut.ts` + WorkCutEditor templates (FFmpeg optional)
- `apps/web/lib/live.ts` + LiveWorkshop Go Live → record→project
- `apps/web/lib/feed.ts` + `search.ts` + `app/(feed)/page.tsx` Findy 10mi
- Sprint Phase prompt artifact kept internal: `docs/internal/` (not published)
- ZIP: `Downloads/my-face-profile-sprint2.zip`

### Sprint 3 Trust Scale (in progress — not a public prompt page)

- `apps/web/lib/trust.ts` — Verified Pro 4 steps · TrustScore · Veri seed
- `apps/web/lib/bots.ts` — 9 bot runners + monetization snapshot
- `apps/web/lib/stripe.ts` — Connect/escrow/MFC/withdraw API (stub→live via env)
- `supabase/functions/bots/{milo,cutty,quoto,timi,findy,helpy,veri,growy,lingo}/`
- `packages/tests` — Vitest unit suite (gating · project · stripe · trust/bots)

### AI Manual Guide (Explanatory Companion)

Source: `Downloads/Face+Profile+Explanatory+Companion.tar.gz`  
Live: `apps/marketing/src/components/companion/MyFaceCompanionGuide.tsx`  
Wired in `AppLayout` on marketing pages (hidden on `/app`, `/signup`, `/login`, `/readiness`).

UX: bottom-right floater → **16-page** flip modal (Work OS + UPRM + MFC + Bot Army).

### Production Readiness (replicated from receptionist)

Source: `aikova-receptionist/.../readiness/ProductionReadinessPage.tsx`  
MyFace: `apps/marketing/src/pages/readiness/ProductionReadinessPage.tsx`  
Route: `/readiness` (alias `/production` → `/readiness`)

**Dual score:**
- **MVP** — live Vite slice on myfaceprofile (marketing + signup→32-field onboarding→condensed UPRM)
- **Full Tree** — vs Full Project Tree OS (640 files · Turbo · apps/web PID 1 · 12 tables · 9 bots split · 100 tests)

Expandable production tree · circle board · Export JSON · local build notes.

## Marketing routes (wired)

`/`, `/how-it-works`, `/work-os`, `/uprm`, `/live-workshop`, `/uprm-command`, `/projects`, `/projects/:id`, `/pricing`, `/verticals`, `/for-tailors|mechanics|plumbers|barbers|builders|electricians`, `/about`, `/careers`, `/contact`, `/blog`, `/blog/:slug`, `/onboarding`, `/sitemap`, `/architecture`, `/readiness`, `/legal/privacy|terms|coins`, `/trust`, `/help`

## Auth

- Email/password: Supabase Auth `signUp` / `signInWithPassword`
- Google: Supabase `signInWithOAuth({ provider: 'google' })` (web) + AuthSession path (native)
- Redirect / site URL: `https://myfaceprofile.aikova.co.uk` (+ Expo scheme `myface://`)

## Onboarding (VisaGuide companion format)

1. `config/onboardingSteps.ts` — field schema (32 fields / 4 phases)
2. `rules/fieldGating.ts` + `gatingEngine.ts` — deterministic eligibility
3. Companion orchestrator — one question at a time → complete → `/uprm`

## Deploy note

Marketing `dist/` → VPS `87.106.103.43` / domain `myfaceprofile.aikova.co.uk`.  
Do **not** put service_role or DB password on the client or in git.
