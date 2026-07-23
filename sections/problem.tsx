import type { CSSProperties } from "react";
import { HandArrow } from "@/components/doodles/hand-arrow";
import { PaperClip } from "@/components/doodles/paper-clip";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PROBLEM_CARDS } from "@/lib/constants";

export function Problem() {
  return (
    <section className="py-28 md:py-40">
      <Container>
        <Reveal className="text-center">
          <span className="font-hand -rotate-1 inline-block text-lg text-[#F97316]">
            The problem
          </span>
          <h2 className="mt-3 font-heading text-4xl font-extrabold tracking-tight text-ink text-balance md:text-5xl">
            Sound familiar?
          </h2>
        </Reveal>

        <div className="relative mt-20 grid gap-10 md:grid-cols-3 md:gap-6">
          <div
            className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px bg-hairline md:block"
            aria-hidden="true"
          />

          {PROBLEM_CARDS.map((card, index) => (
            <Reveal key={card.title} delay={index * 0.12}>
              <div className="relative">
                <PaperClip className="absolute -top-4 left-1/2 z-10 -translate-x-1/2" />
                <div
                  style={{ "--card-rotate": `${card.rotate}deg` } as CSSProperties}
                  className="rotate-[var(--card-rotate)] rounded-2xl border border-hairline bg-paper p-7 pt-9 shadow-soft transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:shadow-lift"
                >
                  <span className="inline-block rounded-full bg-[#FDE047] px-3 py-1 font-hand text-lg uppercase tracking-wide text-ink">
                    {card.tag}
                  </span>
                  <p className="mt-4 font-heading text-xl font-bold leading-snug text-ink">
                    {card.title}
                    {card.highlight ? (
                      <span className="block text-[#F97316]">{card.highlight}</span>
                    ) : null}
                  </p>
                  <p className="mt-3 text-sm text-ink-soft">{card.note}</p>
                </div>

                {index < PROBLEM_CARDS.length - 1 ? (
                  <HandArrow
                    variant="curveRight"
                    className="absolute -right-8 top-1/2 hidden h-10 w-16 -translate-y-1/2 text-ink-soft md:block"
                  />
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
