# Changelog

Dated log of notable changes. `systemstatus.md` describes what the system *currently is*;
`currentphase.md` is the fast "what phase are we in" pointer; this file describes what changed,
why, and (for the non-obvious ones) how it was diagnosed. Add new entries at the top.

---

## 2026-11-24 (second push) - Red logo + compact mobile menu committed and pushed

- Committed and pushed to `main` after `05d35cd`: the `logo2.png` logo (including the source file `claude files/logo2.png`), the
  compact mobile menu, and the doc updates below. Still not committed on purpose: `l.html`, `live.html`, `sites/`, the 6 MB
  reference PDF. Pre-push checks: `tsc` 0 errors, eslint 0 errors (same 24 migration warnings).
- **Known open issue carried into this push:** the Vercel build error from the first push (DB error while loading the homepage
  during static generation) is unresolved; see `handover.md` gap 0.

---

## 2026-11-24 (after the push) - Red logo + compact mobile menu

- **Logo** switched to `claude files/logo2.png` (red tile): `public/logo.png`, `favicon.ico`, `icon.png` replaced (the
  header/footer/blog-cover mark and the Open Graph image read `/logo.png`, so they follow). Comment in `logo-mark.tsx` updated.
  `claude files/logo2.png` is now the source file and must be committed.
- **Mobile menu** (`sections/header.tsx`): the full-screen sheet with 3xl extra-bold links became a compact dropdown panel
  under the header (links 17px semibold with chevrons, regular-height CTA, dimmed backdrop that closes on tap, short slide-in
  `.menu-enter`, toggle icon 22 -> 20px). Behaviour unchanged: Esc, focus trap, focus return, scroll lock, link taps close.
  Verified at 390 and 342 wide (Esc, backdrop tap, toggle, Tab trap, link navigation, scroll-lock release; no errors).
- Open: the Vercel build error reported after the push (DB error during static generation; the log pasted was cut off before
  the actual error line) has not been investigated yet.

---

## 2026-11-24 (shipped) - Committed and pushed to `main`

- One commit containing the whole 2026-11-22 redesign (3 iterations), the new logo, the performance pass,
  prerendered blog/case-study/blog-index routes, the animation pass, the hero project wheel (desktop + mobile polish), the
  contact email / Instagram change, and the new docs (`ARCHITECTURE.md`, `performance-audit.md`, `animation-plan.md`).
  Pushed to `origin/main`; Vercel deploys on push.
- Not committed on purpose: `l.html`, `live.html`, `sites/`, `claude files/logo2.png`, the 6 MB reference PDF in
  `redesign-handoff/`, git-ignored `media/`. No secrets in the change set (checked `.env*` ignore rules and a pattern scan).
- Final pre-push checks: `tsc` 0, eslint 0 errors, clean `npm run build` (0 DB errors, route table: `/`, `/contact`,
  `/form/influencer`, `/work/videos`, `/blog` static; blog/work detail + `/blog/page/N` SSG).

---

## 2026-11-24 (final) - Contact email + Instagram

- Contact email `hello@rulescale.media` -> `rulescalemedia@gmail.com`; final CTA's LinkedIn link -> Instagram
  (`INSTAGRAM_URL` in `lib/constants.ts`, `sections/final-cta.tsx` prop `instagramUrl`, `app/(frontend)/page.tsx`).
  Code defaults updated (`lib/constants.ts`, `lib/cms/{settings,footer,homepage}.ts`, Payload `defaultValue`s); schema.org
  `sameAs` is now Instagram only. **The CMS values were also updated in the shared database** (Site Settings
  `contactEmail` + `sameAs`; Footer Instagram row), because CMS wins over code fallbacks.
- **Lesson**: a script run outside a request cannot `revalidateTag` ("static generation store missing"), and cached CMS
  reads have no expiry, so a DB edit is not visible until the cache is cleared (locally `rm -rf .next`; in production save
  the global in `/admin`). `payload run <script>` exits as soon as the script is imported: use top-level `await` and write
  results to a file (console output is lost).
- Verified on a rebuilt (clean `.next`) production build: home/contact/footer show the new email and the Instagram link;
  JSON-LD `email` and `sameAs` updated; no old email or LinkedIn company URL on the sampled pages; 0 DB errors.

---

## 2026-11-24 (latest) - Hero project wheel

- `sections/hero.tsx` + new `components/hero/project-wheel.tsx`: the two static tiles became a rotary "dial" of
  up to 5 project cards. Front card full size; the others smaller, darker and curving away like a drum; page
  scroll rolls the front card up and out and rotates the next forward. Tall track + sticky stage, rAF-eased,
  transform/opacity only; the server renders the resting state (`wheelStyle(d)` uses `--wheel-h` fractions) so
  there is no jump. Headline column sticky on `lg`; `overflow-hidden` -> `overflow-clip` on the hero and panel.
  Reduced motion = static list (CSS). Frontend only; same data; page still static.
- **Polish pass (same day, after review of a 1500x722 screenshot)**: the first wheel looked clumsy (squashed, hard-cropped
  neighbour; bare red above the front card; "ghost" see-through while a card rolled over the next). Fixes: gentler
  curve (28deg step, 0.55 tilt), tighter spacing, card width capped to the stage height (`--wheel-h`*0.82) so short
  windows are not crowded, a soft mask fading the stage top/bottom, 4px corners, the departing card stays opaque and
  travels faster so it clears the next (it only fades at the very end), the arriving card wins the layering at the
  halfway point. Checked at 1500x722, 1366x768, 1440x900 and 390x844 at rest and mid-roll.
- **Mobile pass (same day, after a 342px-wide screenshot)**: cards were small (~280x187) in an inset red panel with a lot of
  empty red. Now: the red panel bleeds to the screen edges on <lg (`-mx-5 sm:-mx-8`, a background; the cards keep the container
  gutters), the stage fills the pinned viewport height on every size (`--wheel-h: 100svh - header`, no 34rem cap), and on <lg each
  card gets a caption strip under the image (title, category, arrow; the overlay chip is `lg` only), so cards are ~302x265 at 342px
  and ~350x295 at 390px. `REST_LIFT` 0.05 -> 0.11 trims the empty red above the front card (also helps desktop). Checked at
  342x780, 390x844, 768x1024, 1500x722, 1366x768, 1440x900: no overflow, no console errors, last card reachable.
- First iteration was a flat sticky stack (cards sliding over each other); replaced because the brief was a
  curved, rolling dial. Cards behind are dimmed with an ink overlay (`--shade`), not transparency, which washed
  them out against the red.
- Verified: build clean (0 DB errors); order and last card reachable in Chromium/Firefox/WebKit at 4 widths; no
  overflow or console errors; reduced-motion list.

---

## 2026-11-24 (later) - Animation pass

Plan: `Architecture files/animation-plan.md`. Frontend only; no data, route, copy or SEO change.

- **Added**: hero load-in (`.hero-in` / `.hero-slide`, transform-only on the headline and tiles so LCP is not
  delayed); `data-anim` scroll reveals (37 targets on the homepage: work, services, results, process,
  testimonials, FAQ; also blog cards and video tiles) driven by one `components/ui/animation-observer.tsx`;
  page transition `app/(frontend)/template.tsx` (client navigations only); `Button` press/lift/arrow nudge;
  header nav underline; smooth Services `<details>`.
- **Design decisions**: visible without JS and under reduced motion; observer leaves on-screen content alone
  and hands styling back (`data-anim-state="done"`) so hover transforms/transitions are not overridden;
  no animation library; ~2 KB JS.
