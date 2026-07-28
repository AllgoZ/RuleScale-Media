import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { NAV_LINKS } from "@/lib/constants";
import { getPayloadClient } from "./payload-client";
import type { NavigationData } from "./types";

const FALLBACK_NAVIGATION: NavigationData = {
  links: NAV_LINKS.map((link) => ({ label: link.label, href: link.href })),
  ctaLabel: "Start Growing",
  ctaHref: "#final-cta",
};

async function fetchNavigationFromPayload(): Promise<NavigationData> {
  const payload = await getPayloadClient();
  const doc = await payload.findGlobal({ slug: "navigation" });
  return {
    links: doc.links?.length
      ? doc.links.map((link) => ({ label: link.label, href: link.href }))
      : FALLBACK_NAVIGATION.links,
    ctaLabel: doc.ctaLabel || FALLBACK_NAVIGATION.ctaLabel,
    ctaHref: doc.ctaHref || FALLBACK_NAVIGATION.ctaHref,
  };
}

const getCachedNavigation = unstable_cache(fetchNavigationFromPayload, [CACHE_TAGS.navigation], {
  tags: [CACHE_TAGS.navigation],
});

export const getNavigation = cache(async (): Promise<NavigationData> => {
  try {
    return await getCachedNavigation();
  } catch (error) {
    console.error(
      "[cms] Failed to load navigation from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_NAVIGATION;
  }
});
