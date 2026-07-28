# RuleScale Media — Landing Page: System Status

Last updated: 2026-07-28
Repo: https://github.com/AllgoZ/RuleScale-Media (branch `main`)

For "what phase are we in right now and what's next" in 30 seconds, read `currentphase.md`
instead — this file is the full architecture snapshot, that one's the fast pointer.

A single-page Next.js marketing site for RuleScale Media, built as a sequence of distinct
"scenes" rather than repeating template sections, now backed by Payload CMS + PostgreSQL rather
than hard-coded content. This document is a from-scratch snapshot of the current implementation —
tech stack, brand system, CMS architecture, and every section top to bottom.

---

## 1. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.12 (App Router, Turbopack) |
| CMS | Payload CMS 3.86.0 |
| Database | PostgreSQL via `@payloadcms/db-postgres` (Supabase in production) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`, no `tailwind.config.js`) |
| Animation | Framer Motion 12 |
| Icons | lucide-react |
| Primitives | Radix UI (`react-accordion`, `react-slot`) |
| Utilities | `class-variance-authority`, `clsx`, `tailwind-merge` |
| React | 19.2 |

Next.js is pinned to 16.2.12 specifically because every published Payload version's `next` peer
range excludes 15.5.x entirely (only 15.2.9/15.3.9/15.4.11 or 16.2.6+ are supported) — see
`CHANGELOG.md` 2026-07-27 for the full reasoning and the upgrade-verification process used.

Folder layout:
```
app/
  (frontend)/  the marketing site itself — layout.tsx, page.tsx, globals.css (route group)
  (payload)/   Payload-generated admin + REST/GraphQL API routes (never hand-edited)
  robots.ts, sitemap.ts, icon.tsx, opengraph-image.tsx   top-level, outside both route groups
payload.config.ts   Payload config root (collections, globals, db adapter)
payload/
  collections/  users (role: admin/editor), media, categories, authors, posts, testimonials,
                 case-studies, leads
  globals/       homepage (drafts + preview), navigation, footer, site-settings, seo-settings
  access.ts      shared RBAC helpers (isAdmin, isAdminOrEditor, isAdminOrSelf)
  hooks/         revalidateTagSafely() — every afterChange/afterDelete hook goes through this
  seed.ts        one-time seed for testimonials/case-studies (npm run seed)
