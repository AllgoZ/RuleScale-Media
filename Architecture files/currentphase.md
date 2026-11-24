# Current Phase

> **2026-11-24:** the redesign, new logo, performance pass, animations and hero project wheel were pushed to
> `main`. Read `handover.md` (state, open owner decisions, post-deploy checklist) and `ARCHITECTURE.md` (how it is
> built) first; the rows below that mention the older homepage describe history, not the current site.

Last updated: 2026-11-24

This is a fast pointer doc — "what phase is this project in, right now, and what's next." For
the full architecture snapshot read `systemstatus.md`; for the dated history of *why* and *how*
each change happened read `CHANGELOG.md`. Update this file whenever a phase starts or finishes;
don't let it drift into a second changelog.

## Status: Phase 3 complete, live on Vercel, Portfolio + Influencer application system shipped

| Phase | Prompt | Result doc | Status |
|---|---|---|---|
| Initial build | `prompts/version2.md`, `prompts/refinement.md` | — | ✅ Complete |
| Phase 1 — CMS Foundation | `prompts/backend/phase1.md` | `prompts/results/phase1result.md` | ✅ Complete |
| Phase 1.5 — Production Hardening | `prompts/backend/phase1_5.md` | `prompts/results/phase1_5result.md` | ✅ Complete |
| Phase 2 — Blog / Publishing Platform | `prompts/backend/phase2.md` | `prompts/results/phase2result.md` | ✅ Complete |
| Phase 3 — Agency Operations Platform | `prompts/backend/phase3.md` | `prompts/results/phase3result.md` | ✅ Complete |
| Homepage UI/UX redesign | user request (not a numbered backend phase) | — | ✅ Complete (superseded by the 2026-11-22 redesign below) |
| Frontend redesign v1-v3 (Ink/Paper/Red, Archivo, grid layout system) | `prompts/redesignui.md`, `redesignv2.md`, `redesignv3.md` | `redesign-handoff/` | ✅ Pushed to `main` 2026-11-24 |
| New logo, performance pass, animations, hero project wheel, contact/Instagram update | user requests | `Architecture files/performance-audit.md`, `animation-plan.md` | ✅ Pushed to `main` 2026-11-24 |
| Production deploy fixes (Vercel) | — | — | ✅ Complete |
| SEO domain migration (→ www.rulescale.in) | — | — | ✅ Complete |
| Google Tag Manager | `prompts/gooleTagManager/googletagmanager..md` | — | ✅ Complete |
| Portfolio system (Cloudinary, real case studies) | `prompts/v2/casestudy.md`, `prompts/projects_images/casestudy.md` | — | ✅ Complete |
| Influencer application system (`/form/influencer`) | `prompts/forms/influencer.md` | — | ✅ Complete |

All work above is committed and pushed to `origin/main`.

## Where things actually stand

- **Deployed**: live on Vercel at `https://www.rulescale.in`, connected to the same Supabase
  Postgres project used in local dev. Schema now only ever changes via a real `payload
  migrate:create` + committed migration file — `push: false` is set in `payload.config.ts`, so
  **local `npm run dev` no longer auto-pushes schema either**, matching production exactly. This
  was a hard-won fix (see `CHANGELOG.md` 2026-07-30 "permanent dev-push lockout") after a local
  verification script re-triggered the exact interactive-prompt build crash that broke the first
  deploy. If you add/change a collection or global field, you **must** run `payload migrate:create`
  and apply it — there is no other way for local dev or production to see the change anymore.
- **Domain**: `https://www.rulescale.in` is the single canonical domain everywhere — metadataBase,
  canonical/OG/Twitter tags, JSON-LD, sitemap, RSS, robots.txt. All of these read from the
  `SITE_URL` code constant (`lib/constants.ts`, env-overridable via `NEXT_PUBLIC_SITE_URL`), **not**
  the CMS-editable `siteSettings.url` field — that field's `unstable_cache` wrapper has no
  revalidate time, and a domain fix went out once that didn't take effect for a while because a
  standalone script's `revalidateTag()` call silently no-ops outside a real Next.js request
  context. `siteSettings.url` still exists and is editable in the admin, it's just no longer wired
  into anything that generates an actual URL. Full writeup: `CHANGELOG.md` 2026-08-03.
- **Google Tag Manager** (`GTM-K28PK4V6`) is live on every public page, not the admin — see
  `app/(frontend)/layout.tsx`.
