import {
  CAMPAIGN_TYPE_VALUES,
  CREATOR_TYPE_VALUES,
  GENDER_VALUES,
  HEARD_ABOUT_US_VALUES,
  PRIMARY_CATEGORY_VALUES,
  YES_NO_VALUES,
} from "./options";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-.\s\d]{7,20}$/;

const MAX_FIELD = 200;
const MAX_LONG_FIELD = 500;
const MAX_TEXTAREA = 5000;
const MAX_ARRAY_ITEMS = 20;

export type InfluencerFormInput = Record<string, unknown>;

export type ValidatedInfluencerForm = {
  fullName: string;
  contactNumber: string;
  alternativeContact: string;
  email: string;
  gender: string;
  age: number | undefined;
  languages: string[];
  primaryCategory: string;
  subcategory: string;
  creatorType: string;
  bio: string;
  yearsAsCreator: number | undefined;
  currentOccupation: string;
  country: string;
  state: string;
  city: string;
  district: string;
  area: string;
  addressLine1: string;
  addressLine2: string;
  houseNumber: string;
  landmark: string;
  pincode: string;
  instagram: string;
  secondInstagram: string;
  youtube: string;
  snapchat: string;
  facebook: string;
  twitter: string;
  linkedin: string;
  otherPlatforms: string;
  portfolioLink: string;
  mediaKitUrl: string;
  mediaKitPublicId: string;
  rateCardUrl: string;
  rateCardPublicId: string;
  audienceCountry: string;
  audienceAge: string;
  audienceGender: string;
  monthlyReach: number | undefined;
  monthlyImpressions: number | undefined;
  averageStoryViews: number | undefined;
  averageReelViews: number | undefined;
  averageLast5VideoViews: number;
  engagementRate: number | undefined;
  participateEcommerce: string;
  interestedCampaigns: string[];
  commercialReel: number;
  commercialStory: number;
  monthlyCampaignCapacity: number | undefined;
  acceptingCollaborations: string;
  availableForTravel: string;
  previousBrandCollaborations: string;
  industriesInterested: string[];
  industriesWontPromote: string[];
  contentLanguage: string;
  contentPlatforms: string;
  heardAboutUs: string;
  additionalInfo: string;
  termsAccepted: true;
  privacyAccepted: true;
};

function text(value: unknown, maxLength = MAX_FIELD): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function optionalNumber(value: unknown): number | undefined {
  if (value === "" || value === null || value === undefined) return undefined;
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num < 0) return undefined;
  return num;
}

function stringArray(value: unknown, allowed?: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  const items = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, MAX_FIELD))
    .filter(Boolean)
    .filter((item) => !allowed || allowed.has(item));
  return items.slice(0, MAX_ARRAY_ITEMS);
}

function selectValue(value: unknown, allowed: Set<string>): string {
  const candidate = text(value, MAX_FIELD);
  return allowed.has(candidate) ? candidate : "";
}

/**
 * Server-side validation for the influencer application form. Mirrors
 * lib/leads/validate.ts's shape (honeypot check first, plain-object return, no throwing) but
 * covers ~45 fields across 8 sections. The "required" set intentionally matches
 * prompts/forms/influencer.md's explicit "# Validation > Required fields" list, not every field
 * marked `*` inline in the form-section outline — that list is more conservative (it omits
 * postal address fields entirely), and treating it as authoritative keeps the funnel from
 * gating applicants on a full address just to apply.
 */
