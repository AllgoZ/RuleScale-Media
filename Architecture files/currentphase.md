# Current Phase

Last updated: 2026-07-28

This is a fast pointer doc — "what phase is this project in, right now, and what's next." For
the full architecture snapshot read `systemstatus.md`; for the dated history of *why* and *how*
each change happened read `CHANGELOG.md`. Update this file whenever a phase starts or finishes;
don't let it drift into a second changelog.

## Status: Phase 1.5 complete — hardened CMS, ready for a blog phase whenever one is written

| Phase | Prompt | Result doc | Status |
|---|---|---|---|
| Initial build | `prompts/version2.md`, `prompts/refinement.md` | — | ✅ Complete — commits `6861178`, `7b42dfd` |
| Phase 1 — CMS Foundation | `prompts/backend/phase1.md` | `prompts/results/phase1result.md` | ✅ Complete — commit `a95dec1` |
| Phase 1.5 — Production Hardening | `prompts/backend/phase1_5.md` | `prompts/results/phase1_5result.md` | ✅ Complete — **uncommitted**, see below |
| Phase 2 — Blog | not written yet | — | ⬜ Not started |

## Where things actually stand

- **Frontend**: pixel-identical to the original design since Phase 1 shipped — every phase since
  has been backend/infrastructure only, each verified against a Playwright visual baseline before
  being called done.
- **CMS**: Payload 3.86.0 + PostgreSQL (Supabase), connected to a live project (session pooler —
  the direct-connection host is IPv6-only and this dev environment has no IPv6 route out), admin
  user provisioned, homepage content seeded.
- **Caching**: tag-based (`lib/cache/tags.ts`), `unstable_cache()` + `React.cache()`, invalidated
  by Payload `afterChange`/`afterDelete` hooks on save — verified live, not just built.
- **Draft mode**: works on the `homepage` global only (`/next/preview`, `/next/exit-preview`).
  `posts` has `versions.drafts: true` too but no preview route yet — nothing to preview against.
- **RBAC**: `admin` / `editor` roles enforced across every collection and global
  (`payload/access.ts`).
- **Health check**: `GET /api/health`.
- **Blog**: `posts` / `categories` / `authors` collections exist and are fully configured, but
  there is no `/blog` route anywhere in `app/`. Both Phase 1 and Phase 1.5 explicitly deferred
  building it ("Do not begin implementing the blog during this phase").

## Uncommitted work

Phase 1.5's entire diff is sitting uncommitted on `main` as of this writing. Run `git status`
before starting anything new — don't assume `git log` reflects the actual current file state,
and don't assume this file is current either if it's been a while; re-check.

## What's next

No Phase 2 prompt exists yet. Whenever one arrives, it's expected to build the actual `/blog`
route(s) and wire `posts`' existing draft support to a real preview flow — the two things Phase
1.5 deliberately left alone because there was no blog page to preview against yet.
