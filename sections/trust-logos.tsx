import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { TrustLogosData } from "@/lib/cms/types";

export function TrustLogos({ data }: { data: TrustLogosData }) {
  return (
    <section aria-label="Featured on" className="py-16 md:py-20">
      <Container>
        <Reveal>
          <p className="text-center text-sm font-medium text-ink-soft">{data.label}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {data.logos.map((logo) => (
            <span
              key={logo}
              className="rounded-xl border border-hairline bg-white px-6 py-3 font-heading text-sm font-bold text-ink-soft transition-colors hover:text-ink"
            >
              {logo}
            </span>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
