# Handover

Last updated: 2026-11-24

Fast orientation for the next person or agent. Read order: this file → `ARCHITECTURE.md` (how the system
is built, rendering modes, caching, DB cap) → `CLAUDE.MD` (creative brief, brand, layout and performance
rules). Commands/conventions: `AGENT.md`. Dated history: `Architecture files/CHANGELOG.md` (2026-11-22 and
2026-11-24 entries are the source of truth). Measurements and backlog: `Architecture files/performance-audit.md`.
Phase pointer: `Architecture files/currentphase.md`. The pre-redesign audit and the redesign plans live in
`redesign-handoff/`.

## What this is

RuleScale Media's marketing site: Next.js 16.2.12 + Payload CMS 3.86 + Supabase Postgres + Tailwind
v4, live at https://www.rulescale.in on Vercel (deploys on push to `main`). Local dev and production
share ONE database.

## State at handover

**Everything below was committed and pushed to `main` on 2026-11-24** (one large commit on top of
`c9a1f04`, the Content API). Vercel deploys on push to `main`, so the redesigned site should now be live at
https://www.rulescale.in — **I could not see the deployment from here: confirm it in the Vercel dashboard** (build
log: no `EMAXCONN` / `falling back to constants.ts`) and run the post-deploy checklist at the end of this file.
Production serves cached CMS reads (no expiry), so after the deploy open `/admin` -> Site Settings and Footer and
click Save once so the new contact email / Instagram link appear. Deliberately **not committed** (not part of this
work): `l.html` / `live.html` (old HTML snapshots from 2026-11-11), `sites/` (blog drafts + keyword database),
`claude files/logo2.png` (unused logo variant), `redesign-handoff/RuleScale-current-site-visual-reference.pdf`
(6 MB), and the git-ignored `media/`.

### 1. Frontend redesign (2026-11-22, three iterations, frontend-only)
Prompts in `prompts/redesignui.md`, `redesignv2.md`, `redesignv3.md`; plans in `redesign-handoff/`.
1. One design system (Ink/Paper/Red, Archivo only); removed gradients, grain, doodles, glass header,
   magnetic buttons, odometer stats, rotating testimonials, sticky mobile CTA.
2. Art direction: alternating paper / ink / white / red surfaces, split hero with a red panel, client
   marquee, editorial work section, dark staggered 9:16 video wall, native-`<details>` service menu, red
   "why us" split, giant-numeral stats, outlined-numeral process, one featured testimonial, the logo's
   ring+bolt (`components/doodles/brand-device.tsx`) as the signature graphic.
3. Layout system fix: one container, one section rhythm, one heading class, 12-column grid placement.

### 2. New logo (2026-11-24)
The mark is now the supplied PNG `claude files/logo.png` (ring + bolt on an ink `#201e1d` tile), copied
to `public/logo.png`, rendered by `components/doodles/logo-mark.tsx` as a plain `<img>` (used by header,
footer and the blog cover), and used as favicon (`app/(frontend)/favicon.ico`, `icon.png`; the old
generated `icon.tsx` was deleted) and inside the Open Graph image (`opengraph-image.tsx` reads
`public/logo.png`). `claude files/logo2.png` (red tile) was tried and not used. Because the PNG has a dark
tile baked in, it shows as a dark square on the light header; a transparent version would avoid that.
Not changed on purpose: `lib/schema/index.ts` still points `logo`/`image` at `/icon.svg` (404 — see gaps)
and Payload's admin still shows its default branding.

### 3. Performance pass (2026-11-24)
Full write-up and numbers: `Architecture files/performance-audit.md`. In short:
- `/blog/[slug]`, `/work/[slug]`, `/work/videos/[slug]` are prerendered (`generateStaticParams`,
  `revalidate = 900`, returns `[]` if the DB is down at build): detail pages 10–40 ms instead of 0.65–4 s.
- `/blog` and `/blog?page=N` are prerendered too: `next.config.ts` rewrites `/blog?page=N` to the
  internal `/blog/page/N`; the index body is the shared `components/blog/blog-index.tsx`. URLs and
  pagination links are unchanged.
- `Reveal` is now CSS + IntersectionObserver (no Framer Motion on normal pages, ~100 KB less JS; content
  visible before hydration). Framer Motion only loads on `/form/influencer`.
- GTM `afterInteractive`; removed a below-the-fold `priority` image; image optimiser cache 30 days;
  `/logo.png` cache headers; `poweredByHeader: false`; `optimizePackageImports`;
  `data-scroll-behavior="smooth"` on `<html>`.