- **Bug caught in testing**: Tailwind v4 `hover:-translate-y-*` uses the `translate` property, so listing
  `transform` in `transition-[...]` made the lift snap; fixed by listing `translate,scale`.
- **Test artefact worth knowing**: with `scroll-behavior: smooth`, scripted `scrollTo` in Firefox is slow and
  looked like stuck reveals; use `behavior: 'instant'` in tests.
- **Verified**: tsc 0, eslint clean, build clean (0 DB errors, route table unchanged); all reveal targets reveal and
  settle in Chromium/Firefox/WebKit; reduced motion and JS-off keep everything visible; no console errors;
  CLS 0; mobile LCP 244-252 ms (unchanged); 3 engines x 5 viewports x 7 pages clean.

---

## 2026-11-24 - New logo, performance pass, docs

Not committed or deployed. Details: `Architecture files/performance-audit.md`; system model: `ARCHITECTURE.md`.

- **Logo**: `claude files/logo.png` is now the mark everywhere: `public/logo.png`, `LogoMark` (plain `<img>`),
  `favicon.ico` + `icon.png` (generated `icon.tsx` removed), and the Open Graph image. An earlier attempt used
  `next/image` for it, which threw `images.localPatterns` and broke the page (a React "script tag" warning was a
  side effect of the resulting client re-render); fixed by using `<img>`.
- **Static rendering**: `generateStaticParams` + `revalidate = 900` on `blog/[slug]`, `work/[slug]`,
  `work/videos/[slug]` (detail pages 0.65-4 s cold -> 10-40 ms). `/blog` made static; `/blog?page=N` rewritten
  (`next.config.ts`) to the new internal `/blog/page/[page]`; shared body in `components/blog/blog-index.tsx`.
- **Client JS / paint**: `Reveal` rewritten as CSS + IntersectionObserver (visible by default, below-fold
  blocks fade in once); Framer Motion now only on the influencer form (~100 KB less JS per page).
- **Other**: GTM `afterInteractive`; removed below-the-fold `priority` image; image optimiser cache 30 days;
  `/logo.png` cache headers; `poweredByHeader: false`; `optimizePackageImports`; `data-scroll-behavior="smooth"`.
- **Build discipline**: 1 worker / concurrency 1. A first attempt at 2 x 4 hit `EMAXCONNSESSION` and baked posts
  without prev/next links; final build: 0 DB errors, 93 pages in ~46 s.
- **Lesson**: `next start` on an occupied port exits silently, so measurements kept hitting the previous server.
- **Verified**: tsc 0, eslint clean on touched files, build clean; Chromium/Firefox/WebKit x 5 viewports x 7 pages
  with no overflow, broken images or console errors; `/blog?page=N` behaviour checked. Not run: Lighthouse, axe,
  throttled or real-device tests.
- **Docs**: `CLAUDE.MD` (status, logo, motion, performance rules), `handover.md` rewritten, `ARCHITECTURE.md` created.

---

## 2026-11-22 (iteration 3) - Layout system fix (per `prompts/redesignv3.md`)

Layout/alignment only; visual design, copy, colours and SEO unchanged. Plan: `redesign-handoff/REDESIGN-V3-PLAN.md`.

- **Root causes removed**: magic-number `gutter-l/r` calc paddings, negative margins, `%`-width/absolute image
  placement (hero, work lead), hard-coded offsets (`mt-32`, `pt-16`, `pt-24`, `pl-[5.75rem]`, `right-[22%]`),
  and narrow widths applied to `Container` itself (re-centred columns, so the left edge moved page to page).
- **One system**: `Container` (1280px, 20/32/48px) is the only horizontal boundary; narrow reading columns are
  inner, left-aligned blocks. `.section` is the only vertical rhythm; `.text-section` the only section-heading
  style; offsets come from 12-column grid placement, never margins.
