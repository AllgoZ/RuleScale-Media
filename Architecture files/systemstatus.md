# RuleScale Media — Landing Page: System Status

Last updated: 2026-08-03
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
| Media hosting | Cloudinary (`cloudinary` official SDK) — Portfolio collection only, not Payload's own upload storage |

Next.js is pinned to 16.2.12 specifically because every published Payload version's `next` peer
range excludes 15.5.x entirely (only 15.2.9/15.3.9/15.4.11 or 16.2.6+ are supported) — see
`CHANGELOG.md` 2026-07-27 for the full reasoning and the upgrade-verification process used.

Folder layout:
```
app/
  (frontend)/  the marketing site itself — layout.tsx, page.tsx, globals.css (route group)
    blog/      the blog (Phase 2) — index, [slug], category/[slug], tag/[slug], author/[slug],
               search, rss.xml
    contact/   the contact page (Phase 3) — the site's only lead-capture form
    work/      Portfolio detail pages — [slug] (image case study), videos/ (gallery),
               videos/[slug] (video detail) — all CMS-driven, no hardcoded project data
    api/contact/    the one backend endpoint the contact form posts to (Phase 3)
    api/leads/export/   admin-only CSV export of the leads collection (Phase 3)
    api/portfolio/upload/   admin/editor-only Cloudinary upload endpoint for the Portfolio
               collection's thumbnail field — streams straight to Cloudinary, never touches disk
  (payload)/   Payload-generated admin + REST/GraphQL API routes (never hand-edited)
  robots.ts, sitemap.ts, icon.tsx, opengraph-image.tsx   top-level, outside both route groups
                 (sitemap.ts now also includes posts/categories/tags/authors, Phase 2, plus
                 Portfolio items and /work/videos, 2026-08-03)
payload.config.ts   Payload config root (collections, globals, db adapter, admin.components)
payload/
  collections/  users (role: admin/editor), media, categories, authors, posts, tags,
                 testimonials, case-studies (superseded — see "Portfolio" in §1d below),
                 portfolio, leads, influencer-applications (§1f), clients, projects, contracts,
                 files, meetings (clients/projects/contracts/files/meetings are Phase 3
                 placeholders, admin.hidden: true)
  globals/       homepage (drafts + preview), navigation, footer, site-settings, seo-settings
  access.ts      shared RBAC helpers (isAdmin, isAdminOrEditor, isAdminOrSelf)
  hooks/         revalidateTagSafely() (cache invalidation) and dispatchLeadEvent() (Phase 3 —
                 the single seam Leads afterChange events flow through, currently email only)
  admin-views/   custom Payload admin components — business-dashboard.tsx, leads-export-button.tsx,
                 dashboard-nav-link.tsx (Phase 3), cloudinary-upload-field.tsx (Portfolio, a
                 custom Field component wired via admin.components.Field, not a view)
  seed.ts        one-time seed for testimonials/case-studies (npm run seed) — predates Portfolio,
                 which was seeded via one-off `payload run` scripts instead (see CHANGELOG 2026-08-03)
lib/
  cms/          getHomepage() / getNavigation() / getFooter() / getSiteSettings() /
                 getSEOSettings() / getCategories() / getTags() / getAuthors() / getPublishedPosts()
                 / getPostBySlug() / getFeaturedPost() / getRelatedPosts() / getAdjacentPosts() /
                 getFeaturedPortfolioItems() / getVideoPortfolioItems() / getPortfolioItemBySlug()
                 / getRelatedPortfolioItems() / getAllPortfolioItems() — the only code that talks
                 to Payload. Each is cache(unstable_cache(...)) with tag-based invalidation; the
                 homepage-era getters fall back to lib/constants.ts (uncached) on error, the blog
                 and portfolio getters return empty results on error (no pre-CMS content to fall
                 back to). getHomepage()/getPostBySlug()/getPortfolioItemBySlug() branch on
                 Next draft mode before the cached path
  cache/tags.ts  CACHE_TAGS — shared between lib/cms and the payload/*/hooks
  blog/          reading-time.ts, toc.ts (heading extraction + id assignment for the article TOC)
  leads/         validate.ts, rate-limit.ts, attribution.ts, turnstile.ts (Phase 3 — the
                 /api/contact security/validation layer, none of it Payload-specific)
  email/         resend-client.ts, send-lead-emails.tsx, templates/ (Phase 3, React Email)
  env.ts         optional-integration-key accessors (RESEND_API_KEY, TURNSTILE_*,
                 getCloudinaryConfig()) — warn once and degrade gracefully rather than throw when
                 unset
  cloudinary.ts  uploadImage() / deleteImage() / transformImage() — server-only, wraps the
                 official SDK; transformImage() splices a transformation string into an
                 already-uploaded delivery URL rather than calling the SDK, so it needs no live
                 config at read time
  video.ts       parseVideoUrl() — detects YouTube/Vimeo/direct-Cloudinary-MP4 from a plain URL
                 string, used by the video portfolio pages to pick <iframe> vs <video>
  seo/metadata.ts  buildSiteMetadata(), called from layout.tsx's generateMetadata()
  constants.ts  fallback source of truth (no longer the primary content source, still live) —
                 also the single source of truth for SITE_URL, which every SEO-critical surface
                 (sitemap, RSS, metadataBase, canonical/OG, JSON-LD) reads directly, not the
                 CMS-editable siteSettings.url (see §7 and CHANGELOG 2026-08-03)
  schema/index.ts  JSON-LD builders — pure functions taking CMS data as params (Organization,
                 LocalBusiness, Service, FAQPage, BreadcrumbList, Article, CreativeWork, VideoObject)
  utils.ts      cn() class-merge helper
sections/     one file per page section (Header, Hero, Problem, ... Footer), each consuming
              CMS content via a `data` (or `navigation`/`footer`) prop, not a direct import.
              featured-work.tsx (2026-08-03) replaced case-studies.tsx in the homepage's section
              list — same `id="case-studies"` anchor, different data source (Portfolio, not the
              old case-studies collection). case-studies.tsx itself still exists, just unused.
components/
  ui/         generic primitives (Button, Container, Reveal, Accordion, Spotlight, RollingNumber, Marquee)
  doodles/    hand-drawn brand accents (LogoMark, HandArrow, PaperClip, ScribbleUnderline)
  blog/       PostCard, FeaturedPost, CategoryPill, AuthorByline, TableOfContents, RelatedPosts,
              PostNavigation, ShareButtons, NewsletterCta, SearchBox, Pagination, ArticleContent,
              PostGrid
  contact/    ContactForm (Phase 3) — the site's only lead-capture form, "use client"
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

## 1c. Blog / publishing platform (Phase 2)

Added 2026-07-29 per `prompts/backend/phase2.md` — full reasoning (the `_status`-filter bug, the
dev-mode-only Turbopack caching artifact, the nav-link discovery) is in `CHANGELOG.md`.

- **Routes** (`app/(frontend)/blog/`): `/blog` (index, featured post + grid + category pills +
  search box + pagination), `/blog/[slug]` (article — hero, byline, TOC, rich-text body, related
  posts, prev/next, share buttons, `Article` + `BreadcrumbList` JSON-LD), `/blog/category/[slug]`,
  `/blog/tag/[slug]`, `/blog/author/[slug]` (archive listings), `/blog/search` (plain GET form,
  reads `?q=`), `/blog/rss.xml` (hand-built RSS 2.0, `revalidate: 3600`). `sitemap.ts` extended
  with posts/categories/tags/authors alongside the existing homepage entry.
- **Data model**: new `tags` collection (`title`/`slug`, mirrors `categories`). `authors` gained a
  `slug` field (was missing, needed for the author archive route). `posts` gained `tags`
  (relationship, hasMany), `featured` (checkbox), a `seo` group (meta title/description,
  canonical URL, OG/Twitter images), and `admin.preview` → `/blog/${slug}`. Reading time and the
  table-of-contents are computed at read time from the Lexical JSON, not stored.
- **Cache tags**: `posts` (any list-shaped read), `post-<slug>` (single article, precise
  invalidation), `taxonomy` (categories+tags+authors, shared). Posts/Categories/Authors/Tags each
  have `afterChange`/`afterDelete` hooks calling `revalidateTagSafely()`.
- **Published-only filtering**: every public-facing query in `lib/cms/posts.ts` explicitly filters
  `{ _status: { equals: "published" } }` — Payload's `draft` find option does **not** do this by
  itself (see `CHANGELOG.md` for the bug this caught). `getPostBySlug()` branches on `draftMode()`
  before the cache layer, same pattern as `getHomepage()` — draft reads always hit Payload live.
- **Draft preview**: reuses the existing `/next/preview` / `/next/exit-preview` routes unchanged.
  Verified live: authenticated admin + correct `PREVIEW_SECRET` → sees the draft; no session or
  wrong secret → `403`; the draft is absent from the index, pagination, related posts, RSS, and
  sitemap the whole time.
- **Rich text**: `@payloadcms/richtext-lexical/react`'s default JSX converters, with only the
  `heading` converter overridden (to inject TOC-matching anchor ids). Styled via a `.article-body`
  descendant-selector block in `globals.css`, not per-node Tailwind classes.
- **No fake seed content**: every blog listing surface has a real empty-state message. Verified
  end-to-end against ~10 real-shaped temporary test posts (plus categories/tags/an author)
  created through Payload's Local API, then deleted once confirmed working.
- **Verification caveat**: no browser-automation tool was available this session — functional
  checks were HTTP-request-based (`curl`) against a real `npm run build && npm run start` server,
  not the usual Playwright screenshot pass. Visual/responsive (390px/1440px) verification of the
  new blog pages is still outstanding.

---

## 1d. Agency operations platform (Phase 3)

Added 2026-07-29 per `prompts/backend/phase3.md` — full reasoning (the REST-create security gap,
the DB-backed rate-limit decision, why `versions: true` instead of a bespoke audit log) is in
`CHANGELOG.md`.

- **Lead capture**: `/contact` (`app/(frontend)/contact/page.tsx` +
  `components/contact/contact-form.tsx`) is the site's only contact form, posting to the single
  backend endpoint `app/(frontend)/api/contact/route.ts`. That route validates
  (`lib/leads/validate.ts`), checks a honeypot field, rate-limits by email/IP against recent
  `leads` rows (`lib/leads/rate-limit.ts`, DB-backed — no Redis/Upstash provisioned), optionally
  verifies Cloudflare Turnstile if configured (`lib/leads/turnstile.ts`), builds last-touch
  attribution (`lib/leads/attribution.ts`), and creates the lead via the Local API.
- **`leads` collection** (`payload/collections/leads.ts`) expanded from 6 fields to a real CRM
  record: company/website/budget/servicesInterested (sourced from `lib/constants.ts` `SERVICES`)/
  priority/assignedUser (relationship → `users`)/internalNotes/an `attribution` group, plus
  `status` now includes `won`/`lost`. `versions: true` gives a full revision/audit history for
  free. `access.create: () => false` — the public REST/GraphQL create endpoint is closed; only
  `/api/contact`'s Local API call (which bypasses access control by design) can create leads.
  `read`/`update`: `isAdminOrEditor`; `delete`: `isAdmin`.
- **Email**: Resend + React Email (`lib/email/`), triggered from `Leads.afterChange` via
  `payload/hooks/lead-events.ts`'s `dispatchLeadEvent()` — the single seam any future automation
  (Slack/Notion/WhatsApp) will hook into. Sends a visitor confirmation and an admin notification
  (to the CMS's existing `siteSettings.contactEmail`, no new env var). Without a real
  `RESEND_API_KEY`, both emails render and log to the console instead of sending — no crash.
- **Admin business dashboard**: a custom Payload admin view at `/admin/business-dashboard`
  (`payload/admin-views/business-dashboard.tsx`, linked from the sidebar via
  `admin.components.afterNavLinks`) — total/new/won/lost leads, monthly counts, conversion rate,
  most-requested services, lead sources. Server-computed via the Local API, plain HTML/inline
  styles (Payload's admin bundle doesn't run this repo's Tailwind build).
- **CSV export**: `app/(frontend)/api/leads/export/route.ts`, admin-session-gated (same
  `payload.auth()` pattern as `/next/preview`), linked from a `beforeList` button on the Leads
  list view (`payload/admin-views/leads-export-button.tsx`).
- **RBAC**: `users.read` widened `isAdminOrSelf` → `isAdminOrEditor` so the Leads "Assigned User"
  field's dropdown can list every staff member; `users` create/update/delete unchanged.
- **Future collections**: `clients`/`projects`/`contracts`/`files`/`meetings` — registered,
  minimal schema, `admin.hidden: true`, placeholders for a later client-portal phase.
- **Contact CTAs**: the Homepage global's FinalCTA and the footer's email link now point to
  `/contact` instead of `mailto:` — the only two existing-surface changes in this phase.
- **Verification caveat**: same as the blog phase — no browser-automation tool was available,
  so this was verified via HTTP requests against a running server, not Playwright screenshots.

---

## 1e. Portfolio system (Cloudinary-hosted case studies)

Added 2026-08-03 per `prompts/v2/casestudy.md` (architecture) and
`prompts/projects_images/casestudy.md` (real content) — went through formal plan mode first given
the scope; full reasoning and the bugs found along the way are in `CHANGELOG.md`.

- **`portfolio` collection** (`payload/collections/portfolio.ts`) — a new collection, not an
  extension of the pre-existing `case-studies` collection (client confirmed keeping the old one
  untouched rather than migrating it). Fields: title, client, slug, `featured` boolean, `mediaType`
  (image/video), category, description, resultHeadline, services (array), thumbnail
  (url/publicId/width/height/format — the width/height/format/publicId fields are `admin.hidden`,
  populated programmatically, never hand-edited), videoUrl, `caseStudyContent` (richText),
  liveWebsite, sortOrder, publishedAt, an SEO group, `versions.drafts: true`.
- **Cloudinary, not Payload storage**: `lib/cloudinary.ts` wraps the official SDK
  (`uploadImage`/`deleteImage`/`transformImage`), gated by `lib/env.ts`'s `getCloudinaryConfig()`
  — same graceful-degradation pattern as Resend/Turnstile (warns once, returns `null`, never
  throws). A custom Payload admin Field component
  (`payload/admin-views/cloudinary-upload-field.tsx`) replaces the default `thumbnailUrl` text
  input with a file picker + "Upload to Cloudinary" button, wired through an authenticated route
  (`app/(frontend)/api/portfolio/upload/route.ts`, admin/editor only) that streams straight to
  Cloudinary and returns only metadata. `thumbnailUrl` stays directly editable underneath the
  button, so an editor can paste a URL manually if Cloudinary isn't configured.
- **Homepage**: `sections/featured-work.tsx` (new) reads `getFeaturedPortfolioItems()` —
  `featured: true`, `mediaType: "image"` only (videos never show on the homepage), published,
  sorted by `sortOrder` — and replaced `sections/case-studies.tsx` in `app/(frontend)/page.tsx`'s
  render list. Kept the same `id="case-studies"` section anchor so the nav "Work" link / hero CTA
  needed no further changes. Each card links to `/work/[slug]` (the "View Case Study" affordance);
  if `liveWebsite` is set, a small separate icon in the card's corner links out to the live site —
  originally the *whole card* linked externally when `liveWebsite` was set, which silently removed
  any way to reach the internal case study page; fixed same day once reported live.
- **Routes**: `/work/[slug]` (image case study — hero, description, resultHeadline, services,
  `caseStudyContent` rendered via `RichText` from `@payloadcms/richtext-lexical/react`, related
  work, `CreativeWork` + breadcrumb JSON-LD), `/work/videos` (grid of published video items),
  `/work/videos/[slug]` (embedded player — `lib/video.ts`'s `parseVideoUrl()` picks `<iframe>` for
  YouTube/Vimeo or `<video>` for a direct Cloudinary MP4 — plus `VideoObject` + breadcrumb JSON-LD).
  All added to `sitemap.ts`. Every generated URL uses `SITE_URL` directly, not `siteSettings.url`
  (see §7) — applied proactively here after the domain-migration incident on the same day.
- **Real content**: Mylini and Kodai Golden Honey (E-commerce Website) and LightPic (AI SaaS
  Platform) are published and featured, each with a full case-study write-up (Overview/Challenge/
  Solution/SEO Highlights/Outcome) and a real `liveWebsite` URL. A fourth, Fairyland Resort, is
  uploaded to Cloudinary and stored but kept `_status: "draft"` — invisible to every public query
  and even direct URL access, without being deleted. The old `case-studies` collection's 3
  placeholder entries (Marlow & Finch, Northbound Outfitters, Ferra Skincare) are still in the
  database, untouched, just no longer rendered anywhere.
- **Verification caveat**: same as every other phase — no browser-automation tool available, so
  the admin upload button's actual click-through UX is verified against Payload's real hook
  signatures and API response shapes, not a live browser interaction. No video portfolio item has
  been published yet, so `/work/videos` has only ever been exercised against its empty state.

---

## 1f. Influencer application system (`/form/influencer`)

Added 2026-08-05 per `prompts/forms/influencer.md`, which specified a raw Supabase table +
Supabase Storage bucket as if no CMS existed. Confirmed with the user first, then built as a
Payload collection instead — same Supabase Postgres, gets admin list/filter/search/versioning for
free instead of needing a bespoke admin UI. Full reasoning in `CHANGELOG.md` 2026-08-05.

- **`influencer-applications` collection** (`payload/collections/influencer-applications.ts`,
  `dbName: "influencer_apps"` — the full slug plus `versions: true`'s generated enum type names
  exceeded Postgres's 63-character identifier limit) — ~50 fields across the spec's 8 form
  sections plus admin-only CRM fields (status, tier, verification, assigned manager, payment
  status, last-contact/next-followup) and an attribution group, same shape as `leads`. Public REST
  create is closed (`access.create: () => false`); only `/api/influencer`'s route handler writes,
  via the Local API.
- **`/api/influencer`** — honeypot, `lib/influencer/validate.ts` (required-field set matches the
  spec's explicit "Required fields" list, not every field marked `*` in the broader form-section
  outline), DB-backed rate limiting (`lib/influencer/rate-limit.ts`), and a 24h duplicate-
  application check by email or Instagram (`lib/influencer/duplicate-check.ts`).
- **`/api/influencer/upload`** — public/unauthenticated (runs before an applicant has submitted
  anything to authenticate against), bounded by strict PDF-only/10MB validation. Media Kit/Rate
  Card PDFs go to Cloudinary's `raw` resource type, not Supabase Storage — `lib/cloudinary.ts`'s
  `uploadImage`/`deleteImage` were extended to accept it.
- **Client** (`components/forms/influencer/`): an 8-step wizard — progress bar, localStorage
  autosave/restore, per-step validation, XHR upload progress, animated success screen — built from
  existing design-system primitives only (Button, Container, Reveal, brand tokens), no new visual
  language. Page background: `bg-dot-grid-light` (same class the homepage `<main>` uses).
- **Navigation/footer**: "Influencers" added to `navigation.links` (after "Services"),
  "Influencer Program" added to `footer.serviceLinks` (after the existing service items) — both in
  the Payload global `defaultValue`s and, via a one-off script, in the already-seeded live global
  documents (a `defaultValue` change alone doesn't touch a singleton global already in the DB).
- **Verification caveat**: same as every other phase — no browser-automation tool available, so
  the wizard's click-through UX is verified via curl/HTTP checks against a real production build
  (`next build && next start`), not a live browser interaction. One real end-to-end test
  submission was made and immediately deleted after confirming duplicate-detection worked.

---

## 2. Brand system

> **2026-07-29/30 update**: the sections below describe the *original* ink/red/paper editorial
> system as documented at launch. As of 2026-07-30, the **homepage only** was redesigned (UI/UX
> only, zero backend/CMS-schema change) to a card/pill/icon-bubble visual system inspired by a
> reference competitor site, at the user's explicit request, then iterated twice more on
> follow-up feedback. New tokens — `--color-accent-from: #ec3013` (the *original* brand red),
> `--color-accent-via: #a855f7`, `--color-accent-to: #3b82f6`, `--color-accent-solid: #8b5cf6`,
> `--color-home-bg: #f7f8fc` — and utility classes (`.gradient-text`, `.gradient-bg`,
> `.pill-badge`, `.accent-red-bg`/`.accent-red-text`, `.bg-dot-grid-light`) were added to
> `globals.css` in a **separate namespace from `--color-accent`**, specifically so the blog
> (Phase 2) and `/contact` (Phase 3) pages — which already reference `text-accent`/`bg-accent` —
> stay pixel-identical to what's described below. The final color system is a literal 3-stop
> gradient — red → purple → blue — not a blue/purple-only palette that discarded red: the user's
> round-1 feedback ("change the color to our original theme but keep these color too, mix it")
> was resolved by making the brand red a genuine, visible stop in every gradient element, plus
> using the pure red directly (`.accent-red-bg`/`.accent-red-text`) for secondary pill/tag accents
> and one of the two Hero floating stat-card icons. Every homepage section was restyled in place
> (hand-drawn doodle motifs — `ScribbleUnderline`/`HandArrow`/`PaperClip`/`HeroCollage` — dropped
> from the homepage only, left unused in the tree) while reading the exact same `HomepageData`
> shape from the exact same `getHomepage()` — no Payload field was added, removed, or renamed.
> Section order on the homepage was also reprioritized to match the reference (proof/stats moved
> up, services before trust logos, a new hardcoded "Tools & Platforms" section and a floating
> WhatsApp button added — `https://wa.me/919500381132` — and the final CTA section now embeds the
> real `ContactForm` from Phase 3 directly on the homepage instead of only linking out to
> `/contact`). Two follow-up refinement rounds fixed real bugs, both found from user screenshots
> and confirmed via direct HTML/CSS inspection before the fix: (1) `.pill-badge` declared `display:
> inline-flex` as plain/unlayered CSS, which under Tailwind v4's cascade layers always beats
> layered utilities like `hidden`/`md:inline-flex` regardless of source order — the Meta Ads hero
> badge never actually hid on mobile; fixed by removing `display` from the CSS class and applying
> `inline-flex` as an explicit Tailwind utility at every call site instead. (2) The Hero's
> word-by-word headline animation (`AnimatedWords` in `sections/hero.tsx`) put the separating
> space *inside* each word's `inline-block` span, and browsers silently trim trailing whitespace
> at an inline-block box's edge — collapsing "We grow brands" into "Wegrowbrands" in production;
> fixed by moving the space to a sibling text node outside the span (a keyed `Fragment` per word).
> The Hero's four decorative floating elements (Google icon, Meta Ads pill, two stat cards) also
> got a continuous slow vertical-bob idle animation (`Float` component: independent inner
> `motion.div` with `animate={{y: [0, -distance, 0]}}`, `repeat: Infinity`, staggered
> delay/duration per element) layered on top of their one-time spring entrance, per user request.
> Verified live throughout: build/lint clean, a real submission through the new embedded homepage
> form still creates a lead via the unmodified `/api/contact`, and the direct-REST lockdown
> (`POST /api/leads` → `403`) still holds — proving the backend is untouched. No browser-
> automation tool was available this session, so — same caveat as Phases 2–3 — this was verified
> structurally (`curl`, HTML diffing) and from user-provided screenshots, not with a real
> Playwright pass; a full mobile/desktop visual QA is still outstanding for this redesign. Full
> dated diagnostic writeups for both bugs and every iteration round are in `CHANGELOG.md`
> (2026-07-30 entry).

