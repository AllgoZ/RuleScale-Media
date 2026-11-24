import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ResultsData } from "@/lib/cms/types";

/** Stats rendered exactly as stored in the CMS: one very large row, no boxes, no count-up. */
export function Results({ data }: { data: ResultsData }) {
  return (
    <section aria-labelledby="results-heading" className="section bg-paper">
      <Container>
        <Reveal className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2
            id="results-heading"
            className="text-section max-w-md"
          >
            {data.heading}
          </h2>
          <p className="max-w-sm text-[15px] text-ink-soft">{data.note}</p>
        </Reveal>

        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-4">
          {data.stats.map((stat, index) => (
            <div
              key={stat.label}
              data-anim="up"
              data-anim-step={Math.min(index + 1, 5)}
              className="min-w-0"
            >
              <dd className="font-heading text-[clamp(2.75rem,1.2rem+4.2vw,5.25rem)] font-extrabold leading-[0.9] tracking-[-0.05em] text-ink">
                {stat.value}
                <span className="text-accent">{stat.suffix}</span>
              </dd>
              <dt className="mt-4 max-w-[14ch] text-sm font-medium text-ink-soft md:text-base">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
