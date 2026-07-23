"use client";

import { useInView } from "framer-motion";
import { Briefcase, Heart, Target, Users, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RollingNumber } from "@/components/ui/rolling-number";
import { RESULTS_STATS } from "@/lib/constants";

const ICONS: LucideIcon[] = [Briefcase, Users, Target, Heart];

export function Results() {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

  return (
    <section className="bg-ink bg-dot-grid py-24 text-paper md:py-32">
      <Container>
        <Reveal className="text-center">
          <span className="font-hand -rotate-1 inline-block text-base text-accent">
            the numbers
          </span>
          <h2 className="mt-3 font-heading text-3xl font-extrabold tracking-tight text-paper text-balance md:text-4xl">
            Growth you can measure.
          </h2>
        </Reveal>

        <div ref={ref} className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {RESULTS_STATS.map((stat, index) => {
            const Icon = ICONS[index];
            return (
              <Reveal key={stat.label} delay={index * 0.08}>
                <div className="h-full rounded-[28px] border border-paper/10 bg-paper/[0.05] p-6 backdrop-blur-xl transition-colors duration-300 hover:bg-paper/[0.08] md:p-7">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-paper/70">
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  <p className="mt-6 font-heading text-4xl font-extrabold text-paper md:text-5xl">
                    <RollingNumber value={`${stat.value}${stat.suffix}`} revealed={revealed} />
                  </p>
                  <p className="mt-2 text-sm text-paper/50">{stat.label}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p className="mx-auto mt-12 max-w-sm text-center text-base text-paper/50">
            Every engagement is measured against outcomes we agree on before we start — no
            vanity metrics.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
