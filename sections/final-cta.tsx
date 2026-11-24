import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BrandDevice } from "@/components/doodles/brand-device";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { FinalCtaData } from "@/lib/cms/types";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

const contactLink =
  "group flex min-h-14 items-center justify-between gap-4 py-3 font-heading text-xl font-bold tracking-tight text-paper transition-colors hover:text-white md:text-2xl";

/**
 * Closing call to action. The full enquiry form lives at /contact (unchanged).
 * Left: the headline and one clear button. Right: direct contact methods as
 * large links. The brand device sits cropped behind.
 */
export function FinalCTA({
  data,
  contactEmail,
  instagramUrl,
}: {
  data: FinalCtaData;
  contactEmail: string;
  instagramUrl: string | null;
}) {
  return (
    <section
      id="final-cta"
      aria-labelledby="cta-heading"
      className="section on-ink relative overflow-hidden"
    >
      <BrandDevice className="pointer-events-none absolute -left-[14%] -top-[38%] w-[62%] max-w-[780px] text-paper/[0.06]" />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-end lg:gap-12">
          <Reveal className="lg:col-span-7">
            <h2
              id="cta-heading"
              className="text-balance font-heading text-[clamp(2.25rem,1rem+4.6vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em]"
            >
              {data.heading}
            </h2>
            <p className="text-lead mt-6 max-w-md">{data.subheading}</p>
            <Button asChild variant="accent" size="lg" className="mt-10 hover:bg-paper hover:text-ink">
              <Link href="/contact">
                Start a project
                <ArrowRight size={18} />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-5">
            <p className="eyebrow">Or reach us directly</p>
            <ul className="mt-3 divide-y divide-paper/15">
              <li>
                <a href={`mailto:${contactEmail}`} className={contactLink}>
                  <span className="break-all">{contactEmail}</span>
                  <ArrowUpRight size={22} aria-hidden="true" className="shrink-0 text-accent" />
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={contactLink}>
                  <span>WhatsApp {WHATSAPP_DISPLAY}</span>
                  <ArrowUpRight size={22} aria-hidden="true" className="shrink-0 text-accent" />
                </a>
              </li>
              {instagramUrl ? (
                <li>
                  <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={contactLink}>
                    <span>Instagram</span>
                    <ArrowUpRight size={22} aria-hidden="true" className="shrink-0 text-accent" />
                  </a>
                </li>
              ) : null}
            </ul>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
