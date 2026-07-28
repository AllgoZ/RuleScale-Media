You are continuing work on the existing RuleScale Media project.

IMPORTANT

Phase 1 has already been completed successfully.

DO NOT reinstall Payload.
DO NOT recreate collections.
DO NOT redesign the UI.
DO NOT modify animations.
DO NOT refactor components unnecessarily.
DO NOT change the frontend appearance.

Your objective is to HARDEN the CMS architecture and prepare it for production before building the blog.

This phase should improve reliability, caching, SEO integration, permissions, preview workflow, and performance.

----------------------------------------------------
PHASE 1.5
PRODUCTION HARDENING
----------------------------------------------------

Current stack:

- Next.js 16 App Router
- Payload CMS
- Supabase PostgreSQL
- Payload Local API
- Homepage CMS
- Navigation CMS
- Footer CMS
- SiteSettings Global
- SEOSettings Global

The website must continue looking pixel-identical.

----------------------------------------------------
STEP 1
VERIFY EXISTING ARCHITECTURE
----------------------------------------------------

Before making any changes:

Review the current implementation.

Verify:

- Payload configuration
- Globals
- Collections
- Local API
- Homepage data flow
- SEO implementation
- Metadata generation
- JSON-LD generation

Document anything that should be improved before modifying code.

Never rewrite working code without reason.

----------------------------------------------------
STEP 2
CMS-DRIVEN SITE SETTINGS
----------------------------------------------------

Connect SiteSettings and SEOSettings to the frontend.

The following should no longer rely on hardcoded values where practical:

- Site title
- Site description
- Company name
- Contact email
- Phone
- Social links
- Default OG image
- Default Twitter image
- Default keywords
- Robots directives
- Canonical URL
- Organization data
- LocalBusiness data

Preserve sensible fallbacks if CMS values are missing.

----------------------------------------------------
STEP 3
DYNAMIC METADATA
----------------------------------------------------

Refactor metadata generation.

Replace hardcoded metadata with CMS-driven metadata.

Maintain support for:

- Metadata API
- Open Graph
- Twitter
- Canonical
- Robots

Metadata should gracefully fall back if Payload is unavailable.

----------------------------------------------------
STEP 4
JSON-LD
----------------------------------------------------

Update lib/schema.ts

Generate JSON-LD from CMS data instead of constants.

Maintain:

- Organization
- LocalBusiness
- Service
- FAQ
- Breadcrumb

Use SiteSettings wherever possible.

----------------------------------------------------
STEP 5
NEXT.JS CACHING
----------------------------------------------------

Review all CMS queries.

Implement proper caching.

Use modern Next.js APIs.

Use cache(), unstable_cache(), or the recommended Next.js 16 approach where appropriate.

Requirements:

- Homepage cached
- Navigation cached
- Footer cached
- SiteSettings cached
- SEOSettings cached

Do not query PostgreSQL unnecessarily.

----------------------------------------------------
STEP 6
CACHE INVALIDATION
----------------------------------------------------

Implement cache invalidation.

Publishing content in Payload should invalidate only affected pages.

Support:

- Homepage
- Navigation
- Footer
- Settings

Prepare the architecture so blog pages can later invalidate individually.

Avoid full-site cache invalidation when unnecessary.

----------------------------------------------------
STEP 7
DRAFT MODE
----------------------------------------------------

Implement Payload Draft Mode.

Requirements:

- Preview unpublished content
- Preview homepage edits
- Preview future blog posts
- Keep unpublished content invisible to visitors

Integrate with Next.js Draft Mode.

----------------------------------------------------
STEP 8
ROLE PERMISSIONS
----------------------------------------------------

Configure Payload access control.

Roles:

Admin
Editor

Admin:

- Full access

Editor:

- Homepage
- Posts
- Media
- Testimonials
- Case Studies

Editor cannot:

- Manage users
- Delete admins
- Modify system configuration

Use Payload access control best practices.

----------------------------------------------------
STEP 9
MEDIA HARDENING
----------------------------------------------------

Review Media collection.

Ensure support for:

- Alt text
- Responsive images
- Image focal point (if supported)
- Captions
- Image metadata

Verify frontend image optimization still works correctly.

----------------------------------------------------
STEP 10
DATABASE RESILIENCE
----------------------------------------------------

Improve CMS resilience.

Requirements:

If database is unavailable:

- Website must continue rendering using existing fallback logic
- No crashes
- No unhandled promise rejections

Log useful errors.

Do not expose sensitive information.

----------------------------------------------------
STEP 11
HEALTH CHECKS
----------------------------------------------------

Add lightweight health endpoints.

Examples:

/api/health

Should report:

- Next.js status
- Payload status
- Database connectivity

Use proper HTTP status codes.

Do not expose secrets.

----------------------------------------------------
STEP 12
PERFORMANCE REVIEW
----------------------------------------------------

Review the project.

Look for:

- Duplicate CMS queries
- N+1 queries
- Unnecessary rerenders
- Uncached requests
- Overfetching
- Dead code

Optimize without changing functionality.

----------------------------------------------------
STEP 13
CODE QUALITY
----------------------------------------------------

Maintain a clean architecture.

Separate:

payload/

lib/cms/

lib/cache/

lib/schema/

lib/seo/

Do not mix frontend rendering with CMS logic.

Avoid duplicated code.

----------------------------------------------------
STEP 14
TESTING
----------------------------------------------------

Verify after every major step:

- npm run build
- npm run lint

Confirm:

- Homepage renders
- Navigation renders
- Footer renders
- Metadata correct
- JSON-LD valid
- Admin works
- Draft mode works
- Cache invalidation works
- No hydration issues
- No console errors

----------------------------------------------------
STEP 15
DOCUMENTATION
----------------------------------------------------

Create or update documentation explaining:

- CMS architecture
- Cache strategy
- Draft mode
- Revalidation
- Access control
- Metadata flow
- JSON-LD flow

Future developers should understand the architecture quickly.

----------------------------------------------------
EXPECTED RESULT
----------------------------------------------------

At the end of Phase 1.5:

✓ Website remains visually identical

✓ SiteSettings powers metadata

✓ SEOSettings powers metadata

✓ JSON-LD generated from CMS

✓ Cached CMS queries

✓ Efficient cache invalidation

✓ Draft Mode working

✓ Role-based permissions

✓ Optimized media handling

✓ Health endpoint available

✓ Production-ready CMS architecture

✓ Documentation updated

----------------------------------------------------
IMPORTANT

Do not begin implementing the blog during this phase.

Focus entirely on making the CMS integration robust, maintainable, performant, and production-ready.

Before implementing anything substantial, explain any architectural improvements you recommend and justify them. After each major milestone, ensure the application still builds, lints, and behaves identically from the user's perspective.