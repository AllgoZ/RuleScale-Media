Create a new public page at:

/form/influencer

Use the existing RuleScale Media website layout, typography, spacing, components, animations, header, footer, buttons, form styles, validation styles, loading states, and overall design system already used across the website. Make this page feel like a native part of the existing site.

Do NOT create a different design language.

---

## Goal

This page is for onboarding influencers into RuleScale Media's creator network.

Every submission must be stored in Supabase.

Use server actions / API routes (whichever fits the existing architecture).

Validate both client and server side.

Prevent spam with honeypot + rate limiting.

After successful submission:

- save to Supabase
- show success screen
- send user back to homepage CTA after success (button)
- keep submission status as "Applied"

---

## SEO

Page URL

/form/influencer

Title

Influencer Registration | RuleScale Media

Description

Join RuleScale Media's influencer network and collaborate with leading brands across multiple industries.

Canonical

https://rulescale.in/form/influencer

Add proper OpenGraph metadata.

Noindex = false

---

# Database

Create a Supabase table:

influencer_applications

Columns

id (uuid)

created_at

status (default: Applied)

full_name

contact_number

alternative_contact

email

gender

age

languages (text[])

primary_category

subcategory

country

state

city

district

area

address_line_1

address_line_2

house_number

landmark

pincode

instagram

second_instagram

youtube

snapchat

facebook

twitter

linkedin

other_platforms

participate_ecommerce

other_contact

content_platforms

creator_type

commercial_reel

commercial_story

average_last_5_video_views

heard_about_us

previous_brand_collaborations

content_language

bio

audience_country

audience_age

audience_gender

monthly_reach

monthly_impressions

average_story_views

average_reel_views

engagement_rate

interested_campaigns (text[])

portfolio_link

media_kit_url

rate_card_url

available_for_travel

accepting_collaborations

monthly_campaign_capacity

terms_accepted

privacy_accepted

internal_notes

assigned_manager

verification_status

creator_score

tier

last_contact_date

next_followup

payment_status

contract_signed

---

# Form

Divide the form into logical sections.

---

## 1. Personal Information

Full Name *

Contact Number *

Alternative Contact Number

Email *

Gender *

Age *

Languages Known *

---

## 2. Creator Information

Primary Category *

Sub Category *

Type of Creator *

Bio / Tell us about yourself *

Years as Creator

Current Occupation

---

## 3. Location

Country *

State *

City *

District

Area

House / Flat Number

Landmark

Address Line 1 *

Address Line 2

Pincode *

---

## 4. Social Media Profiles

Instagram Profile *

Second Instagram

YouTube

Snapchat

Facebook

X (Twitter)

LinkedIn

Other Platforms

Portfolio Website

Media Kit Upload (PDF)

Rate Card Upload (PDF)

Drive Portfolio Link

---

## 5. Audience Insights

Primary Audience Country

Audience Age Group

Audience Gender

Monthly Reach

Monthly Impressions

Average Story Views

Average Reel Views

Average Last 5 Video Views *

Average Engagement Rate

---

## 6. Collaboration Details

Do you want to participate in E-commerce Campaigns? *

Interested Campaign Types

Checkboxes

Paid Campaigns

Affiliate

UGC

Long Term Partnerships

Product Reviews

Brand Ambassador

Events

Creator Workshops

Commercial Price for 1 Reel *

Commercial Price for 1 Story *

Monthly Campaign Capacity

Accepting Collaborations?

Available for Travel?

Previous Brand Collaborations *

Industries Interested In

Industries You Won't Promote

Content Language *

Other Platforms You Create Content On *

---

## 7. Additional Information

How did you hear about RuleScale Media? *

Any additional information

---

## 8. Consent

Checkbox

I confirm all information provided is accurate.

Checkbox

I agree to RuleScale Media storing my information for collaboration opportunities.

Checkbox

I agree to the Privacy Policy and Terms.

Required.

---

# Validation

Required fields

Full Name

Contact Number

Email

Instagram

Primary Category

Creator Type

Commercial Reel

Commercial Story

Average Last 5 Video Views

Previous Brand Collaborations

Content Language

Terms

Privacy

Validate

Email

Phone

URL

Positive numbers

File types

---

# Supabase Storage

Create bucket

creator-assets

Upload

Media Kit

Rate Card

Store returned URLs in database.

---

# Admin Ready

Structure the code so Payload CMS admin can later:

- view all applications
- filter by category
- filter by city
- filter by creator tier
- filter by status
- search by creator name
- export CSV later

Do not build the admin UI now.

Just structure everything cleanly.

---

# UX

Show progress indicator across sections.

Autosave form locally so refresh doesn't lose data.

Disable submit while uploading.

Show upload progress.

Show success animation after submission.

Display friendly validation errors.

Prevent duplicate submissions by checking same email + Instagram within the last 24 hours.

---

# Security

Use environment variables.

Never expose Supabase service role key.

Use Row Level Security.

Only backend inserts.

Sanitize all inputs.

---

# Deliverables

Implement the complete page.

Create Supabase migration.

Create storage bucket integration.

Create validation schema.

Create types.

Create API/server action.

Create success state.

Ensure the page is production-ready and follows the existing RuleScale Media codebase architecture.