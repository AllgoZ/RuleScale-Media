We are upgrading the RuleScale Media website from static content into a CMS-driven portfolio.

Current stack

- Next.js 15 App Router
- Payload CMS
- PostgreSQL
- Cloudinary
- Existing Case Studies section on landing page

We need to redesign the portfolio architecture.

==================================================
GOALS
==================================================

The landing page should only show featured work.

Every work item should have:

- thumbnail
- title
- client name
- slug
- category
- short description
- result headline
- technologies/services used
- featured boolean
- media type
- external URL (optional)
- internal case study page
- publish date

Additionally each work can be one of:

IMAGE PROJECT
VIDEO PROJECT

Videos are NOT shown inside the landing page.

Instead there should be a dedicated page:

/work/videos

which showcases all video projects.

Landing page should contain:

Featured Work
↓

View All Video Work →

that redirects to

/work/videos

==================================================
MEDIA MANAGEMENT
==================================================

Do NOT store media inside Payload storage.

Use Cloudinary.

Implement Cloudinary upload support.

Environment variables:

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=

(API key and secret will be provided later.)

When uploading from Payload:

1. Upload directly to Cloudinary
2. Receive secure_url
3. Save ONLY metadata inside Payload

Example fields:

thumbnailUrl
publicId
width
height
format
resourceType

No local uploads.

No filesystem storage.

==================================================
PAYLOAD COLLECTION
==================================================

Create collection:

Portfolio

Fields:

title

client

slug

featured

mediaType

enum:

image

video

category

description

resultHeadline

services (relationship or array)

thumbnailUrl

thumbnailPublicId

thumbnailWidth

thumbnailHeight

thumbnailFormat

videoUrl (optional)

caseStudyContent (rich text)

liveWebsite

sortOrder

publishedAt

SEO fields

metaTitle

metaDescription

metaImage

==================================================
THUMBNAIL
==================================================

Inside Payload admin

Thumbnail section should have

Upload to Cloudinary button

Workflow

Choose image

↓

Upload

↓

Preview appears

↓

Cloudinary secure_url saved

↓

Payload stores metadata

Landing page loads thumbnail directly from Cloudinary.

==================================================
VIDEO WORKS
==================================================

For mediaType = video

Admin should support:

video title

thumbnail

video URL

Supported URLs

YouTube

Vimeo

Cloudinary hosted MP4

Store only URL.

Do not upload videos through Payload.

Frontend should embed videos appropriately.

==================================================
LANDING PAGE
==================================================

Current Featured Work section should become CMS driven.

Display only:

featured = true

Order by:

sortOrder ASC

Each card should support

thumbnail

title

client

result headline

short description

services

Clicking anywhere on card should open

/work/[slug]

If external URL exists and "Open External" is enabled then redirect externally.

Otherwise open internal case study.

==================================================
VIDEO PAGE
==================================================

Create

/work/videos

Grid layout.

Each card shows

thumbnail

title

play icon overlay

client

Click opens

/work/videos/[slug]

Video page contains

embedded player

description

services

CTA

==================================================
CASE STUDY PAGE
==================================================

Create

/works/[slug]

Large hero image

Project details

Challenge

Solution

Results

Gallery

Related work

SEO metadata

Dynamic OpenGraph image

==================================================
CLOUDINARY
==================================================

Create reusable helper:

lib/cloudinary.ts

Functions

uploadImage()

deleteImage()

transformImage()

Use official Cloudinary SDK.

==================================================
OPTIMIZATION
==================================================

Use next/image

Serve Cloudinary transformations

Examples

f_auto

q_auto

c_fill

w=800

Use responsive sizes.

Lazy load below fold.

==================================================
ADMIN EXPERIENCE
==================================================

Payload admin should be simple.

Editor flow

New Portfolio Item

↓

Choose Image or Video

↓

Upload Thumbnail

↓

Cloudinary Upload

↓

Preview

↓

Fill Details

↓

Publish

No manual URL copying.

==================================================
SEO
==================================================

Generate

schema.org CreativeWork

for every portfolio item.

VideoObject schema

for videos.

Breadcrumb schema.

Canonical URLs.

Dynamic metadata.

==================================================
IMPORTANT
==================================================

Write production-quality TypeScript.

Do not break existing architecture.

Keep components reusable.

Separate API logic.

Separate Cloudinary helpers.


Follow Payload best practices.

Implement everything end-to-end.