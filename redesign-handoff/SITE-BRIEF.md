# RuleScale Media — Site Brief for a Full UI + Site Redesign

**Audience:** a designer or AI (Claude / ChatGPT) who will redesign this site and has not seen it.
**Snapshot date:** 2026-11-22. **Live site:** https://www.rulescale.in. **Repo:** github.com/AllgoZ/RuleScale-Media (`main`).
**Companion file:** `RuleScale-current-site-visual-reference.pdf` — screenshots of every page type, desktop 1440px and mobile 390px. Read this brief with the PDF open.

**How this document was made.** Three sources, kept distinct so you can weigh them:
- **[code]** read directly from the repository.
- **[live]** measured on the production site with a headless browser on 2026-11-22 (screenshots, DOM, HTTP status checks).
- **[docs]** taken from the repo's own `Architecture files/*.md`. Several of those are out of date; where I found drift I say so.

No code, content, or CMS data was modified to produce this. Nothing here is a claim that a fix has been applied.

---

## 0. TL;DR

RuleScale Media is an Indian full-service marketing agency (website, SEO, performance, social, influencer, video, content, brand). The site is a Next.js 16 + Payload CMS + Postgres app on Vercel with a ~145-URL footprint: a one-page homepage, a 60-post blog, 8 portfolio case studies, a contact form and an influencer-application wizard.

**The engineering foundation is solid** (CMS-driven, cached, SEO-aware, no layout overflow, no CLS, alt text everywhere). **The front end is the weak part** and is what to redesign:

1. **It doesn't look like the brief.** The brand brief asks for premium editorial minimalism with a little hand-drawn warmth, in ink / paper / one red. The live homepage is a generic "SaaS template": centered pill badge + H2 + white 3-column card grid, repeated for 12 sections, in a red→purple→blue gradient. The blog and `/contact` still use the original system, so **the site reads as two different sites.**
2. **Trust signals are weak or fake.** All four rotating testimonials are seeded placeholders from fictional clients; "featured on Google / Meta / LinkedIn…" is text pills, not press; stats are unverified; footer social + legal links go nowhere; the contact email is on the wrong domain.
3. **Information architecture is thin.** No `/work` index, `/services`, `/about`, `/pricing`, privacy or terms page (all 404). The 60-post blog (mostly Dindigul/Coimbatore local SEO) is not surfaced from the homepage, which has zero local signal.
4. **Blog has no images** (grey boxes), the 404 is the unbranded Next.js default, and four of the eight portfolio cards have wrong or missing data.

Section 9 is the full audit; section 10 is the redesign plan; section 11 is a prompt you can paste into another AI.

---

## 1. Business, audience, brand

**What they sell.** Website design & development, SEO, performance marketing, social media, influencer marketing, video production, content, brand strategy, media buying, analytics, localization (multi-lingual), consulting. Tagline: **"We grow brands people remember."** Positioning: most agencies sell *activity*; RuleScale sells the moment a customer remembers the brand.

**Who it's for.** Founders / marketing leads at growing businesses who have been **burned by an agency before** and want proof. Primary market India (Tamil Nadu angle: Dindigul, Coimbatore). Real clients so far: Mylini, Kodai Golden Honey, LightPic, Fairyland Resort, Junefourteen, Pick&Drop Logistics, Packpetti, Ponwins. [live]

**Conversion goals.** Primary: enquiry via `/contact` (also embedded at the bottom of the homepage). Secondary: creator applications at `/form/influencer`; case-study views at `/work/*`. A floating WhatsApp button (+91 95003 81132) is on every page.

**Voice.** Plain, specific, honest, skeptical-founder-friendly. Real numbers over adjectives. No agency-speak ("holistic 360°", "unlock potential"). Full voice guide: `Architecture files/blogcontentbrief.md`.

**The original creative brief** (`CLAUDE.MD`, repo root) — still the stated north star:
- ~90% **premium editorial minimalism** (Apple / Linear / Arc / Stripe Sessions): huge type, whitespace, intentional asymmetry, restrained colour, spring-physics motion.
- ~10% **hand-crafted warmth**: scribbles, sketch arrows, sticky notes, paper clips, Caveat labels — sparingly.
- Palette: **Ink `#201e1d`**, **Paper `#f3f2f2`**, **one accent red `#ec3013`**, ink-soft `#6f6b68`, hairline `rgba(32,30,29,.1)`. "Do not add a second accent colour."
- Type: **Archivo** for everything; **Caveat** only for small hand-drawn labels.
- Logo: ring + lightning-bolt "S" monogram (`claude files/logo.png`, `RuleScale Media logo design with color.pdf`; SVG version in `components/doodles/logo-mark.tsx`).
- Emotional target: *"These people clearly know marketing. I trust them."* then *"I want to keep scrolling."*

> **Key tension for the redesign:** on 2026-07-30 the owner asked for the homepage (only) to be restyled to resemble a competitor reference — that produced the current gradient/card look and deliberately dropped the doodle language. So *the brief and the live site now disagree*, by the owner's own choice. **Decide which direction wins before designing** (see §12, question 1).

---

## 2. Live site snapshot [live]

| Item | Value |
|---|---|
| Sitemap URLs | 145 |
| Blog posts | **60** (all by one author, "RuleScale Media Team") |
| Blog categories / tags | 11 / **61** (≈1 tag per post → many thin tag archives) |
| Portfolio items | 8 (all 8 shown as cards on the homepage); 0 video items (`/work/videos` shows an empty state) |
| Pages that do **not** exist (404) | `/work`, `/services`, `/about`, `/privacy`, `/terms`, `/llms.txt`, `/favicon.ico`, `/icon.svg` |
| Homepage | 12 content sections, 10,215px tall on desktop, 17,569px on mobile |
| Cumulative layout shift | 0 on every page tested |
| Horizontal overflow | none on any page, either viewport |
| Images missing `alt` | 0 |
| Form inputs missing labels | 0 |
| Exactly one `<h1>` per page | yes, all 11 page types |

**Blog topic clusters:** (a) Dindigul local-business series (website, SEO, social, WhatsApp, Google Business Profile…), (b) Coimbatore manufacturers (B2B enquiries, export, LinkedIn, multilingual), (c) India agency/cost guides ("Digital marketing cost India 2026", "Best performance marketing agency India").

---

## 3. Tech stack [code]

