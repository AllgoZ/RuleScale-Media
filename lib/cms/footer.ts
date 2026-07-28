import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { getPayloadClient } from "./payload-client";
import type { FooterData } from "./types";

const FALLBACK_FOOTER: FooterData = {
  blurb:
    "A full-service marketing agency for brands who want to be remembered, not just seen.",
  serviceLinks: [
    { label: "Website Design", href: "#services" },
    { label: "SEO", href: "#services" },
    { label: "Performance Marketing", href: "#services" },
    { label: "Social Media", href: "#services" },
    { label: "Video Production", href: "#services" },
    { label: "Brand Strategy", href: "#services" },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: "#top" },
    { label: "Terms of Service", href: "#top" },
  ],
  socialLinks: [
    { platform: "instagram", url: "#top" },
    { platform: "linkedin", url: "#top" },
    { platform: "youtube", url: "#top" },
  ],
};

async function fetchFooterFromPayload(): Promise<FooterData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "footer" });
  return {
    blurb: doc.blurb || FALLBACK_FOOTER.blurb,
    serviceLinks: doc.serviceLinks?.length
      ? doc.serviceLinks.map((link) => ({ label: link.label, href: link.href }))
      : FALLBACK_FOOTER.serviceLinks,
    legalLinks: doc.legalLinks?.length
      ? doc.legalLinks.map((link) => ({ label: link.label, href: link.href }))
      : FALLBACK_FOOTER.legalLinks,
    socialLinks: doc.socialLinks?.length
      ? doc.socialLinks.map((link) => ({ platform: link.platform, url: link.url }))
      : FALLBACK_FOOTER.socialLinks,
  };
}

const getCachedFooter = unstable_cache(fetchFooterFromPayload, [CACHE_TAGS.footer], {
  tags: [CACHE_TAGS.footer],
});

export const getFooter = cache(async (): Promise<FooterData> => {
  try {
    return await getCachedFooter();
  } catch (error) {
    console.error(
      "[cms] Failed to load footer from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_FOOTER;
  }
});
