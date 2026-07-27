"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import type { ManifestoData } from "@/lib/cms/types";

export function Manifesto({ data }: { data: ManifestoData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  return (
    <section className="svh flex items-center py-24">
      <Container>
        <div ref={ref} className="mx-auto max-w-4xl text-center">
          <span className="font-hand -rotate-1 inline-block text-base text-accent">
            {data.eyebrow}
          </span>

          <p className="font-heading mt-6 text-3xl font-normal italic leading-[1.15] text-ink text-balance sm:text-4xl md:text-5xl">
            {data.lines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%", opacity: 0 }}
                  animate={inView ? { y: "0%", opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-base text-ink-soft"
          >
            {data.note}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
