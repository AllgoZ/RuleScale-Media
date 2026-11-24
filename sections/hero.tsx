import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { BrandDevice } from "@/components/doodles/brand-device";
import { ProjectWheel, type WheelItem } from "@/components/hero/project-wheel";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { PortfolioSummaryData } from "@/lib/cms/types";
import { HERO_COPY } from "@/lib/home-copy";

/** Most projects on the wheel. Each one adds about half a screen of scroll. */
const MAX_CARDS = 5;

/**
 * Hero: one container, two equal columns. The paper/red split is a background on the
 * section that falls on the container's centre line, so both columns sit inside the same
 * page margins.
 *
 * The right column is a rotary "dial" of project cards (components/hero/project-wheel.tsx):
 * the front card is full size, the next ones sit smaller and curve away, and as the page
 * scrolls the front card rolls up and vanishes while the next rotates forward. It is driven
 * by normal page scrolling (no scroll hijacking, nothing to get trapped in on touch screens).
 * On large screens the headline column is sticky, so the copy stays put while the work turns.
 *
 * Sticky only works if no ancestor is a scroll container, which is why the section uses
 * `overflow-clip` (clips without creating one) instead of `overflow-hidden`.
 */
export function Hero({ items }: { items: PortfolioSummaryData[] }) {
  const cards: WheelItem[] = items
    .filter((item) => item.thumbnail)
    .slice(0, MAX_CARDS)
    .map((item) => ({
      id: item.id,
      slug: item.slug,
      title: item.title,
      category: item.category,
      imageUrl: item.thumbnail!.url,
    }));

  return (
    <section id="top" className="split-bg overflow-clip bg-paper">
      <Container>
        <div className="grid lg:grid-cols-2">
          <div className="lg:sticky lg:top-[var(--header-h)] lg:min-h-[calc(100svh-var(--header-h))] lg:self-start">
            <div className="flex h-full flex-col justify-center py-14 lg:min-h-[inherit] lg:py-16 lg:pr-12">
              <p className="eyebrow hero-in [--d:0.05s]">{HERO_COPY.kicker}</p>
              <h1 className="hero-slide [--d:0.1s] mt-5 max-w-[17ch] font-heading text-[clamp(2.25rem,1.1rem+3vw,3.5rem)] font-extrabold leading-[1.02] tracking-[-0.035em] text-balance">
                {HERO_COPY.headline}
              </h1>
              <p className="text-lead hero-in [--d:0.22s] mt-6 max-w-md">{HERO_COPY.lead}</p>
              <div className="hero-in [--d:0.34s] mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button asChild variant="accent" size="lg">
                  <Link href={HERO_COPY.primaryCta.href}>
                    {HERO_COPY.primaryCta.label}
                    <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="link" className="min-h-11">
                  <Link href={HERO_COPY.secondaryCta.href}>{HERO_COPY.secondaryCta.label}</Link>
                </Button>
              </div>
            </div>
          </div>

          <div // Phones/tablets: the red panel bleeds to the screen edges (a background, as the layout rules allow) while
            // the cards keep the container gutters (px-5 / sm:px-8), so they sit on the same edges as the text.
            className="relative isolate -mx-5 overflow-clip bg-accent px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:overflow-visible lg:bg-transparent lg:pl-12 lg:pr-0">
            {/* Decorative ring + bolt. Pinned (sticky) so it stays in view while the cards move. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-clip">
              <div className="sticky top-[var(--header-h)] h-[calc(100svh-var(--header-h))] overflow-clip">
                <BrandDevice className="absolute bottom-0 right-0 h-[85%] w-auto translate-x-1/4 translate-y-1/4 text-ink/15" />
              </div>
            </div>

            {cards.length ? (
              <ProjectWheel items={cards} />
            ) : (
              <div className="my-5 flex aspect-[16/10] items-center justify-center bg-ink lg:my-16">
                <BrandDevice className="h-24 w-24 text-paper" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
