import type { Metadata, Viewport } from "next";
import { Archivo, Caveat } from "next/font/google";
import { MobileCTA } from "@/components/mobile-cta";
import { getFooter } from "@/lib/cms/footer";
import { getHomepage } from "@/lib/cms/homepage";
import { getNavigation } from "@/lib/cms/navigation";
import { getSiteSettings } from "@/lib/cms/settings";
import {
  breadcrumbSchema,
  faqSchema,
  localBusinessSchema,
  organizationSchema,
  serviceSchema,
} from "@/lib/schema";
import { buildSiteMetadata } from "@/lib/seo/metadata";
import { Footer } from "@/sections/footer";
import { Header } from "@/sections/header";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#201e1d",
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  return buildSiteMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navigation, footer, siteSettings, homepage] = await Promise.all([
    getNavigation(),
    getFooter(),
    getSiteSettings(),
    getHomepage(),
  ]);

  const jsonLd = [
    organizationSchema(siteSettings),
    localBusinessSchema(siteSettings),
    serviceSchema(siteSettings, homepage.services.items),
    faqSchema(homepage.faq.items),
    breadcrumbSchema(siteSettings),
  ];

  return (
    <html
      lang="en"
      className={`${archivo.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <div className="bg-atmosphere" aria-hidden="true" />
        <div className="grain-overlay" aria-hidden="true" />
        <div className="bg-vignette" aria-hidden="true" />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <Header navigation={navigation} siteName={siteSettings.siteName} />
          {children}
          <Footer
            footer={footer}
            companyLinks={navigation.links}
            siteName={siteSettings.siteName}
            contactEmail={siteSettings.contactEmail}
          />
        </div>
        <MobileCTA />
      </body>
    </html>
  );
}
