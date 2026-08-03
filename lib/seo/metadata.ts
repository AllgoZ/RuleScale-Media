import type { Metadata } from "next";
import { getSEOSettings, getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";

export async function buildSiteMetadata(): Promise<Metadata> {
  const [siteSettings, seoSettings] = await Promise.all([getSiteSettings(), getSEOSettings()]);

  const title = {
    default: seoSettings.defaultTitle,
    template: `%s | ${siteSettings.siteName}`,
  };
  const description = seoSettings.defaultDescription;

  const twitter: Metadata["twitter"] = {
    card: "summary_large_image",
    title: seoSettings.defaultTitle,
    description,
    images: ["/opengraph-image"],
  };
  if (seoSettings.twitterHandle) {
    twitter.site = seoSettings.twitterHandle;
    twitter.creator = seoSettings.twitterHandle;
  }

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: seoSettings.keywords,
    authors: [{ name: siteSettings.siteName }],
    creator: siteSettings.siteName,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: SITE_URL,
      siteName: siteSettings.siteName,
      title: seoSettings.defaultTitle,
      description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: seoSettings.ogImageAlt,
        },
      ],
    },
    twitter,
    robots: {
      index: seoSettings.robotsIndex,
      follow: seoSettings.robotsFollow,
      googleBot: {
        index: seoSettings.robotsIndex,
        follow: seoSettings.robotsFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
