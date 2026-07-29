# Phase 3 Result — Agency Operations Platform

Executed against `prompts/backend/phase3.md`. Status: **complete and verified against the live
Supabase database** — every claim below was physically observed (build/lint, real HTTP requests
against a running server, real database queries), not assumed from code review alone. No blog
code touched; the homepage stayed pixel-identical except two hrefs (see below), matching the
brief's explicit "do not redesign the frontend / do not modify blog functionality" constraints.

**Not** verified with real browser tooling (no Playwright/browser-automation tool was available
this session, same gap as Phase 2) — see "Known gap" at the end.

---

## What changed

**There was no contact form anywhere on the site before this** — confirmed by direct exploration
before planning, not assumed. Every "Start Growing" CTA and the footer email link were `mailto:`
links. Built a new `/contact` page and, with the user's explicit sign-off on the approach,
repointed exactly two existing hrefs to it: the Homepage global's FinalCTA button and the footer's
email link (now labeled "Contact us" instead of showing the raw address, since a link with literal
email text that no longer opens a mail client would be misleading). Nothing else in any section
changed.

**Leads collection expanded** from 6 fields (name/email/phone/message/source/status) to a real CRM
record: company, website, budget, servicesInterested (sourced from the existing `lib/constants.ts`
`SERVICES` array, not duplicated strings), priority, assignedUser (relationship → users),
internalNotes, and an `attribution` group (IP, user agent, referrer, landing page, UTM params,
device, browser). `status` now includes `won`/`lost`. `versions: true` gives a full audit/revision
history through the existing admin UI — no bespoke audit-log collection needed.

**The one backend endpoint** (`/api/contact`) validates input server-side, checks a CSS-hidden
honeypot field, rate-limits by email/IP against recent `leads` rows (DB-backed — no Redis/Upstash
provisioned, and no deployment target confirmed, so in-memory state would be unreliable anyway),
optionally verifies Cloudflare Turnstile if configured, builds last-touch attribution from the
request, and creates the lead via the Local API.

**A real security gap found and closed**: Payload auto-generates a public `POST /api/leads` REST
route from the collection's original `create: () => true` access — meaning anyone could bypass
`/api/contact`'s validation, rate limiting, and honeypot entirely by hitting the raw API directly.
Fixed by setting `access.create` to `() => false`. The real submit path is unaffected because Local
API calls default to `overrideAccess: true`. Verified live: direct `POST /api/leads` → `403`;
`/api/contact` → `200` with a real lead created.