- **Portfolio**: a real CMS-driven system (new `portfolio` collection, not an extension of the old
  `case-studies` collection) replaced the homepage's static-ish "Case Studies" section. Media is
  Cloudinary-hosted, never Payload/local storage — `lib/cloudinary.ts` + a custom admin upload
  field (`payload/admin-views/cloudinary-upload-field.tsx`) + an authenticated upload route. Three
  real client projects are published and featured (Mylini, Kodai Golden Honey, LightPic), each with
  a full case-study write-up, a live-site link, and its own `/work/[slug]` page; a fourth
  (Fairyland Resort) is uploaded but saved as a draft — fully hidden from every public query without
  being deleted. `/work/videos` + `/work/videos/[slug]` exist for video projects (none published
  yet). The **old** `case-studies` collection and its 3 placeholder entries (Marlow & Finch,
  Northbound Outfitters, Ferra Skincare) are untouched in the database, just no longer rendered
  anywhere — nothing was deleted. Full writeup: `CHANGELOG.md` 2026-08-03.
- **Lead capture**: `/contact` and the homepage's embedded contact section both post to
  `/api/contact` — validated, honeypot-checked, DB-rate-limited, optionally Turnstile-verified.
  The direct Payload REST create endpoint (`POST /api/leads`) is closed (`403`).
- **CRM**: `leads` collection is a real record (company/website/budget/services/priority/assigned
  user/internal notes/attribution), `won`/`lost` statuses, full version/audit history.
- **Email**: Resend + React Email wired end-to-end, gracefully logging to the console instead of
  sending when `RESEND_API_KEY` isn't set (it currently isn't).
- **Cloudinary**: real credentials ARE configured (`CLOUDINARY_CLOUD_NAME`/`CLOUDINARY_API_KEY`/
  `CLOUDINARY_API_SECRET` in `.env.local`) — the upload pipeline is live, not just built-and-waiting
  like Resend/Turnstile.
- **Admin**: a business dashboard at `/admin/business-dashboard`, a CSV export button on the Leads
  list, both custom Payload admin views.
- **Placeholders**: `clients`/`projects`/`contracts`/`files`/`meetings` collections exist (hidden,
  minimal schema) for a future client-portal phase.
- **Influencer applications**: a public 8-step application form at `/form/influencer` (an
  `influencer-applications` Payload collection, not a raw Supabase table/bucket as the spec
  literally requested — see `CHANGELOG.md` 2026-08-05 for why staying inside the existing Payload
  architecture was the better call). Honeypot + DB-backed rate limiting + a 24h duplicate-by-
  email-or-Instagram check guard `/api/influencer`; Media Kit/Rate Card PDFs upload to Cloudinary
  via `/api/influencer/upload`. Linked from the header nav ("Influencers", next to "Services") and
  the footer ("Influencer Program", in the Services column). No applications submitted yet outside
  of one smoke-test record, created and immediately deleted.

## Known gaps

- **No browser-automation tool** has been available in any session so far — no actual mobile
  (390px)/desktop (1440px) screenshots or console-error checks anywhere on the site, including the
  Portfolio admin upload UI and the Influencer form's 8-step wizard (file picker → preview →
  sibling-field population; step navigation → autosave restore → submit), both verified only
  against real hook signatures, API shapes, and curl/HTTP checks, not a live click-through. This is
  the single biggest outstanding gap — a real Playwright pass across the whole site (marketing
  pages, blog, `/work/*`, `/form/influencer`, and the admin panel) is overdue.
- **No real `RESEND_API_KEY` or Turnstile keys configured.** Fully wired and tested in
  graceful-degradation mode (emails log to console, Turnstile verification is skipped). Add
  `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to activate — no code
  changes needed, in either `.env.local` or Vercel's environment variables (both need it
  independently if you want it active in both places).
- **No video portfolio items published yet** — `/work/videos` currently renders its empty state.
  The system supports YouTube/Vimeo/direct-Cloudinary-MP4 (`lib/video.ts`'s `parseVideoUrl()`); just
  needs a `mediaType: "video"` Portfolio entry created via admin.

## What's next

No Phase 4 prompt exists yet as a numbered backend phase, but Portfolio and the Influencer
application system (above) were effectively two. Candidates based on what's explicitly still
deferred: real Slack/Notion/WhatsApp integrations (the `dispatchLeadEvent()` seam in
`payload/hooks/lead-events.ts` is ready for them, though `influencer-applications` doesn't wire
into it yet — no email/notification requirement was in that spec), building out real UI for the
clients/projects/contracts/files/meetings placeholder collections, publishing at least one video
portfolio item to exercise `/work/videos` end-to-end, and — highest priority given the known gap
above — a real Playwright visual pass across the whole site now that there's real client-facing
content (not just placeholder copy) to protect.
