import { Compass, Hammer, Rocket, Search, TrendingUp, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ProcessData } from "@/lib/cms/types";

const ICONS: LucideIcon[] = [Search, Compass, Hammer, Rocket, TrendingUp];

export function Process({ data }: { data: ProcessData }) {
  return (
    <section id="process" className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {data.heading}
          </h2>
          <p className="mt-3 text-base text-ink-soft">{data.description}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.steps.map((step, index) => {
            const Icon = ICONS[index];
            return (
              <Reveal key={step.step} delay={index * 0.08}>
                <div className="relative h-full rounded-[24px] border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="pointer-events-none absolute right-5 top-5 font-heading text-2xl font-extrabold text-ink/[0.08]">
                    {step.step}
                  </span>
                  <span className="gradient-bg flex h-12 w-12 items-center justify-center rounded-full text-white">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-bold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