| Layer | Choice |
|---|---|
| Framework | Next.js **16.2.12**, App Router, Turbopack, React 19.2, TypeScript |
| CMS | **Payload CMS 3.86** (admin at `/admin`, REST + GraphQL under `/api`), Lexical rich text |
| Database | PostgreSQL on **Supabase** (session pooler) via `@payloadcms/db-postgres` |
| Styling | **Tailwind CSS v4** (CSS-first `@theme`, **no `tailwind.config.js`**) + custom classes in `app/(frontend)/globals.css` |
| Motion | Framer Motion 12 (13 files import it) |
| UI libs | Radix (`react-accordion`, `react-slot`), `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react` |
| Media | Cloudinary (portfolio + blog images, influencer PDFs) via the official SDK; Payload's own media collection exists but does not persist on Vercel |
| Email | Resend + React Email (**no `RESEND_API_KEY` set → emails only log to console**) |
| Anti-spam | honeypot + DB-backed rate limit; Cloudflare Turnstile wired but **keys not set** |
| Analytics | Google Tag Manager `GTM-K28PK4V6`, `beforeInteractive`, public pages only |
| Hosting | Vercel, deploys on push to `main`. **No CI, no tests.** |
| Size | ~12.5k lines TS/TSX across `app/ sections/ components/ lib/ payload/`; 22 commits |

**Pinned versions matter:** Next is pinned to 16.2.12 because Payload's `next` peer range excludes 15.5.x. Don't bump Next or Payload casually.

---

## 4. Architecture [code, docs]

### 4.1 Repo map
```
app/
  (frontend)/        the public site (route group; no URL effect)
    layout.tsx         root layout: fonts, GTM, 5 JSON-LD blocks, Header/Footer, MobileCTA, WhatsAppButton
    page.tsx           homepage — fetches CMS data, renders the 12 sections
    globals.css        ALL design tokens + custom utility classes (375 lines)
    blog/              index, [slug], category/[slug], tag/[slug], author/[slug], search, rss.xml
    work/              [slug] (case study), videos/, videos/[slug]
    contact/           the contact page
    form/influencer/   8-step creator application wizard
    next/preview, next/exit-preview   draft-mode entry/exit
    api/               contact, influencer (+upload), leads/export, portfolio/upload,
                       content/posts, content/portfolio, health
    sitemap.ts  icon.tsx  opengraph-image.tsx
  (payload)/         Payload admin + generated API routes — NEVER hand-edit
  robots.ts          must stay OUTSIDE the route group (silently breaks inside it on this Next version)
sections/            one component per homepage section + header + footer   (the UI you will replace)
components/
  ui/                Button, Container, Reveal, Accordion, Spotlight, Marquee, RollingNumber, WhatsAppButton
  doodles/           LogoMark, HandArrow, PaperClip, ScribbleUnderline (hand-drawn language; now only blog/contact/influencer use them)
  blog/ contact/ forms/influencer/ icons/   feature components
  hero-collage.tsx   unused leftover from the older hero
lib/
  cms/               THE ONLY code that talks to Payload (cached getters; types in types.ts)
  constants.ts       fallback copy if the CMS is unreachable + SITE_URL
  schema/ seo/ cache/ leads/ email/ blog/ influencer/ env.ts cloudinary.ts video.ts content-api.ts utils.ts
payload/             collections/, globals/, access.ts (RBAC), hooks/, admin-views/, seed.ts
migrations/          Payload/Drizzle SQL migrations (6 applied)
Architecture files/  systemstatus.md, CHANGELOG.md, currentphase.md, content-api.md, blogcontentbrief.md
CLAUDE.MD AGENT.md handover.md   brief / agent quick-ref / current handover
```

### 4.2 Data flow (this is the contract the redesign must respect)
1. `layout.tsx` and `page.tsx` call cached getters in `lib/cms/*` (`getHomepage()`, `getNavigation()`, `getFooter()`, `getSiteSettings()`, `getFeaturedPortfolioItems()`, `getPublishedPosts()`, …). React `cache()` dedupes per request; `unstable_cache()` persists across requests, invalidated by **cache tags** (`lib/cache/tags.ts`).
2. Payload `afterChange`/`afterDelete` hooks call `revalidateTagSafely()` so an admin edit shows on the live site in ~1–2 s.
3. Sections receive plain data via props (`data`, `navigation`, `footer`, `items`). **A section never imports `payload` or `lib/cms`.** Types are in `lib/cms/types.ts` (`HeroData`, `ServicesData`, …).
4. **Fallback:** every homepage-era getter is try/catch-wrapped and returns `lib/constants.ts` content if Payload/DB is unreachable. Blog + portfolio getters return empty results on error (every list has an empty-state UI).
5. **Draft mode:** `homepage` global and `posts`/`portfolio` use Payload drafts; `/next/preview` (needs `PREVIEW_SECRET` + admin session) enables Next draft mode; draft reads bypass the cache.
6. **Every public query on a drafts-enabled collection must filter `_status: published`** — Payload's `draft` option does not do it. This bug shipped once.

### 4.3 Content model — what the UI can rely on

**Globals (singletons):** `homepage` (34 fields: hero, trustLogos, problem, manifesto, process, services, results, caseStudies[legacy], testimonials, faq, finalCta — each field has a `defaultValue`), `navigation` (links[], ctaLabel, ctaHref), `footer` (blurb, serviceLinks[], legalLinks[], socialLinks[]), `siteSettings` (siteName, tagline, description, url, contactEmail, sameAs[]), `seoSettings`.

**Collections:**
| Collection | Purpose | Notes |
|---|---|---|
| `posts` | blog | title, slug, excerpt, content (Lexical), `featuredImage` (Payload upload) **and** `featuredImageUrl`/`featuredImageAlt` (Cloudinary URL), category, tags, author, publishedDate, featured, `seo{metaTitle,metaDescription,canonicalUrl,ogImage,twitterImage}`; drafts |
| `portfolio` | case studies | title, client, slug, featured, mediaType (image/video), category, description, resultHeadline, services[], thumbnail{url,publicId,w,h,format}, videoUrl, `caseStudyContent` (Lexical), liveWebsite, sortOrder, publishedAt, seo; drafts |
| `testimonials` | quotes | quote, name, title, featured, order (relationship-fed into the homepage) |
| `categories`, `tags`, `authors` | taxonomy | authors: name, slug, role, avatar, bio |
| `leads` | CRM | company/website/budget/services/priority/assignedUser/notes/attribution; status incl. won/lost; versions on; public REST create **closed** |
| `influencer-applications` | creator CRM | ~50 fields over 8 form sections; public REST create closed |
| `users` | staff | role `admin` \| `editor`; API keys enabled |
| `media` | Payload uploads | not reliable on Vercel |
| `case-studies` | **legacy**, 3 placeholder entries, no longer rendered | candidate for deletion |
| `clients`, `projects`, `contracts`, `files`, `meetings` | hidden placeholders for a future client portal | no UI |

**Roles:** admin = everything; editor = create/read/update homepage, posts, media, testimonials, portfolio; delete is admin-only. RBAC only governs `/admin` + REST/GraphQL, not the Local API.

