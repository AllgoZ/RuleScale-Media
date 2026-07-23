import { ArrowUpRight, Globe, Lock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CASE_STUDIES } from "@/lib/constants";

const OFFSETS = ["lg:mt-0", "lg:mt-20", "lg:mt-8"];

function BrowserMock({
  index,
  result,
}: {
  index: number;
  result: string;
}) {
  return (
    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-hairline bg-white shadow-soft transition-shadow duration-300 group-hover:shadow-lift">
      <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink/10" />
        </div>
        <div className="flex flex-1 items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1 text-[10px] text-ink-soft">
          <Lock size={9} />
          <span className="truncate">client-{index + 1}.rulescale.media</span>
        </div>
      </div>

      <div className="relative flex h-full flex-col gap-2.5 p-5">
        <div className="h-3 w-2/5 rounded-full bg-ink/10" />
        <div className="mt-1 h-8 w-4/5 rounded-lg bg-ink/[0.06]" />
        <div className="flex flex-1 items-end gap-2 pt-3">
          {[30, 55, 40, 70, 50, 85, 65].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-accent/25" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-between bg-ink/95 px-5 py-4 text-paper backdrop-blur-sm transition-transform duration-300 ease-out group-hover:translate-y-0">
        <span className="font-heading text-sm font-bold">{result}</span>
        <span className="inline-flex items-center gap-1 text-xs text-paper/70">
          View case study
          <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

export function CaseStudies() {
  return (
    <section id="case-studies" className="py-28 md:py-40">
      <Container>
        <Reveal>
          <div className="max-w-lg">
            <span className="font-hand -rotate-1 inline-block text-base text-accent">
              here&apos;s proof
            </span>
            <h2 className="text-editorial mt-3 text-ink text-balance">
              Recent work we&apos;re proud of.
            </h2>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-x-8 gap-y-16 lg:grid-cols-3">
          {CASE_STUDIES.map((study, index) => (
            <Reveal key={study.client} delay={index * 0.1} className={OFFSETS[index % OFFSETS.length]}>
              <article className="group">
                <BrowserMock index={index} result={study.result} />

                <div className="mt-5 flex items-baseline justify-between">
                  <h3 className="font-heading text-lg font-bold text-ink">{study.client}</h3>
                  <span className="flex items-center gap-1 text-xs text-ink-soft">
                    <Globe size={11} />
                    {study.industry}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-soft">{study.summary}</p>
                <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {study.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium text-ink-soft/70">
                      #{tag.replace(/\s+/g, "")}
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