lib/
  cms/          getHomepage() / getNavigation() / getFooter() / getSiteSettings() /
                 getSEOSettings() — the only code that talks to Payload. Each is
                 cache(unstable_cache(...)) with tag-based invalidation, falling back to
                 lib/constants.ts (uncached) on error; getHomepage() also branches on Next draft
                 mode before the cached path
  cache/tags.ts  CACHE_TAGS — shared between lib/cms and the payload/*/hooks
  seo/metadata.ts  buildSiteMetadata(), called from layout.tsx's generateMetadata()
  constants.ts  fallback source of truth (no longer the primary content source, still live)
  schema/index.ts  JSON-LD builders — pure functions taking CMS data as params
  utils.ts      cn() class-merge helper
sections/     one file per page section (Header, Hero, Problem, ... Footer), each consuming
              CMS content via a `data` (or `navigation`/`footer`) prop, not a direct import
components/
  ui/         generic primitives (Button, Container, Reveal, Accordion, Spotlight, RollingNumber, Marquee)
  doodles/    hand-drawn brand accents (LogoMark, HandArrow, PaperClip, ScribbleUnderline)
  hero-collage.tsx, mobile-cta.tsx   standalone composed pieces
```

Build: clean lint, clean production build (verified against a placeholder, deliberately
unreachable `DATABASE_URL` — the homepage still statically prerenders correctly via the
`lib/cms` fallback path; only `/admin` fails, gracefully, without one).

---

## 1a. CMS architecture (Payload + Postgres)

Added 2026-07-27 per `prompts/backend/phase1.md` — full reasoning, the Next.js 16 upgrade
tradeoff, and the `robots.ts`-in-a-route-group gotcha are in `CHANGELOG.md`, not repeated here.

- **Collections**: `users` (admin auth), `media` (uploads, responsive image sizes),
  `categories`/`authors`/`posts` (blog groundwork, not yet rendered anywhere), `testimonials` and
  `case-studies` (real collections, referenced from the Homepage global via relationship fields),
  `leads` (schema only — no contact form exists yet to write to it).
- **Globals**: `homepage` (one group per section — Hero, TrustLogos, Problem, Manifesto, Process,
  Services, Results, CaseStudies, Testimonials, FAQ, FinalCTA — every field has a `defaultValue`
  mirroring today's copy), `navigation`, `footer`, `siteSettings`, `seoSettings`. As of Phase 1.5
  (§1b), `siteSettings`/`seoSettings` power `layout.tsx`'s metadata + `lib/schema/`'s JSON-LD.
- **Data flow**: `app/(frontend)/layout.tsx` fetches navigation/footer/site-settings/homepage
  once; `app/(frontend)/page.tsx` fetches the homepage once too — free, deduped by `React.cache()`
  within one request. No section component ever imports `payload` or `lib/cms` directly.
- **Fallback**: every `lib/cms/*.ts` getter is `try/catch`-wrapped and returns a
  `lib/constants.ts`-derived object on any failure. This isn't just a safety net for production
  outages — it's what makes local dev and CI work at all before a real `DATABASE_URL` exists.
- **Seeding**: `testimonials`/`case-studies` are relationship-based, so they can't carry a static
  `defaultValue` the way plain array fields can. `payload/seed.ts` (`npm run seed`) inserts the 4
  testimonials / 3 case studies and points the Homepage global's relationships at them — required
  once, after a real Postgres connection exists.
- Connected to a real Supabase project since 2026-07-27 (session pooler — the direct-connection
  host is IPv6-only and this environment has no IPv6 route out). Admin user, seeding, and every
  claim in this document have been verified against that live database, not just built.

---

## 1b. Production hardening (Phase 1.5)

Added 2026-07-28 per `prompts/backend/phase1_5.md` — full reasoning (why `unstable_cache()` over
Cache Components, the `payload run` floating-promise bug, etc.) is in `CHANGELOG.md`.

- **Caching**: every `lib/cms/*.ts` getter is `cache(unstable_cache(fetchFn, [tag], {tags:
  [tag]}))` — `React.cache()` dedupes repeated calls within one request, `unstable_cache()`
  persists across requests with tag-based invalidation. Tags live in `lib/cache/tags.ts`, the
  single source of truth shared with the Payload hooks that invalidate them.
- **Invalidation**: `payload/globals/*.ts` and the `testimonials`/`case-studies` collections each
  have an `afterChange` (`+afterDelete` for the two collections) hook calling
  `revalidateTagSafely()` (`payload/hooks/revalidate.ts`) — same-process `revalidateTag`, no HTTP
  round-trip, since Payload's admin/API already run inside real Next.js Route Handlers here.
  Verified live: an admin-panel save reflects on the running site within ~1-2s, no restart.
- **Draft mode**: `homepage` global has `versions.drafts: true` + `admin.preview`.
  `app/(frontend)/next/preview` (validates `PREVIEW_SECRET` + an authenticated Payload session,
  then enables Next draft mode) and `/next/exit-preview` are the entry/exit points.
  `getHomepage()` reads `draftMode()` first — draft reads bypass the cache entirely and are never
  tagged, so a draft can never leak into what a real visitor sees. Verified live end-to-end.
- **RBAC**: `users.role` is `admin | editor`. `payload/access.ts` has the three reusable checks.
  Admin: full access everywhere. Editor: create/read/update on `homepage` (global, update-only),
  `posts`, `media`, `testimonials`, `case-studies` — delete stays admin-only. Everything else
  (`users`, `navigation`, `footer`, `siteSettings`, `seoSettings`, `categories`, `authors`,
  `leads`) is admin-only to write. `users` read/update is self-or-admin (an editor can see/edit
  their own account, not anyone else's). Verified live via real 403s/200s against the REST API,
  not just code review. This only governs `/admin` + REST/GraphQL — Local API reads (`lib/cms/`)
  default to `overrideAccess: true` and are unaffected.
- **Media hardening**: `caption` field added. Focal-point selection was already active (Payload
  auto-enables it once `imageSizes` is defined, which this collection already had) — confirmed via
  the "Edit Image" modal in `/admin`, not code that needed writing.
- **Health check**: `GET /api/health` (`app/(frontend)/api/health/route.ts`) pings Postgres via
  `payload.db.drizzle.execute(sql\`select 1\`)`, returns `200`/`503`. Coexists with Payload's
  `/api/*` catch-all because Next.js resolves the more specific static segment first — confirmed
  empirically, both routes verified working side by side.

---

## 2. Brand system

The visual system is the real RuleScale Media brand mark (ring + lightning-bolt "S", from the
brand PDF), **not** a generic palette — deliberately restrained to three colors plus one
typeface, per the brand guide's "one accent" principle.

### Colors (`app/globals.css`)

| Token | Value | Used for |
|---|---|---|
| `--color-paper` | `#f3f2f2` | primary background |
| `--color-surface` | `#eae8e6` | (reserved secondary surface) |
| `--color-ink` | `#201e1d` | primary text, dark section backgrounds |
| `--color-ink-soft` | `#6f6b68` | secondary text |
| `--color-accent` | `#ec3013` | the **only** brand accent — CTAs, scribbles, active states |
| `--color-hairline` | `rgba(32,30,29,0.1)` | all hairline borders/dividers |

All exposed as Tailwind utilities (`bg-ink`, `text-accent`, `border-hairline`, etc.) via
`@theme inline`.

**One deliberate exception**: a few sections that were explicitly redesigned to match
reference screenshots reintroduce literal one-off colors for those specific elements only —
`#F97316` (orange) for some eyebrow labels/tags, `#FDE047` (yellow) and `#2563EB` (blue) inside
the hero collage's mock UI cards, and `emerald-600` for a "+186%" trend line. These are scoped
to their exact JSX (arbitrary Tailwind values, not tokens) and do not affect the global palette.

### Typography

- **Headings + body**: Archivo (`next/font/google`, weights 400–900) — one typeface for
  everything, per the brand guide.
- **Hand-drawn accents**: Caveat (weights 500–700) — used only for small eyebrow labels,
  margin notes, and quote-style flourishes (~10% of the UI, by design).
- Custom display-type utility classes in `globals.css`:
  - `.text-display` — clamp(2.25rem, 1.2rem + 6vw, 7.5rem), weight 800, tracking -0.03em — hero/final-CTA headline (formula tuned for mobile, see `CHANGELOG.md`)
  - `.text-editorial` — clamp(2rem, …, 4rem), weight 800 — standard section headline
  - `.text-mega` — clamp(3.5rem, …, 13rem) — (defined, currently unused after the Results rebuild)

### Depth & texture

- `--shadow-soft` / `--shadow-lift` — the only two box-shadow presets used site-wide.
- `.bg-atmosphere` — fixed, full-page radial-gradient ambient light (subtle red/ink glows), sits at z-0 behind everything.
- `.grain-overlay` — fixed SVG turbulence noise, multiply-blended, z-60, over all content.
- `.bg-vignette` — fixed inset box-shadow, z-61, topmost.
- `.bg-dot-grid` — small radial-gradient dot pattern, used on the dark Results section for texture.
- `.spotlight` — cursor-follow radial glow; a component (`Spotlight`) sets `--mx`/`--my` CSS vars on mousemove.
- `.hairline` — 1px `--color-hairline` border utility.
- Everything respects `prefers-reduced-motion` (global override collapses all animation/transition durations to ~0).

### Logo

`components/doodles/logo-mark.tsx` — inline SVG, ring + bolt, redrawn from the brand PDF.
`inverted` prop swaps the ring from ink to paper for dark backgrounds. Same mark is reused for
the favicon (`app/icon.tsx`, dynamic `ImageResponse`) and the OG image (`app/opengraph-image.tsx`).

---

## 3. Global shell

### `app/layout.tsx`
- Loads Archivo + Caveat, sets `viewport` (theme color `#201e1d`, `viewportFit: cover` for iOS
  safe areas), full `Metadata` (title template, OG, Twitter card, canonical, robots directives).
- Injects 5 JSON-LD `<script>` blocks (see §7).
- Renders the three fixed background layers, then `<Header />`, page `{children}`, `<Footer />`,
  then the global `<MobileCTA />`, all inside a `relative z-10` wrapper so content paints above
  the atmosphere/grain layers.

### Header (`sections/header.tsx`)
Sticky, thin (h-14), floating glass pill. Transparent at the top of the page; on scroll
(`scrollY > 24`) animates to a translucent blurred pill (`backdrop-blur-xl`, soft shadow,
hairline border) via Framer Motion `animate={{ backgroundColor, borderColor, boxShadow }}`.
Logo + wordmark left, nav links (`Work / Services / Process / FAQ`) center, "Start Growing"
accent button right. Mobile: hamburger → animated dropdown panel with the same nav links + CTA.

### Mobile sticky CTA (`components/mobile-cta.tsx`)
`md:hidden` fixed bottom bar, full-width accent "Start Growing" button, `env(safe-area-inset-bottom)`
padding. Visibility is driven by three `IntersectionObserver`s (hero, `#final-cta`, `#site-footer`):
visible once scrolled past the hero, hidden again once the final CTA or footer is in view — so it
never duplicates the real CTA.

---

## 4. Page sections, top to bottom

Order in `app/page.tsx`: **Hero → TrustLogos → Problem → Manifesto → Process → Services →
Results → CaseStudies → Testimonials → FAQ → FinalCTA** (Header/Footer wrap all of this in the
layout).

### 1. Hero (`sections/hero.tsx` + `components/hero-collage.tsx`)
- Asymmetric 12-col grid: copy in the left 7 columns, floating collage in the right 5.
- Eyebrow: pill badge ("Hi, we're RuleScale Media", Sparkle icon, Caveat).
- Headline: "We grow brands people remember." — responsive `text-5xl→6xl→3.75rem` scale, with a
  hand-drawn `ScribbleUnderline` (accent) under "people remember." The "people remember." span is
  `sm:whitespace-nowrap` (nowrap only at 640px+; wraps freely below that), and both grid columns
  carry `min-w-0` — fixes for a mobile horizontal-scroll bug, see `CHANGELOG.md`.
- Sub-copy, then accent + ghost CTA buttons ("Start Growing" / "See Our Work"), then a trust line.
- Wrapped in `<Spotlight>` for a cursor-follow red glow.
- **Hero collage**: a parallax composition of 6 floating mock-UI cards (mouse-tracked via
  `useMotionValue`/`useSpring`) — a "Reach this month" bar chart, a search-result card ("Best
  Marketing Agency 2026"), an Instagram-style post card, a video-ready card, a yellow sticky
  quote ("This actually worked."), a coffee-icon badge — connected by dashed SVG lines, plus two
  paper-clip doodles. This section deliberately uses the one-off orange/yellow/blue colors
  described in §2 to match an approved reference design.

### 2. Trust strip (`sections/trust-logos.tsx`)
Quiet transitional beat. Uppercase label ("Our clients have been featured on") + an infinite CSS
`Marquee` of monochrome text wordmarks (Google, Meta, LinkedIn, Shopify, HubSpot, TikTok,
YouTube), faded at both edges, pauses on hover.

### 3. Problem (`sections/problem.tsx`)
Three "pinned note" cards in a row (stacked on mobile), each clipped to a shared hairline
"string" by a `PaperClip` doodle, slight per-card rotation via a CSS custom property
(`--card-rotate`, un-rotates on hover with a lift). Each card: a yellow (`#FDE047`) hand-font
tag (CHAOS / BURNED / STUCK), a bold statement with an orange (`#F97316`) highlighted second
line, and a small supporting note. Hand-drawn `HandArrow` connectors between cards on desktop.
Static/server component — no scroll-linked JS, entrance via `Reveal` only.

### 4. Manifesto (`sections/manifesto.tsx`)
A quiet full-viewport-height (`svh`) bridge scene between Problem and Process. Centered, large
italic serif-weight statement ("Most agencies sell activity. We sell the moment someone
remembers your name.") that reveals line-by-line with a mask/slide-up animation on scroll into
view, plus a small supporting note.

### 5. Process (`sections/process.tsx`)
"A plan, not a guess." — 5 steps (Discover → Strategy → Build → Launch → Scale).
- **Desktop**: steps sit in a zig-zag row (alternating `-translate-y-9`), each an icon circle
  (Search/Compass/Hammer/Rocket/TrendingUp) with a large faint ghost numeral bleeding out behind
  it. A hand-drawn wavy SVG line connects the circles, with a red overlay path whose
  `pathLength` is scroll-linked (`useScroll`/`useTransform`) to draw in as the section scrolls
  into view. Hover fills a circle with accent + lifts it.
- **Mobile**: simple vertical stack with the same icon/ghost-number treatment, no scroll-linked line.

### 6. Services (`sections/services.tsx`)
"One team. Every channel." — an editorial index, not a card grid.
- Left (sticky on `lg:`): eyebrow/heading/description, plus a **live preview panel** that
  cross-fades (`AnimatePresence`) to show the icon + title + tagline of whichever service row is
  currently open.
- Right: a Radix Accordion of all 12 services, each row = icon circle (fills accent when open) +
  "N°01" spec-sheet label + title + tagline (shown only when open) + a rotating `Plus` icon. A
  red accent bar animates in (`scaleY`) on the open row's left edge. Only one row open at a time
  (`type="single" collapsible`), first service open by default.
- Icons are mapped from a string key already present in the `SERVICES` data (`layout`, `search`,
  `target`, `share-2`, `sparkles`, `video`, `pen-line`, `compass`, `megaphone`, `bar-chart-3`,
  `globe`, `lightbulb`).

### 7. Results (`sections/results.tsx` + `components/ui/rolling-number.tsx`)
"Growth you can measure." — rebuilt to a clean, iOS-style stat grid (this replaced an earlier,
larger "fullscreen scaling number" treatment that was deliberately simplified per feedback).
- 2×2 (mobile) / 4-across (desktop) grid of equal frosted-glass cards (`rounded-[28px]`,
  `bg-paper/[0.05]`, `backdrop-blur-xl`, `border-paper/10`) on a dark, dot-grid-textured section.
- Each card: icon circle (Briefcase/Users/Target/Heart) + a **rolling-digit number** + label.
- `RollingNumber` splits a formatted value (`"250+"`, `"18M+"`, `"5x"`, `"98%"`) into characters;
  each digit renders as its own clipped 10-row column (0–9) that spring-animates to the target
  row (`y: -{digit*10}%`), staggered ~60ms per digit — a genuine odometer/iOS-ticker effect, not
  a count-up. Triggered once by a single `useInView` on the grid container.
- No scroll-jacking, no giant type — this section is intentionally the "calm, aligned" one.

### 8. Case studies (`sections/case-studies.tsx`)
"Recent work we're proud of." Three case cards (Marlow & Finch, Northbound Outfitters, Ferra
Skincare) in a 3-col grid with staggered vertical offsets (`lg:mt-0 / lg:mt-20 / lg:mt-8`) so
they don't read as a rigid grid. Each card is a **mock browser window**: traffic-light dots,
faux address bar, a mini bar-chart mock, a diagonal glass-reflection gradient, and a
hover-reveal bottom bar (slides up) showing the headline result stat + "View case study".

### 9. Testimonials (`sections/testimonials.tsx`)
"Kind words" — a single large rotating quote spotlight (not a grid). Auto-advances every 5.2s
(pauses on hover), crossfades between 4 testimonials via `AnimatePresence`, large italic pull
quote + name/title, with small dot pagination (click to jump, active dot widens to accent red).

### 10. FAQ (`sections/faq.tsx` + `components/ui/accordion.tsx`)
"Everything you're wondering." Standard hairline-divided Radix accordion, 6 questions, hand-drawn
plus icon that rotates 45° into an "×" on open.

### 11. Final CTA (`sections/final-cta.tsx`)
Full-bleed dark (`bg-ink`) closing scene inside a `<Spotlight>`. Large `.text-display` headline
("Ready to become the brand everyone remembers?"), accent CTA button, and a hand-drawn
`HandArrow` (`pointUp` variant) pointing up at the button from below-left.

### Footer (`sections/footer.tsx`)
`id="site-footer"` (used by `MobileCTA`'s visibility logic). 4-column layout: logo + blurb +
3 social icon buttons, Services links, Company nav links, contact email. Bottom bar: copyright +
Privacy/Terms placeholders.

---

## 5. Shared component library

**`components/ui/`**
| Component | Role |
|---|---|
| `Button` | CVA variants (`primary` / `accent` / `ghost`) × sizes; magnetic cursor-follow (`useSpring` on x/y) + spring press; `asChild` via Radix `Slot`. Marked `"use client"` (required — see §8 gotchas). |
| `Container` | max-w-7xl page-width wrapper |
| `Reveal` | `whileInView` fade+slide-up, one-time by default — the standard entrance animation used everywhere |
| `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` | Radix wrapper used by FAQ |
| `Spotlight` | cursor-follow radial glow via CSS vars |
| `Marquee` | infinite CSS-animation logo strip |
| `RollingNumber` | odometer-style digit roller, used by Results |

**`components/doodles/`**
| Component | Role |
|---|---|
| `LogoMark` | brand ring+bolt SVG (light/inverted) |
| `HandArrow` | 4 hand-drawn arrow variants (`curveDown`, `curveRight`, `loop`, `pointUp`), scroll-triggered draw-in |
| `PaperClip` | static SVG paper-clip accent |
| `ScribbleUnderline` | scroll-triggered draw-in underline, used under the hero headline |

Two earlier doodle/utility components (`CircleHighlight`, `AnimatedCounter`) were removed once
the Results rebuild made them unused — no dead code left in the tree.

---

## 6. Content & data model

All copy lives in **`lib/constants.ts`** — no hardcoded strings in section files:
`SITE_*` (name/tagline/description/URL), `NAV_LINKS`, `TRUST_LOGOS`, `PROBLEM_CARDS`,
`MANIFESTO`, `PROCESS_STEPS` (5), `SERVICES` (12, each with an `icon` key), `RESULTS_STATS` (4),
`CASE_STUDIES` (3), `TESTIMONIALS` (4), `FAQS` (6).

`lib/schema.ts` builds 5 JSON-LD objects (`organizationSchema`, `localBusinessSchema`,
`serviceSchema`, `faqSchema`, `breadcrumbSchema`) directly from the same constants, so schema
and on-page copy can't drift apart.

---

## 7. SEO implementation

- `generateMetadata`-equivalent static `Metadata` export in `layout.tsx`: title template, full
  description/keywords, canonical, complete Open Graph + Twitter card, robots directives.
- `app/robots.ts`, `app/sitemap.ts` — file-convention routes.
- `app/icon.tsx`, `app/opengraph-image.tsx` — dynamically generated (`next/og`) using the real
  brand mark and colors, not static files.
- 5 JSON-LD blocks injected in `<body>`: Organization, LocalBusiness, Service (all 12 offerings),
  FAQPage (all 6 Q&As), BreadcrumbList.
- Semantic sectioning (`<section>`/`<header>`/`<footer>`), heading hierarchy (single `h1` in
  Hero, `h2` per section), `aria-label`s on icon-only controls, `aria-hidden` on decorative SVGs.

---

## 8. Notable engineering decisions / gotchas (for future edits)

- **`Button` must stay `"use client"`.** Radix `Slot` pulls in context-creating code that breaks
  the RSC server graph if `Button` is imported into a Server Component without its own client
  boundary — this was a real build-breaking bug, now fixed and should not be reintroduced.
- **Never combine a Framer Motion `animate`-driven `y`/rotate with a static Tailwind
  `translate-y`/`rotate-*` class on the *same* element.** Motion sets `transform` inline, which
  silently wins over the class. Pattern used throughout: put the static offset on an *outer*
  wrapper, the animated one on an *inner* element (see `Results`' raised-card wrapper, or
  `hero-collage.tsx`'s `FloatCard`).
- **Avoid 4-point `useTransform` input arrays** (e.g. `[a,b,c,d] → [0,1,1,0]`) bound directly to
  a `style` prop — hit a genuine framer-motion/WAAPI bug ("Offsets must be monotonically
  non-decreasing") in one browser context. The fix pattern used everywhere now: drive a plain
  `useState` "active index" off `useMotionValueEvent`, then animate discrete `initial`/`animate`
  states per item instead of one continuous multi-point transform.
- **CSS rotate via custom property**, not inline `style={{transform}}`: `style={{"--card-rotate":
  "-3deg"} as CSSProperties}` + `className="rotate-[var(--card-rotate)] hover:rotate-0"` — lets
  Tailwind's hover/lift utilities compose with the per-item rotation instead of one overwriting
  the other.
- Tech stack is pinned slightly ahead of the brief's "Next.js 15" (currently Next 15.5.21 /
  React 19.2) after hitting an RSC bug on the bleeding-edge Next 16 canary that was originally
  installed; downgraded to the latest stable 15.x line, which resolved it.
- **CSS Grid items default to `min-width: auto`**, not `0`. Any `grid` container whose
  `grid-cols-*` only kicks in at a breakpoint (e.g. `grid lg:grid-cols-12`) has a single implicit
  column at mobile — if a descendant has any unbreakable content (`whitespace-nowrap`, a long
  clamp()-sized word, a fixed-width element), that item won't shrink to fit and drags the whole
  row wider than the viewport. Fixed in Hero by adding `min-w-0` to the grid item wrappers. Worth
  checking first if a horizontal-scroll bug ever reappears — see `CHANGELOG.md` for the full
  diagnostic writeup.
- **`getBoundingClientRect()` does not reveal text overflow.** If a heading's own box looks
  correctly sized but `element.scrollWidth > element.clientWidth`, the text content itself
  (usually one long unbreakable word at a large clamp() font-size) is overflowing invisibly —
  this is what caused the Final CTA half of the mobile-scroll bug. Diagnose with `scrollWidth`
  comparisons, not just rect scans.

---

## 9. Repo / deployment status

- Git initialized, pushed to `https://github.com/AllgoZ/RuleScale-Media` on `main`. See
  `CHANGELOG.md` and `git log` for the actual commit-by-commit history.
- No CI/deployment pipeline configured yet (no Vercel project, no GitHub Actions).
- `.env*` is gitignored. `DATABASE_URL` and `PAYLOAD_SECRET` are now required (see
  `.env.example`) — the frontend degrades gracefully via the `lib/cms` fallback without them, but
  `/admin` needs a real `DATABASE_URL` to function at all.

---

## 10. See also

- **`Architecture files/CHANGELOG.md`** — dated log of notable fixes/changes, including the
  full diagnostic writeup for the mobile horizontal-scroll bug. This status doc describes *what
  the system currently is*; the changelog describes *what changed and why*. Update the changelog
  going forward rather than accumulating history in this file.
