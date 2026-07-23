"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TESTIMONIALS.length);
    }, 5200);
    return () => clearInterval(id);
  }, [paused]);

  const active = TESTIMONIALS[index];

  return (
    <section className="py-28 md:py-40">
      <Container className="max-w-3xl">
        <Reveal className="text-center">
          <span className="font-hand -rotate-1 inline-block text-base text-accent">
            kind words
          </span>
        </Reveal>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-10 min-h-[16rem] text-center"
        >
          <span className="font-heading pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-7xl leading-none text-accent/15">
            &ldquo;
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-heading text-2xl font-normal italic leading-snug text-ink text-balance sm:text-3xl">
                {active.quote}
              </p>
              <p className="mt-6 text-sm font-semibold text-ink">{active.name}</p>
              <p className="text-sm text-ink-soft">{active.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((testimonial, i) => (
            <button
              key={testimonial.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show testimonial from ${testimonial.name}`}
              aria-current={i === index}
              className="p-1.5"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-accent" : "w-1.5 bg-ink/15"
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
