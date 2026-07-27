# Changelog

Dated log of notable changes. `systemstatus.md` describes what the system *currently is*; this
file describes what changed, why, and (for the non-obvious ones) how it was diagnosed. Add new
entries at the top.

---

## 2026-07-27 — Phase 1: Payload CMS + Postgres foundation

Converted the site from a hard-coded `lib/constants.ts` app into a CMS-driven one — **Next.js →
Payload CMS → PostgreSQL (Supabase)** — per `prompts/backend/phase1.md`, with the frontend
rendering pixel-identical to before. No layout, styling, or animation changed; only where content
comes from changed.

**Next.js 15.5.21 → 16.2.12 (required, not optional).** Every published Payload version (checked
live on npm) has a `next` peer range that excludes all of 15.5.x — the closest supported windows
are `15.4.11` (dead-end, no further 15.x support coming) or `16.2.6+` (npm `latest`, stable since
May 2026, Payload's actively-developed target). Upgraded rather than downgraded, verified in
complete isolation (build/lint/dev/browser at 375px and 1440px, zero visual diff) before touching
any Payload code, to separate upgrade risk from CMS-integration risk. One real fallout: the new
`eslint-plugin-react-hooks` v7 rule set flagged a pre-existing render-time mutation in
`components/ui/rolling-number.tsx` (`digitIndex += 1` inside the character map) — fixed by
computing each digit's stagger position with `chars.slice(0, i).filter(...)` instead of a mutable
counter; identical animation timing, zero mutation.

**Route groups.** Everything previously in `app/` moved into `app/(frontend)/` (mechanical
relocation, same URLs — route groups don't affect routing); a new `app/(payload)/` holds Payload's
own generated admin/API routes (never hand-edit these — regenerate via `npm run
generate:importmap` instead). One deliberate exception: `robots.ts` stays at `app/robots.ts`
(top-level, outside any route group). Confirmed by direct testing that Next 16.2.12 + Turbopack
silently drops the `/robots.txt` route when `robots.ts` lives inside a route group — `sitemap.ts`
in the same directory works fine, so this is specific to the `robots.ts` convention, not route
groups generally. Worth checking first if `/robots.txt` ever goes missing again.

**CMS structure.** 8 collections (`users`, `media`, `categories`, `authors`, `posts`,
`testimonials`, `case-studies`, `leads` — the last four are schema-only groundwork for future
phases, not yet wired into the frontend) and 5 globals (`homepage`, `navigation`, `footer`,
`siteSettings`, `seoSettings`) in `payload/collections/` and `payload/globals/`. Every Homepage
field has a `defaultValue` mirroring today's copy (including several literals that were previously
hard-coded directly in JSX and not even in `constants.ts`, e.g. the Hero headline/CTAs), so a
freshly-migrated database already renders the current site with zero manual data entry.
Testimonials and Case Studies are real collections referenced from the Homepage global via
relationship fields — `payload/seed.ts` (`npm run seed`) inserts the 4 testimonials / 3 case
studies from `constants.ts` and points those relationships at them, since relationship fields
can't carry a static `defaultValue`.

**`lib/cms/` abstraction.** `getHomepage()` / `getNavigation()` / `getFooter()` /
`getSiteSettings()` wrap the Payload Local API and are the *only* things that touch `payload` —
no section component queries Payload directly. Each one is wrapped in `try/catch` and falls back
to an object built from `lib/constants.ts` on any failure (DB unreachable, global not yet seeded,
etc.) — verified by actually building and browsing the site against a deliberately-unreachable
placeholder `DATABASE_URL`; the homepage still statically prerenders with correct fallback content
and zero console errors. `lib/constants.ts` itself is unchanged and still the fallback source of
truth, not dead code.

**Frontend wiring.** `app/(frontend)/layout.tsx` fetches navigation/footer/site-settings once and
`app/(frontend)/page.tsx` fetches the homepage once; both pass slices down as a `data` prop to
each section (works identically for Server and Client Components — Hero, Manifesto, Process,
Services, Results, Testimonials, and Header stayed `"use client"` throughout). Every section's
JSX, classNames, and Framer Motion config are untouched; only the value source changed from a
`lib/constants.ts` import to a `data` prop.

**Explicitly deferred to a later phase** (per the brief's own "later" language): `SiteSettings`/
`SEOSettings` exist and are admin-editable now, but `app/(frontend)/layout.tsx`'s `metadata`
export and `lib/schema.ts`'s JSON-LD still read from `lib/constants.ts` directly — not yet wired
to the CMS. No contact form exists yet despite the `leads` collection being ready for one. No
`/blog` route exists yet despite `posts`/`categories`/`authors` being ready.

**Connected to a real Supabase project** (`DATABASE_URL` in `.env.local`, session pooler on port
5432 — the direct-connection host resolves IPv6-only and this dev machine has no IPv6 route out,
so the pooler is required here, not just a preference). First admin user created, `npm run seed`
run successfully.

**`payload run <script>` does not await a floating top-level promise.** The CLI's `run` command
(`node_modules/payload/dist/bin/index.js`) does `await import(scriptPath)` and then immediately
`process.exit(0)` — it does not know about or wait for any promise your script kicks off unless
that promise is a genuine top-level `await`. `payload/seed.ts` originally ended with
`seed().catch(...)` (a floating promise, not awaited by the module's top-level scope) — `npm run
seed` reported exit code 0 with zero log output in under a second, having done nothing at all;
confirmed by querying Postgres directly and finding the `testimonials`/`case-studies` tables
still empty. Fixed by awaiting it directly (`await seed()` as a genuine top-level await, inside a
`try/catch` since the CLI also doesn't surface a rejected floating promise as a non-zero exit
code). Worth checking first for any future one-off `payload run` script that appears to succeed
but silently does nothing.

---

## 2026-07-23 — Fix mobile horizontal-scroll bug

**Symptom**: the whole site could be scrolled/swiped horizontally by ~50px on mobile widths
(confirmed at both 375px and 390px). Not visible as an obvious clipped element on a casual
visual scan — needed direct DOM measurement to pin down.

**Root cause 1 — Hero.** `sections/hero.tsx`'s 12-col grid only defines `lg:grid-cols-12`, so
below the `lg` breakpoint it has a single implicit grid column. CSS Grid items default to
`min-width: auto`, meaning they refuse to shrink below their content's intrinsic minimum width.
The "people remember." span was `whitespace-nowrap` (to keep the `ScribbleUnderline` aligned
under it as one unbroken phrase), which gave the H1 an intrinsic minimum wider than a phone
viewport — dragging the entire grid row, and the floating hero collage sitting in the row's
other column, past the edge of the screen with it.

**Root cause 2 — Final CTA.** Separately, `.text-display` (`app/globals.css`) used
`clamp(2.75rem, 3.2rem + 4vw, 7.5rem)`. At 375px width that resolves to ~66px — the `vw`
coefficient was too gentle to reach a small size on narrow phones. At that size, the word
"remembers?" in the Final CTA headline no longer fit inside its container. Because the `<h2>`
has no `overflow-hidden`, the text just overflowed its own box silently:
`getBoundingClientRect()` on the heading reported a normal-looking 327px-wide box, and nothing
else in the section looked out of place — only `element.scrollWidth` (401px) vs `clientWidth`
(327px) revealed it. This was the harder of the two to find; see "how it was found" below.

**Fixes** (all in `sections/hero.tsx` and `app/globals.css`, no visual change at `sm:`/tablet/desktop):
- Added `min-w-0` to both of Hero's grid-column wrapper `div`s.
- Changed the headline span from `whitespace-nowrap` to `sm:whitespace-nowrap` — text wraps
  freely below 640px, stays on one line at 640px+ exactly as before.
- Changed `.text-display` to `clamp(2.25rem, 1.2rem + 6vw, 7.5rem)` — resolves to ~42px at
  375px (comfortably fits "remembers?"), and to within ~3px of the old value at 1440px (visually
  identical; confirmed via side-by-side screenshot).

**How it was found**: a naive per-element "does `getBoundingClientRect()` exceed the viewport"
scan produced false positives (the trust-logo marquee and a decorative blur blob both legitimately
exceed the viewport but are clipped by an `overflow-hidden` ancestor) and false negatives (missed
the Final CTA text overflow entirely, since no *element* exceeded its box — only the *text
inside* did). What actually worked: recursively hiding one top-level section at a time
(`el.style.display = "none"`) and re-checking `document.documentElement.scrollWidth` after each,
which isolates the exact culprit regardless of how the overflow is being caused. Once isolated to
Final CTA, walking down the tree following whichever child's `scrollWidth > parent.clientWidth`
led straight to the `<h2>`. Worth reaching for this technique first next time rather than
eyeballing screenshots or rect-scanning — see `systemstatus.md` §8 for the short version.

**Verification**: `document.documentElement.scrollWidth === window.innerWidth` at 375px and
390px (was 425/429 before); `window.scrollX` stays `0` after an explicit
`window.scrollTo(999, 0)` / horizontal wheel event (was jumping to 50); full mobile scroll-through
with zero console errors; desktop screenshots confirm no visual regression; clean lint + build.

Commit: `7b42dfd`.

---

## 2026-07-23 — Results section rebuilt as clean iOS-style stat grid

Replaced the earlier full-viewport scroll-scaling hero-number treatment (felt "too big" /
generic per feedback) with a compact 2×2 / 4-across grid of frosted-glass cards, each with an
icon, a genuine odometer-style rolling-digit number (`components/ui/rolling-number.tsx`, new),
and a label. Removed the now-unused `CircleHighlight` and `AnimatedCounter` components. No
scroll-jacking; lighter bundle than the version it replaced.

---

## 2026-07-23 — Services rebuilt as editorial index

Replaced a flat numbered accordion with icons per row, a live left-column preview panel that
cross-fades to match whichever service is open, and an animated accent bar on the active row.

---

## 2026-07-23 — Process rebuilt with icons + scroll-drawn connector

Replaced plain numbered dots with a per-step icon, a large ghost numeral behind each icon, and a
hand-drawn wavy SVG line whose accent-colored overlay path draws in (`pathLength`) as the
section scrolls into view. Desktop steps sit in a zig-zag rather than a flat row.

---

## 2026-07-23 — Problem section and Hero collage recolored to match approved reference

Both sections intentionally reintroduce one-off orange/yellow/blue values (outside the
ink/paper/red token system) to match specific approved reference screenshots. Scoped to those
two sections only — see `systemstatus.md` §2 for the exact colors and where they're used.

---

## 2026-07-23 — Initial commit

Full site built and pushed: Next.js 15 App Router, RuleScale Media brand system (ink/red/paper,
Archivo + Caveat), all eleven sections, full SEO metadata/schema. See `systemstatus.md` for the
complete current-state description.

Commit: `6861178`.
