import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PostSummaryData } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function PostNavigation({
  previous,
  next,
}: {
  previous: PostSummaryData | null;
  next: PostSummaryData | null;
}) {
  if (!previous && !next) return null;

  return (
    <nav aria-label="More posts" className="grid gap-4 border-t border-hairline pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex flex-col gap-2 rounded-md border border-hairline p-5 transition-colors hover:border-ink"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            <ArrowLeft size={14} aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5" />
            Previous
          </span>
          <span className="font-heading font-bold text-ink">{previous.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className={cn(
            "group flex flex-col gap-2 rounded-md border border-hairline p-5 transition-colors hover:border-ink",
            "sm:items-end sm:text-right"
          )}
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-ink-soft">
            Next
            <ArrowRight size={14} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-heading font-bold text-ink">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