The visual system is the real RuleScale Media brand mark (ring + lightning-bolt "S", from the
brand PDF), **not** a generic palette — deliberately restrained to three colors plus one
typeface, per the brand guide's "one accent" principle. **This section describes the blog and
`/contact` pages' current system, and the homepage's system prior to the 2026-07-30 redesign
noted above** — it has not been rewritten wholesale to avoid losing the historical record; treat
the callout above as authoritative for the homepage's current state.

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
Logo + wordmark left, nav links (`Work / Services / Process / FAQ / Blog`, the last one added in
Phase 2) center, "Start Growing" accent button right. Mobile: hamburger → animated dropdown panel
with the same nav links + CTA.

### Mobile sticky CTA (`components/mobile-cta.tsx`)
`md:hidden` fixed bottom bar, full-width accent "Start Growing" button, `env(safe-area-inset-bottom)`
padding. Visibility is driven by three `IntersectionObserver`s (hero, `#final-cta`, `#site-footer`):
visible once scrolled past the hero, hidden again once the final CTA or footer is in view — so it
never duplicates the real CTA.

---

## 4. Page sections, top to bottom

> **2026-07-30 update**: the section-by-section detail below (hand-drawn doodles, ScribbleUnderline,
> PaperClip, mock-browser-window case study cards, zig-zag SVG process lines, italic-serif Manifesto
> reveal) describes the *pre-redesign* homepage and is now stale — see the §2 callout for what
> replaced it (a clean card/pill/gradient system). **Current section order in
> `app/(frontend)/page.tsx`** (as of 2026-08-03): **Hero → Results → Problem → Manifesto →
> Services → TrustLogos → FeaturedWork → ToolsStack → Process → Testimonials → FAQ → FinalCTA**
> (Header/Footer/MobileCTA/WhatsAppButton wrap all of this in `layout.tsx`). Two sections below no
> longer exist in the form described: "Case studies" (§4.8) was replaced outright by
> `sections/featured-work.tsx` — a Portfolio-collection-driven grid of real client project cards
> (thumbnail, category pill, result headline, description, service tags, "View Case Study" link to
> `/work/[slug]`, plus a small external-link icon if the item has a `liveWebsite` URL) — see §1e.
> "Tools & Platforms" and a floating WhatsApp button were added during the redesign and were never
> given their own entry here. Treat the sub-sections below as historical/superseded except where
> a component name still matches something current (Hero, Services, Results, FAQ, Footer still
> exist, just re-skinned — see §2).

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

