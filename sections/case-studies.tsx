import { Globe } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { CaseStudiesData } from "@/lib/cms/types";

export function CaseStudies({ data }: { data: CaseStudiesData }) {
  return (
    <section id="case-studies" className="py-20 md:py-28">
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

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {data.items.map((study, index) => (
            <Reveal key={study.client} delay={index * 0.1}>
              <article className="h-full rounded-[24px] border border-hairline bg-white p-7 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                    <Globe size={11} />
                    {study.industry}
                  </span>
                  <span className="text-xs font-medium text-ink-soft">{study.client}</span>
                </div>

                <h3 className="mt-4 font-heading text-xl font-bold leading-snug text-ink">
                  {study.result}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{study.summary}</p>

                <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-4">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-ink/[0.04] px-3 py-1 text-xs font-medium text-ink-soft"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
