import {
  CONTACT_EMAIL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
} from "@/lib/constants";
import { getPayloadClient } from "./payload-client";
import type { SiteSettingsData } from "./types";

const FALLBACK_SITE_SETTINGS: SiteSettingsData = {
  siteName: SITE_NAME,
  tagline: SITE_TAGLINE,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  contactEmail: CONTACT_EMAIL,
  sameAs: [
    "https://www.linkedin.com/company/rulescale-media",
    "https://www.instagram.com/rulescalemedia",
  ],
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
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
  } catch (error) {
    console.error(
      "[cms] Failed to load site settings from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_SITE_SETTINGS;
  }
}
