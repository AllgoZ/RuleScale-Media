# Phase 1.5 Result — Production Hardening

Executed against `prompts/backend/phase1_5.md`. Status: **complete and verified against the live
Supabase database** — every claim below was physically observed (build/lint, live API calls,
live admin-panel edits), not assumed from code review alone.

The frontend renders pixel-identical to the Phase 1 baseline — reconfirmed via Playwright
screenshots at 390px and 1440px, zero console errors, zero horizontal overflow.

---

## What changed

**CMS-driven metadata + JSON-LD (Steps 2-4).** `SiteSettings`/`SEOSettings` — admin-editable but
unused since Phase 1 — now actually power the site. `layout.tsx`'s static `metadata` export
became an async `generateMetadata()` (`lib/seo/metadata.ts`). `lib/schema.ts` moved to
`lib/schema/index.ts`; its five JSON-LD builders became pure functions taking CMS data as
parameters instead of importing `constants.ts` directly. Verified the rendered `<head>` was
unchanged (title, description, keywords, OG/Twitter, robots, all 5 JSON-LD blocks) before moving on.

**Caching + tag-based invalidation (Steps 5-6).** Every `lib/cms/*.ts` getter is now
`cache(unstable_cache(fetchFn, [tag], {tags:[tag]}))` — `React.cache()` for per-request dedupe,
`unstable_cache()` for cross-request persistence. Chose this over Next 16's `"use cache"`/Cache
Components deliberately: that directive requires `cacheComponents: true`, an app-wide rendering
model switch far bigger in scope than "cache five queries," and the brief itself names
`unstable_cache()` as an acceptable choice. Payload globals (`homepage`, `navigation`, `footer`,
`siteSettings`, `seoSettings`) and the `testimonials`/`case-studies` collections each got an
`afterChange`/`afterDelete` hook calling `revalidateTag(tag, 'max')` — same-process, no HTTP
round-trip, valid because Payload's admin/API run inside real Next.js Route Handlers here.

**Draft mode (Step 7).** `homepage` global got `versions.drafts: true` + `admin.preview`, plus
`/next/preview` and `/next/exit-preview` routes matching Payload's own official pattern.
`getHomepage()` branches on Next's `draftMode()` before the cache layer — drafts are always read
live and never cached/tagged, so they can't leak to a real visitor.

**Role-based access control (Step 8).** `users.role`: `admin | editor`. Three reusable access
helpers (`payload/access.ts`) applied across all 8 collections and 5 globals. Admin: full access.
Editor: create/read/update on `homepage`, `posts`, `media`, `testimonials`, `case-studies` —
delete stays admin-only everywhere. Everything else is admin-only to write.

**Media hardening (Step 9).** Added a `caption` field. Focal-point selection was already active
(auto-enabled by Payload once `imageSizes` is defined) — confirmed, not rebuilt.

**Health check (Step 11).** `GET /api/health` — Postgres connectivity via
`payload.db.drizzle.execute(sql\`select 1\`)`, `200`/`503`. Coexists cleanly with Payload's
`/api/*` catch-all.

**DB resilience & performance review (Steps 10, 12).** Every new function follows the existing
try/catch + safe-error-logging discipline. Confirmed the "duplicate query" concern from wiring
`getHomepage()`/`getSiteSettings()` into both `layout.tsx` and `page.tsx`/`metadata.ts` is a
non-issue — `React.cache()` dedupes all of it within one request.

**Code organization (Step 13).** New: `lib/cache/tags.ts`, `lib/seo/metadata.ts`,
`payload/access.ts`, `payload/hooks/revalidate.ts`. Moved: `lib/schema.ts` → `lib/schema/index.ts`.

---

## Real issues found and fixed along the way

1. **Payload's own official preview-route template has a latent bug** — `payload.auth()` returns
   `{ user, permissions }`, but the template's example code does
   `user = await payload.auth(...)` then `if (!user)`, checking the whole result object (never
   falsy) instead of destructuring `user` first. Caught by reading the actual TypeScript type
   definitions in `node_modules` rather than trusting the reference source verbatim; fixed in this
   implementation (`{ user } = await payload.auth(...)`).
2. **A draft-only save leaves a stray "unpublished changes" state even with identical content** —
   Payload's `_status` reflects the latest saved version regardless of whether its content differs
   from the published one. Not a bug, just a workflow detail worth knowing: cleaned up with one
   real "Publish changes" after each test.
3. **RBAC bootstrap chicken-and-egg problem**: once the `role` field itself became admin-gated to
   change, the pre-existing first user (defaulted to `editor` when the field was added) couldn't
   be promoted through the normal API — nothing had admin rights yet to authorize it. Solved with
   one direct SQL `UPDATE`, the correct tool for a genuine one-time bootstrap step.
4. **Focal-point UI isn't where you'd first look** — it's inside the "Edit Image" modal on a saved
   Media document, not inline on the create/edit form. A first check for the phrase "focal point"
   on the page itself found nothing; only checking inside the modal confirmed it was there.

---

## Live verification performed

- `npm run build` / `npm run lint` clean at every milestone.
- **Revalidation**: edited the live Homepage's Hero eyebrow field through `/admin` three times
  (marker → confirm live → revert), each save's `POST /api/globals/homepage` request tracked
  directly, each change observed on the public page within ~1-2 seconds with no dev-server
  restart — then confirmed the database held the original value again afterward.
- **Draft mode**: saved a draft-only edit, confirmed the public page was unaffected, confirmed
  `/next/preview` showed the draft content, confirmed `/next/exit-preview` returned to published,
  then published the original content back to fully settle the version history.
- **RBAC**: created a temporary `editor`-role test account, logged in as it, and hit the REST API
  directly — `POST /api/globals/navigation` → `403`, `POST /api/globals/homepage` → `200`,
  `DELETE /api/testimonials/:id` → `403`, `GET /api/users` → `200` scoped to just that user's own
  record (not the real admin's) — then deleted the test account.
- **Media**: uploaded a synthetic test image, confirmed the `caption` field and the focal-point
  controls inside "Edit Image," then deleted the test asset.
- **Health check**: `curl /api/health` against the live, connected database → `200`; confirmed
  `/api/testimonials` (a real Payload REST route) still resolves correctly alongside it.
- **Final pass**: full Playwright mobile (390px) + desktop (1440px) screenshots and interaction
  checks — pixel-identical to the Phase 1 baseline, zero console errors, zero overflow.

All live-database test edits (content changes, the temporary editor account, the test media
asset) were made only after checking in on how to handle live-data testing, and every one was
reverted, deleted, or republished back to its original state by the end.

---

## Deliberately out of scope (per the brief)

No blog implementation — `posts`/`categories`/`authors` remain schema-only, as instructed
("Do not begin implementing the blog during this phase"). No preview route for Posts yet, since
there's no `/blog/[slug]` page to preview against.

## What's needed from here

- `git push` — nothing from this phase has been committed yet.
- A blog phase to actually build `/blog` and wire Posts' existing drafts/preview groundwork to it.