**Stale as of Phase 1 (2026-07-27)** — this described the pre-CMS, pure-`lib/constants.ts` site.
Since Phase 1, all real content lives in **Payload**, backed by Postgres:

- **Globals** (singleton documents): `homepage` (hero/trustLogos/problem/manifesto/process/
  services/results/caseStudies/testimonials/faq/finalCta groups, `versions.drafts: true` +
  `admin.preview`), `navigation`, `footer`, `siteSettings`, `seoSettings`.
- **Collections**: `users`, `media`, `categories`, `authors`, `posts` (blog, Phase 2,
  `versions.drafts: true`), `tags`, `testimonials`, `case-studies` (superseded by `portfolio` for
  display purposes, still holds its original 3 entries — see §1e), `portfolio` (2026-08-03, see
  §1e), `leads` (CRM, Phase 3), `clients`/`projects`/`contracts`/`files`/`meetings` (Phase 3
  placeholders, `admin.hidden: true`).
- **`lib/constants.ts` is the fallback, not the source of truth** — every `lib/cms/*.ts` getter
  (`getHomepage()`, `getNavigation()`, `getFooter()`, `getSiteSettings()`, `getSEOSettings()`, the
  blog getters, the portfolio getters) tries Payload first and falls back to a matching constant
  only if Payload is unreachable or the query throws. `SITE_URL` is the one exception that's
  *never* CMS-sourced by design — see §7.