### 4.4 HTTP surface
| Route | What it does |
|---|---|
| `POST /api/contact` | validates → honeypot → DB rate-limit (email/IP) → optional Turnstile → attribution → creates `lead` → Resend emails (logs only, today) |
| `POST /api/influencer`, `/api/influencer/upload` | wizard submit (24 h duplicate check by email/Instagram); PDF upload (≤10 MB) → Cloudinary `raw` |
| `GET /api/leads/export` | admin-only CSV |
| `POST /api/portfolio/upload` | editor/admin Cloudinary image upload |
| `POST/GET /api/content/posts`, `/api/content/portfolio` | **Content API**: Markdown in/out, upsert by slug, auth `Authorization: users API-Key <KEY>`, writes publish immediately unless `"status":"draft"`. Guide: `Architecture files/content-api.md` |
| `GET /api/health` | Postgres ping, 200/503 |
| `/api/*` (rest) | Payload REST/GraphQL |
| `/sitemap.xml`, `/robots.txt`, `/blog/rss.xml` | `force-dynamic`, so a Vercel build doesn't need the DB |

### 4.5 Config & environment
Required: `DATABASE_URL`, `PAYLOAD_SECRET`, `PREVIEW_SECRET`. Optional: `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CLOUDINARY_*`, `NEXT_PUBLIC_SITE_URL`. The domain for every canonical/OG/JSON-LD/sitemap URL comes from the **`SITE_URL` constant**, never from the CMS `siteSettings.url` (a stale-cache incident taught this). `next.config.ts` only whitelists `res.cloudinary.com` + local `/api/media/file/**` for `next/image`.

### 4.6 Engineering rules that bite (from `AGENT.md`)
- **Local dev and production share ONE Supabase database.** Any schema change needs `payload migrate:create` → review → `payload migrate` → `generate:types`. `push:false` is deliberate. A casual local script once broke the production build.
- `Button` must stay `"use client"` (Radix `Slot` breaks the RSC graph otherwise).
- Never put a Framer-Motion-animated transform and a static Tailwind `translate-*`/`rotate-*` on the *same* element (inline style wins); outer wrapper = static, inner = animated.
- Avoid 4-point `useTransform` arrays bound to `style` (WAAPI "monotonically non-decreasing" bug).
- Grid items default to `min-width:auto`; breakpoint-only grids need `min-w-0` on children or mobile scrolls sideways.
- In-page anchors need a leading `/` (`/#services`), or they break from other routes.
- Tailwind v4 cascade layers: a plain (unlayered) `display:` in a custom class beats `hidden`/`md:*` utilities. That's why `.pill-badge` has no `display`.
- Write source as UTF-8 (a cp1252 em dash once broke the Turbopack build). After `next build`, delete `.next` before `next dev`.
- "Done" = clean `npm run lint` + `npm run build` + looked at in a browser at 390px and 1440px.

---

## 5. Current design system [code, live]

### 5.1 Tokens (`app/(frontend)/globals.css`)
| Token | Value | Where used |
|---|---|---|
| `--color-ink` | `#201e1d` | primary text |
| `--color-paper` | `#f3f2f2` | `<body>`, blog, contact, footer |
| `--color-home-bg` | `#f7f8fc` | homepage `<main>` and `/work/*` (cool white) |
| `--color-ink-soft` | `#6f6b68` | secondary text |
| `--color-accent` | `#ec3013` | blog/contact accent; tag pills; stat numbers |
| `--color-accent-from/via/to` | `#ec3013` / `#a855f7` / `#3b82f6` | **homepage gradient** (`.gradient-bg`, `.gradient-text`) |
| `--color-accent-solid` | `#8b5cf6` | stat numbers (alternating with red) |
| `--color-surface`, `--color-hairline` | `#eae8e6`, `rgba(32,30,29,.1)` | |
| Shadows | `--shadow-soft`, `--shadow-lift` | the only two presets |

There are **two namespaces on purpose** so blog/contact stayed untouched when the homepage was restyled. That is the root of the inconsistency.

### 5.2 Type [live]
Archivo only (weights 400–900; Caveat 500–700 also loaded). Measured on the homepage at 1440px: **H1 60px/66px, weight 800** · **H2 36px/40px, 800** · body 18px/28px in ink-soft. The classes `.text-display` (up to 120px) and `.text-mega` (up to 208px) exist but the homepage H1 does not use them — the "huge headline" in the brief is currently modest.

### 5.3 Shape & surface
Pill badges (`rounded-full`, white, hairline border) above every H2 · cards `rounded-[24px]` white with soft shadow, lift on hover · 48px gradient circle icon tiles (lucide) · gradient pill buttons with inner highlight and coloured glow · `Container` = `max-w-7xl` · section rhythm `py-20 md:py-28`.

### 5.4 Page-wide effects
Homepage `<main>` has a 24px **dot grid**. Site-wide, three **fixed full-viewport overlays**: `.bg-atmosphere` (radial glows), `.grain-overlay` (SVG noise, `mix-blend-mode:multiply`, z-60), `.bg-vignette` (inset shadow, z-61). Header is a sticky glass pill (`backdrop-blur-xl`) that darkens on scroll. Visual consequence: **the header band, blog, contact and footer render on grey-ish `#f3f2f2`, the homepage on cool white `#f7f8fc`** — a visible seam under the header on the homepage.

### 5.5 Motion (not visible in the PDF)
- `Reveal`: opacity 0→1 + 24px rise, once, 80px margin — wraps almost every block.
- Hero: word-by-word headline, highlight "pop" with overshoot easing, floating idle bob on four chips (Google icon, "Meta Ads" pill, two stat cards).
- `Button`: magnetic follow-cursor (pointer-fine only) + spring press.
- `RollingNumber`: odometer digit columns for stats.
- Testimonials: auto-advance every 5.2 s, pause on hover, crossfade.
- Cards: hover lift (`-translate-y-1` + `shadow-lift`).
- Only `Button` consults `useReducedMotion`.

### 5.6 Reusable pieces worth keeping or learning from
`Reveal`, `Container`, `Accordion` (Radix), `Button` (CVA variants), `LogoMark` (SVG), the Lexical → JSX renderer + `.article-body` typography block, `ContactForm`, the influencer wizard (progress bar, autosave to localStorage, XHR upload progress), JSON-LD builders.

---

## 6. Page-by-page inventory [live + code]

Reference: PDF pages 5–16 (homepage sections), 17–19 (mobile), then each other page.

### 6.1 Global shell
- **Header** (`sections/header.tsx`): logo + two-tone wordmark ("RuleScale" ink, "Media" gradient) · nav: **Work · Services · Influencers · Process · FAQ · Blog** (CMS `navigation`; "Work/Services/Process/FAQ" are `/#anchors` on the homepage) · "Start Growing" gradient button → `/contact`. Mobile: hamburger → dropdown card, locks body scroll. **No Escape-to-close, no focus trap, no skip link.**
- **Mobile sticky CTA** (`components/mobile-cta.tsx`): full-width "Start Growing" bar; appears after the hero, hides at final CTA/footer.
- **WhatsApp float:** green 56px circle bottom-right, every page.
- **Footer** (4 columns): logo + blurb + 3 icon-only social links · Services (7 links, 6 are `/#services`) · Company (same as nav) · "Get in touch → Contact us" · © + Privacy / Terms.
  - **[live] Social links and Privacy/Terms all point to `/#top`** (code defaults in `payload/globals/footer.ts`, persisted in the DB).

