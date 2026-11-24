# Performance & Responsiveness Audit

Date: 2026-11-24. Scope: whole site (home, `/contact`, `/blog` + posts, `/work/*`, `/work/videos`,
`/form/influencer`). Measured against a local production build (`next start`) with real CMS data,
Playwright (Chromium / Firefox / WebKit), no network throttling.

## 1. Audit plan (what was checked, in order)

| # | Area | How it was checked |
|---|------|--------------------|
| 1 | Rendering mode per route (static / ISR / dynamic) | `next build` route table |
| 2 | Cold vs warm response time of detail pages | `curl` TTFB on first and repeat hits |
| 3 | Client JS weight and what ships to every page | chunk sizes per page, search for framework/library code |
| 4 | First paint / LCP / CLS | PerformanceObserver in Chromium, mobile (Pixel 5) and 1440 desktop |
| 5 | Images (priority, sizes, cache TTL, Cloudinary) | source review + served HTML |
| 6 | Third-party scripts (GTM) | `layout.tsx` review |
| 7 | Data layer caching and DB connection use | `lib/cms/*`, build log for `EMAXCONNSESSION` |
| 8 | Responsive layout and cross-browser | 3 engines x 5 viewports (360, 390, 768, 1024, 1440) x 7 pages: overflow, broken images, console errors, h1 count, content stuck hidden |
| 9 | Visual regression | screenshots at 390 and 1440 |
| 10 | Static checks | `tsc --noEmit`, eslint on changed files, build log |

## 2. Findings and what was done

| Finding | Impact | Action | Status |
|---------|--------|--------|--------|
| Post, case-study and video detail pages rendered on every request; first hit paid Payload start-up + DB (0.65 s to 4 s) | Slow first response for most pages in the sitemap | `generateStaticParams` + `revalidate = 900` on `blog/[slug]`, `work/[slug]`, `work/videos/[slug]`. 62 posts + 8 case studies are now prerendered; unknown slugs still render on demand. Returns `[]` if the DB is unreachable at build. | Done. Detail pages now 10-40 ms. |
| `Reveal` (used on 26 blocks) was built on Framer Motion and started at `opacity: 0` in the HTML | ~150 KB of animation JS on every page; headings/hero hidden until hydration (hurts FCP/LCP, invisible with JS off) | Rewritten as CSS + `IntersectionObserver`. Content is visible in the server HTML and when already on screen; only below-the-fold blocks fade in once. Reduced motion: nothing is hidden. Framer Motion now only loads on `/form/influencer`. | Done. |
| Lead image of the Work section marked `priority` while far below the fold (same image as the hero tile) | Competes with the real LCP image for bandwidth | Removed `priority`. | Done. |
| GTM loaded `beforeInteractive` | Render-blocking-ish early script | `afterInteractive` (still loads on every page; first event fires slightly later). | Done. |
| Image optimiser cache TTL was the 4-hour default; unversioned `/logo.png` served with no caching | Repeated optimiser/Cloudinary hits; logo refetched | `images.minimumCacheTTL` 30 days; `/logo.png` cached 7 days + SWR. | Done. |
| Smooth-scroll route-transition warning in the console | Noise / scroll glitches on navigation | `data-scroll-behavior="smooth"` on `<html>`. | Done. |
| `X-Powered-By` header, unused-icon imports | Minor | `poweredByHeader: false`, `optimizePackageImports` for lucide and Radix accordion. | Done. |
| Static generation of ~70 pages vs a 15-session Postgres cap | First attempt (2 workers x 4) hit `EMAXCONNSESSION` and baked posts without prev/next links | Build limited to 1 worker, concurrency 1 (`next.config.ts`). Rebuilt: 0 DB errors, 93 pages in 46 s. | Done. |

## 3. Results (production build, local, unthrottled)

| Metric | Before | After |
|--------|--------|-------|
| Detail page, first request (TTFB) | 0.65 s to 4.2 s | 10-40 ms |
| JS transferred per page (raw) | ~723-755 KB | ~607-644 KB (-100 to -110 KB) |
| Requests, home (mobile / desktop) | 40 / 49 | 45 / 53 (see note) |
| Mobile home LCP (cold) | 4.7 s | 0.25 s (image cache was cold before, warm after: treat as indicative, not a like-for-like) |
| CLS | 0.000 | 0.000 |

Note: the request count is not lower; the second measurement ran after the image optimiser cache
was warm and counted more `_next/image` variants. Treat request count as unchanged.

Cross-browser matrix (Chromium, Firefox, WebKit; 360/390/768/1024/1440 wide; 7 pages): no horizontal
overflow, no broken images, no console errors, exactly one `<h1>` per page, nothing left hidden
after scrolling. `tsc` clean; eslint clean on changed files.

## 4. Not done / backlog (needs a decision or a separate pass)

1. **Blog category, tag, author and search pages are still dynamic** because pagination reads
   `?page=`. `/blog` itself was fixed (2026-11-24, follow-up): page 1 is static and
   `/blog?page=N` is rewritten in `next.config.ts` to the prerendered `/blog/page/[page]`, so URLs
   are unchanged (shared body in `components/blog/blog-index.tsx`). The same pattern can be applied
   to the category/tag/author archives; search must stay dynamic.
2. **~600 KB of JS** remains; most of it is React 19 + the Next.js client runtime (~365 KB raw).
   Remaining app-level candidates: the Radix accordion in the FAQ and `lucide-react`. Gains are small.
3. **No Lighthouse / axe / real-device run** and no network throttling; numbers above are local.
   Run Lighthouse (mobile, throttled) on the deployed preview before trusting the absolute values.
4. **Cloudinary originals are fetched at full size by the optimiser**; adding `w_`/`q_auto` to the
   stored URLs would cut the first (cold) image fetch. Needs an upload-pipeline change.
5. **JSON-LD** still emits `FAQPage`/`Service`/`LocalBusiness` on every page and points `logo` at
   `/icon.svg` (404). SEO infrastructure, left alone (see `handover.md`).
6. **Brand device** (giant ring + bolt) is an inline SVG on three sections; fine, but it is the
   heaviest decorative node on the home page if INP ever becomes a concern.
7. **Pages baked while the DB is unreachable** show missing prev/next/related until the 15-minute
   revalidate or a CMS save. Check the build log for `EMAXCONNSESSION` / `falling back to constants.ts`
   before deploying; the DB cap is shared with production traffic.
