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
    <nav
      aria-label="More posts"
      className="grid gap-4 border-t border-hairline pt-8 sm:grid-cols-2"
    >
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex flex-col gap-1 rounded-2xl border border-hairline p-5 transition-colors hover:border-accent/30"
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
            <ArrowLeft size={13} className="transition-transform group-hover:-translate-x-0.5" />
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
            "group flex flex-col gap-1 rounded-2xl border border-hairline p-5 text-right transition-colors hover:border-accent/30",
            "sm:items-end"
          )}
        >
          <span className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
            Next
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="font-heading font-bold text-ink">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
