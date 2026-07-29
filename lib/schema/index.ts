import type {
  FaqItemData,
  PostData,
  ServiceItemData,
  SiteSettingsData,
} from "@/lib/cms/types";

export function organizationSchema(siteSettings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteSettings.url}/#organization`,
    name: siteSettings.siteName,
    url: siteSettings.url,
    logo: `${siteSettings.url}/icon.svg`,
    email: siteSettings.contactEmail,
    description: siteSettings.description,
    sameAs: siteSettings.sameAs,
  };
}

export function localBusinessSchema(siteSettings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteSettings.url}/#localbusiness`,
    name: siteSettings.siteName,
    image: `${siteSettings.url}/icon.svg`,
    url: siteSettings.url,
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
      url: siteSettings.url,
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
  const trail: BreadcrumbItem[] = items?.length
    ? items
    : [{ name: "Home", url: siteSettings.url }];

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
  const url = `${siteSettings.url}/blog/${post.slug}`;
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
        url: `${siteSettings.url}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };
}
