import { Marquee } from "@/components/ui/marquee";
import { Container } from "@/components/ui/container";
import { TRUST_LOGOS } from "@/lib/constants";

export function TrustLogos() {
  return (
    <section aria-label="Featured on" className="py-20 md:py-28">
      <Container>
        <p className="text-center text-xs font-medium uppercase tracking-[0.25em] text-ink-soft/60">
          Our clients have been featured on
        </p>
      </Container>
      <div className="mt-10">
        <Marquee>
          {TRUST_LOGOS.map((logo) => (
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
