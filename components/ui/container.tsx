import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Single page-width wrapper: 1280px max, consistent gutters at every breakpoint. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
