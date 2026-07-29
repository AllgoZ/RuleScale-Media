You are continuing work on the RuleScale Media platform.

IMPORTANT

Phase 1, Phase 1.5, and Phase 2 are complete.

Do NOT redesign the frontend.
Do NOT modify blog functionality.
Do NOT change existing CMS architecture.

Your objective is to transform RuleScale from a marketing website into an operational agency platform.

----------------------------------------------------
PHASE 3
AGENCY OPERATIONS PLATFORM
----------------------------------------------------

GOALS

Implement:

- Lead Management
- CRM foundation
- Contact form backend
- Email notifications
- Admin dashboard
- Business analytics
- Automation-ready architecture

----------------------------------------------------
STEP 1
LEADS COLLECTION
----------------------------------------------------

Expand the existing Leads collection.

Fields:

- Name
- Email
- Phone
- Company
- Website
- Budget
- Services Interested
- Message
- Source
- Status
- Priority
- Assigned User
- Internal Notes
- Created At
- Updated At

Implement proper validation.

----------------------------------------------------
STEP 2
CONTACT FORMS
----------------------------------------------------

Connect every website contact form to the Leads collection.

Use one backend endpoint.

Implement:

- Validation
- Spam protection
- Rate limiting
- Graceful error handling

----------------------------------------------------
STEP 3
EMAILS
----------------------------------------------------

Use Resend.

Send:

- Confirmation email to visitor
- Notification email to admin

Use React Email templates.

Emails should be branded using the existing RuleScale identity.

----------------------------------------------------
STEP 4
ADMIN EXPERIENCE
----------------------------------------------------

Improve lead management.

Allow:

- Filter
- Search
- Sort
- Status updates
- Assignment
- Notes
- CSV export

----------------------------------------------------
STEP 5
BUSINESS DASHBOARD
----------------------------------------------------

Create an admin dashboard showing:

- Total leads
- New leads
- Won leads
- Lost leads
- Monthly lead count
- Conversion rate
- Most requested services
- Lead sources

Do not expose sensitive data publicly.

----------------------------------------------------
STEP 6
ANALYTICS
----------------------------------------------------

Track:

- Lead source
- Landing page
- UTM parameters
- Referrer
- Device
- Browser

Store useful attribution data.

----------------------------------------------------
STEP 7
SECURITY
----------------------------------------------------

Implement:

- Server-side validation
- Rate limiting
- Cloudflare Turnstile support
- Secure API routes
- Environment validation
- Audit logging

----------------------------------------------------
STEP 8
AUTOMATION FOUNDATION
----------------------------------------------------

Prepare event hooks for:

- Lead created
- Lead updated
- Status changed

Design the architecture so Slack, Notion, WhatsApp, and other integrations can be added later without refactoring.

----------------------------------------------------
STEP 9
FUTURE COLLECTIONS
----------------------------------------------------

Create empty schemas (no UI required yet) for:

- Clients
- Projects
- Contracts
- Files
- Meetings

These are placeholders for future phases.

----------------------------------------------------
STEP 10
TESTING
----------------------------------------------------

Verify:

- Forms submit correctly
- Leads persist
- Emails send
- Dashboard updates
- Validation works
- Rate limiting works
- Build passes
- Lint passes

----------------------------------------------------
DELIVERABLE

The result should be a production-ready agency operations backend that integrates cleanly with the existing CMS and blog while preparing the platform for future CRM and client portal capabilities.