### 6.2 Homepage (`/`) — 12 sections in this order
| # | Section | What's there | Data source |
|---|---|---|---|
| 1 | **Hero** (683px) | pill "Hi, we're RuleScale Media"; H1 "We grow brands *people remember.*" (gradient on 2nd line); sub-copy; CTAs "Start Growing" / "See Our Work"; trust line "Trusted by 250+ brands…"; 4 floating chips. Noticeable empty band beneath the CTAs at 1440×900 before the next section appears. | `homepage.hero` + `results.stats[2..3]` |
| 2 | **Results** (585) | pill "Proof", H2 "Growth you can measure.", 4 stat cells: 250+ / 18M+ / 5x / 98% with odometer. *The Hero already showed two of these.* | `homepage.results` |
| 3 | **Problem** (548) | "Sound familiar?" 3 cards CHAOS / BURNED / STUCK | `homepage.problem` |
| 4 | **Manifesto** (421) | eyebrow "About" (there is no About page); "Most agencies sell activity. We sell the moment someone *remembers your name.*" | `homepage.manifesto` |
| 5 | **Services** (1431) | "One team. Every channel." 12 equal cards (icon, title, description, red "note" pill). Copy says "Tap any line to see what it actually includes" — a leftover from the old accordion; **cards don't expand or link anywhere.** | `homepage.services` |
| 6 | **Trust strip** (258) | "Our clients have been featured on" + text pills Google/Meta/LinkedIn/Shopify/HubSpot/TikTok/YouTube | `homepage.trustLogos` |
| 7 | **Featured work** (1925) | "Projects we're proud of": grid of portfolio cards (device-mockup thumbnail, client, category pill, result headline, 2-line description, service chips, "View Case Study", external-link icon) + "View All Video Work" | `getFeaturedPortfolioItems()` |
| 8 | **Tools & platforms** (493) | 6 tiles (GA4, GTM, Google Ads, Meta Ads Manager, Looker Studio, Semrush) | **hard-coded** in `sections/tools-stack.tsx` |
| 9 | **Process** (859) | "A plan, not a guess." 5 cards, Discover → Scale, icon + ghost number. (An earlier scroll-drawn zig-zag version was replaced.) | `homepage.process` |
| 10 | **Testimonials** (569) | one rotating quote card + 4 dots. **All 4 live quotes are seeded placeholders** — Priya Anand (Marlow & Finch), Devon Marsh (Northbound Outfitters), Elena Cho and Marcus Webb (Ferra Skincare) — none are portfolio clients. | `testimonials` collection |
| 11 | **FAQ** (822) | 6 accordion rows (answers collapsed) | `homepage.faq` |
| 12 | **Final CTA + form** (1052) | gradient panel "Ready to become the brand everyone remembers?" with email / phone / LinkedIn, beside the full `ContactForm` | `homepage.finalCta` + `siteSettings` + **hard-coded WhatsApp number** |

### 6.3 Other pages
| Page | URL | Notes |
|---|---|---|
| Blog index | `/blog` | "from the team" Caveat eyebrow, H1 "The Blog", search box, 11 category pills, featured post (image slot is a **grey box — posts have no images**), 3-col grid, pagination |
| Blog article | `/blog/[slug]` | centered 3xl column: category pill, H1 (`.text-editorial`), excerpt, byline, body (`.article-body`), TOC, tags, share buttons, related posts, prev/next, newsletter block (**static placeholder, not wired**) |
| Blog category / tag / author / search | `/blog/category/[slug]` … | same grid component; 61 tag pages + 11 category pages |
| Case study | `/work/[slug]` | client + category pill, **H1 = the `resultHeadline`** (so Mylini and Kodai share the identical H1 "SEO Optimized E-commerce Platform"), description, "Visit live site", hero image, rich-text write-up (Overview/Challenge/Solution/SEO Highlights/Outcome), related work |
| Video gallery | `/work/videos` | **empty state**: "No video projects published yet" |
| Contact | `/contact` | Caveat eyebrow "let's talk", H1 "Tell us about your project", promise "within one business day", **`hello@rulescale.media`**, form with 6 inputs + message, 12 service chips and a budget select in **USD** (`Under $5k … $50k+`) |
| Influencer application | `/form/influencer` | 8-step wizard (personal, creator, location, social, audience, collaboration, additional, consent) |
| 404 | any unknown URL | **Next.js default**: white page, "404 | This page could not be found." — no header, footer, or branding |

---

## 7. SEO surface — preserve all of this [code, live]

- `generateMetadata()` everywhere (title template, description, canonical, OG, Twitter); `metadataBase` from `SITE_URL`.
- JSON-LD: Organization, LocalBusiness, Service, FAQPage, BreadcrumbList **site-wide** from `layout.tsx`; plus Article (posts), CreativeWork (`/work/[slug]`), VideoObject (video items). Built by pure functions in `lib/schema/` from the same CMS data the page renders.
- `sitemap.ts` (145 URLs), `robots.ts` (Allow all + sitemap), `rss.xml`, dynamic `icon.tsx` and `opengraph-image.tsx`; portfolio/blog OG images use the real image.
- Single `<h1>` per page, heading hierarchy, semantic landmarks (header/nav/main/footer present).
- **Do not change** existing URL slugs (60 posts, 61 tags, 11 categories, 8 work items) without 301s.

---

## 8. What measured fine [live]

Be fair to the current build — these are strengths to keep:
no horizontal overflow at 390px or 1440px on any of 11 page types · CLS 0 · all images have alt · all form fields labelled · one H1 per page · full metadata + OG + canonical · valid-JSON JSON-LD · LCP of roughly 0.4–2 s on about half the page loads in an unthrottled headless run (others were slower; see §13.1 — the numbers are noisy) · mobile layouts stack cleanly · CMS edits go live in ~2 s · the data layer is clean and typed.

---

## 9. Audit — findings

Severity: **P0** credibility/legal/broken · **P1** high-impact UX, SEO, or a11y · **P2** polish/maintainability.
Evidence tags: [live] measured/observed, [code] read in source.

