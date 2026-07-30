# Current Phase

Last updated: 2026-07-30

This is a fast pointer doc — "what phase is this project in, right now, and what's next." For
the full architecture snapshot read `systemstatus.md`; for the dated history of *why* and *how*
each change happened read `CHANGELOG.md`. Update this file whenever a phase starts or finishes;
don't let it drift into a second changelog.

## Status: Phase 3 complete, homepage redesigned, live on Vercel

| Phase | Prompt | Result doc | Status |
|---|---|---|---|
| Initial build | `prompts/version2.md`, `prompts/refinement.md` | — | ✅ Complete — commits `6861178`, `7b42dfd` |
| Phase 1 — CMS Foundation | `prompts/backend/phase1.md` | `prompts/results/phase1result.md` | ✅ Complete — commit `a95dec1` |
| Phase 1.5 — Production Hardening | `prompts/backend/phase1_5.md` | `prompts/results/phase1_5result.md` | ✅ Complete — commit `d28d9e4` |
| Phase 2 — Blog / Publishing Platform | `prompts/backend/phase2.md` | `prompts/results/phase2result.md` | ✅ Complete — commit `9ffcc23` |
| Phase 3 — Agency Operations Platform | `prompts/backend/phase3.md` | `prompts/results/phase3result.md` | ✅ Complete — commit `9ffcc23` |
| Homepage UI/UX redesign | user request (not a numbered backend phase) | — | ✅ Complete — commit `9ffcc23` + refinements |
| Production deploy fixes (Vercel) | — | — | ✅ Complete — commits `477f2c2`, `782df9f` |

## Where things actually stand

- **Deployed**: the site is live on Vercel, connected to the same Supabase Postgres project used
  in local dev. `/admin`, the Blog nav link, and the build itself were all broken on first deploy
  and are now fixed — see `CHANGELOG.md` 2026-07-30 for the full diagnostic writeup. Three
  separate root causes, worth knowing before touching deploy config again:
  1. Schema was never migrated to production (Payload disables auto-push whenever
     `NODE_ENV === "production"`, and this project had no `prodMigrations`/migrations at all until
     now — `payload.config.ts` now wires `migrations/` via `prodMigrations`).
  2. `DATABASE_URL` in Vercel was briefly set to the literal `.env.example` placeholder — always
     copy the real value from `.env.local`, never retype it.
  3. `/blog/rss.xml` and `/sitemap.xml` used to be statically pre-rendered *at build time*
     (`revalidate`), making the build itself depend on Postgres being reachable from Vercel's
     build step — both are now `export const dynamic = "force-dynamic"`, computed per-request
     like every other blog route.
- **Homepage**: fully redesigned (UI/UX only, zero Payload schema change) — a card/pill visual
  system whose accent gradient deliberately blends the *original* brand red through purple to
  blue, so both palettes stay visibly mixed rather than one replacing the other. The blog
  (Phase 2) and `/contact` (Phase 3) pages are untouched — the new tokens live in a CSS namespace
  separate from the existing `--color-accent`. Full detail in `systemstatus.md` §2.
- **Lead capture**: `/contact` and the homepage's embedded contact section both post to
  `/api/contact` — validated, honeypot-checked, DB-rate-limited, optionally Turnstile-verified.
  The direct Payload REST create endpoint (`POST /api/leads`) is closed (`403`).
- **CRM**: `leads` collection is a real record (company/website/budget/services/priority/assigned
  user/internal notes/attribution), `won`/`lost` statuses, full version/audit history. Editors can
  read/triage leads.
- **Email**: Resend + React Email wired end-to-end, gracefully logging to the console instead of
  sending when `RESEND_API_KEY` isn't set (it currently isn't).
- **Admin**: a business dashboard at `/admin/business-dashboard`, a CSV export button on the Leads
  list, both custom Payload admin views.
- **Placeholders**: `clients`/`projects`/`contracts`/`files`/`meetings` collections exist (hidden,
  minimal schema) for a future client-portal phase.
- **Migrations**: real now, not just dev-mode push. `migrations/20260730_041032_initial_schema.ts`
  represents the full schema as of this writing; the live database's migration ledger has been
  reconciled (the dev-push marker removed, this migration recorded as already-applied) so future
  boots don't hit the interactive "you used dev mode" prompt. **Going forward, any new
  collection/field change needs a real `payload migrate:create` + a reviewed migration file** —
  relying on `npm run dev`'s auto-push and forgetting to migrate production is exactly what broke
  first deploy.

## Known gaps

- **No browser-automation tool** has been available in any session so far — no actual mobile
  (390px)/desktop (1440px) screenshots or console-error checks on the blog, `/contact`, the admin
  dashboard, or the redesigned homepage. Every verification claim in this project has been
  structural (build/lint/typecheck/curl), not visual. This is the single biggest outstanding gap
  — a real Playwright pass across the whole site is overdue.
- **No real `RESEND_API_KEY` or Turnstile keys configured.** Fully wired and tested in
  graceful-degradation mode (emails log to console, Turnstile verification is skipped). Add
  `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to activate — no code
  changes needed, in either `.env.local` or Vercel's environment variables (both need it
  independently if you want it active in both places).

## What's next

No Phase 4 prompt exists yet. Candidates based on what's explicitly still deferred: real
Slack/Notion/WhatsApp integrations (the `dispatchLeadEvent()` seam in
`payload/hooks/lead-events.ts` is ready for them), building out real UI for the
clients/projects/contracts/files/meetings placeholder collections, and — highest priority given
the known gap above — a real Playwright visual pass across the blog, contact/admin surfaces, and
the redesigned homepage, now that there's finally production traffic to protect.