- **Build pinned to 1 worker / concurrency 1** (`next.config.ts`) because static generation of ~93 pages
  exhausted the 15-connection DB cap at 2 × 4 and baked broken pages. Do not raise it.

### 4. Animation pass (2026-11-24)
Plan and acceptance checks: `Architecture files/animation-plan.md`; rules: `CLAUDE.MD` (Motion). CSS-first,
transform/opacity only, no new dependency (~2 KB JS). Hero load-in; `data-anim` scroll reveals on work,
services, results, process, testimonials, FAQ, blog cards and video tiles (one `AnimationObserver` in the
root layout); page transition on client navigations (`app/(frontend)/template.tsx`); button press/lift and
nav-underline micro-interactions; smooth `<details>` in Services. Content stays visible without JS and under
reduced motion; above-the-fold content is never hidden. Verified: build clean (0 DB errors, route table
unchanged), 37 reveal targets on the homepage all reveal and settle (Chromium/Firefox/WebKit), reduced
motion and JS-off keep everything visible, no console errors, CLS 0, LCP unchanged, browser matrix clean.
Not verified: real devices, Safari < 18 / Firefox for the `<details>` animation (falls back to instant),
perceived smoothness on low-end phones.

### 5. Hero project wheel (2026-11-24)
The hero's right panel is a rotary "dial" of up to 5 featured projects (`components/hero/project-wheel.tsx`,
`MAX_CARDS` in `sections/hero.tsx`): front card full size; the next ones smaller, darker and curving away in 3D;
scrolling rolls the front card up and out while the next rotates forward; `01 / 05` counter on each card. It is
scroll-linked JS (an rAF loop that runs only while moving, transform/opacity only); headline column is sticky
on desktop. Same `getFeaturedPortfolioItems()` data as before. The hero is ~2.2 screens tall on desktop (5
cards, 38vh of scroll per card) before the client marquee; lower `MAX_CARDS` or `STEP_VH` to shorten it.
Polished after review (soft top/bottom fade, opaque cards dimmed by shade, size capped on short windows; checked
at 1500x722, 1366x768, 1440x900, 390x844). Hero/panel use `overflow-clip` (sticky breaks under `overflow-hidden`).
Mobile: the hero's red panel bleeds to the screen edges (<lg) and cards carry a caption strip; verified at 342, 390 and 768
wide. Reduced motion = plain static list
(CSS). Without JS you see card 1 plus the peek of the next; every project is also in the Work section.
Verified on a production build (Chromium/Firefox/WebKit, 360/768/1024/1440): wheel advances in order and the
last card is reachable, no overflow, no console errors, homepage still static, reduced-motion list works.
Not verified: real devices / scroll feel on touch (the eased rAF loop is untested on low-end phones);
LCP/CLS not re-measured after this change (first card still `priority`).

### Backend/data changes
None to schema, routes (beyond the new `/blog/page/[page]` internal route and the rewrite) or APIs. One
additive data-layer change from the redesign: `videoUrl` in `PortfolioSummaryData` / `normalizeSummary`
(`lib/cms/types.ts`, `lib/cms/portfolio.ts`).

### Verified (local, production build, real CMS data)
- `tsc --noEmit` 0 errors; eslint 0 errors on touched files (24 pre-existing warnings in generated
  migrations); `next build` clean with **0** DB errors in the log (93 pages, ~46 s). Route table: `/`,
  `/contact`, `/form/influencer`, `/work/videos`, `/blog` = ○; blog/work detail + `/blog/page/N` = ●;
  category/tag/author/search/rss/sitemap/API/admin = ƒ.
- Cross-browser matrix 2026-11-24: Chromium, Firefox, WebKit × 360/390/768/1024/1440 × 7 pages (home,
  contact, blog, a post, a case study, videos, influencer): no horizontal overflow, no broken images, no
  console errors, one H1, nothing left hidden by `Reveal`. Visual check at 390 and 1440.
- Earlier (2026-11-22): 7-width × 8-page layout test, SEO diff vs production (metadata, OG/Twitter, JSON-LD
  types, H1 counts, robots, 145-URL sitemap) identical.
- `/blog?page=1|2|3|abc|0|2&x=1` behave correctly; pagination click keeps `/blog?page=2`; canonical `/blog`.
- Local, unthrottled numbers: detail-page TTFB 10–40 ms; JS 723 → ~620 KB per page; CLS 0.

## Owner decisions that were still open when this was pushed (the site is live, so treat as urgent)

