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
npm run payload migrate:create <name>   # generate a migration after any collection/global change
npm run payload migrate                 # apply pending migrations to whatever DATABASE_URL points at
npm run seed                  # one-time: seed testimonials/case-studies + wire them into Homepage
```

**Schema changes require a real migration now, including in local dev** — `push: false` is set on
the `postgresAdapter` in `payload.config.ts`, so Payload's dev-mode auto-push (`pushDevSchema()`)
never runs anywhere, not just in production. Local dev and production point at the *same* Supabase
database, so this was made permanent after a local script re-triggered a real production build
crash by re-inserting a dev-push marker into the shared migration ledger — see
`Architecture files/CHANGELOG.md` 2026-07-30 (second entry) for the full incident. After changing
any collection/global field: `npm run payload migrate:create <name>`, review the generated SQL,
`npm run payload migrate` to apply it to the shared DB, then `npm run generate:types`.

Requires a `.env.local` (see `.env.example`): `DATABASE_URL` (Postgres/Supabase connection
string), `PAYLOAD_SECRET`, and `PREVIEW_SECRET` (draft-mode preview link token). Without a real
`DATABASE_URL`, the frontend still works (every `lib/cms/*.ts` getter falls back to
`lib/constants.ts` on any Payload/DB error), but `/admin` will 500 with a clear connection error.
Optional: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (Phase 3) —
the contact form and lead pipeline work fully without these (emails log to the console instead of
sending, Turnstile verification is skipped). `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET` (Portfolio, 2026-08-03) — without these the admin upload button shows a
clear error, but editors can still paste a thumbnail URL manually. `NEXT_PUBLIC_SITE_URL` —
optional override for `SITE_URL` (defaults to `https://www.rulescale.in`); see `lib/env.ts` for
all of the above.

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
  (frontend)/blog/     the blog (Phase 2) — page.tsx (index), [slug]/page.tsx (article),
                      category/[slug], tag/[slug], author/[slug] (archives), search/page.tsx,
                      rss.xml/route.ts. No generateStaticParams anywhere here on purpose — posts
                      stay on the same dynamic-route + tag-cache model as everything else, so an
                      admin save shows up live without a rebuild.
  (frontend)/contact/   the contact page (Phase 3) — the site's only lead-capture form
  (frontend)/work/      Portfolio detail pages (2026-08-03) — [slug]/page.tsx (image case study),
                      videos/page.tsx (gallery), videos/[slug]/page.tsx (video detail). All CMS-
                      driven via lib/cms/portfolio.ts, zero hardcoded project data.
  (frontend)/api/contact/  the one backend endpoint the contact form posts to (Phase 3):
                      validation, honeypot, DB-backed rate limiting, optional Turnstile, then
                      payload.create() via the Local API (bypasses access control by design)
  (frontend)/api/leads/export/  admin-only CSV export of the leads collection (Phase 3)
  (frontend)/api/portfolio/upload/  admin/editor-only Cloudinary upload endpoint (2026-08-03) —
                      streams a multipart file straight to Cloudinary via lib/cloudinary.ts,
                      returns only metadata, never touches Payload/local storage
  (frontend)/sitemap.ts  lives inside (frontend) (unlike robots.ts, see below) — includes
                      posts/categories/tags/authors (Phase 2) and every portfolio item + /work/videos
                      (2026-08-03), all keyed off SITE_URL not siteSettings.url (see "Conventions")
  (payload)/          Payload-generated admin/API routes — do NOT hand-edit, regenerate instead
                      (`npm run generate:importmap`)
  robots.ts, icon.tsx, opengraph-image.tsx  top-level on purpose, NOT inside (frontend) —
                      robots.ts specifically silently stops working if moved into a route group
                      on this Next/Turbopack version, see CHANGELOG 2026-07-27.
payload.config.ts    Payload config root — collections, globals, db adapter, secret,
                      admin.components (custom dashboard view + nav link, Phase 3)
payload/
  collections/         users (has `role`: admin/editor), media, categories, authors, posts, tags,
                        testimonials, case-studies (superseded for display by `portfolio`, still
                        holds its original 3 entries, untouched — see CHANGELOG 2026-08-03),
                        portfolio (2026-08-03: image/video projects, Cloudinary-hosted media,
                        services, rich-text case study content, SEO group, draft/publish), leads,
                        clients, projects, contracts, files, meetings (the last 5 are Phase 3
                        placeholders: admin.hidden: true, no real UI/workflow yet, for a future
                        client-portal phase)
  globals/              homepage (drafts + preview enabled), navigation, footer, site-settings,
                        seo-settings
  access.ts             shared RBAC helpers (isAdmin, isAdminOrEditor, isAdminOrSelf) — reused
                        across every collection/global's `access` block, don't duplicate the
                        role-check logic inline
  hooks/revalidate.ts   revalidateTagSafely(tag) — every afterChange/afterDelete hook calls this,
                        never `revalidateTag` directly (keeps the try/catch discipline in one place)
  hooks/lead-events.ts   dispatchLeadEvent({event, doc, previousDoc}) (Phase 3) — the single seam
                        every Leads afterChange event flows through; currently only triggers the
                        two Resend emails. A future Slack/Notion/WhatsApp integration is one more
                        call inside this function, never a new hook wired into leads.ts. Always
                        `await`ed by the collection hook (not fire-and-forget) so a serverless
                        response can't return — freezing the function — before emails finish.
  admin-views/           custom Payload admin components: business-dashboard.tsx (Phase 3, custom
                        view at /admin/business-dashboard, registered via payload.config.ts's
                        admin.components.views), leads-export-button.tsx (Phase 3, beforeList
                        button on the Leads collection), dashboard-nav-link.tsx (Phase 3, sidebar
                        link via admin.components.afterNavLinks — custom views don't auto-appear
                        in the nav), cloudinary-upload-field.tsx (2026-08-03 — a custom Field
                        component, not a view, registered on Portfolio's `thumbnailUrl` field via
                        that field's own `admin.components.Field`; uses `useField`/`useFormFields`
                        from `@payloadcms/ui` to write returned upload metadata into sibling
                        hidden fields). Plain HTML/inline styles, not Tailwind classes — Payload's
                        admin bundle doesn't run this repo's Tailwind build. Any new admin
                        component needs `npm run generate:importmap` afterward.
  seed.ts               one-time data seed, run via `npm run seed`
lib/
  cms/                 the ONLY code that talks to Payload — getHomepage(), getNavigation(),
                        getFooter(), getSiteSettings(), getSEOSettings(), getCategories(),
                        getTags(), getAuthors(), getPublishedPosts(), getPostBySlug(),
                        getFeaturedPost(), getRelatedPosts(), getAdjacentPosts(),
                        getFeaturedPortfolioItems(), getVideoPortfolioItems(),
                        getPortfolioItemBySlug(), getRelatedPortfolioItems(),
                        getAllPortfolioItems() (2026-08-03). Each is
                        `cache(unstable_cache(fetchFn, [tag], {tags:[tag]}))` — React cache() for
                        per-request dedupe, unstable_cache() for cross-request persistence,
                        invalidated by the matching payload/*/hooks.ts on save. The homepage-era
                        getters fall back to lib/constants.ts on any Payload/DB error — that
                        fallback path is deliberately NOT cached (see CHANGELOG 2026-07-28), so a
                        transient DB outage can't get stuck serving stale fallback content
                        forever. The blog getters have no fallback (no pre-CMS blog content
                        exists) — they return empty results on error and every blog page renders
                        the same empty-state UI for "no data" and "fetch failed."
                        getHomepage()/getPostBySlug()/getPortfolioItemBySlug() additionally branch
                        on next/headers draftMode() before the cached path — draft reads always
                        hit Payload live, uncached, `draft: true`. **Every public post/portfolio
                        query must also explicitly filter `{_status: {equals: "published"}}`** —
                        Payload's `draft` find option does NOT exclude `_status: "draft"`
                        documents by itself, a real bug caught during Phase 2 verification, see
                        CHANGELOG 2026-07-29. Never import `payload` or query Payload from a
                        section/blog component.
  cloudinary.ts          uploadImage()/deleteImage()/transformImage() (2026-08-03) — server-only,
                        wraps the official `cloudinary` SDK, gated by lib/env.ts's
                        getCloudinaryConfig(). transformImage() splices a transformation string
                        into an already-uploaded delivery URL by plain string manipulation rather
                        than calling the SDK, so generating an OG-sized crop needs no live
                        Cloudinary config at page-render time, only at original upload time.
  video.ts               parseVideoUrl() (2026-08-03) — detects YouTube/Vimeo/direct-Cloudinary-MP4
                        from a plain URL string, used by the video portfolio pages to choose
                        <iframe> vs <video>.
  cache/tags.ts          CACHE_TAGS — single source of truth for cache tag strings, imported by
                        both lib/cms/*.ts and payload/**/*.ts hooks so they can't drift apart.
                        Blog tags: `posts` (any list-shaped read), `postBySlug(slug)` (single
                        article), `taxonomy` (categories+tags+authors, shared). Portfolio tags:
                        `portfolio` (any list-shaped read), `portfolioBySlug(slug)` (single item).
  blog/                 reading-time.ts (word count / 200wpm from the Lexical JSON, computed at
                        read time, not stored), toc.ts (extractHeadings() + the shared
                        createHeadingIdAssigner() factory that both the TOC and
                        ArticleContent's heading converter use, so anchor ids always match)
  seo/metadata.ts        buildSiteMetadata() — assembles the Next Metadata object from
                        SiteSettings + SEOSettings, called from layout.tsx's generateMetadata()
  constants.ts          fallback source of truth if Payload is unreachable/unseeded — not dead
                        code, still actively used. Also defines `SITE_URL`
                        (`process.env.NEXT_PUBLIC_SITE_URL || "https://www.rulescale.in"`), the
                        ONLY thing every SEO-critical surface (sitemap, RSS, metadataBase,
                        canonical/OG, JSON-LD) reads for the domain — deliberately NOT
                        `siteSettings.url` (the CMS-editable field), whose `unstable_cache` has no
                        revalidate time and once served a stale domain for a while after a fix
                        shipped, since a standalone script's `revalidateTag()` silently no-ops
                        outside a real request context. See CHANGELOG 2026-08-03.
  schema/index.ts        JSON-LD builders — pure functions taking siteSettings/services/faq/post
                        as params (no internal fetching). breadcrumbSchema() takes an optional
                        `items` trail (defaults to just Home, the original homepage behavior);
                        articleSchema() (blog posts), creativeWorkSchema()/videoObjectSchema()
                        (2026-08-03, portfolio items) all use SITE_URL directly, same reasoning.
  utils.ts               cn() class-merge helper
  leads/                 validate.ts, rate-limit.ts, attribution.ts, turnstile.ts (Phase 3) —
                        the /api/contact security/validation layer. rate-limit.ts is DB-backed
                        (queries recent `leads` by email/IP) rather than in-memory/Redis, since
                        no rate-limiting infra is provisioned and in-memory state doesn't survive
                        serverless invocations.
  email/                 resend-client.ts (lazy client, no-ops when RESEND_API_KEY is unset),
                        templates/ (@react-email/components, brand colors inlined as literal hex
                        since email clients don't support CSS custom properties),
                        send-lead-emails.tsx (Phase 3)
  env.ts                 getResendApiKey() / getTurnstileSecretKey() / getTurnstileSiteKey() /
                        getCloudinaryConfig() (2026-08-03) — warn once and return null when an
                        optional integration key is unset, rather than throwing
sections/            one component per page section, in page order (Header/Footer included).
                     Each takes CMS content as a `data` prop (or `navigation`/`footer`/etc. for
                     Header/Footer) — fetched once in layout.tsx/page.tsx, not per-section.
                     featured-work.tsx (2026-08-03) replaced case-studies.tsx in the homepage's
                     render list (same `id="case-studies"` anchor, Portfolio-collection-driven
                     instead) — case-studies.tsx still exists in the tree, just unreferenced.
                     Current homepage redesigned 2026-07-30 to a card/pill/gradient system — see
                     `Architecture files/systemstatus.md` §2, not the pre-redesign doodle system
                     `components/doodles/` still literally contains (see below).
components/
  ui/                generic primitives — Button, Container, Reveal, Accordion, Spotlight,
                      RollingNumber, Marquee, whatsapp-button.tsx (2026-07-30, floating global CTA)
  doodles/            hand-drawn brand accents — LogoMark, HandArrow, PaperClip, ScribbleUnderline.
                      Still used on the blog (Phase 2) and /contact (Phase 3), which the
                      2026-07-30 redesign deliberately left untouched; no longer used on the
                      homepage itself.
  blog/               PostCard, FeaturedPost, CategoryPill, AuthorByline, TableOfContents,
                      RelatedPosts, PostNavigation, ShareButtons, NewsletterCta (static
                      placeholder, no signup wiring), SearchBox, Pagination, ArticleContent
                      (RichText with only the heading converter overridden), PostGrid
  contact/            ContactForm (Phase 3) — the site's only lead-capture form, "use client",
                      includes a CSS-hidden honeypot field and an optional Turnstile widget
                      (only renders if NEXT_PUBLIC_TURNSTILE_SITE_KEY is set)
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
  `req.user?.role === 'admin'` checks. Local API calls (everything in `lib/cms/`, `lib/leads/`
  route handlers) default to `overrideAccess: true` and are unaffected by any of this — access
  control only governs `/admin` and the REST/GraphQL surface.
- **If a collection accepts public writes through a hardened Route Handler** (validation, rate
  limiting, honeypot, etc. — like `/api/contact` → `leads`), set that collection's Payload
  `access.create` to `() => false`, not `() => true`. The Route Handler's own
  `payload.create()` call still works (Local API bypasses access control by default), but this
  closes the auto-generated public `POST /api/<collection>` REST endpoint, which would otherwise
  let anyone skip every one of the Route Handler's protections by hitting Payload's raw API
  directly. This is a real gap that existed on `leads` until Phase 3 — see CHANGELOG 2026-07-29.
- Custom Payload admin UI (a dashboard view, a list-view button, a nav link) goes in
  `payload/admin-views/`, registered via `payload.config.ts`'s `admin.components` (`views` for a
  new top-level route, `beforeList`/`afterList` for a per-collection list-view addition,
  `afterNavLinks` for a sidebar link — custom views don't auto-appear in the nav). Reference
  components with the `@/` path alias (e.g. `"@/payload/admin-views/foo#ComponentName"`) — Payload's
  import-map generator resolves it the same way Next's bundler does. Always run
  `npm run generate:importmap` after adding or renaming one, or the admin panel won't find it.
- Draft mode exists on the Homepage global and on Posts (`versions.drafts` + `admin.preview`).
  Preview a pending edit via the "Preview" button in `/admin` (or manually:
  `/next/preview?path=/&previewSecret=...` for the homepage, `?path=/blog/<slug>&...` for a post,
  then `/next/exit-preview` to leave). The generic preview routes accept any `path`, so no new
  route was needed for Posts.
- Any query in `lib/cms/posts.ts` (or a future collection with `versions.drafts: true`) that's
  meant to be public-facing MUST explicitly filter `{_status: {equals: "published"}}`. Payload's
  `draft` find/findByID option controls which version's *content* comes back, not whether a
  draft-status document is included at all — omitting `draft`, or passing `draft: false`, does
  NOT exclude `_status: "draft"` docs. This is a real bug that shipped once and was caught during
  Phase 2 verification (a draft test post appeared in the listing, pagination, related posts, and
  RSS, and was directly fetchable by URL) — see CHANGELOG 2026-07-29.
- Brand tokens live in `app/(frontend)/globals.css` (`--color-ink`, `--color-paper`,
  `--color-accent`, `--color-ink-soft`, `--color-hairline`) and are exposed as Tailwind utilities
  (`bg-ink`, `text-accent`, `border-hairline`, ...). Use those, don't hardcode hex values for new
  work. The 2026-07-30 homepage redesign added a second namespace (`--color-accent-from/via/to/
  solid`, `--color-home-bg`, `.gradient-text`, `.gradient-bg`, `.pill-badge`) deliberately kept
  separate from `--color-accent` so the blog/`/contact` pages stay unaffected — use the gradient
  tokens for anything on the homepage or the new `/work/*` pages, the plain `--color-accent`
  tokens for anything on the blog or `/contact`. Full detail: `systemstatus.md` §2.
- **Every in-page anchor link needs a leading `/`** (`/#case-studies`, not `#case-studies`) — a
  bare hash is harmless on the homepage itself but breaks navigation from any other route (e.g.
  clicking a nav link from `/blog` just appends the hash to the current URL instead of going
  home). This bit every hardcoded link AND every CMS-stored `navigation`/`footer`/`homepage` CTA
  href at once — fixing the code wasn't enough, the already-persisted documents needed a one-off
  script too. See CHANGELOG 2026-07-30 (second entry that day).
- **Domain/URL generation must use `SITE_URL`** (`lib/constants.ts`), never `siteSettings.url` —
  see the `constants.ts` entry in the file tree above and CHANGELOG 2026-08-03 for why.
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
- If `npm run dev` seems to be serving stale `unstable_cache` data (a page shows old/missing
  content that a direct DB check proves is actually correct) even after killing the process and
  deleting `.next/cache`, this is a known Turbopack dev-mode artifact, not a code bug — different
  route entry points can end up with their own `unstable_cache`/module-singleton instances that
  don't stay in sync. Verify against `npm run build && npm run start` (single unified bundle)
  before concluding there's a real problem. See CHANGELOG 2026-07-29 for the full diagnosis.
- Any `payload run <script>.ts` one-off (seeding/publishing/cleanup) that calls `payload.create`
  on a `versions.drafts: true` collection defaults to `_status: "draft"` if you don't pass
  anything — omitting the `draft` option does NOT mean "published." To create a genuinely
  published document via the Local API, pass `data: { _status: "published" }` explicitly (passing
  `draft: false` to `update()` was tried and does *not* do this). Also note:
  `revalidateTagSafely()` always fails (harmlessly, caught) when called from a standalone
  `payload run` script — there's no Next.js request context outside a real HTTP request, so a
  script-driven write won't invalidate the running dev/prod server's cache; restart the server (or
  hit the write through `/admin`/the REST API instead) if you need the change to show up live.
- **`payload run <script>.ts` calls `process.exit(0)` the instant the dynamic `import()` of your
  script resolves** — which happens as soon as the module's top-level synchronous code finishes
  running, not when an un-awaited async function inside it finishes. A script whose top-level code
  is `run().then(...)` (fire-and-forget) gets killed mid-flight with zero output and no error; a
  script whose top-level code is `await run()` (or just inlined top-level `await` statements, since
  these scripts run as ESM) blocks the module from resolving until the work is actually done. Always
  use top-level `await`, never a bare `.then()`/`.catch()` chain, in a one-off `payload run` script.
- No helper exists for constructing Lexical rich-text content programmatically (e.g. from a
  one-off seed script) — build the plain JSON AST by hand: a `root` node wrapping `children`
  (`paragraph`/`heading`/`list`/`listitem` nodes, each with `direction`/`format`/`indent`/`version`
  keys), each `text` node needs `{type: "text", text, format: 0, detail: 0, mode: "normal", style:
  "", version: 1}`. See the one-off script referenced in `CHANGELOG.md` 2026-08-03 for a working
  set of builder functions (`paragraph()`, `heading()`, `bulletList()`, `richText()`) if writing
  another one.

## Verifying UI changes

No visual regression suite exists — verification is manual, via Playwright driven through Bash.
(If no Playwright/browser-automation tool is available in a given session, fall back to
HTTP-request-based checks — status codes, rendered HTML content, response headers — and say so
explicitly rather than claiming a visual pass that didn't happen; this occurred during Phase 2,
see `Architecture files/currentphase.md`'s "Known gap.")

1. Start the dev server (`npm run dev`), confirm it's actually serving before testing against it.
2. Screenshot the change at a mobile width (~375–390px) and desktop (~1440px).
3. Scroll through and check `document.documentElement.scrollWidth === window.innerWidth` (no
   horizontal overflow) and zero console/page errors.
4. Actually look at the screenshot before claiming the change is correct — don't infer success
   from "the build didn't crash."

## Brand quick reference

Ink `#201e1d` · Paper `#f3f2f2` · Accent Red `#ec3013` · Ink-soft `#6f6b68` — the original system,
still exactly what the blog and `/contact` use, Accent Red the only accent on those pages, used
sparingly. **The homepage (and the new `/work/*` pages) use a second, separate token namespace**
added by the 2026-07-30 redesign: a 3-stop gradient literally blending the same Accent Red through
purple `#a855f7` to blue `#3b82f6` (`--color-accent-from/via/to`, `.gradient-text`, `.gradient-bg`),
plus a flat `--color-accent-solid` (`#8b5cf6`) and light `--color-home-bg` (`#f7f8fc`) — the two
systems coexist by design, not by oversight, specifically so this rule can stay simple: blog/
contact → plain `--color-accent`; homepage/`/work/*` → gradient tokens. Archivo for all type;
Caveat only for small hand-drawn label accents (blog/contact only, not the homepage). Full
rationale and the historical superseded palette: `claude files/CLAUDE.MD`. Full token/usage
detail: `Architecture files/systemstatus.md` §2.
