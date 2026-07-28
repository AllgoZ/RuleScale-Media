# Phase 1 Result — CMS Foundation (Payload + Supabase Postgres)

Executed against `prompts/backend/phase1.md`. Status: **complete and live** — not just built, but
verified end-to-end against a real Supabase project (admin login, schema push, and seeding all
confirmed working). Committed as `a95dec1` on `main` (not yet pushed to origin).

The frontend renders pixel-identical to before this work — verified via Playwright screenshots at
375px/390px and 1440px against the pre-change baseline, zero console errors, zero horizontal
overflow, and working interactivity (services accordion, mobile menu, testimonial rotation).

---

## What changed

**Next.js 15.5.21 → 16.2.12.** Not optional — every published Payload version's `next` peer range
excludes all of 15.5.x (only 15.2.9 / 15.3.9 / 15.4.11 or 16.2.6+ are supported). Upgraded rather
than downgraded to the dead-end 15.4.11, since 16.2.x is Payload's actively-developed target and
npm's current `latest`. Verified in complete isolation (build/lint/dev/browser, zero visual diff)
before any Payload code was added, to separate upgrade risk from CMS-integration risk.

**Route groups.** `app/` split into `app/(frontend)/` (the site) and `app/(payload)/` (Payload's
generated admin + REST/GraphQL routes — never hand-edited, regenerated via `npm run
generate:importmap`). `robots.ts` stays at top-level `app/robots.ts`, not inside `(frontend)/` —
confirmed by direct testing that `/robots.txt` silently stops resolving when `robots.ts` lives
inside a route group on this Next 16 + Turbopack combination, while `sitemap.ts` in the same
directory works fine.

**CMS structure** (`payload/`): 8 collections (`users`, `media`, `categories`, `authors`,
`posts`, `testimonials`, `case-studies`, `leads`) and 5 globals (`homepage`, `navigation`,
`footer`, `siteSettings`, `seoSettings`). Every Homepage field carries a `defaultValue` mirroring
today's copy — including several literals that were previously hard-coded directly in JSX and not
even present in `lib/constants.ts` (the Hero headline/CTAs, Final CTA copy). Testimonials and
Case Studies are real collections referenced from the Homepage global via relationship fields.

**`lib/cms/` abstraction.** `getHomepage()` / `getNavigation()` / `getFooter()` /
`getSiteSettings()` are the *only* code that touches Payload — no section component queries it
directly. Each wraps the Payload Local API in `try/catch` and falls back to an object built from
`lib/constants.ts` on any failure (DB unreachable, global not yet seeded). This was proven for
real, not just written defensively: the full build/lint/browser pass was run once against a
deliberately-unreachable placeholder `DATABASE_URL` before a real one existed, and the homepage
still statically prerendered correctly.

**Frontend wiring.** `app/(frontend)/layout.tsx` fetches navigation/footer/site-settings once;
`app/(frontend)/page.tsx` fetches the homepage once. Both pass slices down as a `data` prop to
each section — works identically whether the section is a Server or Client Component. Every
section's JSX, classNames, and Framer Motion config are untouched; only where the content comes
from changed.

**`payload/seed.ts`** (`npm run seed`) inserts the 4 testimonials / 3 case studies from
`lib/constants.ts` and points the Homepage global's relationship fields at them — required once
per environment, since relationship fields can't carry a static `defaultValue`.

---

## Bugs found and fixed along the way

1. **`eslint-config-next`'s legacy `FlatCompat` bridge broke under ESLint 9 + the Next 16
   toolchain** ("Converting circular structure to JSON"). Fixed by switching `eslint.config.mjs`
   to the native flat-config exports (`eslint-config-next/core-web-vitals`,
   `eslint-config-next/typescript`) instead of `compat.extends(...)`.
2. **`components/ui/rolling-number.tsx`** mutated a closure variable (`digitIndex += 1`) inside a
   JSX-returning `.map()` callback — flagged by the stricter `eslint-plugin-react-hooks` v7 that
   shipped with `eslint-config-next` 16. Fixed with a pure `digitsBefore(index)` lookup; identical
   stagger-animation timing, zero mutation.
3. **`sharp` version sensitivity in `next/og`.** Once `sharp` was installed (required by Payload),
   the `/icon` and `/opengraph-image` routes started failing at build time with a libvips
   `colourspace` error. Root cause was `sharp@0.35.3` being auto-resolved; pinning to `0.34.2`
   (the exact version Payload's own official template uses) fixed it.
4. **`robots.ts` inside a route group.** See "Route groups" above — real, reproducible, isolated
   by testing with and without the `(payload)` group present.
5. **Direct Supabase connection is IPv6-only.** `db.<ref>.supabase.co` only resolves to an IPv6
   address, and this machine has no IPv6 route out (`ENETUNREACH`). Fixed by using Supabase's
   Session Pooler (`aws-0-<region>.pooler.supabase.com:5432`), which is IPv4-reachable — not a
   credentials problem, a networking one, diagnosed with direct TCP/DNS tests before asking for a
   different connection string.
6. **`npm run seed` silently did nothing** (exit 0, zero output, tables still empty). Root cause:
   Payload's `payload run <script>` CLI does `await import(scriptPath)` then immediately
   `process.exit(0)` — it does not know about or wait for a floating promise. The script originally
   ended with `seed().catch(...)` instead of a genuine top-level `await`, so the whole process
   exited before any of the awaited DB calls completed. Fixed by awaiting `seed()` directly at
   module top level, inside `try/catch`. Confirmed via direct Postgres queries before and after.

---

## Live verification performed

- `npm run build` / `npm run lint` clean throughout, at every milestone.
- Real Supabase Postgres connection established (session pooler); Payload pushed the full schema
  on first connect.
- Admin user created (`rulescalemedia@gmail.com`) via the actual `/admin/create-first-user` form;
  login confirmed, real Payload Dashboard screenshotted showing all 8 collections + 5 globals.
- `npm run seed` run successfully — verified directly in Postgres: 4 rows in `testimonials`, 3 in
  `case_studies`, and both relationship arrays correctly wired into the `homepage` global in the
  right order.
- Homepage re-verified against the live, seeded database: pixel-identical output, zero console
  errors, zero overflow, and server logs confirmed it was reading real Payload data (no more
  `[cms] Failed to load...` fallback messages).

---

## Deliberately deferred (per the brief's own "later" language)

- `SiteSettings` / `SEOSettings` globals exist and are admin-editable, but `app/(frontend)/layout.tsx`'s
  `metadata` export and `lib/schema.ts`'s JSON-LD still read `lib/constants.ts` directly.
- `posts` / `categories` / `authors` collections exist (blog groundwork) but there is no `/blog`
  route yet.
- `leads` collection exists (schema only) but no contact form writes to it yet.
- Newsletter, CRM, client portal, customer auth, payments, search, comments — explicitly out of
  scope per Step 11 of the brief.

## What's needed from here

- `git push` — commit `a95dec1` is local only, not yet pushed to `origin/main`.
- Real content review in `/admin` — every field is pre-populated with today's copy via
  `defaultValue`, but nothing has been reviewed/edited by a human yet.
- A future phase to wire `SiteSettings`/`SEOSettings` into `layout.tsx`/`schema.ts`, per the
  brief's own sequencing.
