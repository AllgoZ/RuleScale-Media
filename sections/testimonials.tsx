"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { TestimonialsData } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function Testimonials({ data }: { data: TestimonialsData }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % data.items.length);
    }, 5200);
    return () => clearInterval(id);
  }, [paused, data.items.length]);

  const active = data.items[index];

  return (
    <section className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <Reveal className="text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>
        </Reveal>

        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative mt-8 min-h-[14rem]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[24px] border border-hairline bg-white p-8 text-center shadow-soft"
            >
              <p className="font-heading text-xl font-medium leading-snug text-ink text-balance">
                &ldquo;{active.quote}&rdquo;
              </p>
              <p className="mt-5 text-sm font-semibold text-ink">{active.name}</p>
              <p className="text-sm text-ink-soft">{active.title}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {data.items.map((testimonial, i) => (
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
                  i === index ? "gradient-bg w-6" : "w-1.5 bg-ink/15"
                )}
              />
            </button>
          ))}
        </div>
      </Container>
    </section>
  );
}