- **`lib/schema/index.ts`** builds JSON-LD objects (`organizationSchema`, `localBusinessSchema`,
  `serviceSchema`, `faqSchema`, `breadcrumbSchema`, `articleSchema`, `creativeWorkSchema`,
  `videoObjectSchema`) as pure functions taking CMS data as params — no internal fetching, so
  schema output can't drift from whatever the page actually rendered.

---

## 7. SEO implementation

- **`SITE_URL`** (`lib/constants.ts`, `process.env.NEXT_PUBLIC_SITE_URL || "https://www.rulescale.in"`)
  is the single source of truth for every generated absolute URL — `metadataBase`, canonical,
  Open Graph, Twitter, all JSON-LD `@id`/`url` fields, `sitemap.ts`, `robots.ts`,
  `blog/rss.xml/route.ts`. **Deliberately not `siteSettings.url`** (the CMS-editable field) for
  any of this — that field is cached via `unstable_cache` with no revalidate time, and a domain
  migration once shipped that didn't take effect for a while because a standalone script's
  `revalidateTag()` call silently no-ops outside a real Next.js request context. `siteSettings.url`
  still exists and is admin-editable, it's just not wired into anything that emits a URL. Full
  incident writeup: `CHANGELOG.md` 2026-08-03.
- `buildSiteMetadata()` (`lib/seo/metadata.ts`) assembles the Next `Metadata` object from
  `siteSettings`/`seoSettings` (title template, description, keywords, robots directives) plus
  `SITE_URL` (metadataBase, OG/Twitter urls), called from `layout.tsx`'s `generateMetadata()`.
  Every blog and portfolio detail page has its own `generateMetadata()` that layers
  page-specific title/description/canonical/OG/Twitter on top.
