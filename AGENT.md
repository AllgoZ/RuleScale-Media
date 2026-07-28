# AGENT.md

Quick technical reference for any coding agent working in this repo. For "what phase are we in
right now" read `Architecture files/currentphase.md` first; for deep architecture detail read
`Architecture files/systemstatus.md`; for dated change history and full bug-diagnosis writeups
read `Architecture files/CHANGELOG.md`; for brand/creative direction read `claude files/CLAUDE.MD`.

## Setup & commands

```bash
npm install
npm run dev                 # http://localhost:3000
npm run build                # production build — must be clean before considering any work done
npm run lint                 # must be clean
npm run generate:types       # regenerate payload-types.ts after changing a collection/global schema
npm run generate:importmap   # regenerate app/(payload)/admin/importMap.js after admin UI changes
npm run seed                  # one-time: seed testimonials/case-studies + wire them into Homepage
```

Requires a `.env.local` (see `.env.example`): `DATABASE_URL` (Postgres/Supabase connection
string), `PAYLOAD_SECRET`, and `PREVIEW_SECRET` (draft-mode preview link token). Without a real
`DATABASE_URL`, the frontend still works (every `lib/cms/*.ts` getter falls back to
`lib/constants.ts` on any Payload/DB error), but `/admin` will 500 with a clear connection error.

`curl http://localhost:3000/api/health` reports `{status, checks: {app, database}}` — `200` when
Postgres is reachable, `503` otherwise. Cheapest way to confirm the DB connection is alive.

There is no automated test suite. "Done" means: clean lint, clean build, and the change has
actually been looked at in a browser (see "Verifying UI changes" below) — not just "it compiles."

## Project structure

```
app/
  (frontend)/        the actual marketing site — layout.tsx, page.tsx, globals.css, and
                      next/preview + next/exit-preview (draft-mode routes)
                      (route group; doesn't affect URLs)
  (frontend)/api/health/  Postgres connectivity check — coexists with Payload's /api/*
                      catch-all because Next prefers the more specific static segment
  (payload)/          Payload-generated admin/API routes — do NOT hand-edit, regenerate instead
                      (`npm run generate:importmap`)
  robots.ts, sitemap.ts, icon.tsx, opengraph-image.tsx  top-level on purpose, NOT inside
                      (frontend) — robots.ts specifically silently stops working if moved into a
                      route group on this Next/Turbopack version, see CHANGELOG 2026-07-27
payload.config.ts    Payload config root — collections, globals, db adapter, secret
payload/
  collections/         users (has `role`: admin/editor), media, categories, authors, posts,
                        testimonials, case-studies, leads
  globals/              homepage (drafts + preview enabled), navigation, footer, site-settings,
                        seo-settings
  access.ts             shared RBAC helpers (isAdmin, isAdminOrEditor, isAdminOrSelf) — reused
                        across every collection/global's `access` block, don't duplicate the
                        role-check logic inline
  hooks/revalidate.ts   revalidateTagSafely(tag) — every afterChange/afterDelete hook calls this,
                        never `revalidateTag` directly (keeps the try/catch discipline in one place)
  seed.ts               one-time data seed, run via `npm run seed`
lib/
  cms/                 the ONLY code that talks to Payload — getHomepage(), getNavigation(),
                        getFooter(), getSiteSettings(), getSEOSettings(). Each is
                        `cache(unstable_cache(fetchFn, [tag], {tags:[tag]}))` — React cache() for
                        per-request dedupe, unstable_cache() for cross-request persistence,
                        invalidated by the matching payload/*/hooks.ts on save. Each falls back to
                        lib/constants.ts on any Payload/DB error — that fallback path is
                        deliberately NOT cached (see CHANGELOG 2026-07-28), so a transient DB
                        outage can't get stuck serving stale fallback content forever.
                        getHomepage() additionally branches on next/headers draftMode() before
                        the cached path — draft reads always hit Payload live, uncached, `draft:
                        true`. Never import `payload` or query Payload from a section component.
  cache/tags.ts          CACHE_TAGS — single source of truth for cache tag strings, imported by
                        both lib/cms/*.ts and payload/**/*.ts hooks so they can't drift apart
  seo/metadata.ts        buildSiteMetadata() — assembles the Next Metadata object from
                        SiteSettings + SEOSettings, called from layout.tsx's generateMetadata()
  constants.ts          fallback source of truth if Payload is unreachable/unseeded — not dead
                        code, still actively used
  schema/index.ts        JSON-LD builders — pure functions taking siteSettings/services/faq as
                        params (no internal fetching), called from layout.tsx with data it already
                        fetched for Header/Footer/Homepage
  utils.ts               cn() class-merge helper
sections/            one component per page section, in page order (Header/Footer included).
                     Each takes CMS content as a `data` prop (or `navigation`/`footer`/etc. for
                     Header/Footer) — fetched once in layout.tsx/page.tsx, not per-section.
components/
  ui/                generic primitives — Button, Container, Reveal, Accordion, Spotlight,
                      RollingNumber, Marquee
  doodles/            hand-drawn brand accents — LogoMark, HandArrow, PaperClip, ScribbleUnderline
  hero-collage.tsx    standalone composed piece used only by Hero
  mobile-cta.tsx      global sticky mobile CTA bar
Architecture files/
  systemstatus.md      current-state snapshot: brand tokens, every section, component library, SEO
  CHANGELOG.md          dated log of what changed and why, including full bug-diagnosis writeups
claude files/
  CLAUDE.MD             creative brief / brand direction (read this for the "why")
```

