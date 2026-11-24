import { BrandDevice } from "@/components/doodles/brand-device";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ManifestoData, ProblemData } from "@/lib/cms/types";

/**
 * "Why us": the Problem statements and the Manifesto share one full-bleed red
 * surface. Left: three lines the visitor will recognise. Right: the manifesto
 * at display size, with the brand device cropped behind it. Both still read
 * their CMS content (problem + manifesto globals).
 *
 * Contrast: ink on brand red (3.75:1) and white on brand red (4.2:1) are used
 * only at large/bold sizes, which is the WCAG AA large-text threshold (3:1).
 */
export function Why({ problem, manifesto }: { problem: ProblemData; manifesto: ManifestoData }) {
  const leadLines = manifesto.lines.slice(0, -1).join(" ");
  const finalLine = manifesto.lines[manifesto.lines.length - 1];

  return (
    <section
      aria-labelledby="why-heading"
      className="section relative overflow-hidden bg-accent text-ink"
    >
      <BrandDevice className="pointer-events-none absolute -bottom-[30%] -right-[12%] w-[70%] max-w-[900px] text-ink/10" />

      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-x-16">
          <Reveal className="lg:col-span-5">
            <h2 id="why-heading" className="font-heading text-lg font-bold">
              {problem.heading}
            </h2>
            <ul className="mt-6 flex flex-col gap-7">
              {problem.cards.map((card) => (
                <li
                  key={card.title}
                  className="font-heading text-[clamp(1.5rem,1.1rem+1.2vw,2rem)] font-extrabold leading-[1.1] tracking-tight"
                >
                  {card.title}
                  {card.highlight ? <span className="block text-white">{card.highlight}</span> : null}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-7">
            <p className="font-heading text-[clamp(2rem,1rem+3.8vw,4.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-white text-balance">
              {leadLines ? `${leadLines} ` : null}
              <span className="text-ink">{finalLine}</span>
            </p>
            <p className="mt-8 max-w-md font-heading text-xl font-bold">{manifesto.note}</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
