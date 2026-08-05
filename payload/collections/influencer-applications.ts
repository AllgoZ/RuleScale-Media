import type { CollectionConfig } from "payload";
import {
  APPLICATION_STATUS_OPTIONS,
  CAMPAIGN_TYPE_OPTIONS,
  CREATOR_FACE_TYPE_OPTIONS,
  CREATOR_TYPE_OPTIONS,
  GENDER_OPTIONS,
  HEARD_ABOUT_US_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  PRIMARY_CATEGORY_OPTIONS,
  TIER_OPTIONS,
  VERIFICATION_STATUS_OPTIONS,
  YES_NO_OPTIONS,
} from "@/lib/influencer/options";
import { isAdmin, isAdminOrEditor } from "../access";

// Public submissions go through /api/influencer (validation, rate limiting, honeypot,
// duplicate-application check) via the Local API, which bypasses access control entirely —
// same pattern as the Leads collection. Denying create here closes the raw REST/GraphQL
// create endpoint without affecting the real submit path.
// dbName is deliberately shorter than the slug — Postgres identifiers cap at 63 characters,
// and the versions table's generated enum names (enum__<dbName>_v_version_<field>) blow past
// that with the full "influencer_applications" prefix once versions: true is on.
export const InfluencerApplications: CollectionConfig = {
  slug: "influencer-applications",
  dbName: "influencer_apps",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: [
      "fullName",
      "email",
      "primaryCategory",
      "city",
      "tier",
      "status",
      "createdAt",
    ],
    listSearchableFields: ["fullName", "email", "contactNumber", "instagram", "city"],
  },
  access: {
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: true,
  fields: [
    // --- 1. Personal information ---
    { name: "fullName", type: "text", required: true },
    { name: "contactNumber", type: "text", required: true },
    { name: "alternativeContact", type: "text" },
    { name: "email", type: "email", required: true },
    { name: "gender", type: "select", options: [...GENDER_OPTIONS] },
    { name: "age", type: "number", min: 0 },
    {
      name: "languages",
      type: "text",
      hasMany: true,
      admin: { description: "Languages the creator speaks/writes, not necessarily content language." },
    },

    // --- 2. Creator information ---
    { name: "primaryCategory", type: "select", required: true, options: [...PRIMARY_CATEGORY_OPTIONS] },
    { name: "subcategory", type: "text" },
    { name: "creatorType", type: "select", required: true, options: [...CREATOR_TYPE_OPTIONS] },
    { name: "bio", type: "textarea" },
    { name: "yearsAsCreator", type: "number", min: 0 },
    { name: "currentOccupation", type: "text" },

    // --- 3. Location ---
    { name: "country", type: "text", defaultValue: "India" },
    { name: "state", type: "text" },
    { name: "city", type: "text" },
    { name: "district", type: "text" },
    { name: "area", type: "text" },
    { name: "addressLine1", type: "text" },
    { name: "addressLine2", type: "text" },
    { name: "houseNumber", type: "text" },
    { name: "landmark", type: "text" },
    { name: "pincode", type: "text" },

    // --- 4. Social media profiles ---
    { name: "instagram", type: "text", required: true },
    { name: "instagramFollowers", type: "number", min: 0 },
    {
      name: "creatorFaceType",
      type: "select",
      hasMany: true,
      options: [...CREATOR_FACE_TYPE_OPTIONS],
      admin: { description: "Whether this creator shows their face in Instagram content." },
    },
    { name: "secondInstagram", type: "text" },
    { name: "secondInstagramFollowers", type: "number", min: 0 },
    { name: "youtube", type: "text" },
    { name: "youtubeFollowers", type: "number", min: 0 },
    { name: "snapchat", type: "text" },
    { name: "snapchatFollowers", type: "number", min: 0 },
    { name: "facebook", type: "text" },
    { name: "facebookFollowers", type: "number", min: 0 },
    { name: "twitter", type: "text" },
    { name: "twitterFollowers", type: "number", min: 0 },
    { name: "linkedin", type: "text" },
    { name: "linkedinFollowers", type: "number", min: 0 },
    { name: "otherPlatforms", type: "text", admin: { description: "Other social profile links." } },
    { name: "portfolioLink", type: "text", admin: { description: "Drive / portfolio website link." } },
    { name: "mediaKitUrl", type: "text", admin: { description: "Cloudinary URL of the uploaded PDF." } },
    { name: "mediaKitPublicId", type: "text", admin: { hidden: true } },
    { name: "rateCardUrl", type: "text", admin: { description: "Cloudinary URL of the uploaded PDF." } },
    { name: "rateCardPublicId", type: "text", admin: { hidden: true } },

    // --- 5. Audience insights ---
    { name: "audienceCountry", type: "text" },
    { name: "audienceAge", type: "text", admin: { description: "e.g. 18–24" } },
    { name: "audienceGender", type: "text" },
    { name: "monthlyReach", type: "number", min: 0 },
    { name: "monthlyImpressions", type: "number", min: 0 },
    { name: "averageStoryViews", type: "number", min: 0 },
    { name: "averageReelViews", type: "number", min: 0 },
    { name: "averageLast5VideoViews", type: "number", required: true, min: 0 },
    { name: "engagementRate", type: "number", min: 0, admin: { description: "Percentage, e.g. 4.5" } },

    // --- 6. Collaboration details ---
    { name: "participateEcommerce", type: "select", options: [...YES_NO_OPTIONS] },
    { name: "interestedCampaigns", type: "select", hasMany: true, options: [...CAMPAIGN_TYPE_OPTIONS] },
    { name: "commercialReel", type: "number", required: true, min: 0, admin: { description: "Price for one reel." } },
    { name: "commercialStory", type: "number", required: true, min: 0, admin: { description: "Price for one story." } },
    { name: "monthlyCampaignCapacity", type: "number", min: 0 },
    { name: "acceptingCollaborations", type: "select", options: [...YES_NO_OPTIONS] },
    { name: "availableForTravel", type: "select", options: [...YES_NO_OPTIONS] },
    { name: "previousBrandCollaborations", type: "textarea", required: true },
    { name: "industriesInterested", type: "text", hasMany: true },
    { name: "industriesWontPromote", type: "text", hasMany: true },
    { name: "contentLanguage", type: "text", required: true },
    { name: "contentPlatforms", type: "text", admin: { description: "Other platforms this creator publishes on." } },

    // --- 7. Additional information ---
    { name: "heardAboutUs", type: "select", options: [...HEARD_ABOUT_US_OPTIONS] },
    { name: "additionalInfo", type: "textarea" },

    // --- 8. Consent ---
    {
      name: "termsAccepted",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: {
        description:
          "Confirms the information provided is accurate and consents to RuleScale Media storing it for collaboration opportunities, per the Terms.",
      },
    },
    {
      name: "privacyAccepted",
      type: "checkbox",
      required: true,
      defaultValue: false,
      admin: { description: "Agrees to the Privacy Policy." },
    },

    // --- CRM (admin-only, not on the public form) ---
    { name: "status", type: "select", defaultValue: "applied", options: [...APPLICATION_STATUS_OPTIONS] },
    { name: "internalNotes", type: "textarea" },
    { name: "assignedManager", type: "relationship", relationTo: "users" },
    {
      name: "verificationStatus",
      type: "select",
      defaultValue: "unverified",
      options: [...VERIFICATION_STATUS_OPTIONS],
    },
    { name: "creatorScore", type: "number", min: 0, max: 100 },
    { name: "tier", type: "select", options: [...TIER_OPTIONS] },
    { name: "lastContactDate", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "nextFollowup", type: "date", admin: { date: { pickerAppearance: "dayOnly" } } },
    { name: "paymentStatus", type: "select", defaultValue: "not-applicable", options: [...PAYMENT_STATUS_OPTIONS] },
    { name: "contractSigned", type: "checkbox", defaultValue: false },

    // --- Attribution (captured automatically, not visitor-editable) ---
    {
      name: "attribution",
      type: "group",
      admin: {
        description: "Captured automatically from the application form — not visitor-editable.",
      },
      fields: [
        { name: "ipAddress", type: "text" },
        { name: "userAgent", type: "text" },
        { name: "referrer", type: "text" },
        { name: "landingPage", type: "text" },
        { name: "device", type: "text" },
        { name: "browser", type: "text" },
      ],
    },
  ],
};