- `app/robots.ts`, `app/(frontend)/sitemap.ts` (note: `sitemap.ts` lives *inside* the `(frontend)`
  route group, `robots.ts` deliberately does not — see §8) — both `force-dynamic`, not
  build-time-static, so neither depends on Postgres being reachable during a Vercel build.
  `sitemap.ts` includes the homepage, `/blog` + every post/category/tag/author, `/work/videos` +
  every portfolio item (routed to `/work/[slug]` or `/work/videos/[slug]` by `mediaType`).
- `app/icon.tsx`, `app/opengraph-image.tsx` — dynamically generated (`next/og`) using the real
  brand mark and colors. Blog posts and portfolio items instead use a real uploaded/Cloudinary
  image as their OG image (`post.seo.ogImage || post.featuredImage`, or
  `item.seo.metaImage || item.thumbnail.url` transformed to `1200×630` via
  `lib/cloudinary.ts`'s `transformImage()`) rather than a per-page generated `ImageResponse`.
- JSON-LD blocks (see §6) injected in `<body>` — Organization/LocalBusiness/Service/FAQPage/
  BreadcrumbList site-wide (`layout.tsx`), plus Article (blog posts), CreativeWork (`/work/[slug]`)
  and VideoObject (`/work/videos/[slug]`) on their respective detail pages.
- Semantic sectioning (`<section>`/`<header>`/`<footer>`), heading hierarchy (single `h1` per
  page), `aria-label`s on icon-only controls, `aria-hidden` on decorative SVGs.
- **Google Tag Manager** (`GTM-K28PK4V6`) is live on every public page (`app/(frontend)/
  layout.tsx`, `next/script` `strategy="beforeInteractive"`), not inside `/admin`
  (`app/(payload)/layout.tsx` is untouched).

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
- **Live on Vercel** at `https://www.rulescale.in` (canonical domain, migrated from the retired
  `rulescalemedia.com` — see `CHANGELOG.md` 2026-08-03), connected to the same Supabase Postgres
  project used in local dev (confirmed by the user). No GitHub Actions/other CI configured —
  Vercel's own git-push-triggered build is the only pipeline.
- **Schema is migration-based everywhere, dev-push is permanently off, local included.** Payload
  hard-disables its auto-push-on-boot behavior whenever `NODE_ENV === "production"` (confirmed
  from the installed `@payloadcms/db-postgres` source) and instead applies
  `postgresAdapter({ prodMigrations })` on boot — `payload.config.ts` wires this to `migrations/`
  (`20260730_041032_initial_schema.ts`, `20260803_091008_add_portfolio_collection.ts`, then
  `20260805_150921_add_influencer_applications.ts`).
  **`push: false` is also set** on the same adapter config, which additionally disables dev-push
  in `npm run dev` locally, not just in production — added after a local verification script
  re-triggered the exact interactive-prompt build crash described below by re-inserting a
  dev-push marker into the shared database's migration ledger (`CHANGELOG.md` 2026-07-30, second
  entry). **Any new collection/field change now needs a real `payload migrate:create` + a
  reviewed migration file, applied to the shared DB, before local dev or production will see it
  at all** — there's no other path anymore.