### 9.1 Trust & content
| # | Sev | Finding | Evidence |
|---|---|---|---|
| C1 | **P0** | **All four rotating testimonials are seeded placeholders** from fictional clients — Priya Anand (Marlow & Finch), Devon Marsh (Northbound Outfitters), Elena Cho and Marcus Webb (Ferra Skincare). None of these companies is in the real portfolio. The three seeded case studies with the same names are also still in the DB. Fabricated testimonials on a marketing site are a credibility *and* advertising-standards risk. | [live] `Show testimonial from …` ×4 in the homepage DOM; [docs] `payload/seed.ts`, `systemstatus.md` §1a |
| C2 | **P0** | **Footer social links (Instagram/LinkedIn/YouTube) and Privacy/Terms all go to `/#top`.** No privacy/terms pages exist, while the site collects personal data in two forms (India DPDP Act applies). | [live] `/privacy`,`/terms` → 404; [code] `payload/globals/footer.ts` |
| C3 | **P0** | **Contact email `hello@rulescale.media`** is shown on the homepage, `/contact`, and used for admin notifications, but the site's domain is `rulescale.in`. If `.media` isn't owned/receiving, enquiries bounce. *(Confirm with owner.)* | [live] `/contact`; [code] `lib/constants.ts` `CONTACT_EMAIL` |
| C4 | P1 | **"Our clients have been featured on Google · Meta · LinkedIn · Shopify · HubSpot · TikTok · YouTube"** is text pills, no logos, no real press. Reads as a false endorsement claim. Same for the decorative Google icon and "Meta Ads" chip in the hero. | [live]/[code] `trust-logos.tsx`, `hero.tsx` |
| C5 | P1 | **Unverifiable headline claims**: "250+ projects / 18M+ reach / 5x ROAS / 98% retention / Trusted by 250+ brands" vs 8 public portfolio items. No source, no case-study backing. | [live] |
| C6 | P1 | **Currency mismatch**: FAQ quotes "$3,000–$15,000/month"; the contact budget select is in USD; JSON-LD `priceRange: "$$$"`. Audience and the blog are India-first (₹). | [live]/[code] |
| C7 | P1 | **Portfolio data is unfinished**: card 5's *client* label says **"Mylini"** while its image, alt text and live link are **Junefourteen**; the client fields "Pickanddrop logicsitcs" (typo), "packpetti" and "ponwins" are mis-cased/misspelled; **Junefourteen, Pick&Drop, Packpetti and Ponwins have no description, result headline or category** (so those four cards are half-height and uneven); Mylini and Kodai Golden Honey share the identical result headline; the sitemap includes `/work/landing page` (a URL with a **space**) and `/work/e-commerce-site` (generic; probably two of these four items, inferred from order). | [live] homepage §7, sitemap |
| C8 | P1 | "**View All Video Work**" button leads to an empty page. | [live] `/work/videos` |
| C9 | P1 | **Local-SEO mismatch**: the blog is hyper-local (Dindigul, Coimbatore) but the homepage has no local signal (no city, address, areas served, map) and does not surface the blog at all. | [live] |
| C10 | P2 | Hero sub-copy "Marketing that actually moves businesses." and Services "Tap any line…" are generic/stale; Manifesto eyebrow says "About" with no About page. | [live] |
| C11 | P2 | The Hero and Results both show 5x and 98% (duplication). | [live] |
| C12 | P2 | Newsletter block on blog posts is a static placeholder (no signup). | [docs] |

### 9.2 Design & UX
| # | Sev | Finding | Evidence |
|---|---|---|---|
| D1 | **P1** | **Template sameness.** Sections 2–11 all use the same recipe: centered pill badge → centered H2 → white rounded card grid, same spacing. This directly contradicts the brief ("every section deliberately composed, not stamped from the same layout"). | [live] PDF pp. 5–16 |
| D2 | **P1** | **Two visual systems = two sites.** Homepage/`/work` (cool-white, gradient, pills) vs blog/contact/influencer (paper-grey, hand-font eyebrows, red accent, doodles). Nav and footer are shared but everything between them changes personality. | [live] |
| D3 | **P1** | **Brand drift.** Purple `#a855f7` and blue `#3b82f6` are not in the brand mark; "one accent colour" is the brand's stated principle. The gradient is the single most "generic SaaS" element on the site. | [code]/[live] |
| D4 | P1 | **Hero is weak.** 60px headline (brief asks "huge"), centered text only, no visual proof (no work, no product, no people); the four floating chips are decorative/implied-endorsement; a noticeable empty band under the CTAs at 1440×900; hero stats duplicate §2. | [live] |
| D5 | P1 | **Strongest asset is buried.** The portfolio mockups are the best visuals on the site yet sit ~6,000px down; nothing visual appears above the fold. | [live] |
| D6 | P1 | **Services = 12 undifferentiated equal cards**, no hierarchy (core vs secondary), no links, no detail pages, no outcomes/pricing signals. | [live] |
| D7 | P1 | **IA gaps:** no `/work` index (nav "Work" jumps to a homepage anchor), no `/services`, `/about`/team (no faces anywhere — for a trust-driven agency), `/pricing`, FAQ page, privacy/terms. | [live] 404s |
| D8 | P1 | **Mixed funnels in the primary nav.** "Influencers" (a creator-recruitment form — a different audience from clients) sits beside client nav items; the same applies to the footer "Services" column. | [live] |
| D9 | P1 | **Blog has no imagery.** 0 `<img>` on blog index/category pages; every card and the featured slot is a grey box. 60 posts × grey boxes = the blog looks unfinished. | [live] `imgs=0`; PDF pp. 20–27 |
| D10 | P1 | **Contact form is long for a first touch**: name, email, phone, company, website, budget, 12 service chips, message — and it is embedded in the homepage footer. Budget options in USD. | [live] |
| D11 | P2 | **Branded 404 / error / loading missing.** | [live] |
| D12 | P2 | **Overlay stack** on mobile: header + floating WhatsApp (bottom-right) + sticky "Start Growing" bar compete for the same thumb zone. | [live] mobile |
| D13 | P2 | **Header/body colour seam** on the homepage (header zone `#f3f2f2` over a `#f7f8fc` page). | [live] hero screenshot |
| D14 | P2 | Testimonials: a single rotating card (4 quotes, all placeholders — see C1) is a weak social-proof pattern for the section that should carry the most weight. | [live] |
| D15 | P2 | Process cards leave an orphan row/blank cell (5 items in a 3-col grid); Featured-work grid has uneven card heights because four items lack copy (C7). | [live] |
| D16 | P2 | Blog typography is fine but plain: no pull-quotes, callouts, author card with photo, or reading-progress. | [live] |

