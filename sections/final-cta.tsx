import { Briefcase, Mail, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { FinalCtaData } from "@/lib/cms/types";

const WHATSAPP_NUMBER = "919500381132";
const WHATSAPP_DISPLAY = "+91 95003 81132";

export function FinalCTA({
  data,
  contactEmail,
  linkedinUrl,
  services,
  turnstileSiteKey,
}: {
  data: FinalCtaData;
  contactEmail: string;
  linkedinUrl: string | null;
  services: string[];
  turnstileSiteKey: string | null;
}) {
  return (
    <section id="final-cta" className="py-20 md:py-28">
      <Container>
        <div className="grid gap-2 overflow-hidden rounded-3xl border border-hairline bg-white p-2 lg:grid-cols-2">
          <Reveal className="gradient-bg flex flex-col justify-center rounded-[20px] p-8 text-white md:p-12">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-sm font-medium">
              {data.eyebrow}
            </span>
            <h2 className="mt-6 font-heading text-3xl font-extrabold leading-tight text-balance md:text-4xl">
              {data.heading}
            </h2>
            <p className="mt-4 max-w-md text-white/80">{data.subheading}</p>

            <div className="mt-8 flex flex-col gap-3">
              <a
                href={`mailto:${contactEmail}`}
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/15"
              >
                <Mail size={16} />
                {contactEmail}
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/15"
              >
                <Phone size={16} />
                {WHATSAPP_DISPLAY}
              </a>
              {linkedinUrl ? (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm transition-colors hover:bg-white/15"
                >
                  <Briefcase size={16} />
                  LinkedIn
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="p-8 md:p-12">
            <ContactForm services={services} turnstileSiteKey={turnstileSiteKey} />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
