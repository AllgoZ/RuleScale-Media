import type { FaqItemData, ServiceItemData, SiteSettingsData } from "@/lib/cms/types";

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

export function breadcrumbSchema(siteSettings: SiteSettingsData) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteSettings.url,
      },
    ],
  };
}