### 9.3 Accessibility (WCAG 2.2 AA lens; automated axe was not run — these come from computed contrast + code review)
| # | Sev | Finding | Evidence |
|---|---|---|---|
| A1 | P1 | **Contrast failures** (computed): red `#ec3013` text on its 10% tint pills = **3.6:1** (needs 4.5); white text on the gradient = **3.7–4.2:1** at its purple/blue/red stops (buttons are 16px semibold — not "large text"); white/80 sub-copy on the CTA gradient ≈ **3.3:1**; `ink-soft/60` placeholders low. Passing: ink on white 16.6, ink-soft on `#f7f8fc` 4.97, ink-soft on `#f3f2f2` 4.72. | [code] computed |
| A2 | P1 | **Focus visibility on form fields**: inputs use `focus:outline-none` and only change border to `accent/40` — a weak indicator (WCAG 2.4.7 / 1.4.11). Buttons do have a focus ring. | [code] `contact-form.tsx`, `forms/influencer/field.tsx`, `search-box.tsx` |
| A3 | P1 | **Auto-rotating testimonial** advances every 5.2 s with pause only on mouse hover — no pause on keyboard focus, no stop control (WCAG 2.2.2). | [code] `testimonials.tsx` |
| A4 | P1 | **Reduced motion is largely ignored.** Only `Button` calls `useReducedMotion()`. The global CSS `prefers-reduced-motion` rule shortens CSS animations/transitions but does not stop Framer Motion JS animation (Reveal, Hero, Manifesto, Testimonials, RollingNumber). | [code] grep |
| A5 | P1 | **Mobile menu**: no Escape key, no focus trap/return, no `aria-controls`. No **skip-to-content** link anywhere. | [code] `header.tsx` |
| A6 | P2 | **Odometer exposes digit columns**: `RollingNumber` renders 0–9 columns per digit into the DOM; `aria-label` is set on a generic `span` (not reliably announced), so screen readers/crawlers can read "0123456789…". Confirmed in the page's text content. | [live]/[code] |
| A7 | P2 | **Footer social links** are icon-only to `/#top` (labelled, but dead). | [live] |
| A8 | P2 | **Tap targets**: 50 (desktop) / 45 (mobile) interactive elements on the homepage are under 44×44 CSS px (many are inline text links; the WCAG 2.2 AA floor is 24px, so this is an HIG/AAA concern, not a failure). | [live] measured |
| A9 | P2 | Opacity-0 initial states are rendered in SSR HTML; with JS disabled/blocked, below-the-fold content stays invisible. | [code] `reveal.tsx` |

### 9.4 SEO
| # | Sev | Finding | Evidence |
|---|---|---|---|
| S1 | P1 | **`FAQPage` JSON-LD on every page** (including blog articles and the contact page) although the FAQ is only visible on the homepage — Google's guidance requires FAQ markup to match visible page content. Same for `Service`/`LocalBusiness` site-wide. | [live] JSON-LD types per page |
| S2 | P1 | **LocalBusiness schema is incomplete**: no `address`, `telephone`, `areaServed`, `geo`, `openingHours`; `priceRange:"$$$"`; `logo`/`image` point to **`/icon.svg`, which 404s**. For a Tamil Nadu-focused agency this is the biggest missed local-SEO lever. | [code] `lib/schema/index.ts`; [live] `/icon.svg` → 404 |
| S3 | P1 | **Sitemap contains an invalid URL** `https://www.rulescale.in/work/landing page` (space) and a generic `/work/e-commerce-site`. | [live] sitemap |
| S4 | P1 | **Thin/duplicate landing surface**: no service pages, no location pages, no `/work` hub; 61 tag archives for 60 posts (mostly 1-post tags) are likely thin, near-duplicate pages. | [live] sitemap |
| S5 | P2 | Mylini and Kodai Golden Honey case studies share an identical **H1** ("SEO Optimized E-commerce Platform"). Their `<title>` tags are unique (e.g. "Mylini \| Building an SEO-Optimized E-commerce Experience…"), so the damage is limited to H1/card headline duplication. | [live] |
| S6 | P2 | No `llms.txt`; `/favicon.ico` 404 (browsers use the `<link rel=icon>` so this mainly affects crawlers/bookmarks). | [live] |
| S7 | P2 | FAQ answers are collapsed (Radix) — present in JSON-LD, not in the initial DOM text. | [live] |
| S8 | P2 | Homepage does not link to the blog or any post → 60 articles get link equity only from `/blog` and the nav. | [live] |

### 9.5 Performance
Honest caveat: my runs were **unthrottled headless Chromium on a shared Windows machine**; LCP swung widely between runs (homepage mobile 1.8 s in one run, 6.2 s in another), so treat numbers as indicative. What is solid:
| # | Sev | Finding | Evidence |
|---|---|---|---|
| P1 | P2 | Homepage HTML is ~228 KB raw (5 JSON-LD blocks, RSC payload, odometer digit DOM); 65 requests; 13 source files import Framer Motion (the animation runtime ships on every page). | [live] |
| P2 | P2 | Three full-viewport fixed layers (multiply-blend grain, vignette, atmosphere) plus `backdrop-blur-xl` header force continuous compositing while scrolling. During my first automated capture, headless Chromium crashed once while scrolling the homepage (not reproduced on retry; **cause unproven**). Worth profiling on a mid-range Android before keeping them. | [code]/[live] |
| P3 | P2 | GTM is loaded `beforeInteractive`; `afterInteractive`/`lazyOnload` would not delay hydration. | [code] `layout.tsx` |
| P4 | P2 | 9 font weights loaded (Archivo 400–900 ×6 + Caveat ×3); a variable font would cut requests. Caveat is no longer used on the homepage. | [code] |
| P5 | P2 | Every page makes one request that failed name resolution in my environment (probably a third-party tag; **unverified**). Not a site bug by itself. | [live] |

### 9.6 Engineering & maintainability
| # | Sev | Finding | Evidence |
|---|---|---|---|
| E1 | P1 | **Docs drift.** `systemstatus.md` §4 documents the *pre-redesign* homepage; §8 still cites Next 15.5.21; `CLAUDE.MD` says 11 sections (live: 12) and describes the doodle system as current; `currentphase.md` last updated 2026-08-05; `handover.md` says Fairyland is draft but it is live and featured. An AI reading the docs alone will build against the wrong picture — **trust this brief and the code over those docs.** | [docs] vs [code]/[live] |
| E2 | P1 | **Hard-coded copy contradicts the repo's own rule** ("never hardcode marketing copy in a section"): Tools & Platforms list, final-CTA labels, WhatsApp number (in 2 files), hero chips. | [code] |
| E3 | P2 | **Dead code / dead data**: `sections/case-studies.tsx`, `components/hero-collage.tsx`, `Spotlight`, `Marquee`, `text-mega`, `.bg-dot-grid`, the `case-studies` collection + 3 fake entries, 5 hidden placeholder collections, `HandArrow`/`PaperClip`/`ScribbleUnderline` on the homepage path. | [code] |
| E4 | P2 | **Two token namespaces** force every new component to pick a system; many arbitrary values like `bg-[var(--color-accent)]/10`. | [code] |
| E5 | P1 | **No automated tests, no CI.** Verification is manual; before this capture, no Playwright/visual QA had ever been run site-wide. | [docs] |
| E6 | P1 | **One shared database for local dev and production.** A redesign that touches CMS schema, or a dev script, can break prod. Needs a staging DB/branch before any schema work. | [docs] |
| E7 | P2 | Workspace clutter: untracked `l.html`, `live.html` (saved page dumps), `sites/` (SEO research data) at repo root; `media/dosa ghee.mp4` untracked. | [code] `git status` |
| E8 | P2 | `lib/cms/*` homepage getters fall back to **fabricated placeholder content** (Marlow & Finch etc.) if the DB is down — the fallback itself ships fake testimonials/case studies. | [code] `lib/constants.ts` |

