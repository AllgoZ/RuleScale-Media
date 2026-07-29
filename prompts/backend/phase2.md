You are continuing work on the RuleScale Media project.

IMPORTANT

Phase 1 and Phase 1.5 are complete.

Do NOT modify the homepage UI.
Do NOT redesign existing pages.
Do NOT refactor working code unnecessarily.

Your objective is to build a production-quality content platform on top of the existing Payload CMS architecture.

GOALS

Build a complete blog and publishing system that is scalable, SEO-first, and fully integrated with the existing CMS.

REQUIREMENTS

Use Payload's Lexical rich text editor.

Support:

- Blog listing page
- Individual blog pages
- Categories
- Tags
- Authors
- Featured posts
- Reading time
- Related posts
- Search
- Pagination
- RSS feed
- Dynamic sitemap
- Dynamic metadata
- Article JSON-LD
- Breadcrumb JSON-LD
- Draft preview
- Responsive images
- SEO fields
- Canonical URLs
- Open Graph
- Twitter cards

DATA MODEL

Enhance the existing Posts collection with:

- Title
- Slug
- Excerpt
- Rich Content (Lexical)
- Featured Image
- Author (relationship)
- Category (relationship)
- Tags (relationship or collection)
- Publish Date
- Updated Date
- Featured flag
- Reading Time
- SEO fields
- Canonical URL
- OG Image
- Twitter Image
- Draft/Published status

Create routes:

/blog
/blog/[slug]
/blog/category/[slug]
/blog/tag/[slug]
/blog/author/[slug]
/blog/search

BLOG INDEX

Display:

- Featured post
- Recent posts
- Categories
- Search
- Pagination

ARTICLE PAGE

Display:

- Hero
- Featured image
- Author
- Publish date
- Reading time
- Rich article
- Table of contents
- Related posts
- Previous/Next navigation
- Social sharing
- Newsletter CTA placeholder

SEO

Generate dynamic:

- Metadata
- Open Graph
- Twitter
- Canonical
- Robots
- Article JSON-LD
- Breadcrumb JSON-LD

SEARCH

Implement server-side search by:

- Title
- Excerpt
- Category
- Tags
- Author

Use efficient queries and avoid loading all posts into memory.

RSS

Generate a valid RSS feed from published posts.

SITEMAP

Automatically include:

- Posts
- Categories
- Authors
- Homepage

IMAGES

Use Next.js Image optimization.

Support alt text and responsive sizing.

PERFORMANCE

Cache blog data appropriately.

Use tag-based revalidation where possible.

Avoid N+1 queries.

Use server components wherever practical.

TESTING

Verify:

- Build passes
- Lint passes
- Draft preview works
- RSS validates
- Sitemap updates
- Metadata renders correctly
- Search functions
- Pagination works
- No hydration issues
- No visual regressions

DOCUMENTATION

Document the blog architecture, routing, search, caching, and publishing workflow.

The end result should be a production-ready publishing platform that can scale to hundreds of articles without requiring architectural changes.