- **Hero** = `.split-bg` (paper|red on the container's centre line) + one container, `lg:grid-cols-2`, two
  contained tiles in the right column (no overlap/clipping). **Header** = 3-column grid, nav truly centred.
- **Work** re-laid on the grid (lead + caption share a grid row; B bottom-aligned; index = fixed column grid with
  thumbnails). **Services** intro/rows share `--row-pad`; expanded content reuses the summary column template.
  Testimonials quote mark is in flow; Process numerals fixed to the right edge; Results sized to the column;
  video wall + footer wordmark moved inside the container; blog article gets a sticky TOC in the right column.
- **Verification**: automated layout test (7 widths x 8 pages = 56 combos): no horizontal overflow, header
  centres within 1px, nav centred, every content element inside the container edges, headings on the left edge,
  hero tiles not overlapping. The test was proven able to fail by injecting a misalignment. Visual review at
  390/768/1440. tsc 0, eslint 0 errors, build OK, SEO diff vs production identical, 0 console 500s over 30 runs.
- **Lesson**: leftover local `next dev/start` servers exhaust Supabase's 15-connection session pool
  (`EMAXCONNSESSION`); a build then silently falls back to placeholder content and pages show intermittent 500s.
  Kill stray servers before building or testing.

---

## 2026-11-22 (iteration 2) - Art-direction pass (per `prompts/redesignv2.md`)

v1 was aligned but generic (one background tone, one section recipe, dividers, red-dot labels, cards).
v2 changes composition and contrast. Plan: `redesign-handoff/REDESIGN-V2-PLAN.md`. Frontend only.

- **Signature elements**: the logo's ring+bolt drawn huge and cropped (`components/doodles/brand-device.tsx`),
  full-bleed brand red as a surface, alternating paper / ink / white / red sections, real project mockups as
  the visual lead, a bolt-separated client marquee.
- **Sections** (each its own composition): split hero with red panel + overlapping projects; ink client
  marquee; work = full-bleed lead with overlapping ink caption, landscape + portrait crop, big-type index
  with hover preview; ink video wall (staggered 9:16, no cards, hover text); services = native
  `<details name>` editorial menu (descriptions stay in the DOM); red "why us" split (Problem + Manifesto
  merged in `sections/why.tsx`); giant-numeral stats; ink zig-zag process with outlined numerals; one huge
  featured testimonial; white FAQ; CTA with contact links; footer with giant wordmark.
- **Removed**: red-dot eyebrows (`.eyebrow` is plain small caps now), divider-as-structure, equal card grids,
  `sections/problem.tsx`, `sections/manifesto.tsx`.
- `/work/videos` is now a dark wall page. Homepage video band still renders only when >=1 video is published.
- Verified: tsc 0, eslint 0 errors, `next build` OK; Playwright at 390/768/1440 (no overflow, one H1, alt
  present); video wall + lightbox 18/18 at 3 breakpoints (temporary fixture, removed); SEO diff vs production
  identical (10 pages, robots, 145-URL sitemap).
- Known: intermittent `/_next` 500s seen once during one automated scroll against a production build
  (not reproduced in 4 reruns; likely the image optimizer fetching from Cloudinary). Not verified: Lighthouse,
  axe, real devices, a published video.

---

## 2026-11-22 - Full frontend redesign (per `prompts/redesignui.md`)

Frontend only. No Payload schema/collection/route/sitemap/robots/metadata/JSON-LD changes. Plan and
decisions: `redesign-handoff/REDESIGN-IMPLEMENTATION-PLAN.md`; the "before" audit: `redesign-handoff/SITE-BRIEF.md`.

- **One design system** (`app/(frontend)/globals.css`): Ink/Paper/Red, Archivo variable only. Brand red
  `#ec3013` for display accents/rules; tonal `--color-accent-deep #d1260b` for button fills and small red
  text (AA). Removed the red->purple->blue gradient namespace, grain/vignette/atmosphere overlays, dot grid,
  Caveat, doodles, glass header, magnetic buttons, rolling-number odometer, auto-rotating testimonials,
  sticky mobile CTA, hard-coded Tools tiles. Legacy tokens (`accent-solid`, `home-bg`, `gradient-*`,
  `pill-badge`, `font-hand`) no longer exist.
- **Homepage order**: Hero -> Clients -> Work -> Videos (only if >=1 published) -> Services (grouped) ->
  Results -> Problem -> Manifesto -> Process -> Testimonials (static) -> FAQ -> Final CTA. Anchor ids
  (`#top #case-studies #services #process #faq #final-cta #site-footer`) kept.
- **Copy ownership**: hero + work/video/clients framing live in `lib/home-copy.ts`; everything else still
  reads the CMS `homepage` global. CMS `hero`, `trustLogos` fields are no longer rendered. Header nav is
  `lib/nav.ts` (full CMS nav still in the footer). The homepage no longer embeds the contact form
  (`/contact` unchanged).
- **Video showcase**: `components/video/*` (9:16 grid, native `<dialog>` lightbox, posters only until
  opened). Data = existing `portfolio` items with `mediaType: video`. Only data-layer change:
  `videoUrl` added to `PortfolioSummaryData` / `normalizeSummary` (additive).
- **Blog/work/contact/influencer** restyled; imageless posts get a branded typographic cover; the
  non-functional "newsletter coming soon" block became `ArticleCta`. Branded `not-found.tsx` / `error.tsx`
  (unmatched URLs outside route handlers still use Next's default 404).
- **Footer** hides social/legal links whose URL is the `/#top` placeholder (they were dead links).
- Dead code deleted: mobile-cta, hero-collage, hand-arrow, paper-clip, scribble-underline, spotlight,
  marquee, rolling-number, google/meta icons, tools-stack, case-studies section, newsletter-cta.
- Verified: `tsc` 0 errors, `eslint` 0 errors (24 pre-existing warnings in generated migrations),
  `next build` OK, Playwright at 390/768/1440 over 10 page types (no horizontal overflow, one H1, no missing
  alt), video lightbox 41/41 checks (against a temporary local fixture, since removed), mobile-menu/skip-link/
  reduced-motion checks, SEO diff vs production identical (metadata, OG/Twitter, JSON-LD types, robots,
  145-URL sitemap).
- Not verified: Lighthouse/axe, real-device testing, a published video item in production.

---

## 2026-10-24 - Content API for agent-driven blog + case study publishing

Goal: let Claude publish blog posts and edit portfolio case studies directly using a Payload API
key (the key mechanism itself shipped 2026-08-08 in `a15890b`). Raw Payload REST needs rich text as
Lexical JSON, so the real gap was ergonomics and a few permission/storage holes.

- **`POST/GET /api/content/posts` and `/api/content/portfolio`** (`app/(frontend)/api/content/*`,
  helpers in `lib/content-api.ts`): upsert-by-slug, partial updates, Markdown in (via
  `convertMarkdownToLexical`) and Markdown out on GET (`convertLexicalToMarkdown`) so existing
  content can be fetched, edited and re-posted. Auth is plain Payload (`payload.auth` on request
  headers, `admin`/`editor` only). No DELETE by design. Defaults to publishing immediately
  (user's choice); `"status":"draft"` available.
- **Categories/tags**: `create` widened from `isAdmin` to `isAdminOrEditor` so the endpoint can
  auto-create them. Update/delete stay admin-only. Authors stay admin-only (endpoint resolves an
  existing author slug, defaulting to the first author).
- **Posts gained `featuredImageUrl` / `featuredImageAlt`** (migration
  `20261024_140605_add_post_featured_image_url`, applied to the shared DB). `normalizeSummary` in
  `lib/cms/posts.ts` falls back to it when the `featuredImage` upload relation is empty, so every
  existing blog component, OG tag and JSON-LD image works unchanged. Reason: the `media`
  collection stores on local disk, which does not persist on Vercel.
- Guide for the agent: `Architecture files/content-api.md`.
- Gotcha hit while building: a Python `open()` edit on Windows wrote an em dash as cp1252, which
  made Turbopack fail with "invalid utf-8 sequence". Write files as UTF-8 explicitly.
- Verified: `tsc` and `next build` clean; against a production build, unauthenticated and bad-key
  requests return 401 and anonymous `POST /api/categories` still 403. **Not yet verified:** an
  authenticated create/update round trip with a real editor key (creating a temporary key-bearing
  user in the shared DB was declined), so Markdown -> Lexical rendering on a live post is untested.

---

## 2026-08-05 — Influencer creator-network application form (`/form/influencer`)

New public page, `prompts/forms/influencer.md`. The spec asked for a raw Supabase table +
Supabase Storage bucket, written as if no CMS existed yet — but this repo already stores
everything in the same Supabase Postgres via Payload collections, and already uses Cloudinary
(not Supabase Storage) for file uploads. Confirmed the deviation with the user before building:
implemented as a new `influencer-applications` Payload collection instead of a parallel
raw-Supabase-client data path, so it gets Payload admin (list/filter/search, versioning, RBAC) for
free rather than needing a bespoke admin UI built later — directly satisfies the spec's "Admin
Ready" requirement.

**New `influencer-applications` Payload collection**
(`payload/collections/influencer-applications.ts`): ~50 fields covering the spec's 8 form sections
(personal, creator, location, social, audience, collaboration, additional, consent) plus
admin-only CRM fields (status, tier, verification, assigned manager, payment status,
last-contact/next-followup dates) and an attribution group, same pattern as `leads`. Public REST
create is closed (`access.create: () => false`) — only `/api/influencer`'s route handler can
write, via the Local API. Needed an explicit `dbName: "influencer_apps"` — the full slug
(`influencer-applications`) combined with `versions: true`'s generated enum type names
(`enum__<name>_v_version_<field>`) blew past Postgres's 63-character identifier limit on the
longest field name. Required fields intentionally match the spec's explicit "Required fields"
list, not every field marked `*` in the form-section outline (broader, includes the full postal
address) — the itemized list reads as the more deliberate source of truth, and gating an
applicant on a full address to apply would hurt conversion for no stated reason.

**Submission pipeline**: `/api/influencer` (honeypot, `lib/influencer/validate.ts` server-side
validation, DB-backed rate limiting, and a 24h duplicate-application check by email+Instagram) and
`/api/influencer/upload` (public, unauthenticated by necessity since it runs before an applicant
has submitted anything — bounded by strict PDF-only/10MB checks). PDFs (Media Kit, Rate Card) go
to Cloudinary's `raw` resource type rather than Supabase Storage; `lib/cloudinary.ts`'s
`uploadImage`/`deleteImage` were extended to accept it.

**Client**: `components/forms/influencer/` — an 8-step wizard (progress bar, localStorage
autosave/restore, per-step client validation, XHR-based upload progress, animated success screen
with a "Back to Homepage" CTA), built entirely from the existing design system components (Button,
Container, Reveal, brand tokens) — no new visual language. Page background uses `bg-dot-grid-light`
(same class the homepage's `<main>` already uses) for the grid-on-light-background treatment.

**Navigation and footer**: added an "Influencers" link to `navigation.links` (right after
"Services") and an "Influencer Program" link to `footer.serviceLinks` (after the existing service
items) — both in the collection `defaultValue`s (`payload/globals/navigation.ts`,
`payload/globals/footer.ts`, plus their `lib/constants.ts`/`lib/cms/footer.ts` fallbacks) and, via
a one-off `payload run` script, in the already-seeded live global documents — same as every prior
case where a `defaultValue` change doesn't retroactively touch a singleton global already sitting
in the database. The footer's "Company" column already mirrors the full nav array, so the new link
appears there too automatically; not deliberate, but harmless.

**Real gotcha, worth remembering**: right after the DB update, `npm run dev` kept serving the old
nav/footer even after clearing `.next/cache` and a full process restart. Root cause wasn't the
already-documented Turbopack `unstable_cache` dev-mode artifact (see the 2026-07-29 entry) — it
was a leftover **production build** sitting in `.next` from an earlier `npm run build` in the same
session, including prerendered static HTML for `/`. `next dev` reused that static output instead
of rendering fresh; `rm -rf .next/cache` doesn't touch `.next/server`'s actual prerendered pages.
Fix: delete the entire `.next` directory (not just `.next/cache`) before starting `dev` again after
a `build` has run against the same working tree.

Verified against a real production build (`next build && next start`, not just `next dev`, given
the caching gotcha above): title/canonical/OG tags render correctly, honeypot/validation/
duplicate-check/rate-limit all behave correctly against the real database, nav/footer show the new
link. One real end-to-end test submission was made and immediately deleted via a one-off script
after confirming duplicate-detection worked — no test data left in the shared database. Known gap,
same as every other phase: no browser-automation tool available this session, so a real mobile/
desktop click-through of the 8-step wizard hasn't been done.

---

## 2026-08-03 — CMS-driven Portfolio system, real client case studies, Cloudinary

Replaced the static "Case Studies" homepage section (a bare `case-studies` collection — client,
industry, result, summary, tags, no thumbnail, no rich content, no publish workflow) with a real
portfolio subsystem, per a full written spec. Went through formal plan mode first given the scope
(new external service, new collection, five new routes, custom admin UI) — plan approved before
any code was written.

**New `portfolio` Payload collection** (`payload/collections/portfolio.ts`): title, client, slug,
`featured` boolean, `mediaType` (image/video), category, description, resultHeadline, services
(array), thumbnail (url/publicId/width/height/format), videoUrl, `caseStudyContent` (richText),
liveWebsite, sortOrder, publishedAt, an SEO group, `versions.drafts: true`. A real migration
(`migrations/20260803_091008_add_portfolio_collection.ts`) was generated and applied to the shared
dev/prod database — required now that `push: false` (2026-07-30 entry below) means nothing gets a
table without one, local dev included.

**Cloudinary, not Payload storage, for all portfolio media** — the explicit requirement. Official
`cloudinary` SDK wrapped in `lib/cloudinary.ts` (`uploadImage`/`deleteImage`/`transformImage`),
gated behind a new `getCloudinaryConfig()` in `lib/env.ts` that follows the same
optional-key-degrades-gracefully pattern as `RESEND_API_KEY`/`TURNSTILE_SECRET_KEY` (warns once,
returns `null`, never throws at boot) — the collection had to be fully usable before real
Cloudinary keys existed ("will be provided later" in the original spec). Uploads go through a new
authenticated route, `app/(frontend)/api/portfolio/upload/route.ts` (admin/editor only, same
`payload.auth()` pattern as `/api/leads/export`), which streams straight to Cloudinary and returns
only metadata — no file ever touches Payload or local disk. `transformImage()` does the
OG-image-sized crop by string-splicing the transformation into an already-uploaded delivery URL
(`.../upload/f_auto,q_auto,c_fill,w_1200,h_630/...`) rather than calling the SDK, so it keeps
working to render pages even if Cloudinary env vars are later unset or rotated.

**Custom Payload admin field** (`payload/admin-views/cloudinary-upload-field.tsx`): replaces the
default text input for `thumbnailUrl` with a file picker + "Upload to Cloudinary" button, using
`useField`/`useFormFields` from `@payloadcms/ui` to write the returned metadata into the sibling
(hidden) `thumbnailPublicId`/`Width`/`Height`/`Format` fields on success. `thumbnailUrl` itself
stays a real, visible, directly-editable text input underneath the button — an editor can paste a
URL manually as a fallback with zero Cloudinary configuration, so the collection was genuinely
usable end-to-end before real API keys arrived. Needed `npm run generate:importmap` after adding
it — Payload's admin bundle only knows about a custom component once it's in the import map.

**New routes**, all `SITE_URL`-based (not `siteSettings.url` — see the domain-migration entry
below, same lesson applied proactively here): `/work/[slug]` (image-project case study detail —
hero, description, resultHeadline, services, `caseStudyContent` rendered via
`@payloadcms/richtext-lexical/react`'s `RichText`, related work, `CreativeWork` + breadcrumb
JSON-LD), `/work/videos` (grid of published video items), `/work/videos/[slug]` (embedded player —
`lib/video.ts`'s `parseVideoUrl()` detects YouTube/Vimeo/direct-Cloudinary-MP4 and picks
`<iframe>` vs `<video>` accordingly — plus `VideoObject` + breadcrumb JSON-LD). All three added to
`sitemap.ts`.

**Homepage**: new `sections/featured-work.tsx` (`getFeaturedPortfolioItems()` — `featured: true`,
`mediaType: "image"` only, published, sorted by `sortOrder`) replaces the old
`case-studies`-collection-driven section in `app/(frontend)/page.tsx`. Deliberately kept the same
`id="case-studies"` anchor the old section used, so the nav "Work" link, hero secondary CTA, and
the CMS `navigation` document's stored href — all fixed to point at `/#case-studies` in the
2026-07-30 entry below — kept working with zero further changes. The old collection and its 3
placeholder entries (Marlow & Finch, Northbound Outfitters, Ferra Skincare) were left completely
alone, just no longer rendered — nothing was deleted.

**Real content**: uploaded the four supplied client project images to Cloudinary and created the
matching Portfolio documents — Mylini and Kodai Golden Honey (E-commerce Website) and LightPic (AI
SaaS Platform) are published and featured, with full case-study rich text (Overview/Challenge/
Solution/SEO Highlights/Outcome) built programmatically as Lexical AST nodes in a one-off script
(no existing helper for this in the codebase) from the supplied case-study briefs. A fourth,
Fairyland Resort, was uploaded and stored but saved with `_status: "draft"` — "keep it hidden, do
not delete" — which correctly excludes it from every public query (`getFeaturedPortfolioItems`,
`getPortfolioItemBySlug`, `getAllPortfolioItems`) including direct URL access (`/work/
fairyland-resort` → 404), without touching the record. Each real project's `liveWebsite` was later
set to its actual production URL (mylini.com, lightpic.in, kodaigoldenhoney.com).

**Real bug, caught from a live report, not a test**: setting `liveWebsite` made the *entire*
homepage card an external link (the original card component had one click target that branched
external-vs-internal), so there was no longer any way to reach `/work/[slug]` from the homepage —
the spec's own "View Case Study button" had never actually been built as a distinct element. Fixed
by always linking the card body to the internal case study page and moving the external link to a
small separate icon button in the card's corner (`stopPropagation`-free since it's a sibling
absolutely-positioned element at a higher z-index, not nested inside the card's own link).

Verified throughout the same way as every other phase: `npm run lint`/`build` clean at each stage,
a real end-to-end round-trip (create a test item → confirm it renders on the homepage and its
detail page with correct JSON-LD → delete it) before touching real content, `POST /api/leads` still
`403` and `/admin` still loads after every change (backend untouched). Known gap, same as always:
no browser-automation tool available this session, so the admin upload button's actual click-through
UX (file picker → preview → sibling-field population) is verified against Payload's real hook
signatures and API shapes, not a live browser interaction.

---

## 2026-08-03 — Domain migration: rulescalemedia.com → www.rulescale.in, twice

Google Search Console reported `sitemap.xml` "Couldn't fetch" / "URL not allowed" against the
retired `rulescalemedia.com` domain. Audited the entire repo for the string (`lib/constants.ts`'s
`SITE_URL`, `payload/globals/site-settings.ts`'s `url` field default; `migrations/*` left alone as
historical DDL, and two false positives correctly left untouched — the `instagram.com/
rulescalemedia` / `linkedin.com/company/rulescale-media` social handles, and a seed-admin email
mention in `prompts/results/phase1result.md`). Fixed `SITE_URL` to
`process.env.NEXT_PUBLIC_SITE_URL || "https://rulescale.in"`, fixed the Payload default, and
patched the live `siteSettings.url` document directly (same pattern as the earlier nav-link fix) —
though it turned out someone had already corrected that field via the admin UI before this session,
so the live document was already right; only the code-level fallbacks needed the fix at that point.

**Google Search Console still showed the old domain after that fix shipped.** Root cause: every
SEO-critical surface (`sitemap.ts`, `blog/rss.xml/route.ts`, `lib/seo/metadata.ts`'s
`metadataBase`/OG, `lib/schema/index.ts`'s JSON-LD builders, every blog page's canonical/OG) read
the domain from `siteSettings.url` — a Payload global cached via `unstable_cache` with **no
revalidate time**, invalidated only by a tag that reliably fails when a document is updated from a
standalone script (no Next.js request context to call `revalidateTag` from — the exact same
limitation noted in the 2026-07-30 entry below). Vercel's Data Cache for that tag was still serving
a pre-fix snapshot. Fix: stopped using `siteSettings.url` for domain construction entirely across
every one of those files — replaced with the `SITE_URL` code constant, which carries zero caching
risk since it's evaluated fresh on every import. `siteSettings.url` remains in Payload as an
editable, admin-visible field, just no longer wired into anything that generates a URL.

**Domain corrected a second time same day**: the actual live Vercel routing turned out to be
`https://www.rulescale.in` (the `www` variant), not the bare apex — `SITE_URL`'s default and the
Payload field's default were both updated from `https://rulescale.in` to `https://www.rulescale.in`
to match. Verified via `curl`: `/sitemap.xml`, `/robots.txt`, canonical/OG/Twitter meta tags,
`Organization` JSON-LD, and the RSS feed all confirmed emitting `www.rulescale.in` exclusively, zero
`rulescalemedia.com` references left anywhere live.

---

## 2026-08-01 — Google Tag Manager

Added GTM (`GTM-K28PK4V6`) to the public site only — `app/(frontend)/layout.tsx`, not the separate
`app/(payload)/layout.tsx` admin layout, so it fires on every public page (home, blog, contact) but
never inside `/admin`. Used `next/script` with `strategy="beforeInteractive"` — Next's own
documented pattern for GTM — rather than a raw `<script>` tag in `<head>`: `beforeInteractive`
scripts get injected into the initial HTML and execute before hydration and before any other page
script, which is the actual intent behind GTM's own "as high in `<head>` as possible" instruction
(confirmed via rendered-HTML inspection: the script appears as literally the first thing in
`<body>`, ahead of the JSON-LD and everything else, regardless of its JSX position). The required
`<noscript>` iframe fallback is the first element inside `<body>`.

---

## 2026-07-30 — Cross-page in-page-scroll links; permanent dev-push lockout

**Bug**: navigating to `/blog` and clicking "Work" in the header nav (or the logo, or the mobile
CTA, or a footer link) produced `/blog#case-studies` instead of returning to the homepage. Root
cause: every in-page anchor across the whole site (`#case-studies`, `#services`, `#process`,
`#faq`, `#final-cta`, `#top`) was a *bare* hash with no leading `/` — harmless on the homepage
itself, but from any other route a bare `#anchor` just appends to the current URL rather than
navigating home. Fixed by prefixing all of them with `/` across every source location: the
CMS-editable defaults (`payload/globals/navigation.ts`, `footer.ts`, `homepage.ts`'s hero CTAs),
the code-level fallbacks (`lib/constants.ts`, `lib/cms/*.ts`), and the hardcoded logo/footer/
mobile-CTA links — then patched the already-persisted `navigation`/`footer`/`homepage` documents
in the live database to match, since fixing only the defaultValue doesn't touch a document that
already exists (the same lesson as every other "fix the default AND the live row" fix this
project has needed).

**While testing that fix, re-broke the exact production build crash from the 2026-07-30 entry
below.** Running the verification script (`payload run` outside `NODE_ENV=production`) re-triggered
Payload's dev-mode schema auto-push against the shared database, re-inserting the `{name: "dev",
batch: -1}` migration-ledger marker that causes an unanswerable interactive prompt on the next
Vercel build — because local dev and production point at the *same* database, and nothing had
previously stopped dev-push from running locally between deploys. Root-caused this time instead of
just re-patching the ledger again: added `push: false` to `postgresAdapter(...)` in
`payload.config.ts`. Per the adapter's own source (`this.push !== false` gates `pushDevSchema()`),
this permanently disables auto-push everywhere, not just in production — local dev now behaves
exactly like production, schema changes only ever land via a real `payload migrate:create` +
committed migration file. Re-corrected the ledger once more after adding the flag, confirmed no
recurrence.

---

## 2026-07-30 — Homepage UI/UX redesign, refinements, and first production deploy

Two threads of work: a full visual redesign of the homepage (UI/UX only, explicitly no backend/
endpoint changes), refined over several rounds of live feedback; and the first real deploy to
Vercel, which surfaced — and led to fixing — a class of "worked in dev, breaks in production"
gaps this project had been carrying since Phase 1.

**Homepage redesign.** Every homepage section restyled from the ink/red/paper editorial system to
a clean, card-and-pill "reference-inspired" system, at the user's explicit request, reading the
exact same `HomepageData` shape from the exact same `getHomepage()` — zero Payload schema change.
New tokens/utility classes (`.gradient-text`, `.gradient-bg`, `.pill-badge`, `.bg-dot-grid-light`,
`--color-accent-from/via/to/solid`, `--color-home-bg`) live in a namespace separate from
`--color-accent`, so the blog (Phase 2) and `/contact` (Phase 3) pages are byte-for-byte
unaffected. Section order was reprioritized to match the reference (proof/stats moved up, services
before trust logos), a hardcoded "Tools & Platforms" section and a floating WhatsApp button
(`https://wa.me/919500381132`) were added, and the final section now embeds the real Phase 3
`ContactForm` directly on the homepage instead of only linking out to `/contact`.

**The color system went through a real iteration, not a single pass.** First pass fully replaced
red with a blue→purple gradient. Follow-up feedback ("keep these colors too, mix it") changed the
gradient itself to a 3-stop blend starting on the *original* brand red (`#ec3013`) through purple
(`#a855f7`) to blue (`#3b82f6`), so the original palette stays literally present in every gradient
element, not just adjacent to it — plus the original red is reused directly (via the existing,
untouched `--color-accent` variable) for secondary tag/pill accents and half the animated stat
numbers, so both palettes read as genuinely mixed.

**Two real bugs found and fixed during the redesign, not just style tweaks:**
1. `.pill-badge` declared its own `display: inline-flex` as plain (unlayered) CSS. Under Tailwind
   v4's cascade layers, an unlayered declaration always beats a layered utility like
   `hidden`/`md:inline-flex`, regardless of source order — so the decorative "Meta Ads" hero badge
   never actually hid on mobile, and visibly overlapped the eyebrow pill in a live screenshot.
   Fixed by removing `display` from the CSS class entirely and applying `inline-flex` as an
   explicit Tailwind class at each call site, restoring correct responsive behavior everywhere
   `.pill-badge` is used.
2. The word-by-word headline animation (`AnimatedWords` in `sections/hero.tsx`) put the
   space between words *inside* each word's `inline-block` span, right at the box edge — browsers
   silently trim trailing whitespace at an inline-block boundary, which collapsed "We grow brands"
   into "Wegrowbrands" in production. Fixed by moving the space to a sibling text node outside the
   animated span (wrapped in a keyed `Fragment`), confirmed via the actual rendered HTML.

Also added in follow-up rounds: hand-rolled Google/Meta SVG icon components (`components/icons/`,
same inline-SVG pattern as the existing `LogoMark`) for the Hero's platform badges and the Tools
section; nearly doubled `.bg-dot-grid-light`'s contrast after it read as invisible in a screenshot
(muted further by the pre-existing site-wide grain overlay sitting above it in z-order); trimmed
every section's eyebrow copy to short reference-style labels ("Proof", "Services", "FAQ", ...),
patched live onto the persisted Homepage document since it — unlike `navigation` — turned out to
already have a saved row from Phase 1; bumped card radii from 16px to 24px and added spring-based
entrance motion for an "iOS" feel; and a slow, infinite, out-of-phase vertical bob
(`Float` component) on the Hero's four floating decorative elements (Google icon, Meta Ads pill,
both stat cards).

**First Vercel deploy surfaced three real production gaps, none of them backend-logic bugs:**

1. **`/admin` 500'd and the Blog nav link silently disappeared.** Root cause confirmed by reading
   the actual installed `@payloadcms/db-postgres` source (`connect.js`): schema auto-push is
   hard-disabled whenever `NODE_ENV === "production"` (which Vercel always sets) — production only
   ever applies schema via an explicit `prodMigrations` config, which this project never had. Every
   schema change since Phase 1 (Tags, blog fields, the whole Leads/CRM expansion, 5 new
   collections, `authors.slug`) had only ever reached whichever database `npm run dev` happened to
   be pointed at locally; Vercel's production boot never touched schema at all. `/admin` queries
   the full collection set immediately, so it threw a raw SQL error. `getNavigation()`'s try/catch
   silently fell back to `lib/constants.ts`'s `NAV_LINKS` — which still had the pre-Phase-2 4-link
   list, since Phase 2 only updated the Payload-side `defaultValue`, never this separate fallback
   constant — which is why the rest of the page looked "updated" while nav didn't. Fixed: added
   `NAV_LINKS`'s missing Blog entry; wired `prodMigrations` in `payload.config.ts`; generated a
   first migration (`payload migrate:create`, `migrations/`) representing the full current schema.
2. **`DATABASE_URL` on Vercel was set to the literal `.env.example` placeholder** (`ENOTFOUND
   host` — Node's DNS resolver failing on the literal hostname `host`), not the real Supabase
   connection string — a dashboard configuration mistake, not a code issue; confirmed by grepping
   the actual source for that placeholder string and finding zero references outside
   `.env.example`, which is never loaded at runtime.
3. **Once `DATABASE_URL` was fixed, the build itself crashed**: `/blog/rss.xml` and `/sitemap.xml`
   were two of the only routes Next.js pre-renders *at build time* (both had `revalidate`, making
   them eligible for static generation) — and since this project's database was built entirely via
   dev-mode push, its `payload_migrations` table held a `{name: "dev", batch: -1}` marker that
   Payload's migration runner treats as "confirm before proceeding" via an *interactive* prompt,
   which cannot be answered in Vercel's non-interactive build environment. Fixed two ways: directly
   corrected the shared database's migration ledger (deleted the `dev` marker, recorded
   `initial_schema` as already-applied, since its `CREATE TABLE` statements would conflict with
   tables that already exist) — and, for defense in depth, changed both routes from `revalidate` to
   `export const dynamic = "force-dynamic"`, so neither one depends on Postgres being reachable
   *during a build* ever again, matching how every other blog route already worked.

Live-verified throughout: build/lint/typecheck clean after each change; a real submission through
the redesigned homepage's embedded contact form still creates a lead via the unmodified
`/api/contact`; the direct-REST lockdown (`POST /api/leads` → `403`) still holds; the rendered
headline HTML confirmed the space-collapse fix; all temporary test leads deleted after each check.

---

## 2026-07-29 — Phase 3: agency operations platform (leads, CRM, email, dashboard, security)

Built the operational backbone behind the marketing site per `prompts/backend/phase3.md`: a real
lead-capture pipeline, a lightweight CRM layer on the previously-unused `leads` collection,
transactional email (Resend + React Email), a custom admin business dashboard, CSV export,
last-touch attribution, and request-level security (validation, DB-backed rate limiting, honeypot,
optional Turnstile). No blog code touched, no homepage redesign — only two existing CTA hrefs
changed (see below).

**There was no contact form anywhere on the site before this.** Every "Start Growing" CTA and the
footer email link were `mailto:` links — Phase 1's own docs had flagged this as an explicit
deferral. Confirmed via direct exploration before planning, not assumed. Built a new `/contact`
page (`components/contact/contact-form.tsx`) and, with the user's explicit sign-off on the
approach, repointed exactly two existing hrefs to it: the Homepage global's FinalCTA
(`payload/globals/homepage.ts`, `mailto:hello@rulescale.media` → `/contact`) and the footer's
email anchor (`sections/footer.tsx`, now a `/contact` link labeled "Contact us" instead of the raw
address — keeping literal email text on a link that no longer opens a mail client would have been
misleading). The Homepage global's live document was already persisted from Phase 1, so — same as
the Phase 2 nav-link lesson, but the opposite finding — the code's `defaultValue` change alone did
NOT touch production data; it needed a one-time live patch via the Local API, same bootstrap
pattern used for the Phase 1.5 admin-role fix.

**A real security gap found and closed: Payload's public REST create endpoint bypassed all of
this.** `/api/contact` validates, rate-limits, and (optionally) Turnstile-checks every submission
— but Payload auto-generates a public `POST /api/leads` REST route from the collection config,
and the original `create: () => true` access meant anyone could skip the hardened endpoint
entirely and hit the raw API directly, unprotected. Fixed by setting `Leads.access.create` to
`() => false`. This does not break the real submit path: Local API calls
(`payload.create()` from inside `/api/contact`) default to `overrideAccess: true` and are
unaffected by collection access control — only the raw external REST/GraphQL path is closed.
Verified live: direct `POST /api/leads` → `403`; `/api/contact` → `200` and a real lead is created.

**Rate limiting is DB-backed, not in-memory or Redis.** No Upstash/Redis is provisioned, and the
deployment target isn't confirmed (in-memory state is useless across serverless invocations
anyway). `lib/leads/rate-limit.ts` queries recent `leads` by email/IP within a rolling window using
the collection itself — no new infrastructure. Verified live: the 4th submission from the same
email within the window returned `429`; the first 3 succeeded.

**Emails degrade gracefully without a real Resend key**, matching this codebase's established
fallback conventions (DB-unreachable → `constants.ts`; no email adapter → Payload logs to
console). Verified live with no `RESEND_API_KEY` set: both the visitor-confirmation and
admin-notification emails rendered correctly via `@react-email/render` and were logged to the
console instead of throwing. The notification recipient reuses the existing
`getSiteSettings().contactEmail` CMS field rather than adding a new env var.

**Attribution is last-touch, not first-touch.** True cross-session first-touch attribution needs a
cookie set on first page load and read later — real infrastructure for what the brief listed as
"store useful attribution data," not a hard requirement for session-linked tracking. Instead,
`lib/leads/attribution.ts` captures UTM params + `document.referrer` + the current page directly
from the `/contact` form at submit time, plus IP/user-agent server-side from request headers, plus
a small inline regex classifier for device/browser (no new dependency).

**Admin dashboard and CSV export are custom-built**, confirmed via direct `node_modules`
inspection before writing any of it: no built-in CSV feature in this Payload version, no
`@payloadcms/plugin-import-export` installed, and the only stat-widget system
(`admin.dashboard`) is explicitly marked `@experimental` in Payload's own type defs. Used the
stable, documented `admin.components.views` mechanism instead
(`payload/admin-views/business-dashboard.tsx`, registered at `/admin/business-dashboard` with a
sidebar link via `admin.components.afterNavLinks`) — plain HTML/inline styles, since Payload's
admin bundle doesn't run this repo's Tailwind build. CSV export
(`app/(frontend)/api/leads/export/route.ts`) replicates the `payload.auth()` + role-check pattern
from the existing `/next/preview` route to gate it to admins only — verified live: `401`
unauthenticated, `200` with an admin session, correct CSV content including the `servicesInterested`
multi-select joined with `; `.

**RBAC**: Leads read/update widened to `isAdminOrEditor` (was admin-only), delete stays
`isAdmin`-only — mirrors the exact allowance already granted to posts/media/testimonials/
case-studies in Phase 1.5. `users.read` widened from `isAdminOrSelf` to `isAdminOrEditor` so the
new "Assigned User" relationship field's admin-UI dropdown can actually list every staff member
(Payload resolves relationship options through the target collection's own read access) —
create/update/delete on `users` are untouched.

**Audit logging reuses Payload's built-in `versions`** (`versions: true` on `Leads`) rather than a
bespoke audit-log collection — full revision history through the existing admin UI, no new table.

**Automation seam, not real integrations.** The brief asks for Slack/Notion/WhatsApp to be
addable "later without refactoring," not built now (no credentials exist for any of them).
`payload/hooks/lead-events.ts` exports one `dispatchLeadEvent()` function that every Leads
`afterChange` event flows through — currently only triggering the two Resend emails; a future
integration is one more call inside that function, never a new hook wired into the collection
config. The hook is `await`ed (not fire-and-forget) specifically so a serverless response can't
return — freezing/killing the function — before the emails finish sending.

**Future collections** (`clients`, `projects`, `contracts`, `files`, `meetings`) are registered,
minimal-schema, `admin.hidden: true` — real, migratable tables invisible in the admin nav until a
later phase builds real UI for them, matching the brief's "no UI required yet."

**"Services Interested" options are sourced from `lib/constants.ts`'s existing `SERVICES` array**
(both in the Payload field config and in `lib/leads/validate.ts`'s server-side whitelist), not
hand-duplicated strings, so the two can't drift.

**Verification**: `npm run build` / `npm run lint` clean after each chunk. Full live pass against
the Supabase database — 3 real-shaped temporary test leads created through `/contact`'s actual
`/api/contact` endpoint (not a script), exercising validation, honeypot rejection, rate limiting,
the email fallback, the CSV export, and the business dashboard's aggregation math (verified the
displayed counts matched the known test data exactly) — then deleted. No browser-automation tool
was available this session (same gap as Phase 2) — verification was HTTP-request-based against a
running server rather than Playwright screenshots; the mobile/desktop visual pass is still
outstanding.

---

## 2026-07-29 — Phase 2: blog / publishing platform

Built the actual `/blog` on top of the Phase 1/1.5 CMS foundation per `prompts/backend/phase2.md`
— listing, article, category/tag/author archives, search, RSS, sitemap, draft preview, SEO/JSON-LD.
No homepage/existing-page changes beyond a new "Blog" nav link and generalizing
`breadcrumbSchema()` to accept an optional trail (defaults to exactly its old single-item output).

**Data model.** New `payload/collections/tags.ts` (mirrors `categories.ts`: `title`/`slug`,
admin-only writes). `authors` was missing a `slug` field entirely — required for
`/blog/author/[slug]`, added. `posts` gained `tags` (relationship, hasMany), `featured`
(checkbox), a `seo` group (`metaTitle`/`metaDescription`/`canonicalUrl`/`ogImage`/`twitterImage`),
and `admin.preview` pointing at `/blog/${doc.slug}`. Reading time and TOC are computed at read
time from the Lexical JSON (`lib/blog/reading-time.ts`, `lib/blog/toc.ts`), not stored fields —
cheap to compute, can't drift from the actual content.

**Cache tags: three shapes, not one per entity.** `posts` (any list-shaped read — index, search,
pagination, archives, RSS, sitemap, related, prev/next), `post-<slug>` (single article, precise
per-post invalidation on save/slug-rename), `taxonomy` (categories+tags+authors, shared since
they're small and rarely edited). Posts/Categories/Authors/Tags each got `afterChange`/
`afterDelete` hooks calling `revalidateTagSafely()`.

**Real bug found during verification: Payload's `draft` find option does not filter by
`_status`.** The working assumption going in — that omitting `draft` (or passing `draft: false`)
on a `find()` against a versioned collection automatically excludes `_status: "draft"` documents
— is wrong. It controls which version's *content* comes back, not whether the document appears
at all. A draft-only test post was showing up in the blog index, pagination counts, related
posts, and the RSS feed, and was directly fetchable by URL (`200`, should be `404`). Fixed by
adding an explicit `PUBLISHED_ONLY = { _status: { equals: "published" } }` filter to every
public-facing query in `lib/cms/posts.ts` (`fetchPublishedPosts`, `fetchPostBySlugFromPayload`
when not in preview mode, `fetchFeaturedPostFromPayload`, `fetchRelatedPostsFromPayload`,
`fetchAdjacentPostsFromPayload`). Verified with a real draft-only test post afterward: `404` on
direct fetch, absent from the index/pagination/related-posts/RSS/sitemap, and correctly visible
through the authenticated preview flow only. Worth remembering for any future Payload query
against a `versions.drafts: true` collection — `draft: false` is not a status filter.

**Draft preview.** `admin.preview` on `posts` reuses the existing `/next/preview` /
`/next/exit-preview` routes from Phase 1.5 unchanged (they already accepted an arbitrary `path`
query param). `getPostBySlug()` branches on `draftMode()` before the cache layer, same pattern as
`getHomepage()`. Verified live end-to-end with real HTTP requests: authenticated admin session +
correct `PREVIEW_SECRET` → redirected to the draft page, draft content visible, `__prerender_bypass`
cookie set; no session → `403`; wrong secret → `403`.

**Blog nav link needed no live-database patch.** The plan assumed the existing `navigation` global
document (saved during Phase 1) would need a direct API patch to add the new link, matching the
Phase 1.5 admin-role bootstrap pattern. Turned out the `navigation` global has never actually been
saved through `/admin` — `payload.findGlobal()` was confirmed to return a *fresh, unpersisted*
value straight from `defaultValue` every call (proven by requesting it twice and seeing the
array's item `id`s change between calls). So editing `payload/globals/navigation.ts`'s
`defaultValue` array was sufficient by itself; no live-document patch was needed or performed.

**Dev-mode-only caching artifact hit during verification, not a product bug.** While iterating
with `payload run` standalone scripts (seeding test posts, fixing their publish status, deleting
them), some `unstable_cache` entries in the running `next dev` process got and stayed stale even
across full process restarts and `rm -rf .next/cache` — isolated by comparing a raw
`getPayloadClient()` query (always correct), the same query through `getPublishedPosts()` called
from a throwaway Route Handler (correct), and the same call from `blog/page.tsx` in the same
process (stale), which rules out the data layer and points at Turbopack dev's per-route module
compilation giving different entry points their own long-lived `unstable_cache`/`getPayloadClient()`
singleton instances that don't reliably stay in sync with each other. Confirmed clean on a real
`npm run build && npm run start` (single unified server bundle, no per-route module duplication) —
every check that failed under `next dev` passed under the production server. Documented here so
a future "the blog looks empty in dev but the database clearly has posts" report isn't re-debugged
from scratch — restart `next dev` and/or verify against `npm run build && npm run start` first.

**Rich text rendering.** `ArticleContent` (`components/blog/article-content.tsx`) reuses
`@payloadcms/richtext-lexical/react`'s default JSX converters for every node type except
`heading` (overridden to inject TOC-matching anchor ids), rather than reimplementing
list/link/upload/blockquote conversion. Un-styled default output is styled via a `.article-body`
descendant-selector block in `globals.css`, matching this project's existing convention (see
`.text-display` etc.) rather than inventing a second styling approach for one component.
TOC/heading-id sync: `lib/blog/toc.ts` exports `createHeadingIdAssigner()`, a stateful factory
that both `extractHeadings()` (TOC sidebar) and `ArticleContent`'s heading converter instantiate
fresh per render — both walk the document in the same order, so the ids always match without any
shared mutable state across renders.

**Verification.** Created ~10 real-shaped temporary test posts (varying categories/tags/dates,
one featured, one genuine draft) plus 2 categories/2 tags/1 author through Payload's Local API
(same "create, verify, delete" pattern used for the Phase 1.5 RBAC test account), exercising
pagination, both archive types, search, related posts, prev/next, RSS, sitemap, and the draft/
preview boundary against the live Supabase database — then deleted all of it, confirmed via a
final "posts remaining: 0" check. No Playwright/browser-automation tool was available in this
session (unlike the Phase 1/1.5 sessions); functional/structural verification was done via direct
HTTP requests (`curl`) against a running production server instead — response status codes,
rendered HTML content, RSS/sitemap XML well-formedness, and the authenticated-vs-anonymous preview
behavior were all checked this way, but no actual screenshots or console-error checks were taken.
Visual/responsive (390px/1440px) verification of the new blog pages is still outstanding and
should be done with real browser tooling before considering this phase fully closed out.

---

## 2026-07-28 — Phase 1.5: production hardening (caching, drafts, RBAC, health)

Hardened the Phase 1 CMS foundation per `prompts/backend/phase1_5.md`, ahead of the blog phase.
No visual change — verified pixel-identical against the Phase 1 Playwright baseline throughout.

**SiteSettings/SEOSettings now actually power metadata + JSON-LD**, closing the deferral Phase 1
left open. `app/(frontend)/layout.tsx`'s static `metadata` export became an async
`generateMetadata()` calling the new `lib/seo/metadata.ts`. `lib/schema.ts` moved to
`lib/schema/index.ts` and its five JSON-LD builders became pure functions taking
`siteSettings`/`services`/`faq` as parameters instead of importing `constants.ts` — verified the
rendered `<head>` (title, description, keywords, OG/Twitter tags, robots directive, all 5 JSON-LD
blocks) was byte-identical to the pre-change static version before moving on.

**Caching: `React.cache()` wrapping `unstable_cache()`, not `"use cache"`.** Considered Next 16's
stable Cache Components (`"use cache"` + `cacheComponents: true`) first, but that flag changes the
rendering model for the *entire app*, not just these five queries — much bigger blast radius than
this phase's brief asked for, and the brief itself explicitly allows `unstable_cache()`. Every
`lib/cms/*.ts` getter is now `cache(unstable_cache(fetchFn, [tag], {tags:[tag]}))`; tags live in
the new `lib/cache/tags.ts`. Verified live: `revalidateTag(tag, 'max')` fired from a Payload
`afterChange` hook (`payload/hooks/revalidate.ts`) — a same-process call, valid because Payload's
admin/API already run inside real Next.js Route Handlers in this repo — reflected an admin-panel
save on the running dev server within ~1-2 seconds, no restart, confirmed by editing a live field,
polling the public page for the new value, then reverting.

**Draft mode.** `homepage` global got `versions.drafts: true` + `admin.preview`;
`app/(frontend)/next/preview` and `/next/exit-preview` are the entry/exit routes, matching
Payload's own official website-template pattern (verified against that template's actual source
before writing this, including a real bug in the template's own `payload.auth()` usage — it
checks `if (!user)` against the whole `{ user, permissions }` result object rather than
destructuring `user` first, which would never be falsy; fixed in this implementation).
`getHomepage()` branches on `draftMode().isEnabled` *before* the cache layer — draft reads are
never tagged or cached, so a draft can't leak to a real visitor through a shared cache entry.
Verified live end-to-end: saved a draft-only Homepage edit, confirmed the public page was
unaffected, confirmed `/next/preview?...` showed the draft, confirmed `/next/exit-preview`
returned to published, then published the original content back to fully settle the version
history (a draft-only save leaves Payload's `_status` as `"draft"` even when the content is
unchanged from what's published — a stray "unpublished changes" state, not a content bug, cleaned
up with one real Publish).

**Role-based access control.** `users.role` (`admin | editor`, admin-only to change via
field-level access — prevents self-escalation). `payload/access.ts` has three reusable checks
(`isAdmin`, `isAdminOrEditor`, `isAdminOrSelf`) instead of repeating role-check logic across 13
collection/global configs. Admin: full access. Editor: create/read/update on `homepage`, `posts`,
`media`, `testimonials`, `case-studies` (delete stays admin-only everywhere per the brief — it
never grants editors delete). Everything else stays admin-only to write.
**Real bootstrap problem hit and solved**: once the `role` field's own update-access became
admin-gated, the *existing* first user (created before `role` existed, defaulted to `editor`)
could no longer be promoted through the normal API/UI — nobody had admin rights yet to authorize
the change. Fixed with one direct SQL `UPDATE`, the correct tool for a one-time bootstrap step.
Verified live via actual REST API calls with an editor session: `POST /api/globals/navigation` →
403, `POST /api/globals/homepage` → 200, `DELETE /api/testimonials/:id` → 403, `GET /api/users` →
200 but scoped to only the editor's own record (proving the `Where`-constraint form of `Access`
works, not just the boolean form) — all against a temporary test editor account, deleted after.

**Media hardening.** Added a `caption` field. Focal-point selection turned out to already be
active — Payload auto-enables it once `imageSizes` is defined (documented behavior), which the
Media collection already had from Phase 1 — confirmed by uploading a synthetic test image and
finding the focal-point controls inside the "Edit Image" modal (not inline on the main form,
which is why an earlier check for the phrase "focal point" on the page itself found nothing).

**Health check.** `GET /api/health` pings Postgres via `payload.db.drizzle.execute(sql\`select
1\`)` — the documented public accessor, preferred over the working-but-undocumented
`payload.db.pool`. Placed at `app/(frontend)/api/health/route.ts`, a literal segment living
alongside Payload's `/api/*` catch-all (`app/(payload)/api/[...slug]/route.ts`); confirmed by
actual build + curl that Next.js resolves the more specific static route first and every other
`/api/*` path still reaches Payload untouched.

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
