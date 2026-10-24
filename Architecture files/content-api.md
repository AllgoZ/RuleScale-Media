# Content API — how an agent (Claude) publishes blogs and edits case studies

Last updated: 2026-10-24

Read this before writing or editing blog posts / portfolio case studies over HTTP. For *what* to
write (voice, pillars, SEO/AEO), read `blogcontentbrief.md`. Base URL: `https://www.rulescale.in`.

## Auth

Every request needs the header `Authorization: users API-Key <KEY>`. The key belongs to a Payload
user with role `editor` (generated in `/admin` -> Users -> enable API key). Keep it in an env var
(e.g. `RULESCALE_API_KEY`), never in a committed file, never echoed back into chat or docs.

What an editor key can and cannot do:

| Can | Cannot |
|---|---|
| create/update posts and portfolio items, publish or unpublish | delete anything (delete is admin-only) |
| create categories and tags (auto-created by the endpoints below) | create/edit authors, users, globals, leads |
| upload a portfolio/blog image to Cloudinary | read leads or influencer applications |

Writes go live immediately by default (`status` defaults to `"published"`); pass `"status":"draft"`
to save without publishing. Cache tags revalidate automatically, so the live site updates in ~1-2s.

## Blog posts — `POST /api/content/posts`

Upserts by `slug`: creates if new, otherwise updates only the fields you send (omitted fields are
left untouched). Body is JSON; the post body is **Markdown** (converted to Lexical server-side).

```json
{
  "title": "Why your SEO traffic plateaus (and what to do about it)",
  "slug": "seo-traffic-plateau",              // optional, derived from title
  "excerpt": "One or two sentences used on cards and as the meta fallback.",
  "markdown": "## Heading\n\nParagraph...\n\n- bullet\n\n[link](https://www.rulescale.in/contact)",
  "category": "SEO",                          // name or slug; created if missing
  "tags": ["technical seo", "content"],       // created if missing
  "author": "rulescale-team",                 // an existing author slug; default = first author
  "featuredImageUrl": "https://res.cloudinary.com/...",
  "featuredImageAlt": "Descriptive alt text",
  "publishedDate": "2026-10-24",              // default: now, on first publish
  "featured": false,
  "seo": { "metaTitle": "...", "metaDescription": "...", "canonicalUrl": "" },
  "status": "published"                       // or "draft"
}
```

Creating requires `title`, `excerpt`, `markdown`. Response:
`{ok, action: "created"|"updated", id, slug, status, url}`.

Read back: `GET /api/content/posts` lists posts (including drafts); `GET /api/content/posts?slug=x`
returns one post with its body as Markdown — fetch it, edit the Markdown, POST it back.

Use `##` for section headings (the page `h1` is the post title); the table of contents is built
from the headings.

## Portfolio / case studies — `POST /api/content/portfolio`

Same upsert-by-slug model. `markdown` becomes `caseStudyContent`.

```json
{
  "title": "Mylini", "client": "Mylini", "slug": "mylini",
  "featured": true, "mediaType": "image", "category": "E-commerce Website",
  "description": "...", "resultHeadline": "...",
  "services": ["Web Design", "SEO"],
  "thumbnailUrl": "https://res.cloudinary.com/...",
  "thumbnailPublicId": "...", "thumbnailWidth": 1600, "thumbnailHeight": 900, "thumbnailFormat": "png",
  "videoUrl": "", "liveWebsite": "https://...", "sortOrder": 0, "publishedAt": "2026-10-24",
  "markdown": "## Overview\n...\n\n## Challenge\n...\n\n## Solution\n...\n\n## Outcome\n...",
  "seo": { "metaTitle": "", "metaDescription": "", "metaImage": "https://res.cloudinary.com/..." },
  "status": "published"
}
```

Creating requires `title` and `client`. `services` replaces the whole list when sent. `GET
/api/content/portfolio[?slug=x]` mirrors the posts GET (list, or one item with Markdown body).

## Images

`POST /api/portfolio/upload` (multipart, field `file`, <=10MB, same API-key header) uploads to
Cloudinary and returns `{secureUrl, publicId, width, height, format}`. Use `secureUrl` as
`featuredImageUrl` / `thumbnailUrl` / `seo.metaImage` and pass the other fields as the
`thumbnail*` values. Blog posts use `featuredImageUrl` (not Payload's `featuredImage` upload,
because Payload's local media storage does not persist on Vercel).

## Errors

`401` bad/missing key or non-staff role · `400` validation (message names the field) · `404`
unknown slug on GET · `500` unexpected (details in Vercel logs). The raw Payload REST API
(`/api/posts`, `/api/portfolio`) still works with the same key but needs Lexical JSON for rich
text — prefer the endpoints above.

## Not covered

Authors, testimonials, homepage/navigation/footer globals, and deletion are intentionally outside
this API; those stay in `/admin`.
