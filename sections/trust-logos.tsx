import { BoltGlyph } from "@/components/doodles/brand-device";
import type { PortfolioSummaryData } from "@/lib/cms/types";
import { CLIENTS_COPY } from "@/lib/home-copy";

/**
 * Ink credibility band: a slow marquee of brands from published portfolio work
 * (every name is real and links through to a case study elsewhere on the page).
 * The CMS `trustLogos` list (Google, Meta, …) is intentionally not rendered.
 * Under reduced motion the marquee stops and wraps as a static list.
 */
export function TrustLogos({ items }: { items: PortfolioSummaryData[] }) {
  const names = Array.from(new Set(items.map((item) => item.title.trim()).filter(Boolean)));
  if (names.length < 2) return null;

  // Make sure one half of the loop is wider than the viewport.
  const half = Array.from({ length: Math.max(1, Math.ceil(10 / names.length)) }, () => names).flat();

  const list = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {half.map((name, index) => (
        <li key={`${name}-${index}`} className="flex items-center">
          <span className="whitespace-nowrap px-8 font-heading text-2xl font-bold tracking-tight md:text-3xl">
            {name}
          </span>
          <BoltGlyph className="h-5 w-3 text-accent" />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label={CLIENTS_COPY.label} className="on-ink marquee overflow-hidden py-7 md:py-9">
      <div className="marquee-track">
        {list(false)}
        {list(true)}
      </div>
    </section>
  );
}
