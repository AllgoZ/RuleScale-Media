"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type ArrowVariant = "curveDown" | "curveRight" | "loop" | "pointUp";

const PATHS: Record<ArrowVariant, string> = {
  curveDown: "M8 4C10 40 60 46 40 88",
  curveRight: "M4 10C40 4 70 6 92 30",
  loop: "M4 40C10 8 50 4 60 24C68 40 40 48 38 30C36 16 58 8 76 18",
  pointUp: "M6 88C10 50 30 20 62 8",
};

const ARROWHEADS: Record<ArrowVariant, string> = {
  curveDown: "M32 78 L40 88 L50 80",
  curveRight: "M80 20 L92 30 L82 40",
  loop: "M66 12 L76 18 L68 26",
  pointUp: "M46 4 L62 8 L58 24",
};

export function HandArrow({
  variant = "curveDown",
  className,
  color = "var(--color-ink)",
  viewBox = "0 0 100 96",
}: {
  variant?: ArrowVariant;
  className?: string;
  color?: string;
  viewBox?: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      fill="none"
      className={cn("overflow-visible", className)}
      aria-hidden="true"
    >
      <motion.path
        d={PATHS[variant]}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d={ARROWHEADS[variant]}
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: 0.9 }}
      />
    </svg>
  );
}
