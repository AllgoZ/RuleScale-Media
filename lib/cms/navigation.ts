import { NAV_LINKS } from "@/lib/constants";
import { getPayloadClient } from "./payload-client";
import type { NavigationData } from "./types";

const FALLBACK_NAVIGATION: NavigationData = {
  links: NAV_LINKS.map((link) => ({ label: link.label, href: link.href })),
  ctaLabel: "Start Growing",
  ctaHref: "#final-cta",
};

export async function getNavigation(): Promise<NavigationData> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "navigation" });
    return {
      links: doc.links?.length
        ? doc.links.map((link) => ({ label: link.label, href: link.href }))
        : FALLBACK_NAVIGATION.links,
      ctaLabel: doc.ctaLabel || FALLBACK_NAVIGATION.ctaLabel,
      ctaHref: doc.ctaHref || FALLBACK_NAVIGATION.ctaHref,
    };
  } catch (error) {
    console.error(
      "[cms] Failed to load navigation from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_NAVIGATION;
  }
}