### 9.7 Top 10 to fix first (regardless of redesign direction)
1. Remove the four placeholder testimonials + the fake case-study fallbacks (C1, E8).
2. Make footer social links real; publish Privacy + Terms pages (C2).
3. Confirm/fix the contact email domain (C3).
4. Stop implying endorsements: replace the "featured on" pills with real logos/press or delete (C4).
5. Back or remove the 250+/18M+/5x/98% claims (C5).
6. Fix portfolio data: wrong client label, typos, missing descriptions/headlines, the `/work/landing page` slug (C7, S3).
7. Add real featured images to blog posts (D9).
8. Scope JSON-LD per page (FAQ only where visible) and complete LocalBusiness (S1, S2).
9. Contrast + focus + reduced-motion + testimonial pause + skip link (A1–A5).
10. Branded 404/error pages (D11).

---

## 10. Redesign plan (recommendation — needs the owner's answers in §12)

### 10.1 Principles
1. **One system, every page.** Retire the two-namespace split. Blog, contact, influencer, work, and home share one token set.
2. **Proof above the fold.** Lead with real work and real numbers; the portfolio imagery is the best asset.
3. **Compose, don't stamp.** Vary section layouts (full-bleed, asymmetric split, editorial index, horizontal scroller, big-type statement). Max one card-grid pattern per 3 sections.
4. **India-first, locally specific.** ₹, city names, WhatsApp-first contact, Tamil-English awareness.
5. **Earn trust honestly.** Only claims the owner can back; show faces.
6. **Accessible and light by default.** Motion that respects `prefers-reduced-motion`; fewer always-on layers.

### 10.2 Recommended direction (default if the owner has no strong preference)
Return to the **original brief**: premium editorial minimalism on ink / paper / **one red**, Archivo (variable), large confident type (`.text-display` scale), generous whitespace, asymmetric grids, hand-drawn accents at ≈10% (a scribble underline, one sticky-note quote, margin notes in Caveat — used with restraint). Drop purple/blue entirely. This (a) matches the brand mark and `CLAUDE.MD`, (b) resolves D1–D3 in one move, and (c) lets blog/contact stay largely as-is while the homepage catches up.

### 10.3 Proposed information architecture
```
/                 Home (story: promise → proof → how we think → what we do → work → people → talk)
/work             NEW  Work index (filter by service/industry) → /work/[slug] (richer case studies)
/services         NEW  Overview + /services/[slug] for the top 4–6 (SEO, Website, Performance, Social, Video, Influencer)
/about            NEW  Team, story, values, location(s)  ← faces = trust
/pricing          OPTIONAL  Ranges in ₹ + how engagements work (or fold into /services)
/blog …           keep URLs; add featured images, pillar hubs, author card
/contact          keep; shorter form, WhatsApp + call as first-class
/creators         RENAME of /form/influencer, moved out of the client nav into the footer/secondary nav (301 from old URL)
/privacy /terms   NEW (required)
/404 /error       NEW branded
```
Primary nav (client-focused): **Work · Services · About · Blog · Contact**, CTA "Start Growing". Creators link in footer.

### 10.4 Homepage section-by-section recommendation
| Now | Proposed |
|---|---|
| 1 Hero (centered text, chips) | **Split or full-bleed hero** with the promise at display scale + a live work collage/loop of real client mockups; one CTA pair; one proof line backed by a real stat |
| 2 Results | Fold into hero proof strip or a bold full-width stat band, only verifiable numbers |
| 3 Problem | Keep the *idea* (it is on-brand) but as an editorial 3-voices layout, not 3 identical cards |
| 4 Manifesto | Full-viewport statement, scroll-revealed, the page's emotional pivot |
| 5 Services | **Editorial index** (the earlier accordion idea, with real links to `/services/*`), core vs supporting |
| 6 Trust strip | Real client logos from the 8 case studies (they have them) — drop Google/Meta/etc. text pills |
| 7 Featured work | Promote higher; big alternating case-study rows with outcome metric; link to `/work` |
| 8 Tools | Merge into Process or footer-level credibility line; CMS-driven or removed |
| 9 Process | Keep as a horizontal timeline with the hand-drawn connector from the brief |
| 10 Testimonials | Real quotes with face + company + logo, multiple visible at once; no auto-rotate |
| NEW | **Latest from the blog** (3 posts) + a local-presence block (city, map, areas served) |
| 11 FAQ | Keep; render answers in DOM; page-scoped FAQ schema |
| 12 Final CTA + form | Short form (name, email/phone, one-line need) + WhatsApp as the primary alternative; long form lives at `/contact` |

### 10.5 Phases (suggested order)
| Phase | Goal | Deliverables | Gate |
|---|---|---|---|
| **0. Decisions & hygiene** | Remove credibility liabilities before any pixels | Answers to §12; staging DB/branch; fix C1–C3, C7, S3; delete placeholder data | Owner sign-off |
| **1. Design system** | One token set + component kit | New `globals.css` tokens, type scale, Button/Card/Badge/Section/Container primitives, motion presets with reduced-motion, a11y-checked colour pairs | Style guide page renders at 390/1440 |
| **2. Homepage** | New composed homepage | 12→~10 sections per §10.4, same CMS types where possible (additive fields only) | Lighthouse + manual QA |
| **3. Core pages** | IA expansion | `/work`, `/services/*`, `/about`, `/privacy`, `/terms`, 404/error; richer `/work/[slug]` | |
| **4. Blog & forms** | Bring remaining surfaces onto the system | Blog index/article redesign with images, author card; shorter contact form; creators page | |
| **5. SEO/a11y/perf hardening** | Prove it | Per-page JSON-LD, complete LocalBusiness, axe + Lighthouse CI, Playwright screenshots at 390/1440, 301 map | Clean `lint` + `build` + test pass |

