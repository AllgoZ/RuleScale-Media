import { SITE_URL } from "@/lib/constants";
import type {
  FaqItemData,
  PortfolioItemData,
  PostData,
  ServiceItemData,
  SiteSettingsData,
} from "@/lib/cms/types";

export function organizationSchema(siteSettings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: siteSettings.siteName,
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    email: siteSettings.contactEmail,
    description: siteSettings.description,
    sameAs: siteSettings.sameAs,
  };
}

export function localBusinessSchema(siteSettings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#localbusiness`,
    name: siteSettings.siteName,
    image: `${SITE_URL}/icon.svg`,
    url: SITE_URL,
    email: siteSettings.contactEmail,
    priceRange: "$$$",
    description: siteSettings.description,
  };
}

export function serviceSchema(siteSettings: SiteSettingsData, services: ServiceItemData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Marketing Agency Services",
    provider: {
      "@type": "Organization",
      name: siteSettings.siteName,
      url: SITE_URL,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Marketing Services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          description: service.description,
        },
      })),
    },
  };
}

export function faqSchema(faq: FaqItemData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

/** `items` defaults to just Home — the homepage's only-ever call site keeps its
 * exact existing output. Blog pages pass a longer trail (Home > Blog > ... ). */
export function breadcrumbSchema(siteSettings: SiteSettingsData, items?: BreadcrumbItem[]) {
  const trail: BreadcrumbItem[] = items?.length ? items : [{ name: "Home", url: SITE_URL }];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}

export function articleSchema(post: PostData, siteSettings: SiteSettingsData) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}/#article`,
    headline: post.title,
    description: post.seo.metaDescription || post.excerpt,
    image: post.featuredImage?.url ? [post.featuredImage.url] : undefined,
    datePublished: post.publishedDate || post.updatedAt,
    dateModified: post.updatedAt,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : {
          "@type": "Organization",
          name: siteSettings.siteName,
        },
    publisher: {
      "@type": "Organization",
      name: siteSettings.siteName,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}

export function creativeWorkSchema(item: PortfolioItemData, siteSettings: SiteSettingsData) {
  const url = `${SITE_URL}/work/${item.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${url}/#work`,
    name: item.title,
    description: item.seo.metaDescription || item.description,
    image: item.thumbnail?.url ? [item.thumbnail.url] : undefined,
    creator: {
      "@type": "Organization",
      name: siteSettings.siteName,
    },
    about: item.client,
    keywords: item.services.join(", ") || undefined,
    url,
  };
}

export function videoObjectSchema(item: PortfolioItemData, siteSettings: SiteSettingsData) {
  const url = `${SITE_URL}/work/videos/${item.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "@id": `${url}/#video`,
    name: item.title,
    description: item.seo.metaDescription || item.description,
    thumbnailUrl: item.thumbnail?.url ? [item.thumbnail.url] : undefined,
    uploadDate: item.publishedAt || undefined,
    embedUrl: item.videoUrl || undefined,
    publisher: {
      "@type": "Organization",
      name: siteSettings.siteName,
    },
  };
}
