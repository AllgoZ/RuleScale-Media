import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * End-of-article call to action. Replaces the old "newsletter — coming soon"
 * block, which promised something the site doesn't do. This points at the real,
 * working enquiry form.
 */
export function ArticleCta() {
  return (
    <aside className="on-ink flex flex-col items-start gap-6 rounded-md p-8 md:flex-row md:items-center md:justify-between md:p-10">
      <div>
        <p className="font-heading text-2xl font-extrabold tracking-tight">
          Want this done for your brand?
        </p>
        <p className="muted mt-2 max-w-md text-[15px]">
          Tell us what you&apos;re working on. We&apos;ll reply within one business day.
        </p>
      </div>
      <Button asChild variant="accent" size="lg" className="shrink-0 hover:bg-paper hover:text-ink">
        <Link href="/contact">
          Start a project
          <ArrowRight size={18} />
        </Link>
      </Button>
    </aside>
  );
}