### 10.6 Constraints the new design must honour
- Keep `lib/cms/types.ts` shapes (add fields; don't rename/remove) and getter signatures, or migrate with a reviewed Payload migration (shared DB!).
- Keep all existing URLs and slugs; 301 anything renamed. Keep `SITE_URL` as the single domain source.
- Keep `/api/contact`, `/api/influencer*`, `/api/content/*` request/response contracts.
- Keep draft preview working; keep every public query filtered on `_status: published`.
- Keep Tailwind v4 CSS-first; no `tailwind.config.js`. Keep `Button` a client component.
- New copy must be CMS-driven with a brand-voice `defaultValue` — no Lorem, no invented clients or stats.

### 10.7 Definition of done
Clean `npm run lint` + `npm run build`; Playwright screenshots at 390 and 1440 for every page type with zero horizontal overflow and zero console errors; axe-core: no serious/critical; keyboard-only pass of nav, mobile menu, forms, accordion; Lighthouse mobile ≥ 90 performance / ≥ 95 accessibility / ≥ 95 SEO on home, a blog post, and a case study; JSON-LD validates in Google's Rich Results test; no URL that returned 200 before now returns 404.

---

## 11. Prompt to paste into Claude / ChatGPT

> You are a senior product designer + Next.js engineer. I'm attaching (1) `SITE-BRIEF.md` and (2) a PDF of screenshots of the live site https://www.rulescale.in (desktop 1440px and mobile 390px). Read the brief fully first.
>
> Do not write code yet. Step 1: restate in ≤10 bullets what the site is, what's wrong with it (use the audit IDs), and what you must not break (§10.6). Step 2: ask me the open questions in §12 that you cannot answer yourself. Step 3: after I answer, propose **two** distinct visual directions (name, 1-paragraph rationale, palette, type scale, a described homepage hero + one section layout) and recommend one. Step 4: only after I pick, produce the design system, then the homepage, then the remaining pages, one phase at a time (§10.5), pausing for my review after each.
>
> Rules: one accent colour at most unless I approve a change; Archivo for type; never invent clients, testimonials, or statistics — use placeholders clearly marked `TODO(owner)`; India-first (₹); WCAG 2.2 AA; respect `prefers-reduced-motion`; Tailwind v4 CSS-first; keep CMS data shapes and URLs.

---

## 12. Open questions for the owner (answer before design starts)

1. **Direction:** return to the original brief (ink / paper / one red, editorial + hand-drawn warmth), keep the current red→purple→blue gradient look, or something new?
2. **Positioning:** India-wide, Tamil Nadu-local, or global? (Drives currency, copy, schema, local pages.)
3. **Proof inventory:** which real client logos, testimonials (with names/photos/permission), and verifiable numbers can be shown? Are 250+ / 18M+ / 5x / 98% true and documentable?
4. **People:** can the team be shown (photos, names, roles)? Is there an office address for schema/footer?
5. **Contact:** is `hello@rulescale.media` a working mailbox? Which email/phone/WhatsApp are canonical?
6. **Scope:** are new pages (`/work`, `/services/*`, `/about`, `/pricing`, legal) in scope? Any pages to retire (e.g. the creator form)?
7. **CMS:** may schema change (new fields/collections) — and can a staging Supabase branch be created so dev stops sharing the production DB?
8. **Blog:** generate featured images for the 60 posts? Keep all 61 tags or consolidate?
9. **Legal:** who supplies the Privacy Policy and Terms?
10. **Timeline / budget / launch constraints** (festival season, campaign dates)?

---

## 13. Appendix

### 13.1 Measured data per page [live, 2026-11-22; headless Chromium, unthrottled, indicative]
| Page | Desktop height | Mobile height | LCP d / m (ms) | Requests (d) | Interactive <44px (d) |
|---|---|---|---|---|---|
| `/` | 10,215 | 17,569 | 4,480 / 6,208 | 65 | 50 |
| `/blog` | 3,294 | 7,124 | 1,508 / 7,428 | 79 | 40 |
| `/blog/best-digital-marketing-agency-india-2026` | 5,681 | 9,655 | 2,004 / 1,912 | 50 | 40 |
| `/blog/category/seo` | 2,642 | 6,442 | 6,584 / 1,960 | 59 | 29 |
| `/blog/author/rulescale-media-team` | 2,638 | 6,495 | 1,508 / 2,072 | 59 | 29 |
| `/blog/search?q=seo` | 2,100 | 4,739 | 4,540 / 3,552 | 50 | 27 |
| `/work/mylini` | 4,640 | 5,420 | 2,004 / 5,452 | 41 | 28 |
| `/work/videos` | 937 | 1,549 | 912 / 756 | 37 | 27 |
| `/form/influencer` | 1,632 | 2,451 | 1,512 / 936 | 35 | 35 |
| `/contact` | 1,738 | 2,617 | 756 / 1,148 | 35 | 40 |
| 404 | 900 | 844 | 476 / 380 | 10 | 0 |

LCP varied run-to-run by several seconds on the same page; do not use these as a performance baseline — re-measure with Lighthouse/WebPageTest on throttled mobile before and after.

### 13.2 Homepage text, verbatim (for copy review)
- H1: *We grow brands people remember.* — Sub: *Marketing that actually moves businesses. We pair sharp strategy with website design, SEO, social, influencer, and video production — so growth isn't left to chance.* — Trust line: *Trusted by 250+ brands across DTC, hospitality, SaaS, and retail.*
- Results: *Growth you can measure. Every engagement is measured against outcomes we agree on before we start — no vanity metrics.*
- Problem: *Sound familiar?* — "My website gets traffic… but nobody converts." / "I've tried agencies before." / "We post on social media… but nothing happens."
- Manifesto: *Most agencies sell activity. We sell the moment someone remembers your name. That's the only metric that compounds.*
- Services: *One team. Every channel.* Process: *A plan, not a guess.* FAQ: *Everything you're wondering.* Final CTA: *Ready to become the brand everyone remembers? Tell us where you're stuck. We'll tell you exactly how we'd fix it — no obligation, no jargon.*
- FAQ facts stated on site: results in 2–4 weeks (paid) / 3–6 months (SEO); engagements start **$3,000–$15,000/month** (separate from ad spend); **month-to-month after a 90-day onboarding**.

### 13.3 Where to look in the repo
| Need | File |
|---|---|
| All design tokens + custom CSS | `app/(frontend)/globals.css` |
| Page composition | `app/(frontend)/page.tsx`, `layout.tsx` |
| Any homepage section | `sections/<name>.tsx` |
| Primitives | `components/ui/*`, `components/doodles/*` |
| CMS getters + types | `lib/cms/*`, `lib/cms/types.ts` |
| Fallback copy | `lib/constants.ts` |
| Schema/JSON-LD | `lib/schema/index.ts`, `lib/seo/metadata.ts` |
| CMS schema | `payload/collections/*`, `payload/globals/*`, `payload.config.ts` |
| Content API | `Architecture files/content-api.md`, `app/(frontend)/api/content/*` |
| Voice/SEO for copy | `Architecture files/blogcontentbrief.md` |
| History + gotchas | `Architecture files/CHANGELOG.md`, `AGENT.md`, `handover.md` |
| Brand mark | `claude files/logo.png`, `components/doodles/logo-mark.tsx` |

### 13.4 Known limits of this audit
- Screenshots show the **production** site as of 2026-11-22 and could differ from `main` if something is un-deployed.
- No automated accessibility engine (axe) or Lighthouse run — a11y findings come from computed contrast and code review; performance numbers are unthrottled and noisy.
- Motion, hover, and the mobile menu open-state were read from code, not captured.
- I did not log into `/admin`, so CMS-only content (e.g. unpublished drafts, testimonial entries beyond the one rendered) was not inspected directly.
- The contact form was **not** submitted (it would create a real lead in the production database).
