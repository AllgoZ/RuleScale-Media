"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function ScribbleUnderline({
  className,
  color = "var(--color-accent)",
  delay = 0,
}: {
  className?: string;
  color?: string;
  delay?: number;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      className={cn("absolute left-0 w-full", className)}
      aria-hidden="true"
    >
      <motion.path
        d="M2 9.5C34 3.5 72 2 101 6.5C130 11 168 12.5 198 5"
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={inView ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}
