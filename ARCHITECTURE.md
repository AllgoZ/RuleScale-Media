# Architecture

Last updated: 2026-11-24. Describes the system **as committed and pushed to `main` on 2026-11-24** (redesign,
new logo, performance pass, animations, hero project wheel, contact/Instagram update; Vercel deploys on push).
Where this disagrees with
`Architecture files/systemstatus.md` or parts of `AGENT.md`, this file and the code win.

Companion docs: `CLAUDE.MD` (creative brief, brand, layout and performance rules), `handover.md`
(state, risks, next steps), `AGENT.md` (commands), `Architecture files/CHANGELOG.md` (history),
`Architecture files/performance-audit.md` (measurements and backlog), `Architecture files/content-api.md`
(HTTP publishing).

---

## 1. System overview

```
Browser ──► Vercel (Next.js 16 App Router, React 19)
              │  static/ISR pages ◄── prerendered at build + regenerated on tag / every 15 min
              │  dynamic routes (archives, search, API, admin)
              ▼
        lib/cms/*  (typed, cached getters — the ONLY code that talks to Payload for page data)
              │  unstable_cache + cache tags
              ▼
        Payload CMS 3 (in-process, same Next app: /admin, /api/[...slug], /api/graphql)
              │
              ├─► PostgreSQL (Supabase)   ← ONE database shared by local dev and production
              ├─► Cloudinary              ← portfolio / blog images, uploads from the admin
              ├─► Resend (optional)       ← lead emails (logged to console if no key)
              └─► Cloudflare Turnstile (optional)  ← form bot check (skipped if no key)
Google Tag Manager (GTM-K28PK4V6) loads afterInteractive on every page.
```

- One repo, one Next.js app. Payload is embedded: `app/(payload)/` is generated (never hand-edit),
  `app/(frontend)/` is the public site, `payload/` holds collections, globals, hooks and admin views.
- Deploys on push to `main` (Vercel). `push: false` on the DB adapter: schema changes need migrations
  (`npm run payload migrate:create <name>`, review, `npm run payload migrate`, `npm run generate:types`).
