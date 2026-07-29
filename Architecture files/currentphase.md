# Current Phase

Last updated: 2026-07-29

This is a fast pointer doc — "what phase is this project in, right now, and what's next." For
the full architecture snapshot read `systemstatus.md`; for the dated history of *why* and *how*
each change happened read `CHANGELOG.md`. Update this file whenever a phase starts or finishes;
don't let it drift into a second changelog.

## Status: Phase 3 complete — the site can now capture and manage real leads, uncommitted

| Phase | Prompt | Result doc | Status |
|---|---|---|---|
| Initial build | `prompts/version2.md`, `prompts/refinement.md` | — | ✅ Complete — commits `6861178`, `7b42dfd` |
| Phase 1 — CMS Foundation | `prompts/backend/phase1.md` | `prompts/results/phase1result.md` | ✅ Complete — commit `a95dec1` |
| Phase 1.5 — Production Hardening | `prompts/backend/phase1_5.md` | `prompts/results/phase1_5result.md` | ✅ Complete — commit `d28d9e4` |
| Phase 2 — Blog / Publishing Platform | `prompts/backend/phase2.md` | `prompts/results/phase2result.md` | ✅ Complete — **uncommitted**, see below |
| Phase 3 — Agency Operations Platform | `prompts/backend/phase3.md` | `prompts/results/phase3result.md` | ✅ Complete — **uncommitted**, see below |

## Where things actually stand

- **Frontend**: homepage still pixel-identical to the Phase 1.5 baseline except two hrefs — the
  FinalCTA button and the footer email link now go to `/contact` instead of `mailto:`. The blog
  (Phase 2) is untouched, as the Phase 3 brief required.
- **Lead capture**: `/contact` is live, posting to `/api/contact` — validated, honeypot-checked,
  DB-rate-limited (3 per email/IP per 10 minutes), optionally Turnstile-verified. The direct
  Payload REST create endpoint (`POST /api/leads`) is now closed (`403`) — only the hardened
  route can create leads.
- **CRM**: `leads` collection expanded to a real record (company/website/budget/services/
  priority/assigned user/internal notes/attribution), with `won`/`lost` statuses and a full
  version/audit history. Editors can now read/triage leads (was admin-only).
- **Email**: Resend + React Email wired end-to-end, gracefully logging to the console instead of
  sending when `RESEND_API_KEY` isn't set (it currently isn't — see "What's needed from here").
- **Admin**: a business dashboard at `/admin/business-dashboard` (totals, monthly counts,
  conversion rate, top services, lead sources) and a CSV export button on the Leads list, both
  new custom Payload admin views.
- **Placeholders**: `clients`/`projects`/`contracts`/`files`/`meetings` collections exist
  (hidden, minimal schema) for a future client-portal phase.
- **CMS/blog/caching/drafts/RBAC baseline**: unchanged from Phase 1.5/2 except the two RBAC
  widenings noted above (Leads and Users read access).

## Uncommitted work

Phase 2 AND Phase 3's entire diffs are sitting uncommitted on `main` as of this writing. Run
`git status` before starting anything new — don't assume `git log` reflects the actual current
file state, and don't assume this file is current either if it's been a while; re-check.

## Known gaps

- **No browser-automation tool** was available this session (same as Phase 2) — the mobile
  (390px)/desktop (1440px) visual pass on `/contact` and the admin dashboard hasn't been done.
  Verification instead used direct HTTP requests against a running server.
- **No real `RESEND_API_KEY` or Turnstile keys are configured.** The system is fully wired and
  tested in its graceful-degradation mode (emails log to console, Turnstile verification is
  skipped). Add `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, and
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to `.env.local` to activate real sending/verification — no
  code changes needed.

## What's next

No Phase 4 prompt exists yet. Candidates based on what's explicitly still deferred: real
Slack/Notion/WhatsApp integrations (the `dispatchLeadEvent()` seam in
`payload/hooks/lead-events.ts` is ready for them), building out real UI for the
clients/projects/contracts/files/meetings placeholder collections, and a Playwright visual pass
covering both the blog (Phase 2) and the contact/admin surfaces (Phase 3).
