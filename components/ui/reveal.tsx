"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Phase = "idle" | "hidden" | "shown";

/**
 * Subtle one-time entrance (fade + small rise). Used on section headers and
 * key blocks only, never on every element.
 *
 * Pure CSS + IntersectionObserver (no animation library in the page bundle).
 * Content is visible in the server HTML and for anything already on screen, so
 * it never delays first paint or LCP; only blocks that start below the fold are
 * hidden after hydration and faded in as they approach the viewport. Reduced
 * motion: nothing is ever hidden.
 */
export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    // Already on screen at hydration: leave it visible.
    if (node.getBoundingClientRect().top < window.innerHeight - 60) return;

    setPhase("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("shown");
          if (once) observer.disconnect();
        } else if (!once) {
          setPhase("hidden");
        }
      },
      { rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  const style = { "--reveal-y": `${y}px`, "--reveal-delay": `${delay}s` } as CSSProperties;

  return (
    <div
      ref={ref}
      style={phase === "idle" ? undefined : style}
      className={cn(phase === "hidden" && "reveal-hidden", phase === "shown" && "reveal-shown", className)}
    >
      {children}
    </div>
  );
}
