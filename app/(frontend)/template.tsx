"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Module-level: false while the first page is server-rendered and hydrated, true for every
// page mounted by a later client-side navigation.
let hasHydrated = false;

/**
 * Page transition: a short fade + rise on the incoming page after client-side navigations.
 * The first load is never animated, so it cannot delay first paint or LCP.
 * Keep the wrapper layout-neutral: it must behave like the `#content` flex column it sits in.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [animate] = useState(hasHydrated);

  useEffect(() => {
    hasHydrated = true;
  }, []);

  return <div className={cn("flex flex-1 flex-col", animate && "page-enter")}>{children}</div>;
}
