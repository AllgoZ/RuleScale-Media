/**
 * Single source of truth for every select/checkbox-group option list on the influencer
 * application form — imported by both the Payload collection (admin dropdowns) and
 * lib/influencer/validate.ts (server-side whitelist), so the two can't drift apart the way
 * SERVICES/SERVICE_OPTIONS already work for the contact form (see lib/constants.ts).
 */

export const GENDER_OPTIONS = [
  { label: "Female", value: "female" },
  { label: "Male", value: "male" },
  { label: "Non-binary", value: "non-binary" },
  { label: "Prefer not to say", value: "prefer-not-to-say" },
] as const;

export const PRIMARY_CATEGORY_OPTIONS = [
  { label: "Fashion & Style", value: "fashion-style" },
  { label: "Beauty & Skincare", value: "beauty-skincare" },
  { label: "Fitness & Health", value: "fitness-health" },
  { label: "Food & Cooking", value: "food-cooking" },
  { label: "Travel", value: "travel" },
  { label: "Tech & Gadgets", value: "tech-gadgets" },
  { label: "Gaming", value: "gaming" },
  { label: "Lifestyle & Vlogging", value: "lifestyle-vlogging" },
  { label: "Comedy & Entertainment", value: "comedy-entertainment" },
  { label: "Education", value: "education" },
  { label: "Finance", value: "finance" },
  { label: "Parenting & Family", value: "parenting-family" },
  { label: "Other", value: "other" },
] as const;

export const CREATOR_TYPE_OPTIONS = [
  { label: "Content Creator", value: "content-creator" },
  { label: "Influencer", value: "influencer" },
  { label: "UGC Creator", value: "ugc-creator" },
  { label: "Photographer", value: "photographer" },
  { label: "Videographer", value: "videographer" },
  { label: "Model", value: "model" },
  { label: "Other", value: "other" },
] as const;

export const YES_NO_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
] as const;

export const CAMPAIGN_TYPE_OPTIONS = [
  { label: "Paid Campaigns", value: "paid-campaigns" },
  { label: "Affiliate", value: "affiliate" },
  { label: "UGC", value: "ugc" },
  { label: "Long Term Partnerships", value: "long-term-partnerships" },
  { label: "Product Reviews", value: "product-reviews" },
  { label: "Brand Ambassador", value: "brand-ambassador" },
  { label: "Events", value: "events" },
  { label: "Creator Workshops", value: "creator-workshops" },
] as const;

export const HEARD_ABOUT_US_OPTIONS = [
  { label: "Instagram", value: "instagram" },
  { label: "Google Search", value: "google-search" },
  { label: "Referral from another creator", value: "creator-referral" },
  { label: "Referral from a brand", value: "brand-referral" },
  { label: "LinkedIn", value: "linkedin" },
  { label: "Event / Workshop", value: "event-workshop" },
  { label: "Other", value: "other" },
] as const;

export const APPLICATION_STATUS_OPTIONS = [
  { label: "Applied", value: "applied" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Onboarded", value: "onboarded" },
] as const;

export const VERIFICATION_STATUS_OPTIONS = [
  { label: "Unverified", value: "unverified" },
  { label: "Verified", value: "verified" },
  { label: "Flagged", value: "flagged" },
] as const;

export const TIER_OPTIONS = [
  { label: "Nano (1K–10K)", value: "nano" },
  { label: "Micro (10K–50K)", value: "micro" },
  { label: "Mid-tier (50K–500K)", value: "mid-tier" },
  { label: "Macro (500K–1M)", value: "macro" },
  { label: "Mega (1M+)", value: "mega" },
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  { label: "Not applicable", value: "not-applicable" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Overdue", value: "overdue" },
] as const;

function toValueSet(options: ReadonlyArray<{ value: string }>): Set<string> {
  return new Set(options.map((option) => option.value));
}

export const GENDER_VALUES = toValueSet(GENDER_OPTIONS);
export const PRIMARY_CATEGORY_VALUES = toValueSet(PRIMARY_CATEGORY_OPTIONS);
export const CREATOR_TYPE_VALUES = toValueSet(CREATOR_TYPE_OPTIONS);
export const YES_NO_VALUES = toValueSet(YES_NO_OPTIONS);
export const CAMPAIGN_TYPE_VALUES = toValueSet(CAMPAIGN_TYPE_OPTIONS);
export const HEARD_ABOUT_US_VALUES = toValueSet(HEARD_ABOUT_US_OPTIONS);
