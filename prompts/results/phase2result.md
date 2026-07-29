# Phase 2 Result — Blog / Publishing Platform

Executed against `prompts/backend/phase2.md`. Status: **complete and verified against the live
Supabase database** for data/query/caching/draft-preview correctness. **Not** verified with real
browser tooling (no Playwright/browser-automation tool was available this session) — see "Known
gap" at the end.

No homepage or existing-page UI changed. The only touches near existing surface are a new "Blog"
nav link and generalizing `breadcrumbSchema()` to accept an optional trail (defaults to exactly
its previous single-item output, so the homepage's call site is unaffected).

---

## What changed

**Data model.** New `tags` collection (`title`/`slug`, mirrors `categories`, admin-only writes).
`authors` was missing a `slug` field required for `/blog/author/[slug]` — added. `posts` gained
`tags` (relationship, hasMany), `featured` (checkbox), a `seo` group (meta title/description,
canonical URL, OG image, Twitter image), and `admin.preview` → `/blog/${slug}`. "Updated date" and
"draft/published status" from the brief are Payload's existing built-in `updatedAt` and
`_status` — no new fields needed for those. Reading time and the table of contents are computed
at read time from the Lexical JSON (`lib/blog/reading-time.ts`, `lib/blog/toc.ts`), not stored,
so they can't drift from the actual content.

**Caching.** Three tag shapes: `posts` (any list-shaped read — index, search, pagination,
archives, RSS, sitemap, related posts, prev/next), `post-<slug>` (single article, precise
invalidation on save or slug rename), `taxonomy` (categories+tags+authors, shared since they're
small and rarely edited). Posts/Categories/Authors/Tags each got `afterChange`/`afterDelete` hooks
calling `revalidateTagSafely()`, same pattern as Phase 1.5.

**Routes** (`app/(frontend)/blog/`): index, `[slug]` article (metadata per-post falling back to
site SEO settings, hero/byline/reading-time/rich-text body/TOC/related posts/prev-next/share
buttons/newsletter placeholder, `Article` + `BreadcrumbList` JSON-LD), `category/[slug]`,
`tag/[slug]`, `author/[slug]` archives, `search` (plain GET form, no client JS), `rss.xml`
(hand-built RSS 2.0, `revalidate: 3600`). `sitemap.ts` extended with posts/categories/tags/authors.
No `generateStaticParams` anywhere — posts stay on the same dynamic-route-plus-tag-cache model
already proven in Phase 1.5, so an admin save shows up live without a rebuild.

**Rich text rendering.** `ArticleContent` reuses `@payloadcms/richtext-lexical/react`'s default
JSX converters for every node type except `heading` (overridden to inject TOC-matching anchor
ids) — verified the actual installed converter signatures before writing this rather than
reimplementing list/link/upload/blockquote handling. Styled via a `.article-body`
descendant-selector CSS block, matching this project's existing convention for un-classed markup.

**Draft preview.** Reuses the Phase 1.5 `/next/preview` / `/next/exit-preview` routes unchanged —
they already accepted an arbitrary `path` query param. `getPostBySlug()` branches on `draftMode()`
before the cache layer, same pattern as `getHomepage()`.

**Nav link.** Added `{label: "Blog", href: "/blog"}` to `payload/globals/navigation.ts`'s
`defaultValue`. No live-database patch was needed — see "real issues found" below.

**New UI** (`components/blog/`): PostCard, FeaturedPost, CategoryPill, AuthorByline,
TableOfContents (static anchor list, not scroll-spy — not asked for), RelatedPosts, PostNavigation,
ShareButtons (X/LinkedIn/Facebook share-intent links + copy-link button; generic `ExternalLink`
icon in place of brand logos, since this lucide-react version has none — same precedent as
`sections/footer.tsx`), NewsletterCta (static placeholder, matching Phase 1's explicit newsletter
deferral — no signup wiring), SearchBox, Pagination, ArticleContent, PostGrid.

---

## Real issues found and fixed along the way

1. **Payload's `draft` find option does not filter by `_status` — a real, shipped-then-caught
   bug.** The working assumption was that omitting `draft` (or passing `draft: false`) on a
   `find()`/`findByID()` against a versioned collection automatically excludes documents whose
   current `_status` is `"draft"`. It doesn't — that option controls which version's *content*
   comes back, not whether the document is included at all. Caught during live verification: a
   draft-only test post appeared in the blog index, pagination totals, related posts, and the RSS
   feed, and was directly fetchable at its URL (`200`, should have been `404`). Fixed by adding an
   explicit `{_status: {equals: "published"}}` filter to every public-facing query in
   `lib/cms/posts.ts`. Re-verified afterward: `404` on direct fetch, absent everywhere public,
   correctly visible only through the authenticated preview flow.
2. **The `navigation` global was never actually saved through `/admin`.** The plan assumed adding
   the nav link would need a live-document patch (matching the Phase 1.5 admin-role bootstrap
   pattern), since Phase 1 seeded real homepage content. Checking directly (`GET
   /api/globals/navigation` twice, watching the array items' `id`s change between calls) proved
   the document has no persisted row — Payload was returning `defaultValue` fresh every read. So
   editing the config's `defaultValue` was sufficient by itself.
3. **My own seed script under-specified publish status.** `payload.create()` on `posts` (a
   `versions.drafts: true` collection) defaults new documents to `_status: "draft"` unless you
   explicitly set it — omitting the `draft` option is not the same as publishing. The 10 intended
   "published" test posts were created as drafts by mistake; caught mid-verification when the
   blog index unexpectedly went empty, fixed by updating each with `data: {_status: "published"}`
   (note: passing `draft: false` to `update()` was tried first and does *not* set `_status`).
4. **A dev-mode-only Turbopack caching artifact, chased and ruled out as a product bug.** While
   iterating with standalone `payload run` scripts (which can't trigger `revalidateTag` — no
   Next.js request context outside a real HTTP request), some `unstable_cache` entries in the
   running `next dev` process stayed stale across full process restarts and `rm -rf .next/cache`.
   Isolated by comparing a raw `getPayloadClient()` query (always correct), the same query via
   `getPublishedPosts()` from a throwaway Route Handler (correct), and the identical call from
   `blog/page.tsx` in the same process (stale) — ruling out the data/query layer. Confirmed clean
   on `npm run build && npm run start` (a single unified server bundle, no per-route module
   duplication): every check that failed under `next dev` passed under the production server.
   Documented in `CHANGELOG.md`/`AGENT.md` so this isn't re-debugged from scratch next time.

---

## Live verification performed

- `npm run build` / `npm run lint` clean at every milestone; final production build (`npm run
  build && npm run start`) used for the definitive end-to-end pass after the `_status` fix.
- Live schema push confirmed (`tags` table, `posts_rels`, `authors.slug` all present) by starting
  the dev server once against the real Supabase database and querying the Payload REST API.
- Created ~10 real-shaped temporary test posts (varying categories/tags/publish dates, one
  `featured: true`, one genuine unpublished draft) plus 2 categories, 2 tags, and 1 author through
  Payload's Local API — same "create, verify, delete" pattern used for the Phase 1.5 RBAC test
  account. Exercised and confirmed correct: blog index + pagination (page 1/2 split correctly),
  category archive, tag archive, author archive, search, the article page (headings/TOC ids,
  related posts correctly excluding the draft and unrelated posts, prev/next), RSS (well-formed
  XML, correct item count, draft excluded), sitemap (correct URL count, draft excluded).
- Draft preview tested with real HTTP requests: logged in as the real admin account via
  `POST /api/users/login`, then `GET /next/preview?path=/blog/<draft-slug>&previewSecret=...` with
  that session cookie → redirected to the draft page, draft title visible, `__prerender_bypass`
  cookie set. Same URL with no session cookie → `403`. Same URL with an incorrect
  `previewSecret` → `403`.
- Homepage regression check: `/` still renders correctly, includes the new "Blog" nav link,
  `<title>` and other existing metadata unchanged; `/robots.txt` and `/admin` still resolve.
- All test data (10 posts, 2 categories, 2 tags, 1 author) deleted after verification; confirmed
  via a final "posts remaining: 0" check against the live database.

---

## Known gap

No Playwright/browser-automation tool was available in this session (unlike Phase 1/1.5).
Everything above was verified via direct HTTP requests (`curl`) — status codes, rendered HTML,
RSS/sitemap XML — not actual screenshots or in-browser console-error checks. **The mobile
(390px)/desktop (1440px) visual pass and console-error check on the new blog pages has not been
done.** Run it before treating this phase's UI as fully sign-off-ready; see
`Architecture files/currentphase.md`'s "Known gap" section.

## Deliberately out of scope (per the brief and prior-phase precedent)

No real newsletter signup wiring (`NewsletterCta` is a static placeholder, matching Phase 1's
explicit newsletter deferral). No scroll-spy on the table of contents (a static anchor list meets
the brief's "table of contents" ask without adding IntersectionObserver complexity that wasn't
requested).

## What's needed from here

- `git commit` — nothing from this phase has been committed yet.
- A real Playwright visual/responsive pass on the new blog pages (see "Known gap").
- Real blog content, whenever there's copy to publish — the blog currently has zero posts by
  design (no fake seed content), so every listing page shows its honest empty state until then.
