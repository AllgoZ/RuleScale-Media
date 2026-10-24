# Handover

Last updated: 2026-10-24

Fast orientation for the next person or agent. Brand/creative "why": `CLAUDE.MD`. Commands,
conventions, gotchas: `AGENT.md`. Architecture snapshot: `Architecture files/systemstatus.md`.
Dated history: `Architecture files/CHANGELOG.md`. Phase pointer: `Architecture files/currentphase.md`.

## What this is

RuleScale Media's marketing site: Next.js 16.2.12 + Payload CMS 3.86 + Supabase Postgres + Tailwind
v4, live at https://www.rulescale.in on Vercel (deploys on push to `main`). Local dev and production
share ONE database.

## State at handover

- Shipped: homepage, blog, contact/leads CRM, portfolio (`/work/*`, Cloudinary), influencer
  application form, GTM, SEO/JSON-LD, Payload API-key auth on users.
- **New this session: Content API** so Claude can publish blogs and edit case studies with an API
  key. Endpoints `POST/GET /api/content/posts` and `/api/content/portfolio` (Markdown in/out,
  upsert by slug, no delete). Guide: `Architecture files/content-api.md`.
- Posts gained `featuredImageUrl`/`featuredImageAlt`; categories/tags can now be created by editors.
  Migration `20261024_140605_add_post_featured_image_url` is **already applied to the shared DB**.
- Repo docs: `CLAUDE.MD` now lives at the repo root (moved from `claude files/`).

## Unverified / known gaps

1. **No authenticated round trip of the content API has been run.** Only 401/403 checks passed.
   First action after deploy: create one `"status":"draft"` post with the real key, open it in
   `/admin`, confirm headings/lists/links render, then publish.
2. No browser-based visual QA (390px/1440px) has ever been done site-wide.
3. No `RESEND_API_KEY` / Turnstile keys: lead emails only log to console.
4. No video portfolio items published; `/work/videos` shows its empty state.
5. Content API writes publish immediately by default (owner's choice). Use `"status":"draft"` when
   unsure.

## Setting up the API key (owner action)

`/admin` -> Users -> create a user with role **Editor** -> tick Enable API Key -> Save -> copy the
key. Give it to Claude via an env var (e.g. `RULESCALE_API_KEY`), never in committed files. Header:
`Authorization: users API-Key <KEY>`. Use a dedicated editor user, not an admin.

## Rules that bite

- Schema change => `npm run payload migrate:create <name>`, review, `npm run payload migrate`,
  `npm run generate:types`. `push: false`; there is no auto-push.
- Write source files as UTF-8 explicitly (a cp1252 em dash once broke the Turbopack build).
- Domain URLs come from `SITE_URL`, never `siteSettings.url`. In-page anchors need a leading `/`.
- Public queries on drafts-enabled collections must filter `_status: published`.
- After `npm run build`, delete the whole `.next` before `npm run dev`.

## Suggested next steps

1. Deploy, then run the draft-post round-trip test above.
2. Write the first real blog posts per `Architecture files/blogcontentbrief.md`.
3. Add Resend/Turnstile keys in Vercel and `.env.local`.
4. A real Playwright pass across the site.
