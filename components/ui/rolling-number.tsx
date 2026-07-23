"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

function RollingDigit({ digit, delay }: { digit: number; delay: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden align-top">
      <motion.span
        initial={{ y: "0%" }}
        animate={{ y: `-${digit * 10}%` }}
        transition={{ type: "spring", stiffness: 210, damping: 26, delay }}
        className="absolute left-0 top-0 flex w-full flex-col"
      >
        {Array.from({ length: 10 }).map((_, d) => (
          <span key={d} className="flex h-[1em] items-center justify-center leading-none">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

export function RollingNumber({
  value,
  revealed,
  className,
}: {
  value: string;
  revealed: boolean;
  className?: string;
}) {
  const chars = value.split("");
  let digitIndex = 0;

  return (
    <span className={cn("inline-flex tabular-nums", className)} aria-label={value}>
      {chars.map((char, i) => {
        if (/[0-9]/.test(char)) {
          const target = revealed ? Number(char) : 0;
          const delay = digitIndex * 0.06;
          digitIndex += 1;
          return <RollingDigit key={i} digit={target} delay={delay} />;
        }
        return (
          <span key={i} className="inline-block leading-none">
            {char}
          </span>
        );
      })}
    </span>
  );
}
