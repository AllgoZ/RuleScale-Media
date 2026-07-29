import { Mail } from "lucide-react";

/** Static placeholder — no signup wiring. Newsletter infrastructure is explicitly
 * out of scope (see prompts/backend/phase1.md Step 11), this just reserves the
 * spot in the article layout for when that phase happens. */
export function NewsletterCta() {
  return (
    <div className="flex flex-col items-start gap-4 rounded-2xl border border-hairline bg-ink p-8 text-paper sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper/10 text-paper">
          <Mail size={18} />
        </span>
        <div>
          <p className="font-heading text-lg font-bold">Get the next one in your inbox.</p>
          <p className="mt-1 text-sm text-paper/60">
            No spam, no fluff — just the occasional idea worth your time.
          </p>
        </div>
      </div>
      <span className="font-hand -rotate-1 inline-block shrink-0 text-sm text-paper/50">
        coming soon
      </span>
    </div>
  );
}
