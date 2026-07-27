You are working on an existing production-ready Next.js project for RuleScale Media.

IMPORTANT:
Do NOT redesign the UI.
Do NOT modify animations.
Do NOT change layouts.
Do NOT change styling.
Do NOT refactor sections unless absolutely required.

Your goal is ONLY to convert the existing static website into a CMS-driven website while preserving the exact frontend.

The project is currently a Next.js App Router application using:

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Existing SEO
- Existing JSON-LD
- Existing reusable components

Currently all content comes from lib/constants.ts.

The objective is to make every piece of content editable through a CMS.

----------------------------------------------------
PHASE 1
CMS FOUNDATION
----------------------------------------------------

Goal:

Transform the project from

Next.js
↓
lib/constants.ts

into

Next.js
↓
Payload CMS
↓
PostgreSQL (Supabase)

without changing the UI.

----------------------------------------------------
REQUIREMENTS
----------------------------------------------------

Use:

- Payload CMS (latest stable)
- PostgreSQL (Supabase)
- Prisma only if Payload requires it
- Payload Local API
- Next.js App Router
- TypeScript

The frontend must remain exactly the same.

----------------------------------------------------
STEP 1
INSTALL PAYLOAD
----------------------------------------------------

Install Payload CMS correctly inside the existing project.

Create the Payload configuration.

Create the admin panel.

Create authentication.

Create database connection.

Do NOT create unnecessary demo collections.

----------------------------------------------------
STEP 2
DATABASE
----------------------------------------------------

Prepare the project for Supabase PostgreSQL.

Read the database connection string from .env.

Never hardcode secrets.

Create an env.example.

----------------------------------------------------
STEP 3
CMS STRUCTURE
----------------------------------------------------

Create the following collections.

Collections

Users
Media
Posts
Categories
Authors
Testimonials
CaseStudies
Leads

Create the following Globals.

Homepage
Navigation
Footer
SiteSettings
SEOSettings

Use Payload best practices.

----------------------------------------------------
STEP 4
MEDIA
----------------------------------------------------

Configure media uploads.

Images should be reusable throughout the CMS.

Use responsive image sizes.

----------------------------------------------------
STEP 5
HOMEPAGE
----------------------------------------------------

Move ALL homepage content into the Homepage Global.

Everything currently inside lib/constants.ts should eventually come from the CMS.

Create fields for:

Hero

- Heading
- Subheading
- CTA
- Secondary CTA

Problem section

Manifesto

Services

Results

Case Studies

Testimonials

FAQ

Final CTA

Do NOT change any frontend markup.

----------------------------------------------------
STEP 6
API LAYER
----------------------------------------------------

Create a clean CMS abstraction.

Example

lib/cms/

homepage.ts

navigation.ts

footer.ts

settings.ts

Do NOT query Payload directly inside UI components.

Create helper functions like:

getHomepage()

getNavigation()

getFooter()

etc.

----------------------------------------------------
STEP 7
FRONTEND
----------------------------------------------------

Replace imports from

lib/constants.ts

with CMS data.

The UI should render exactly the same.

If CMS data is missing, gracefully fall back to existing constants.

Never leave the page blank.

----------------------------------------------------
STEP 8
SEO
----------------------------------------------------

Do NOT remove existing SEO.

Preserve:

Metadata

Open Graph

Twitter

JSON-LD

robots.ts

sitemap.ts

Canonical URLs

Later these values should come from SiteSettings.

----------------------------------------------------
STEP 9
ADMIN
----------------------------------------------------

After setup I should be able to login at

/admin

and edit

Homepage

Navigation

Footer

SEO

Media

Posts

without writing code.

----------------------------------------------------
STEP 10
CODE QUALITY
----------------------------------------------------

Use production-quality architecture.

No duplicated logic.

No unnecessary wrappers.

No dead code.

No unused packages.

Keep files organized.

Suggested structure:

payload/

collections/

globals/

lib/cms/

Do not mix frontend UI with backend logic.

----------------------------------------------------
STEP 11
DO NOT IMPLEMENT YET
----------------------------------------------------

Do NOT build:

Newsletter

CRM

Client Portal

Analytics Dashboard

Authentication for customers

Payments

Search

Comments

Those belong to future phases.

----------------------------------------------------
EXPECTED RESULT
----------------------------------------------------

At the end of this phase:

✓ Existing website looks identical

✓ Admin panel works

✓ CMS connected

✓ PostgreSQL connected

✓ Homepage editable

✓ Navigation editable

✓ Footer editable

✓ SEO ready

✓ Media library working

✓ Architecture scalable for future blog and CRM

----------------------------------------------------
VERY IMPORTANT
----------------------------------------------------

Before writing code:

1. Inspect the existing project.
2. Preserve the existing architecture.
3. Explain any breaking changes before making them.
4. Work incrementally.
5. After each major step, verify the project still builds successfully.
6. Never remove existing functionality unless replacing it with an equivalent implementation.
7. If there is a better architectural choice than the one described above, explain it before implementing it.

Your priority is long-term maintainability, scalability, and preserving the existing production UI.