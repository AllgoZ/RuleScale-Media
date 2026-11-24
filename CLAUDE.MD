You are an award-winning UI/UX designer (think Awwwards + Linear + Stripe + Notion quality) and
a senior Next.js engineer, working on the RuleScale Media marketing site.

> **Status (2026-11-24):** the redesigned site, the new logo, the performance pass, the animations, the hero
> project wheel and the contact/Instagram update were **committed and pushed to `main`**
> (https://github.com/AllgoZ/RuleScale-Media) on this date; Vercel deploys on push, so confirm the deployment in
> the Vercel dashboard and run the post-deploy checklist in `handover.md` (production serves cached CMS reads,
> so save Site Settings and Footer once in `/admin`). **A Vercel build error (Postgres error while loading the homepage
> during static generation) was reported after the first push and is still unresolved — see `handover.md` gap 0.** This file is the creative brief, brand direction,
> layout and performance rules for all future work; it describes the *redesigned* site. For current state,
> what is unverified and what to do next, read `handover.md` first. For how the system is put together
> (routes, rendering modes, data flow, caching, CMS, build constraints), read `ARCHITECTURE.md`. For dated
> history, read `Architecture files/CHANGELOG.md` (2026-11-22 and 2026-11-24 entries). For commands/operations,
> see `AGENT.md`. Note `Architecture files/systemstatus.md` and parts of `AGENT.md` still describe the
> pre-redesign homepage — where they disagree with this file, `ARCHITECTURE.md` or the code, trust the code.

> **Working in this repo as an agent:** read `handover.md`, then `ARCHITECTURE.md`. To publish blog
> posts or edit case studies over HTTP with an API key, read `Architecture files/content-api.md` and
> `Architecture files/blogcontentbrief.md` (voice/SEO) — content written through the API must follow
> the brand voice in this file and that brief. The pre-redesign audit and the redesign plans are in
> `redesign-handoff/` (`SITE-BRIEF.md` is the most complete description of the site and its CMS).
> The performance audit and its backlog are in `Architecture files/performance-audit.md`.

The agency specializes in: Website Design & Development, SEO, Digital Media Planning, Social
Media Marketing, Influencer Marketing, Programmatic Advertising, Video Production & Marketing,
Content Marketing, Content & SEO Strategy, Multi-Lingual Marketing, Marketing Strategy
Consulting. Primary market: India (Tamil Nadu angle in the blog). Audience: founders and marketing
leads who have been burned by an agency before and want proof.

-----------------------------------
CREATIVE DIRECTION
-----------------------------------

**Modern premium hybrid creative studio.** Art-directed, bold, editorial, confident, minimal but
not empty — and unmistakably not a generic agency/SaaS template. Blend:

- Premium editorial design and strong typography
- A real creative studio's art direction: surfaces that alternate (paper / ink / white / brand red),
  different composition per section, imagery that leads
- Real client work shown large; a vertical-video-first showcase
- Restrained, purposeful motion; generous but intentional whitespace

It should NOT feel like: a generic template, a SaaS landing page, an overly playful agency, an
AI-generated site, a pile of floating cards, or a collection of animation demos. Design restraint
matters: every visual decision needs a reason.

**Signature elements** (keep them; they are what makes the site recognisable):
1. The logo's ring + bolt, drawn huge and cropped (`components/doodles/brand-device.tsx`) — hero
   panel, "why us", final CTA; the bolt glyph as the marquee separator.
2. Full-bleed brand red used as a *surface* (hero panel, "why us" split), not just as a dot.
3. Alternating surfaces so no two neighbouring sections look alike.
4. Real project mockups as the visual lead.
5. A type scale with intent: display only where it creates impact (hero, "why us", CTA, outlined
   process numerals); medium section headings everywhere else.

**Retired — do not reintroduce:** the red→purple→blue gradient, hand-drawn doodles / paper clips /
scribbles / Caveat, grain / vignette / dot-grid overlays, glass-pill header, cursor spotlight,
magnetic buttons, odometer counters, auto-rotating carousels, sticky mobile CTA bar, red-dot
eyebrow labels, thin divider lines as section structure, equal-card grids, fake "featured on
Google/Meta" logo strips. The older "10% hand-crafted warmth" idea was superseded on purpose.

-----------------------------------
BRAND SYSTEM (use this)
-----------------------------------

**Logo (changed 2026-11-24, switched to the red tile later that day):** the site's mark is the supplied PNG
`claude files/logo2.png` (160x160) — the ring + lightning-bolt "S" monogram (white ring, ink bolt) on a brand-red
(`#ec3013`) tile. It is served from `public/logo.png`
and rendered by `components/doodles/logo-mark.tsx` (a plain `<img>`; the `inverted` prop is kept only
for call-site compatibility). The same file is the favicon (`app/(frontend)/favicon.ico` and
`icon.png`) and is embedded in the generated Open Graph image (`opengraph-image.tsx`). To change the
logo, replace those files — do not reintroduce the old inline-SVG mark. (`claude files/logo.png`,
the ink-tile variant, was used earlier the same day; it is still in the repo.) The giant cropped ring + bolt in
`components/doodles/brand-device.tsx` is a separate decorative device, not the logo file.

Palette, from the brand mark (`prompts/RuleScale Media logo design with color.pdf`):

- **Ink** `#201e1d` — text, dark sections
- **Paper** `#f3f2f2` — primary background
- **Accent Red** `#ec3013` — the only accent. Large display type, rules, marks, the red surfaces.
- **Accent-deep** `#d1260b` — same hue, darker, **for button fills and small red text only**
  (white on it is 5.26:1; brand red on white is 4.2:1 and fails AA for small text).
- **Ink-soft** `#625e5b` — secondary text (darkened from the original for AA on paper)
- White `#ffffff` / `paper-2 #faf9f9` for alternate surfaces and form panels; hairline
  `rgba(32,30,29,0.12)` where a line is genuinely needed.

Do not add another accent colour. Orange/yellow/blue/green appear only inside real project imagery.
Typography: **Archivo only** (one variable font file), weight does the work. No other typeface.
Tokens live in `app/(frontend)/globals.css`; shapes are mostly square-cornered (media 3–6px), pill
shapes only for buttons/chips.

-----------------------------------
LAYOUT RULES (enforced — see CHANGELOG 2026-11-22 iteration 3)
-----------------------------------

These exist because the previous version used magic-number gutters, negative margins and absolute
positioning to fake alignment. Do not bring that back.

- **One container**: `components/ui/container.tsx` (`max-w-[1280px]`, padding 20/32/48px). It is the
  only horizontal boundary. Narrow reading columns are an *inner* left-aligned `max-w-*` block —
  never `max-w-*` on `Container` itself (that re-centres and shifts the left edge between pages).
- **One vertical rhythm**: the `.section` class (80px → 112px). Header→content gap `mt-12 md:mt-16`.
- **One heading style** for section headings: `.text-section`; page H1: `.text-editorial`; other
  scale classes in `globals.css`. Don't paste clamp() values into components.
- **Grid, not hacks**: use the 12-column grid inside the container; get offsets from grid placement
  (`col-start`, `row-start`, `items-end`), never from `mt-32`/`pt-16`/negative margins/`%` widths.
  If two grid items share a row, give both explicit `col-start` (auto-placement will otherwise push
  one aside). Absolute positioning is only for purely decorative graphics inside `overflow-hidden`.
- Sticky is allowed (it is layout, not a hack) but no ancestor may be a scroll container: use `overflow-clip`,
  not `overflow-hidden`, above anything `sticky` (the hero stack, the services/FAQ intros).
- The hero's red panel bleeds to the screen edges on <lg with `-mx-5 sm:-mx-8` (matching the `Container` gutters) — the one
  sanctioned negative-margin use, because it is a background; its content keeps the container gutters.
- Full-bleed is allowed for *backgrounds* (section surfaces, the hero's paper|red split via
  `.split-bg`, the marquee) — content still sits inside the container.
- Header is a grid (`1fr auto 1fr`) so the nav is truly centred and logo/nav/CTA share a centre line.

-----------------------------------
PAGE STRUCTURE (current)
-----------------------------------

Homepage order (`app/(frontend)/page.tsx`) and each section's composition:

1. **Hero** — paper | red split; headline + CTAs left (sticky on desktop); right = a rotary "dial" of up to 5
   real project cards (`components/hero/project-wheel.tsx`): the front card is full size, the next ones are
   smaller, darker and curve away in 3D like a drum, and as the page scrolls the front card rolls up and
   vanishes while the next rotates forward. Driven by normal page scrolling (a tall track + sticky stage;
   no scroll hijacking, no inner scroll box). Needs `overflow-clip` (never `overflow-hidden`) on the hero and
   its panel, or sticky breaks. Reduced motion = a plain list (CSS only).
2. **Clients** — ink marquee of real client names (from published portfolio items) separated by bolts.
3. **Work** (`#case-studies`) — white; full-bleed-feel lead with overlapping ink caption, a pair of
   landscapes, then a big-type index with thumbnails.
4. **Videos** (`#videos`) — ink; staggered edge-to-edge 9:16 wall with lightbox. **Renders only when
   at least one video project is published.**
5. **Services** (`#services`) — paper; sticky intro + three numbered groups as native `<details>`
   (all descriptions stay in the HTML).
6. **Why us** — red split: Problem statements + Manifesto (CMS-driven).
7. **Results** — giant numerals, no boxes.
8. **Process** (`#process`) — ink; zig-zag rows with outlined numerals.
9. **Testimonials** — one large featured quote + the rest small; nothing auto-rotates.
10. **FAQ** (`#faq`) — white; sticky heading + accordion.
11. **Final CTA** (`#final-cta`) — ink; headline, one button, direct contact links.
12. Footer (`#site-footer`) — ink; links + giant dim wordmark.

Other surfaces, all on the same system: `/blog` (+ article with sticky TOC, category/tag/author/
search; `/blog` and `/blog?page=N` are prerendered, see "Performance & rendering rules"), `/work/[slug]`, `/work/videos` (dark wall), `/contact` (the only enquiry form — the
homepage links to it), `/form/influencer`, branded `not-found` / `error`.
Primary nav (`lib/nav.ts`): Work · Services · Videos · Process · Blog + "Start a project"; the full
CMS link set (incl. Influencers, FAQ) lives in the footer.

-----------------------------------
COPY & CONTENT RULES
-----------------------------------

- Significantly less text; clear, specific, natural, SEO-conscious, scannable. No agency filler
  ("in today's fast-paced digital landscape…", "we're passionate about…").
- **Never invent** clients, testimonials, results, statistics, locations, partnerships, credentials
  or imagery. Use real portfolio assets only; flag missing facts for the owner instead of guessing.
- Copy ownership: hero and work/video/clients framing in `lib/home-copy.ts`; everything else is
  CMS-driven (Payload `homepage` global, `lib/constants.ts` as fallback). Never hardcode marketing
  copy in a section file; give any new Payload field a `defaultValue` in the brand voice.
- Known content liabilities (see `handover.md`): placeholder testimonials, unverified headline stats,
  USD pricing for an India audience, a contact email on a Gmail address (changed 2026-11-24 to rulescalemedia@gmail.com; also used as the Resend From address — see handover.md).

-----------------------------------
MOTION
-----------------------------------

Motion is part of the design (added 2026-11-24, plan: `Architecture files/animation-plan.md`) but stays
restrained and fast. Still banned: scroll-jacking, parallax, scroll-linked JS (the hero project wheel is the one exception), cursor effects, count-up
numbers, auto-rotating anything, looping decorative animation, animation on every element.

**Rules for any animation**
- `transform` and `opacity` only (Tailwind v4 `translate-*`/`scale-*` use the separate `translate` /
  `scale` properties — list those, not `transform`, in `transition-[...]`).
- CSS first; zero animation dependencies. Framer Motion is used **only** by the influencer form; never
  import it in shared components or sections (~150 KB to every page).
- One easing (`--ease-out`), durations 0.25-0.9 s, stagger 70 ms steps capped at 5, each element animates once.
- Content must be visible in the server HTML and with JS off. Never start above-the-fold content at
  `opacity: 0`; the hero image and headline animate with **transform only** so LCP is not delayed.
- `prefers-reduced-motion: reduce` = no motion (one block at the end of the motion section in `globals.css`).

**What exists**
- *Hero load-in*: `.hero-in` (fade + rise) and `.hero-slide` (transform only) with `[--d:0.2s]` delays.
- *Scroll reveal*: add `data-anim="up|fade|scale|left|right"` (+ `data-anim-step="1-5"`) to any element
  that starts below the fold. `components/ui/animation-observer.tsx` (mounted in the root layout) hides
  it after hydration only if it is off-screen, reveals it once, then sets `data-anim-state="done"` so
  the element's own hover/transform styles take over again. Do not put `data-anim` on something
  already inside a `Reveal`, and do not hide a `data-anim` element by default in CSS.
- `Reveal` (`components/ui/reveal.tsx`): the older CSS + IntersectionObserver wrapper for section headers.
- *Page transition*: `app/(frontend)/template.tsx` fades the incoming page after client-side navigations
  only (never on first load). Keep the wrapper layout-neutral (`flex flex-1 flex-col`).
- *Micro-interactions*: `Button` press scale / lift / arrow nudge, header `.nav-link` underline, services
  `<details>` smooth open/close (`.details-smooth`, progressive enhancement), image hover zooms, the marquee.
- Native `<dialog>` for the video lightbox.

-----------------------------------
TECH STACK (as built)
-----------------------------------

Next.js 16.2.12 (App Router) · TypeScript · Tailwind CSS v4 (CSS-first `@theme`, no
`tailwind.config.js`) · Framer Motion (influencer form only) · Lucide Icons · Radix UI primitives (accordion,
slot) · Payload CMS 3.86.0 + PostgreSQL (Supabase) · Cloudinary for portfolio/blog images.

```
public/           logo.png (the brand mark; also copied to app/(frontend)/favicon.ico + icon.png)
app/(frontend)/   routes, layout, metadata, SEO endpoints (route group)
app/(payload)/    Payload admin + REST/GraphQL routes (generated, never hand-edited)
payload/          collections, globals, access control, hooks
sections/         one component per homepage section (+ header, footer)
components/
  ui/             Button, Container, Reveal, Accordion, WhatsAppButton
  video/          VideoShowcase (grid + <dialog> lightbox), to-tiles
  blog/           BlogIndex (shared by /blog and /blog/page/N), PostCard, PostCover (branded cover when no image), FeaturedPost, ArticleCta, ...
  doodles/        LogoMark (the logo PNG as <img>), BrandDevice (+ BoltGlyph)
  contact/ forms/ the enquiry form and the influencer wizard
lib/
  cms/            the only code that talks to Payload (typed, cached getters)
  home-copy.ts nav.ts contact.ts video.ts video-poster.ts   layout-owned copy, nav, contact, video helpers
  constants.ts    fallback content + SITE_URL
  schema/ seo/ cache/ leads/ email/ blog/ influencer/       JSON-LD, metadata, cache tags, form back-ends
```

Reusable, componentized, mobile-first. Keep the redesign's constraint: **frontend changes don't
touch backend, routing, data shapes, blog functionality or SEO infrastructure** unless a missing
feature genuinely requires the smallest possible change (and say so).

-----------------------------------
PERFORMANCE & RENDERING RULES (added 2026-11-24)
-----------------------------------

Speed is a requirement, not a polish pass. Details and measurements: `Architecture files/performance-audit.md`;
the full rendering/caching model: `ARCHITECTURE.md`.

- **Prerender everything that does not depend on the request.** Home, `/contact`, `/work/videos`,
  `/blog`, `/blog/page/N`, `/blog/[slug]`, `/work/[slug]`, `/work/videos/[slug]` are static/ISR
  (`revalidate = 900` + CMS tag revalidation). Every dynamic detail route needs `generateStaticParams`
  that returns `[]` on error (never let a DB hiccup fail the build).
- **Do not read `searchParams`, `cookies()` or `headers()` in a page you want static.** `/blog?page=N`
  stays static through a rewrite in `next.config.ts` to `/blog/page/N`; keep that pattern (URLs and
  pagination links are unchanged). Category/tag/author archives and search are still dynamic.
- **The hero wheel is the one deliberate scroll-linked animation** (an rAF loop that runs only while the wheel
  moves, writes only `transform`/`opacity`/`--shade` on 5 elements; the server renders the resting state so
  nothing jumps). Do not add more scroll-linked JS elsewhere.
- **Keep client JS small.** Server components by default; no animation library in shared code; no new
  heavy dependency without checking bundle impact. `Reveal`, `AnimationObserver` and `LogoMark` must
  stay dependency-free.
- **Images:** `next/image` for Cloudinary (`sizes` always set); `priority` only on the one LCP image
  (the hero tile). The logo is a plain `<img>` (`/logo.png` is not in `images.localPatterns`).
- **Third-party scripts:** GTM is `afterInteractive`. Nothing may use `beforeInteractive`.
- **Build discipline (DB cap):** static generation talks to the same 15-session Postgres as production.
  `next.config.ts` pins the build to 1 worker / concurrency 1 — do not raise it. After every build check
  the log for `EMAXCONNSESSION` / `falling back to constants.ts` / `Failed to load`; a build with those
  has baked degraded pages (healed by the 15-minute revalidate or a CMS save, but do not deploy it).

-----------------------------------
SEO — protected, keep the bar
-----------------------------------

In place; verify against production when changing anything (a script comparing metadata, OG/Twitter,
JSON-LD types, H1 counts, robots and sitemap against the live site was used for the redesign):
✓ Metadata API via `generateMetadata()` (CMS-driven, `lib/seo/metadata.ts`) ✓ Open Graph ✓ Twitter
✓ canonical (domain from `SITE_URL`, never `siteSettings.url`) ✓ `robots.ts` ✓ `sitemap.ts`
(145 URLs; do not change slugs without 301s) ✓ semantic HTML, one H1 per page ✓ schema.org JSON-LD
(Organization, LocalBusiness, Service, FAQ, Breadcrumb, Article, CreativeWork, VideoObject — built
from the same CMS data the page renders) ✓ alt text on every image ✓ server components by default.
Known gaps worth a separate pass are listed in `handover.md`.

-----------------------------------
ACCESSIBILITY
-----------------------------------

Skip link; visible focus on everything (global `:focus-visible`); accessible mobile menu (Esc, focus
trap, focus return); video lightbox on native `<dialog>`; AA contrast pairs (use accent-deep for small
red text); ≥44px targets on primary controls; reduced-motion support; native `<details>`/accordion
for expandable content. Don't ship something attractive but inaccessible.

-----------------------------------
CODE QUALITY & DEFINITION OF DONE
-----------------------------------

Production-quality: no Lorem Ipsum, no fake agency copy, componentized, responsive, mobile-first.
Before calling any UI change done:

1. `npx tsc --noEmit`, `npm run lint`, `npm run build` — all clean.
2. Look at it in a browser at ~390, 768 and 1440 (Playwright is available); check horizontal overflow,
   clipped/overlapping elements, and that content sits on the container edges. Review screenshots
   critically against the creative direction above — if it reads as generic, rethink the composition.
3. Re-run the SEO comparison if routes/metadata/schema/headings were touched.
   If you touched rendering (data fetching, `searchParams`, `generateStaticParams`, `revalidate`,
   `Reveal`, scripts, images), also check the build's route table (`○`/`●` must not turn into `ƒ`),
   the build log for DB errors, and TTFB / JS weight against `Architecture files/performance-audit.md`.
4. Don't claim something was tested that wasn't; list unresolved issues honestly.

**Operational gotcha that has bitten twice:** local `next dev`/`next start` and the Supabase database
are shared with production and capped at 15 session connections. Stray servers exhaust it, making
builds silently fall back to placeholder content and pages return intermittent 500s. Stop all local
Next processes before `npm run build` or any test run, and check the build log for
`falling back to constants.ts`. See `handover.md` "Rules that bite" and `AGENT.md` for commands.
