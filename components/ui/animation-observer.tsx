"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// A reveal (delay <= 0.35s + transform 0.8s) is over well before this; afterwards the element
// goes back to its own styles so hover transitions and transforms are not overridden.
const SETTLE_MS = 1400;

/**
 * Drives the `data-anim` scroll reveals (styles in globals.css). Mounted once in the
 * root layout; renders nothing.
 *
 * States on the element (`data-anim-state`):
 *   (none)  visible: server HTML, no JS, reduced motion
 *   seen    was already on screen (or above it) when scanned: left visible, never animated
 *   hidden  below the fold, waiting
 *   in      revealing (transition running)
 *   done    settled; no animation rules apply any more
 *
 * - Above-the-fold content is never hidden, so it cannot affect LCP.
 * - Everything below the fold is hidden once, then revealed once as it nears the viewport.
 * - Re-scans after every client-side navigation.
 * - Reduced motion / no IntersectionObserver: does nothing, everything stays visible.
 */
export function AnimationObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const timers = new Set<number>();

    const frame = requestAnimationFrame(() => {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-anim]:not([data-anim-state])")
      );
      if (!nodes.length) return;

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const node = entry.target as HTMLElement;
            node.dataset.animState = "in";
            observer?.unobserve(node);
            const timer = window.setTimeout(() => {
              timers.delete(timer);
              node.dataset.animState = "done";
            }, SETTLE_MS);
            timers.add(timer);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.01 }
      );

      const fold = window.innerHeight;
      for (const node of nodes) {
        const { top, bottom } = node.getBoundingClientRect();
        if (bottom <= 0 || top < fold) {
          node.dataset.animState = "seen"; // on screen or already scrolled past: leave visible
          continue;
        }
        node.dataset.animState = "hidden";
        observer.observe(node);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      // Anything still waiting would otherwise stay hidden if this effect re-runs.
      document
        .querySelectorAll<HTMLElement>('[data-anim-state="hidden"], [data-anim-state="in"]')
        .forEach((node) => delete node.dataset.animState);
    };
  }, [pathname]);

  return null;
}