**Email**: Resend + React Email, triggered from a single `dispatchLeadEvent()` seam
(`payload/hooks/lead-events.ts`) that every Leads `afterChange` event flows through — the
architecture the brief asked for so Slack/Notion/WhatsApp can be added later as more calls inside
that same function, never a new hook. Sends a visitor confirmation and an admin notification (to
the CMS's existing `siteSettings.contactEmail`, no new env var). Without a real `RESEND_API_KEY`,
both emails render correctly via `@react-email/render` and log to the console instead of
throwing — same graceful-degradation convention this codebase already uses everywhere else.

**Admin business dashboard** at `/admin/business-dashboard` — a custom Payload admin view (the
stable, documented `admin.components.views` mechanism, not the `@experimental` widget-dashboard
system, confirmed via direct `node_modules` type-def inspection before writing any of it): total/
new/won/lost leads, monthly counts (trailing 6 months), conversion rate, most-requested services,
lead sources. Linked from the sidebar via `admin.components.afterNavLinks`.

**CSV export**: an admin-authenticated Route Handler (`/api/leads/export`, same `payload.auth()` +
role-check pattern as the existing `/next/preview` route) linked from a button injected above the
Leads list view.

**RBAC**: Leads read/update widened to `isAdminOrEditor` (delete stays admin-only) — mirrors the
exact allowance already granted to posts/media/testimonials/case-studies in Phase 1.5. `users.read`
widened from `isAdminOrSelf` to `isAdminOrEditor` so the "Assigned User" field's admin-UI dropdown
can list every staff member (Payload resolves relationship options through the target collection's
own read access) — `users` create/update/delete are untouched.

**Filter/search/sort** on the Leads list view needed only `admin.listSearchableFields` and
`admin.defaultColumns` config — confirmed via `node_modules` inspection that this is otherwise
free/built-in, not something requiring custom code.

**Future collections**: `clients`, `projects`, `contracts`, `files`, `meetings` — registered,
minimal schema, `admin.hidden: true`, placeholders for a future client-portal phase per the
brief's "no UI required yet."

---

## Real issues found and fixed along the way

1. **Payload's `create: () => true` on a collection that also accepts writes through a hardened
   Route Handler is a real hole**, not just a theoretical one — the raw `POST /api/leads` REST
   endpoint was fully open and bypassed every protection `/api/contact` provides. Not something
   the brief called out explicitly; found by reasoning through what `create: () => true` actually
   exposes once a "real" submit path existed. Fixed with `create: () => false` (Local API creates
   are unaffected since they bypass access control by default).
2. **`document.referrer`/UTM capture is last-touch, not first-touch, by design** — true
   cross-session attribution needs a cookie set on first page load and read later, real
   infrastructure for what the brief listed as one line among many ("store useful attribution
   data"). Captured at submit time instead: meaningfully satisfies the ask without new session
   state or cookie consent implications.
3. **CSV export and the admin dashboard needed custom building**, confirmed rather than assumed:
   grepped the installed Payload/@payloadcms packages for CSV/export functionality (none) and for
   `@payloadcms/plugin-import-export` (not installed), and found the only stat-widget system
   (`admin.dashboard`) explicitly marked `@experimental` in Payload's own type definitions — used
   the stable `admin.components.views` mechanism instead.
4. **The Homepage global's live document was already persisted** (from Phase 1's real content
   seeding), so — the mirror image of the Phase 2 nav-link lesson — editing
   `payload/globals/homepage.ts`'s `defaultValue` alone did NOT update the live FinalCTA href. Had
   to patch the live document directly, one-time, via the Local API (same bootstrap pattern as the
   Phase 1.5 admin-role fix), confirmed working via a direct API read before and after.
5. **A dev-mode Turbopack persistent-cache corruption**, unrelated to any code in this phase: after
   several rapid `npm run dev` restarts (some via `taskkill` that didn't fully clean up), the
   Turbopack persistent cache started throwing "Another write batch or compaction is already
   active" and serving 500s regardless of `.next` deletion. Root cause was **multiple orphaned
   `node.exe` processes** (including a second dev server that had silently started on port 3001)
   still holding a lock on the shared cache. Fixed by enumerating and killing every stray `node.exe`
   process, then doing one clean restart. Not a code issue — flagging here in case it recurs.

---

## Live verification performed

- `npm run build` / `npm run lint` clean after every chunk (data model → lib/security layer → API
  routes → frontend → admin views).
- Direct REST lockdown: `POST /api/leads` (unauthenticated, bypassing `/api/contact`) → `403`.
  `GET /api/leads` (unauthenticated) → `403`.
- Real submission through `/api/contact` with a full realistic payload (name/email/phone/company/
  website/budget/services/message/UTM/referrer) → `200`, lead created with every field populated
  correctly, both emails rendered and logged (no `RESEND_API_KEY` configured).
- Honeypot-filled submission → `400`, rejected before touching the database.
- Rate limiting: 3 submissions from the same email succeeded, the 4th within the 10-minute window
  → `429`.
- CSV export: `401` unauthenticated; `200` with a real admin session (via `POST
  /api/users/login`), correct CSV content including the multi-select `servicesInterested` field
  joined with `; `.
- Business dashboard: loaded at `/admin/business-dashboard` with an authenticated admin session;
  displayed stat counts (total=3, new=3) and the services/sources breakdowns matched the known
  test data exactly.
- Homepage regression: `/` still 200, still shows all existing sections and copy, now includes
  `/contact` in both the FinalCTA button and the footer link; `/blog`, `/sitemap.xml`,
  `/robots.txt`, `/admin` all still resolve correctly (Phase 2 unaffected).
- All 3 temporary test leads (created through the real `/contact` → `/api/contact` flow, not a
  seed script) deleted after verification; confirmed via a final "leads remaining: 0" check.

---

## Known gap

No Playwright/browser-automation tool was available in this session. Everything above was
verified via direct HTTP requests (`curl`) against a running dev server with the schema pushed to
the live database — status codes, response bodies, rendered HTML/CSV content — not actual
screenshots or in-browser console-error checks. **The mobile (390px)/desktop (1440px) visual pass
on `/contact` and the admin dashboard has not been done.** Run it before treating this phase's UI
as fully sign-off-ready.

## Deliberately out of scope (per the brief and available credentials)

No real Slack/Notion/WhatsApp integrations — the brief asks for the architecture to support adding
them "later without refactoring," not to build them now, and no credentials exist for any of them.
The `dispatchLeadEvent()` seam in `payload/hooks/lead-events.ts` is ready for them. No real UI for
the clients/projects/contracts/files/meetings placeholder collections — explicitly "no UI required
yet" per the brief.

## What's needed from here

- `git commit` — nothing from Phase 2 or Phase 3 has been committed yet.
- Add `RESEND_API_KEY` to `.env.local` to start actually sending lead emails (currently logging to
  the console only).
- Add `TURNSTILE_SECRET_KEY` + `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to activate spam verification on
  the contact form (currently skipped — honeypot + rate limiting still apply without it).
- A real Playwright visual/responsive pass on `/contact` and the admin dashboard (see "Known gap").
