# My Face Profile OS

**SHOW · CONNECT · GROW** — Your Work Is Your Face. Not Your CV.

M gradient: `#8FFF4A → #00E5C0 → #1A7CFF → #FFE600 → #FF8A00`

## Dual score (Sprint 1 in progress)

| Mode | Target after Sprint 1 | Notes |
|------|----------------------|--------|
| MVP live | ~90%+ | Marketing + split UPRM on Vite `/app/dashboard` |
| Full Tree | ~80% foundation | Turbo + `apps/web` PID 1 + `supabase/schema.sql` |

## Monorepo

```
pnpm-workspace.yaml
turbo.json
apps/marketing   # Vite marketing + product OS (live myfaceprofile.aikova.co.uk)
apps/web         # Next 14 UPRM PID 1 → http://localhost:3001/uprm
packages/ui      # Shared UPRM components
packages/types
packages/config
supabase/        # schema.sql + functions/onboarding-chat
```

## Dev

```bash
pnpm install
pnpm dev:marketing   # :3000
pnpm --filter @myface/web dev   # :3001
```

## Supabase

1. Paste `supabase/schema.sql` into SQL editor
2. Adapt `supabase/seed_oldham.sql` with your auth user id
3. Deploy stub: `supabase functions deploy onboarding-chat`

## Oldham test

See `OLDHAM_TEST_CHECKLIST.md` — AYO'S TAILORS Spindlegate OL1.

## Deploy (marketing)

Build `apps/marketing` → rsync/scp `dist/` to VPS `/var/www/myfaceprofile`.

## Sprint map

1. **Foundation** (this) — Turbo · schema · split UPRM · Stripe stub · onboarding memory
2. **Work Graph** — WorkCut FFmpeg · Mux Live · Feed/PostGIS
3. **Trust Scale** — trust_ledger · 9 bot workers · 100 tests · 95%+
