import type { Metadata, Viewport } from "next";
import { Archivo, Caveat } from "next/font/google";
import Script from "next/script";
import { MobileCTA } from "@/components/mobile-cta";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
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

const GTM_ID = "GTM-K28PK4V6";

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
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <Script
          id="gtm-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
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
          />
        </div>
        <MobileCTA />
        <WhatsAppButton />
      </body>
    </html>
  );
}