- First deploy surfaced three separate, now-fixed issues — full diagnostic writeups in
  `CHANGELOG.md`'s 2026-07-30 entry: (1) `/admin` 500 + missing Blog nav link, caused by
  production never having received any schema changes since Phase 1 (fixed by the migrations
  work above, plus adding the missing `Blog` entry to `lib/constants.ts`'s `NAV_LINKS` fallback);
  (2) a `DATABASE_URL` Vercel dashboard misconfiguration (was briefly set to the literal
  `.env.example` placeholder); (3) a build-time crash on `/blog/rss.xml` — Payload's `migrate()`
  found a `{name: "dev", batch: -1}` dev-push marker row in the live DB's migration ledger and
  tried to show an interactive confirmation prompt, which can't be answered in Vercel's
  non-interactive build — fixed by correcting the ledger directly (marker removed, initial
  migration recorded as already-applied) and switching `rss.xml`/`sitemap.ts` from
  build-time-static (`revalidate`) to `export const dynamic = "force-dynamic"` so the build no
  longer depends on Postgres being reachable at all.
- `.env*` is gitignored. `DATABASE_URL` and `PAYLOAD_SECRET` are required (see `.env.example`) —
  the frontend degrades gracefully via the `lib/cms` fallback without them, but `/admin` needs a
  real `DATABASE_URL` to function at all. **Always copy the real value from `.env.local` into
  Vercel's env vars — never retype `.env.example`'s placeholder.** `CLOUDINARY_CLOUD_NAME`/
  `CLOUDINARY_API_KEY`/`CLOUDINARY_API_SECRET` are configured with real values in `.env.local`
  (Portfolio uploads are live, not just built-and-waiting) — confirm they're set in Vercel's
  environment variables too before relying on the admin upload button in production.

---

## 10. See also

- **`Architecture files/CHANGELOG.md`** — dated log of notable fixes/changes, including the
  full diagnostic writeup for the mobile horizontal-scroll bug. This status doc describes *what
  the system currently is*; the changelog describes *what changed and why*. Update the changelog
  going forward rather than accumulating history in this file.