## Conventions

- All homepage content, site metadata, and JSON-LD are CMS-driven (Payload `homepage`,
  `siteSettings`, `seoSettings` globals), with `lib/constants.ts` as the fallback if Payload is
  unreachable. Adding/editing homepage copy means adding a field (with a `defaultValue` matching
  current copy) to `payload/globals/homepage.ts`, NOT hardcoding a string in a section component.
- Adding a new cached `lib/cms/*.ts` getter or a new Payload global/collection that should
  invalidate one: add the tag to `lib/cache/tags.ts` first, then wire the getter
  (`cache(unstable_cache(...))`) and the config's `hooks.afterChange` (`revalidateTagSafely`)
  from that same constant. Never hardcode a tag string in more than one place.
- Role-based access: `payload/access.ts` has `isAdmin` / `isAdminOrEditor` / `isAdminOrSelf` —
  use these on every new collection/global's `access` block rather than inlining
  `req.user?.role === 'admin'` checks. Local API calls (everything in `lib/cms/`) default to
  `overrideAccess: true` and are unaffected by any of this — access control only governs `/admin`
  and the REST/GraphQL surface.
- Draft mode only exists on the Homepage global right now (`versions.drafts` + `admin.preview`).
  Preview a pending edit via the "Preview" button in `/admin` (or manually:
  `/next/preview?path=/&previewSecret=...`, then `/next/exit-preview` to leave). Posts has
  `versions.drafts: true` too but no preview route yet — there's no `/blog` page to preview
  against until the blog phase.
- Brand tokens live in `app/(frontend)/globals.css` (`--color-ink`, `--color-paper`,
  `--color-accent`, `--color-ink-soft`, `--color-hairline`) and are exposed as Tailwind utilities
  (`bg-ink`, `text-accent`, `border-hairline`, ...). Use those, don't hardcode hex values for new
  work.
- Tailwind v4 here — theme is CSS-first (`@theme` in `globals.css`), there is no
  `tailwind.config.js`.
- `Button` (`components/ui/button.tsx`) must stay `"use client"`. It uses Radix `Slot`, which
  breaks the RSC server graph if the component is imported into a Server Component without its
  own client boundary — this was a real build-breaking bug once.
- Next.js is pinned to `16.2.12`, not a coincidence — every published Payload version's `next`
  peer range excludes all of 15.5.x, only specific 15.x final-patch windows (15.2.9/15.3.9/15.4.11)
  or `16.2.6+`. Don't bump Payload without checking its current `next` peer range first, and don't
  drift Next.js off a version Payload actually supports.
- Don't combine a Framer Motion `animate`-driven transform (`y`, `rotate`, etc.) with a static
  Tailwind `translate-*`/`rotate-*` class on the *same* element — Motion sets `transform` inline
  and silently overrides the class. Put the static offset on an outer wrapper, the animated one
  on an inner element (see `FloatCard` in `components/hero-collage.tsx` for the pattern).
- Avoid multi-point `useTransform` input arrays (e.g. 4 breakpoints mapping to `[0,1,1,0]`) bound
  directly to a `style` prop — this hit a real framer-motion/WAAPI bug ("Offsets must be
  monotonically non-decreasing"). Prefer a plain `useState` "active" value driven by
  `useMotionValueEvent`, then discrete `initial`/`animate` states per item.
- CSS Grid items default to `min-width: auto`, not `0`. Any `grid` container whose columns only
  appear at a breakpoint (e.g. `grid lg:grid-cols-12`) has a single implicit column below that
  breakpoint — unbreakable content (a long word, `whitespace-nowrap`) inside it won't shrink to
  fit, and will silently push the whole page wider than the viewport on mobile. Add `min-w-0` to
  the grid item wrappers. This caused a real horizontal-scroll bug — full diagnosis in
  `Architecture files/CHANGELOG.md`.
- `getBoundingClientRect()` does not reveal text overflow. If an element's own box looks
  correctly sized but the page still scrolls horizontally, compare `element.scrollWidth` vs
  `element.clientWidth` on the actual text-bearing elements, not just rects — a heading can
  overflow its box invisibly at a large responsive font size.

## Verifying UI changes

No visual regression suite exists — verification is manual, via Playwright driven through Bash:

1. Start the dev server (`npm run dev`), confirm it's actually serving before testing against it.
2. Screenshot the change at a mobile width (~375–390px) and desktop (~1440px).
3. Scroll through and check `document.documentElement.scrollWidth === window.innerWidth` (no
   horizontal overflow) and zero console/page errors.
4. Actually look at the screenshot before claiming the change is correct — don't infer success
   from "the build didn't crash."

## Brand quick reference

Ink `#201e1d` · Paper `#f3f2f2` · Accent Red `#ec3013` (the *only* accent — used sparingly) ·
Ink-soft `#6f6b68`. Archivo for all type; Caveat only for small hand-drawn label accents. Full
rationale and the historical superseded palette: `claude files/CLAUDE.MD`. Full token/usage
detail: `Architecture files/systemstatus.md` §2.