export function validateInfluencerForm(
  input: InfluencerFormInput
): { ok: true; data: ValidatedInfluencerForm } | { ok: false; error: string } {
  // Honeypot: hidden from real visitors via CSS, not `type="hidden"` (basic bots still fall for it).
  if (text(input.honeypot) !== "") {
    return { ok: false, error: "Submission rejected." };
  }

  const fullName = text(input.fullName);
  if (!fullName) return { ok: false, error: "Please enter your full name." };

  const contactNumber = text(input.contactNumber, 30);
  if (!contactNumber || !PHONE_RE.test(contactNumber)) {
    return { ok: false, error: "Please enter a valid contact number." };
  }

  const email = text(input.email);
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const instagram = text(input.instagram);
  if (!instagram) return { ok: false, error: "Please enter your Instagram profile." };

  const primaryCategory = selectValue(input.primaryCategory, PRIMARY_CATEGORY_VALUES);
  if (!primaryCategory) return { ok: false, error: "Please select a primary category." };

  const creatorType = selectValue(input.creatorType, CREATOR_TYPE_VALUES);
  if (!creatorType) return { ok: false, error: "Please select the type of creator you are." };

  const commercialReel = optionalNumber(input.commercialReel);
  if (commercialReel === undefined) {
    return { ok: false, error: "Please enter your commercial price for one reel." };
  }

  const commercialStory = optionalNumber(input.commercialStory);
  if (commercialStory === undefined) {
    return { ok: false, error: "Please enter your commercial price for one story." };
  }

  const averageLast5VideoViews = optionalNumber(input.averageLast5VideoViews);
  if (averageLast5VideoViews === undefined) {
    return { ok: false, error: "Please enter your average views across your last 5 videos." };
  }

  const previousBrandCollaborations = text(input.previousBrandCollaborations, MAX_TEXTAREA);
  if (!previousBrandCollaborations) {
    return { ok: false, error: "Please tell us about your previous brand collaborations (or write \"None\")." };
  }

  const contentLanguage = text(input.contentLanguage);
  if (!contentLanguage) return { ok: false, error: "Please enter your content language." };

  if (input.termsAccepted !== true) {
    return { ok: false, error: "Please confirm your information is accurate and agree to the terms." };
  }
  if (input.privacyAccepted !== true) {
    return { ok: false, error: "Please agree to the Privacy Policy." };
  }

  const contactNumberAlt = text(input.alternativeContact, 30);
  if (contactNumberAlt && !PHONE_RE.test(contactNumberAlt)) {
    return { ok: false, error: "Please enter a valid alternative contact number." };
  }

  return {
    ok: true,
    data: {
      fullName,
      contactNumber,
      alternativeContact: contactNumberAlt,
      email,
      gender: selectValue(input.gender, GENDER_VALUES),
      age: optionalNumber(input.age),
      languages: stringArray(input.languages),
      primaryCategory,
      subcategory: text(input.subcategory),
      creatorType,
      bio: text(input.bio, MAX_TEXTAREA),
      yearsAsCreator: optionalNumber(input.yearsAsCreator),
      currentOccupation: text(input.currentOccupation),
      country: text(input.country) || "India",
      state: text(input.state),
      city: text(input.city),
      district: text(input.district),
      area: text(input.area),
      addressLine1: text(input.addressLine1, MAX_LONG_FIELD),
      addressLine2: text(input.addressLine2, MAX_LONG_FIELD),
      houseNumber: text(input.houseNumber),
      landmark: text(input.landmark),
      pincode: text(input.pincode, 20),
      instagram,
      secondInstagram: text(input.secondInstagram),
      youtube: text(input.youtube),
      snapchat: text(input.snapchat),
      facebook: text(input.facebook),
      twitter: text(input.twitter),
      linkedin: text(input.linkedin),
      otherPlatforms: text(input.otherPlatforms, MAX_LONG_FIELD),
      portfolioLink: text(input.portfolioLink, MAX_LONG_FIELD),
      mediaKitUrl: text(input.mediaKitUrl, MAX_LONG_FIELD),
      mediaKitPublicId: text(input.mediaKitPublicId, MAX_LONG_FIELD),
      rateCardUrl: text(input.rateCardUrl, MAX_LONG_FIELD),
      rateCardPublicId: text(input.rateCardPublicId, MAX_LONG_FIELD),
      audienceCountry: text(input.audienceCountry),
      audienceAge: text(input.audienceAge, 50),
      audienceGender: text(input.audienceGender, 50),
      monthlyReach: optionalNumber(input.monthlyReach),
      monthlyImpressions: optionalNumber(input.monthlyImpressions),
      averageStoryViews: optionalNumber(input.averageStoryViews),
      averageReelViews: optionalNumber(input.averageReelViews),
      averageLast5VideoViews,
      engagementRate: optionalNumber(input.engagementRate),
      participateEcommerce: selectValue(input.participateEcommerce, YES_NO_VALUES),
      interestedCampaigns: stringArray(input.interestedCampaigns, CAMPAIGN_TYPE_VALUES),
      commercialReel,
      commercialStory,
      monthlyCampaignCapacity: optionalNumber(input.monthlyCampaignCapacity),
      acceptingCollaborations: selectValue(input.acceptingCollaborations, YES_NO_VALUES),
      availableForTravel: selectValue(input.availableForTravel, YES_NO_VALUES),
      previousBrandCollaborations,
      industriesInterested: stringArray(input.industriesInterested),
      industriesWontPromote: stringArray(input.industriesWontPromote),
      contentLanguage,
      contentPlatforms: text(input.contentPlatforms, MAX_LONG_FIELD),
      heardAboutUs: selectValue(input.heardAboutUs, HEARD_ABOUT_US_VALUES),
      additionalInfo: text(input.additionalInfo, MAX_TEXTAREA),
      termsAccepted: true,
      privacyAccepted: true,
    },
  };
}
