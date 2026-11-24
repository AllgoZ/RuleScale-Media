import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  /** Extra query params to preserve across page links, e.g. `{ q: "..." }` on the
   * search results page. */
  searchParams?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams ?? {})) {
      if (value) params.set(key, value);
    }
    if (page > 1) params.set("page", String(page));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const atStart = currentPage <= 1;
  const atEnd = currentPage >= totalPages;
  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper";

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3 pt-4">
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={atStart}
        aria-label="Previous page"
        className={cn(arrow, atStart && "pointer-events-none opacity-40")}
      >
        <ChevronLeft size={18} />
      </Link>
      <span className="px-3 text-sm font-medium text-ink-soft">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={atEnd}
        aria-label="Next page"
        className={cn(arrow, atEnd && "pointer-events-none opacity-40")}
      >
        <ChevronRight size={18} />
      </Link>
    </nav>
  );
}