1. **Testimonials are fake.** All four quotes (Priya Anand / Marlow & Finch, Devon Marsh / Northbound,
   Elena Cho + Marcus Webb / Ferra) are seeded placeholders, and the design features one at display size.
   Replace or remove them in `/admin` first. The fallback in `lib/constants.ts` also contains fabricated
   clients/testimonials.
2. **Dead footer links.** Instagram (now real, see below), LinkedIn, YouTube and Privacy/Terms pointed to `/#top`; the
   footer hides any link with that placeholder. No privacy/terms pages exist (both 404) while two forms collect personal
   data. Real URLs/pages are needed.
3. **Contact email changed (2026-11-24)** to `rulescalemedia@gmail.com` (was `hello@rulescale.media`), a Gmail address on a
   different domain from `rulescale.in`. It is shown on the homepage, `/contact` and the footer, is the lead-notification
   recipient and the JSON-LD `email`. **Caveat for when Resend is configured:** `lib/email/send-lead-emails.tsx` also uses
   it as the *From* address (`<siteName> <contactEmail>`); Resend cannot send from a Gmail address, so before adding
   `RESEND_API_KEY` give the sender a verified-domain address (code change not made, as it was out of scope).
   **Instagram replaces LinkedIn** (2026-11-24): the final CTA's third contact link is now Instagram
   (`https://www.instagram.com/rulescalemedia?lqvp=MXhocXAweWJ0cDJ2aw==`, exactly as supplied; the `?lqvp=` part is a
   share-tracking parameter and `https://www.instagram.com/rulescalemedia` works the same, cleaner for the schema). It is
   also the footer Instagram icon and the only schema.org `sameAs` entry (LinkedIn removed). Where it lives: code defaults in
   `lib/constants.ts` (`CONTACT_EMAIL`, `INSTAGRAM_URL`), `lib/cms/{settings,footer,homepage}.ts` and the Payload
   `defaultValue`s, **and the CMS values**, which win: Site Settings (`contactEmail`, `sameAs`) and Footer (Instagram row)
   were updated in the shared database on 2026-11-24. **Production serves cached CMS reads** (no expiry; refreshed only by
   tag revalidation), so after deploying open `/admin` -> Site Settings and Footer and click Save once (or redeploy and
   save) so the live site picks the new values up. Not changed: the influencer form's Instagram/LinkedIn fields, the blog
   LinkedIn share button, the CMS `trustLogos` "LinkedIn" name (not rendered), footer LinkedIn/YouTube placeholders.
4. **Bad CMS data**: portfolio slug `landing page` (contains a space; 404 on live and in the sitemap), a
   generic `e-commerce-site` slug, FAQ/contact budget in USD for an India audience, unverified headline
   stats (250+ / 18M+ / 5x / 98%).
5. **Homepage no longer embeds the contact form** — it links to `/contact` plus direct contact details.
   Confirm that conversion path is acceptable.
6. **Logo tile**: confirm a dark square logo on the light header is what you want (see "New logo").

## Unverified / known gaps

1. **No published video items**: the homepage video band is hidden and `/work/videos` shows its empty
   state, so `/work/videos/[slug]` prerendering and the wall are proven only on an earlier fixture.
   Publish one `mediaType: video` item (needs `videoUrl`, ideally a thumbnail) and look at it.
   `media/dosa ghee.mp4` (local, git-ignored) is unpublished; do not ship it without the owner's decision.
2. **No Lighthouse, axe, network-throttled or real-device testing.** All speed numbers are local and
   unthrottled. Contrast was computed, not audited.
3. **Category / tag / author archives are still dynamic** (they read `?page=`). The `/blog` rewrite pattern
   would make them static; search must stay dynamic. First request after a cold start can still take
   seconds there.
4. **Pages baked while the DB is unreachable** degrade silently (placeholder content, missing prev/next,
   even a 404) until the 15-minute revalidate or a CMS save. Always check the build log; the DB cap is
   shared with production traffic, so a Vercel build can hit it too.
5. **No authenticated round trip of the Content API** has been run (only 401/403 checks).
6. No `RESEND_API_KEY` / Turnstile keys: lead emails only log to console.
7. Unmatched URLs still show Next's default 404 (the branded `not-found.tsx` only covers `notFound()`
   inside `app/(frontend)`; a global one needs an experimental config flag).
8. Site-wide JSON-LD still emits `FAQPage`/`Service`/`LocalBusiness` on every page; LocalBusiness has no
   address/phone and points `logo`/`image` at `/icon.svg` (404 — `/logo.png` would be valid now). Left
   alone on purpose (SEO infrastructure); worth a separate pass.
