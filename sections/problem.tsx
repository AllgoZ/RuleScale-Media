import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ProblemData } from "@/lib/cms/types";

export function Problem({ data }: { data: ProblemData }) {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {data.heading}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {data.cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.1}>
              <div className="h-full rounded-[24px] border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="inline-block rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                  {card.tag}
                </span>
                <p className="mt-4 font-heading text-lg font-bold leading-snug text-ink">
                  {card.title}
                  {card.highlight ? (
                    <span className="gradient-text block">{card.highlight}</span>
                  ) : null}
                </p>
                <p className="mt-3 text-sm text-ink-soft">{card.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
