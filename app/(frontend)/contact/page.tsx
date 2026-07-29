import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getTurnstileSiteKey } from "@/lib/env";
import { getSiteSettings } from "@/lib/cms/settings";
import { SERVICES } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const title = `Contact | ${siteSettings.siteName}`;
  const description = `Tell us about your project and we'll get back to you within one business day.`;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title, description, url: `${siteSettings.url}/contact` },
    twitter: { title, description },
  };
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const services = SERVICES.map((service) => service.title);
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <main className="py-16 md:py-24">
      <Container className="max-w-2xl">
        <Reveal>
          <span className="font-hand -rotate-1 inline-block text-base text-accent">
            let&apos;s talk
          </span>
          <h1 className="text-editorial mt-2 text-ink text-balance">Tell us about your project</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Fill out the form below and someone from the {siteSettings.siteName} team will get
            back to you within one business day — or email us directly at{" "}
            <a href={`mailto:${siteSettings.contactEmail}`} className="text-ink underline">
              {siteSettings.contactEmail}
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <ContactForm services={services} turnstileSiteKey={turnstileSiteKey} />
        </Reveal>
      </Container>
    </main>
  );
}
