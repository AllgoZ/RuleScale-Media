import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import {
  CONTACT_EMAIL,
  INSTAGRAM_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";
import { getPayloadClient } from "./payload-client";
import type { SEOSettingsData, SiteSettingsData } from "./types";

const FALLBACK_SITE_SETTINGS: SiteSettingsData = {
  siteName: SITE_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  contactEmail: CONTACT_EMAIL,
  sameAs: [INSTAGRAM_URL],
};

const FALLBACK_SEO_SETTINGS: SEOSettingsData = {
  defaultTitle: `${SITE_NAME} | ${SITE_TAGLINE}`,
  defaultDescription: SITE_DESCRIPTION,
  keywords: [
    "marketing agency",
    "website design and development",
    "SEO agency",
    "social media marketing",
    "influencer marketing",
    "programmatic advertising",
    "video production",
    "content marketing",
    "brand strategy consulting",
  ],
  ogImageAlt: SITE_NAME,
  twitterHandle: "",
  robotsIndex: true,
  robotsFollow: true,
};

async function fetchSiteSettingsFromPayload(): Promise<SiteSettingsData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "siteSettings" });
  return {
    siteName: doc.siteName || FALLBACK_SITE_SETTINGS.siteName,
    tagline: doc.tagline || FALLBACK_SITE_SETTINGS.tagline,
    description: doc.description || FALLBACK_SITE_SETTINGS.description,
    url: doc.url || FALLBACK_SITE_SETTINGS.url,
    contactEmail: doc.contactEmail || FALLBACK_SITE_SETTINGS.contactEmail,
    sameAs: doc.sameAs?.length
      ? doc.sameAs.map((entry) => entry.url)
      : FALLBACK_SITE_SETTINGS.sameAs,
  };
}

async function fetchSEOSettingsFromPayload(): Promise<SEOSettingsData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "seoSettings" });
  return {
    defaultTitle: doc.defaultTitle || FALLBACK_SEO_SETTINGS.defaultTitle,
    defaultDescription: doc.defaultDescription || FALLBACK_SEO_SETTINGS.defaultDescription,
    keywords: doc.keywords?.length
      ? doc.keywords.map((entry) => entry.keyword)
      : FALLBACK_SEO_SETTINGS.keywords,
    ogImageAlt: doc.ogImageAlt || FALLBACK_SEO_SETTINGS.ogImageAlt,
    twitterHandle: doc.twitterHandle || FALLBACK_SEO_SETTINGS.twitterHandle,
    robotsIndex: doc.robotsIndex ?? FALLBACK_SEO_SETTINGS.robotsIndex,
    robotsFollow: doc.robotsFollow ?? FALLBACK_SEO_SETTINGS.robotsFollow,
  };
}

const getCachedSiteSettings = unstable_cache(
  fetchSiteSettingsFromPayload,
  [CACHE_TAGS.siteSettings],
  { tags: [CACHE_TAGS.siteSettings] }
);

const getCachedSEOSettings = unstable_cache(
  fetchSEOSettingsFromPayload,
  [CACHE_TAGS.seoSettings],
  { tags: [CACHE_TAGS.seoSettings] }
);

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    return await getCachedSiteSettings();
  } catch (error) {
    console.error(
      "[cms] Failed to load site settings from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_SITE_SETTINGS;
  }
});

export const getSEOSettings = cache(async (): Promise<SEOSettingsData> => {
  try {
    return await getCachedSEOSettings();
  } catch (error) {
    console.error(
      "[cms] Failed to load SEO settings from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_SEO_SETTINGS;
  }
});