- Env: `DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`, optional `NEXT_PUBLIC_SITE_URL`,
  `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, Cloudinary keys.
  Domain URLs come from `SITE_URL` in `lib/constants.ts`, never from `siteSettings.url`.

## 2. Routes and rendering mode

Legend: **○** static at build · **●** prerendered via `generateStaticParams` (ISR) · **ƒ** rendered per request.
All ○/● pages that read CMS data refresh via cache tags (section 4); detail pages also have
`revalidate = 900` as a safety net.

| Route | Mode | Notes |
|---|---|---|
| `/` | ○ | Hero, clients marquee, work, videos (only if ≥1 published video), services, why, results, process, testimonials, FAQ, final CTA |
| `/contact` | ○ | The only enquiry form (`components/contact/contact-form.tsx` → `POST /api/contact`) |
| `/form/influencer` | ○ | Multi-step creator application wizard (client; the only user of Framer Motion) |
| `/work/videos` | ○ | Dark 9:16 video wall + native `<dialog>` lightbox |
| `/work/[slug]` | ● | Image case studies (`mediaType: image`). 8 today |
| `/work/videos/[slug]` | ● | Video items (`mediaType: video`). 0 today |
| `/blog` | ○ | Page 1 of the index. No `searchParams` — that is why it can be static |
| `/blog/page/[page]` | ● | Pages 2..N of the index (internal target, see below) |
| `/blog/[slug]` | ● | Articles with sticky TOC; 62 today |
| `/blog/category/[slug]`, `/blog/tag/[slug]`, `/blog/author/[slug]` | ƒ | Read `?page=`; still per-request (backlog) |
| `/blog/search` | ƒ | Must stay dynamic (query string) |
| `/blog/rss.xml`, `/sitemap.xml` | ƒ (`force-dynamic`) | Deliberately not built at build time |
| `/robots.txt`, `/icon-*.png`, `/opengraph-image-*` | ○ | Metadata routes |
| `/api/contact`, `/api/influencer`, `/api/influencer/upload`, `/api/portfolio/upload`, `/api/leads/export`, `/api/health`, `/api/content/{posts,portfolio}` | ƒ | See section 6 |
| `/admin/**`, `/api/[...slug]`, `/api/graphql*` | ƒ | Payload |
| `/next/preview`, `/next/exit-preview` | ƒ | Draft-mode toggles (need `PREVIEW_SECRET` + a logged-in admin) |

### `/blog?page=N` stays static (rewrite)
`next.config.ts` rewrites `/blog?page=N` (N ≥ 2) to the internal route `/blog/page/N` with a
`beforeFiles` rewrite and a named-group `has` query match. Visitors still see `/blog?page=N`;
`components/blog/pagination.tsx` is unchanged; metadata/canonical stay `/blog`. Both routes render
the shared `components/blog/blog-index.tsx`. `?page=abc|0|1` serve page 1; a page beyond the last
renders an empty list on demand (as before). Apply the same pattern to category/tag/author archives
to make them static; search cannot.

## 3. Page composition

- `app/(frontend)/layout.tsx`: Archivo (one variable font via `next/font`), GTM, site-wide JSON-LD
  (Organization, LocalBusiness, Service, FAQ, Breadcrumb), skip link, `Header`, `Footer`,
  `WhatsAppButton`. `<html data-scroll-behavior="smooth">`.
- Hero (`sections/hero.tsx`): sticky headline column + `components/hero/project-wheel.tsx`, a rotary dial of up
  to 5 featured projects. A tall track holds a sticky stage; page scroll through the track maps to a wheel
  position (eased in an rAF loop that only runs while moving). Each card's transform/opacity/shade come from
  `wheelStyle(d)` (d = signed distance from the front card; positions are fractions of `--wheel-h`, so the
  server renders the resting state identically). `STEP_VH` (scroll per card), `STEP_DEG`, `REST_LIFT`
  and `MAX_CARDS` tune it. The stage has a CSS mask that dissolves its top and bottom (no hard crops), cards are
  opaque and dimmed with an ink `--shade` overlay (never transparent while overlapping), and card width is capped
  at `--wheel-h * 0.82` so short windows are not crowded. On phones/tablets (<lg) the red panel bleeds to the screen edges and each
  card has a caption strip under the image (the overlay chip is desktop-only); the stage always fills the pinned viewport height
  so there is no empty red below it. Reduced motion falls back to a static list via `.wheel-*` rules in `globals.css`.
- `app/(frontend)/page.tsx` composes `sections/*` in order: hero → trust-logos (marquee) →
  featured-work → videos → services → why → results → process → testimonials → faq → final-cta.
  Copy ownership: hero/work/videos/clients framing in `lib/home-copy.ts`; everything else from the
  Payload `homepage` global (with `lib/constants.ts` as fallback). Primary nav is `lib/nav.ts`; the full
  CMS link set renders in the footer.
- Client components are deliberately few: `header` (menu, focus trap), `ui/reveal`, `ui/animation-observer`, `template.tsx`, `ui/accordion`
  (Radix), `ui/button` (Slot), `video/video-showcase`, `blog/share-buttons`, `contact/contact-form`,
  the influencer form, `error.tsx`. Everything else is a server component.

## 4. Data layer and caching

```
page / generateMetadata ──► lib/cms/<thing>.ts getter
                               React.cache() (per-request dedupe)
                               draftMode()? ── yes ─► Payload directly, draft: true (preview)
                                              └ no ─► unstable_cache(fetch…, [tag], { tags: [tag] })
                                                         └─► getPayloadClient().find / findGlobal
                               on error: log + return fallback (constants.ts / null / empty page)
```

- Tags are defined in `lib/cache/tags.ts`: `homepage`, `navigation`, `footer`, `siteSettings`,
  `seoSettings`, `posts`, `post-<slug>`, `taxonomy`, `portfolio`, `portfolio-<slug>`.
- Payload collection/global hooks call `revalidateTagSafely(tag)` (`payload/hooks/revalidate.ts`,
  `revalidateTag(tag, "max")`) on save/delete. That invalidates the data cache **and** regenerates the
  static pages that used it, so editors see changes within seconds.
- **Failure behaviour matters:** getters catch errors and return fallbacks, so a database failure during
  a build does not fail it — it *bakes degraded pages* (placeholder homepage content, a 404 for a post,
  missing prev/next). Hence the 15-minute `revalidate` on detail/index pages and the rule to read the
  build log. Failed fetches are never stored in the data cache.
- Public queries on drafts-enabled collections must filter `_status: published`.
- `getPayloadClient()` memoises one Payload instance per process.

### Database connection cap (critical)
Supabase session pooler: **15 clients, shared by local dev, builds and production**. Mitigations in
the code: `next.config.ts` sets `experimental.cpus: 1` and `staticGenerationMaxConcurrency: 1` so
generating ~93 pages uses few connections (a 2 × 4 setup exhausted the pool and baked broken pages).
Do not raise these. Do not leave `next dev`/`next start` running during a build; check the build log
for `EMAXCONNSESSION`, `falling back to constants.ts`, `Failed to load`.

## 5. CMS model (Payload)

Collections: `users` (roles, API keys), `posts` (drafts, Lexical body), `categories`, `tags`, `authors`,
`portfolio` (image/video case items; Cloudinary URLs, `videoUrl`, `sortOrder`, featured flag),
`case-studies`, `testimonials`, `clients`, `projects`, `contracts`, `meetings`, `files`, `media`,
`leads` (contact enquiries + attribution), `influencer-applications`.
Globals: `homepage` (services, process, stats, FAQ, testimonials, problem, manifesto, final CTA),
`navigation`, `footer`, `siteSettings`, `seoSettings`. Admin extras: business dashboard, leads CSV
export, Cloudinary upload field. CMS `hero` and `trustLogos` fields exist but are no longer rendered.

## 6. API surface

| Endpoint | Purpose / guards |
|---|---|
| `POST /api/contact` | Validate → rate-limit (email + IP) → Turnstile (if keyed) → create `lead` → Resend emails (or console log) |
| `POST /api/influencer`, `/api/influencer/upload` | Creator application + file upload; validation, duplicate check, rate limit |
| `POST /api/portfolio/upload` | Cloudinary upload for the admin |
| `GET /api/leads/export` | CSV, authenticated |
| `GET /api/health` | `select 1` against Postgres |
| `POST /api/content/posts`, `/api/content/portfolio` | Agent publishing with `Authorization: users API-Key …` (editor role); upserts by slug; Markdown → Lexical. Full contract in `Architecture files/content-api.md` |
| `/api/[...slug]`, `/api/graphql` | Payload REST/GraphQL |

## 7. Design system and layout (summary; the rules live in `CLAUDE.MD`)

- Tokens in `app/(frontend)/globals.css` (Tailwind v4 CSS-first `@theme`): Ink `#201e1d`, Paper
  `#f3f2f2`, Accent `#ec3013`, Accent-deep `#d1260b` (button fills / small red text only), Ink-soft
  `#625e5b`, white / paper-2 / surface, hairline. Archivo only. No other accent colour, no gradients.
- Surfaces alternate (paper / ink / white / red); signature devices: ring + bolt (`BrandDevice`), red
  surface, real project mockups, big type only where it earns it.
- One `Container` (1280px; 20/32/48px padding), one `.section` rhythm, one heading class per level,
  12-column grid placement instead of margins/absolute positioning.
- **Logo:** `public/logo.png` (the `claude files/logo.png` ring + bolt on an ink tile) via
  `components/doodles/logo-mark.tsx` (`<img>`); same file as favicon (`favicon.ico`, `icon.png`) and
  embedded in `opengraph-image.tsx`.
- **Motion** (plan: `Architecture files/animation-plan.md`; rules: `CLAUDE.MD`): CSS-first, transform/opacity
  only. Hero load-in (`.hero-in` / `.hero-slide`); scroll reveals via `data-anim` attributes driven by one
  `components/ui/animation-observer.tsx` (mounted in the root layout; hides only off-screen elements after
  hydration, then hands styling back via `data-anim-state="done"`); `Reveal` for section headers; a page
  transition in `app/(frontend)/template.tsx` (client navigations only); button/nav micro-interactions;
  smooth `<details>`. Everything is visible without JS and under reduced motion. Framer Motion only in the
  influencer form.
- Accessibility baseline: skip link, global `:focus-visible`, focus-trapped mobile menu, native
  `<dialog>` / `<details>`, AA contrast pairs, ≥44px primary targets.

## 8. SEO

Metadata via `generateMetadata()` (`lib/seo/metadata.ts`, CMS-driven), canonical from `SITE_URL`,
Open Graph/Twitter, `robots.ts`, `sitemap.ts` (145 URLs; never change slugs without 301s), one H1 per
page, JSON-LD built from the same CMS data (Organization, LocalBusiness, Service, FAQ, Breadcrumb,
Article, CreativeWork, VideoObject). Known gaps (handover): site-wide FAQ/Service/LocalBusiness on
every page; LocalBusiness lacks address/phone and `logo`/`image` point at `/icon.svg` (404).

## 9. Performance model

Why the site is fast, and what must not regress (details and numbers: `performance-audit.md`):

1. Pages are served as static HTML (○/●); detail pages respond in ~10–40 ms instead of paying Payload
   start-up (0.65–4 s) on the first request.
2. Client JS ≈ 600 KB raw per page, mostly React + the Next runtime; no animation library outside the
   influencer form.
3. Content is visible in the server HTML (`Reveal` and `data-anim` never hide above-the-fold content; the
   hero image/headline animate with transform only), one LCP image is `priority` (the hero tile), CLS is 0.
   The animation pass added ~2 KB of JS and did not change LCP (244-252 ms mobile, local).
4. Images: Cloudinary through `next/image` with a 30-day optimiser cache; `/logo.png` cached 7 days.
5. GTM `afterInteractive`; no render-blocking third parties.
6. `next.config.ts` also sets `poweredByHeader: false` and `optimizePackageImports` for lucide and Radix.

Regression checks: the build's route table must still show `○`/`●` for the pages in section 2;
TTFB of a detail page on a production start should be tens of ms; no `ƒ` appearing on `/blog`.

## 10. Verification and operations

- Before calling work done: `npx tsc --noEmit`, `npm run lint`, `npm run build` (clean, no DB errors in
  the log), then look at 390 / 768 / 1440 in a browser. Playwright (Python) with Chromium, Firefox and
  WebKit is installed; the cross-browser matrix used on 2026-11-24 covered 3 engines × 5 viewports ×
  7 pages with no overflow, broken images or console errors.
- Stop stray `next dev` / `next start` processes before building or measuring (PowerShell:
  `Get-CimInstance Win32_Process | ? { $_.Name -eq 'node.exe' -and $_.CommandLine -match 'Landing page' }`).
  `next start` exits silently into the old process if the port is taken — verify the port before
  trusting measurements.
- After `npm run build`, delete `.next` before `npm run dev` (and vice versa).
- `next dev` compiles each route on first visit (seconds); measure speed on a production build.
- Write source files as UTF-8; large Bash heredocs can fail to parse here — use the file tools.
