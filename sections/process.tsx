"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Compass, Hammer, Rocket, Search, TrendingUp, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { PROCESS_STEPS } from "@/lib/constants";

const ICONS: LucideIcon[] = [Search, Compass, Hammer, Rocket, TrendingUp];

export function Process() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 85%", "end 60%"],
  });
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="process" className="py-28 md:py-40">
      <Container>
        <Reveal>
          <div className="max-w-lg">
            <span className="font-hand -rotate-1 inline-block text-base text-[#F97316]">
              here&apos;s how we think
            </span>
            <h2 className="text-editorial mt-3 text-ink text-balance">A plan, not a guess.</h2>
            <p className="mt-4 max-w-md text-base text-ink-soft">
              Five steps, every time — so you always know what happens next and why.
            </p>
          </div>
        </Reveal>

        {/* Mobile: simple vertical stack */}
        <div ref={trackRef} className="mt-16 flex flex-col gap-10 md:hidden">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = ICONS[index];
            return (
              <Reveal key={step.step} delay={index * 0.08}>
                <div className="flex gap-5">
                  <div className="relative shrink-0">
                    <span className="pointer-events-none absolute -left-2 -top-3 font-heading text-4xl font-extrabold text-ink/[0.07]">
                      {step.step}
                    </span>
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-hairline bg-paper text-ink-soft">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                  </div>
                  <div className="pt-1">
                    <h3 className="font-heading text-xl font-extrabold text-ink">{step.title}</h3>
                    <p className="mt-2 max-w-sm text-sm text-ink-soft">{step.description}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Desktop: elevated zig-zag path */}
        <div className="relative mt-24 hidden md:block">
          <svg
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-x-0 -top-8 h-32 w-full"
            fill="none"
          >
            <path
              d="M100 90 C200 90 200 30 300 30 C400 30 400 90 500 90 C600 90 600 30 700 30 C800 30 800 90 900 90"
              stroke="var(--color-hairline)"
              strokeWidth="2"
              fill="none"
            />
            <motion.path
              d="M100 90 C200 90 200 30 300 30 C400 30 400 90 500 90 C600 90 600 30 700 30 C800 30 800 90 900 90"
              stroke="var(--color-accent)"
              strokeWidth="2"
              fill="none"
              style={{ pathLength }}
            />
          </svg>

          <div className="grid grid-cols-5 gap-4">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = ICONS[index];
              const raised = index % 2 === 1;
              return (
                <Reveal key={step.step} delay={index * 0.08}>
                  <div
                    className={
                      "group flex flex-col items-center text-center " +
                      (raised ? "md:-translate-y-9" : "")
                    }
                  >
                    <div className="relative">
                      <span className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-heading text-7xl font-extrabold text-ink/[0.06]">
                        {step.step}
                      </span>
                      <span className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-hairline bg-paper text-ink-soft shadow-soft transition-all duration-300 group-hover:-translate-y-1 group-hover:border-accent group-hover:bg-accent group-hover:text-paper group-hover:shadow-lift">
                        <Icon size={22} strokeWidth={1.75} />
                      </span>
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-extrabold text-ink lg:text-xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink-soft">{step.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