9. GTM now loads `afterInteractive`, so the first tracking event fires slightly later than before; check
   conversion tracking in GTM preview after deploy.
10. Docs drift: `Architecture files/systemstatus.md` (sections 2, 4, parts of 1) and `AGENT.md`'s file tree
    still describe the pre-redesign homepage (mobile-cta, doodles, gradient tokens, tools-stack,
    case-studies section, hand-drawn doodles). Trust `ARCHITECTURE.md`, `CLAUDE.MD` and the code.

## Rules that bite

- Schema change => `npm run payload migrate:create <name>`, review, `npm run payload migrate`,
  `npm run generate:types`. `push: false`; there is no auto-push.
- **Local dev and production share one Supabase database with a 15-connection session pool.** Leftover
  `next dev` / `next start` processes exhaust it (`EMAXCONNSESSION`); a `next build` then silently falls
  back to placeholder content and pages return intermittent 500s. Before building or testing, make sure no
  stray servers are running (PowerShell:
  `Get-CimInstance Win32_Process | ? { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'Landing page' }`),
  and check the build log for `EMAXCONNSESSION`, `falling back to constants.ts`, `Failed to load`.
- **Keep the build single-threaded** (`experimental.cpus: 1`, `staticGenerationMaxConcurrency: 1`).
- **`next start` on a taken port exits silently** and you keep measuring the old server (this invalidated
  one set of numbers on 2026-11-24). Check the port and the start log; kill by port, not by guess.
- Tailwind v4 `translate-*` / `scale-*` use the `translate` / `scale` CSS properties: put those (not
  `transform`) in `transition-[...]` or the motion snaps instead of gliding.
- **Dev is slow on first visit** to each route (Turbopack compiles on demand, e.g. 9 s for a case study).
  Judge speed on `npm run build && npm start`, not `npm run dev`.
- After `npm run build`, delete the whole `.next` before `npm run dev` (and vice versa); stale
  `unstable_cache` in dev can show old data.
- Don't make above-the-fold content start hidden (`Reveal` / `data-anim` must stay visible-by-default;
  only the observer hides off-screen elements after hydration); don't import
  Framer Motion in shared code; don't use `beforeInteractive` scripts; don't read `searchParams` /
  `cookies()` in pages meant to be static.
- Write source files as UTF-8 explicitly. Domain URLs come from `SITE_URL`, never `siteSettings.url`.
  In-page anchors need a leading `/` and keep their ids (`#top`, `#case-studies`, `#services`, `#process`,
  `#faq`, `#final-cta`, `#site-footer`).
- Public queries on drafts-enabled collections must filter `_status: published`.
- Homepage copy ownership: hero + work/video/clients framing live in `lib/home-copy.ts`; the primary nav
  is `lib/nav.ts`; everything else (services, process, stats, FAQ, testimonials, problem, manifesto, final
  CTA) is CMS-driven. CMS `hero` and `trustLogos` fields are no longer rendered.
- Don't `Write` to a file you edited with `sed`/scripts without re-reading it first (the tool rejects
  stale writes). In this environment large heredocs in Bash can fail to parse; use the file tools. Git
  Bash rewrites a leading `/` in arguments (`MSYS_NO_PATHCONV=1`) when you curl or pass URL paths.

## Suggested next steps

1. **Post-deploy checklist (do this first):** confirm the Vercel deployment succeeded; open `/admin` -> Site
   Settings and Footer and Save once (refreshes cached CMS reads); load `/`, `/blog`, a post, a case study,
   `/contact` on phone and desktop; check GTM/conversion events fire; confirm the contact email and Instagram link
   are the new ones. Then work through the open owner decisions above (fake testimonials first).
2. After deploy: check GTM/conversion tracking, run Lighthouse (mobile, throttled) and axe on home, a blog
   post, `/blog` and a case study; compare against `performance-audit.md`.
3. Publish one real video item and check the wall on desktop and a phone.
4. Make the category/tag/author archives static with the `/blog` rewrite pattern (optional).
5. Run the Content API draft-post round trip; write real blog posts with featured images (current posts
   show a branded typographic cover because none has an image).
6. Add Resend/Turnstile keys in Vercel and `.env.local`.
7. Fix the JSON-LD `logo`/`image` URLs and the other SEO gaps in a separate pass.
8. Update `systemstatus.md` / `AGENT.md` to match the redesign, then consider a Playwright suite (the
   layout test from 2026-11-22 and the browser matrix from 2026-11-24 are good starting points).
