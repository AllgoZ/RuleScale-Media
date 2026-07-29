"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/container";
import type { ManifestoData } from "@/lib/cms/types";

export function Manifesto({ data }: { data: ManifestoData }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });
  const leadLines = data.lines.slice(0, -1).join(" ");
  const finalLine = data.lines[data.lines.length - 1];

  return (
    <section className="py-20 md:py-28">
      <Container>
        <div ref={ref} className="mx-auto max-w-3xl text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-heading text-3xl font-extrabold leading-tight text-ink text-balance md:text-4xl"
          >
            {leadLines ? `${leadLines} ` : null}
            <span className="gradient-text">{finalLine}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mt-5 max-w-lg text-base text-ink-soft"
          >
            {data.note}
          </motion.p>
        </div>
      </Container>
    </section>
  );
}
