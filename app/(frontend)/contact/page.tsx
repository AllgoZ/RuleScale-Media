import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";
import { getTurnstileSiteKey } from "@/lib/env";
import { getSiteSettings } from "@/lib/cms/settings";
import { SERVICES, SITE_URL } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const title = `Contact | ${siteSettings.siteName}`;
  const description = `Tell us about your project and we'll get back to you within one business day.`;
  return {
    title,
    description,
    alternates: { canonical: "/contact" },
    openGraph: { title, description, url: `${SITE_URL}/contact` },
    twitter: { title, description },
  };
}

export default async function ContactPage() {
  const siteSettings = await getSiteSettings();
  const services = SERVICES.map((service) => service.title);
  const turnstileSiteKey = getTurnstileSiteKey();

  return (
    <main className="section">
      <Container>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow">Let&apos;s talk</p>
            <h1 className="text-editorial mt-5 text-balance">Tell us about your project</h1>
            <p className="text-lead mt-6 max-w-md">
              Share a few details and someone from the {siteSettings.siteName} team will reply
              within one business day.
            </p>
            <ul className="mt-10 flex flex-col gap-2 border-t border-hairline pt-6 text-[15px]">
              <li>
                <span className="eyebrow">Email</span>
                <a
                  href={`mailto:${siteSettings.contactEmail}`}
                  className="mt-1 flex min-h-11 items-center font-heading text-lg font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
                >
                  {siteSettings.contactEmail}
                </a>
              </li>
              <li className="mt-2">
                <span className="eyebrow">WhatsApp</span>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex min-h-11 items-center font-heading text-lg font-bold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <div className="rounded-md bg-paper-2 p-6 md:p-10">
              <ContactForm services={services} turnstileSiteKey={turnstileSiteKey} />
            </div>
          </Reveal>
        </div>
      </Container>
    </main>
  );
}
