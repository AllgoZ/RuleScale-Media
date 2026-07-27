import { Marquee } from "@/components/ui/marquee";
import { Container } from "@/components/ui/container";
import type { TrustLogosData } from "@/lib/cms/types";

export function TrustLogos({ data }: { data: TrustLogosData }) {
  return (
    <section aria-label="Featured on" className="py-20 md:py-28">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-ink-soft/60">
          {data.label}
        </p>
      </Container>
      <div className="mt-10">
        <Marquee>
          {data.logos.map((logo) => (
            <span
              key={logo}
              className="font-heading text-xl font-bold text-ink-soft/30 transition-colors hover:text-ink-soft"
            >
              {logo}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
