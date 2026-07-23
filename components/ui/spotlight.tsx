"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function Spotlight({
  children,
  className,
  color = "rgba(37, 99, 235, 0.1)",
}: {
  children: ReactNode;
  className?: string;
  color?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const mx = ((event.clientX - rect.left) / rect.width) * 100;
    const my = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${mx}%`);
    el.style.setProperty("--my", `${my}%`);
    el.style.setProperty("--spotlight-opacity", "1");
  }

  function handleMouseLeave() {
    ref.current?.style.setProperty("--spotlight-opacity", "0");
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ "--spotlight-color": color } as CSSProperties}
      className={cn("spotlight relative", className)}
    >
      {children}
    </div>
  );
}
