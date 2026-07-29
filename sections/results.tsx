"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RollingNumber } from "@/components/ui/rolling-number";
import type { ResultsData } from "@/lib/cms/types";

export function Results({ data }: { data: ResultsData }) {
  const ref = useRef<HTMLDivElement>(null);
  const revealed = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });

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
          <p className="mt-3 text-base text-ink-soft">{data.note}</p>
        </Reveal>

        <div
          ref={ref}
          className="mt-14 grid divide-y divide-hairline overflow-hidden rounded-3xl border border-hairline bg-white sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4"
        >
          {data.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.08}>
              <div className="p-8 text-center">
                {/* Solid color, not .gradient-text — RollingNumber renders each digit as
                    its own nested span, and background-clip:text gradients don't inherit
                    through nested elements (only color does), so a gradient here would
                    leave every digit invisible instead of colored. Alternates between the
                    original brand red and the new purple accent so both palettes read as
                    genuinely mixed, not just adjacent. */}
                <p
                  className="font-heading text-4xl font-extrabold md:text-5xl"
                  style={{
                    color: index % 2 === 0 ? "var(--color-accent)" : "var(--color-accent-solid)",
                  }}
                >
                  <RollingNumber value={`${stat.value}${stat.suffix}`} revealed={revealed} />
                </p>
                <p className="mt-2 text-sm text-ink-soft">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
