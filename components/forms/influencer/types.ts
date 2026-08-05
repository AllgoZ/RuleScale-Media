export type InfluencerFormState = {
  fullName: string;
  contactNumber: string;
  alternativeContact: string;
  email: string;
  gender: string;
  age: string;
  languages: string[];
  primaryCategory: string;
  subcategory: string;
  creatorType: string;
  bio: string;
  yearsAsCreator: string;
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
  mediaKitFileName: string;
  rateCardUrl: string;
  rateCardPublicId: string;
  rateCardFileName: string;
  audienceCountry: string;
  audienceAge: string;
  audienceGender: string;
  monthlyReach: string;
  monthlyImpressions: string;
  averageStoryViews: string;
  averageReelViews: string;
  averageLast5VideoViews: string;
  engagementRate: string;
  participateEcommerce: string;
  interestedCampaigns: string[];
  commercialReel: string;
  commercialStory: string;
  monthlyCampaignCapacity: string;
  acceptingCollaborations: string;
  availableForTravel: string;
  previousBrandCollaborations: string;
  industriesInterested: string[];
  industriesWontPromote: string[];
  contentLanguage: string;
  contentPlatforms: string;
  heardAboutUs: string;
  additionalInfo: string;
  termsAccepted: boolean;
  privacyAccepted: boolean;
};

export const INITIAL_INFLUENCER_FORM_STATE: InfluencerFormState = {
  fullName: "",
  contactNumber: "",
  alternativeContact: "",
  email: "",
  gender: "",
  age: "",
  languages: [],
  primaryCategory: "",
  subcategory: "",
  creatorType: "",
  bio: "",
  yearsAsCreator: "",
  currentOccupation: "",
  country: "India",
  state: "",
  city: "",
  district: "",
  area: "",
  addressLine1: "",
  addressLine2: "",
  houseNumber: "",
  landmark: "",
  pincode: "",
  instagram: "",
  secondInstagram: "",
  youtube: "",
  snapchat: "",
  facebook: "",
  twitter: "",
  linkedin: "",
  otherPlatforms: "",
  portfolioLink: "",
  mediaKitUrl: "",
  mediaKitPublicId: "",
  mediaKitFileName: "",
  rateCardUrl: "",
  rateCardPublicId: "",
  rateCardFileName: "",
  audienceCountry: "",
  audienceAge: "",
  audienceGender: "",
  monthlyReach: "",
  monthlyImpressions: "",
  averageStoryViews: "",
  averageReelViews: "",
  averageLast5VideoViews: "",
  engagementRate: "",
  participateEcommerce: "",
  interestedCampaigns: [],
  commercialReel: "",
  commercialStory: "",
  monthlyCampaignCapacity: "",
  acceptingCollaborations: "",
  availableForTravel: "",
  previousBrandCollaborations: "",
  industriesInterested: [],
  industriesWontPromote: [],
  contentLanguage: "",
  contentPlatforms: "",
  heardAboutUs: "",
  additionalInfo: "",
  termsAccepted: false,
  privacyAccepted: false,
};

export const INFLUENCER_FORM_SECTIONS = [
  "Personal Information",
  "Creator Information",
  "Location",
  "Social Media",
  "Audience Insights",
  "Collaboration",
  "Additional Info",
  "Consent",
] as const;

/**
 * Matches prompts/forms/influencer.md's "# Validation > Required fields" list exactly (not
 * every field marked `*` in the form-section outline, which is broader and includes the full
 * postal address — see lib/influencer/validate.ts for the same reasoning on the server side).
 */
export const REQUIRED_INFLUENCER_FIELDS: (keyof InfluencerFormState)[] = [
  "fullName",
  "contactNumber",
  "email",
  "instagram",
  "primaryCategory",
  "creatorType",
  "commercialReel",
  "commercialStory",
  "averageLast5VideoViews",
  "previousBrandCollaborations",
  "contentLanguage",
];

export const DRAFT_STORAGE_KEY = "rulescale-influencer-application-draft-v1";
