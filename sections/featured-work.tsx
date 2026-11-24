import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { PortfolioSummaryData } from "@/lib/cms/types";
import { WORK_COPY } from "@/lib/home-copy";
import { cn } from "@/lib/utils";

const metaLine = (item: PortfolioSummaryData, max = 2) =>
  [item.category, ...item.services.slice(0, max)]
    .filter(Boolean)
    .filter((value, index, all) => all.indexOf(value) === index)
    .join("  ·  ");

function Cover({
  item,
  className,
  sizes,
  priority,
  position,
}: {
  item: PortfolioSummaryData;
  className: string;
  sizes: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <div data-anim="scale" className={cn("relative overflow-hidden bg-surface", className)}>
      {item.thumbnail ? (
        <Image
          src={item.thumbnail.url}
          alt={`${item.title}: ${item.category || "project"} by RuleScale Media`}
          fill
          priority={priority}
          sizes={sizes}
          style={position ? { objectPosition: position } : undefined}
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.035]"
        />
      ) : null}
    </div>
  );
}

/** Shared caption: title + number, then one meta line. Same structure for every project. */
function Caption({
  item,
  index,
  className,
}: {
  item: PortfolioSummaryData;
  index: number;
  className?: string;
}) {
  return (
    <div data-anim="up" data-anim-step="1" className={className}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="font-heading text-2xl font-extrabold tracking-tight">
          <Link href={`/work/${item.slug}`} className="after:absolute after:inset-0 after:content-['']">
            {item.title}
          </Link>
        </h3>
        <span className="text-sm text-ink-soft">{String(index).padStart(2, "0")}</span>
      </div>
      <p className="mt-1 text-sm text-ink-soft">{metaLine(item)}</p>
    </div>
  );
}

/**
 * Editorial portfolio on the page's 12-column grid. Different compositions
 * come from grid placement, not margins:
 *  A  lead image (cols 1-9) with an ink caption panel (cols 8-12) sharing its row
 *  B  large landscape (cols 1-7) + smaller 4:3 (cols 8-12), bottom-aligned
 *  C  the rest as an index: number · thumbnail · title · category · arrow
 */
export function FeaturedWork({ items }: { items: PortfolioSummaryData[] }) {
  if (!items.length) return null;

  const [lead, second, third, ...rest] = items;

  return (
    <section id="case-studies" aria-labelledby="work-heading" className="section overflow-hidden bg-white">
      <Container>
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">{WORK_COPY.eyebrow}</p>
            <h2 id="work-heading" className="text-section mt-3 max-w-xl">
              {WORK_COPY.heading}
            </h2>
          </div>
          <Link
            href={WORK_COPY.cta.href}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap font-heading font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            {WORK_COPY.cta.label}
            <ArrowUpRight size={18} />
          </Link>
        </Reveal>

        <div className="mt-12 flex flex-col gap-16 md:mt-16 md:gap-24">
          {/* A */}
          <article className="group relative grid grid-cols-1 lg:grid-cols-12">
            <Cover
              item={lead}
              sizes="(min-width: 1280px) 880px, (min-width: 1024px) 70vw, 100vw"
              className="aspect-[16/10] lg:col-span-9 lg:col-start-1 lg:row-start-1"
            />
            <div data-anim="up" data-anim-step="2" className="bg-ink p-7 text-paper lg:z-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end lg:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">01 — Featured</p>
              <h3 className="mt-4 font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                <Link href={`/work/${lead.slug}`} className="after:absolute after:inset-0 after:content-['']">
                  {lead.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-paper/70">{metaLine(lead, 3)}</p>
              {lead.resultHeadline && lead.resultHeadline !== lead.title ? (
                <p className="mt-5 font-heading text-lg font-semibold leading-snug">{lead.resultHeadline}</p>
              ) : null}
              <span className="mt-7 inline-flex items-center gap-2 font-heading text-sm font-semibold">
                View case study
                <ArrowUpRight
                  size={18}
                  aria-hidden="true"
                  className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </article>

          {/* B */}
          {second ? (
            <div className="grid grid-cols-1 gap-16 md:gap-24 lg:grid-cols-12 lg:items-end lg:gap-x-8 lg:gap-y-0">
              <article className="group relative lg:col-span-7">
                <Cover item={second} sizes="(min-width: 1024px) 55vw, 100vw" className="aspect-[16/10]" />
                <Caption item={second} index={2} className="mt-4" />
              </article>
              {third ? (
                <article className="group relative lg:col-span-5">
                  <Cover
                    item={third}
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="aspect-[16/10]"
                  />
                  <Caption item={third} index={3} className="mt-4" />
                </article>
              ) : null}
            </div>
          ) : null}

          {/* C */}
          {rest.length ? (
            <div>
              <p className="eyebrow">More work</p>
              <ul className="mt-6">
                {rest.map((item, index) => (
                  <li key={item.id} data-anim="up">
                    <Link
                      href={`/work/${item.slug}`}
                      className="group grid grid-cols-[2rem_4rem_1fr_auto] items-center gap-x-4 py-4 transition-colors hover:bg-paper md:grid-cols-[2.5rem_6rem_1fr_auto_auto] md:gap-x-6 md:px-4"
                    >
                      <span className="text-sm text-ink-soft">{String(index + 4).padStart(2, "0")}</span>
                      <span className="relative block aspect-[16/10] overflow-hidden bg-surface">
                        {item.thumbnail ? (
                          <Image src={item.thumbnail.url} alt="" fill sizes="96px" className="object-cover" />
                        ) : null}
                      </span>
                      <span className="font-heading text-[clamp(1.25rem,0.8rem+1.6vw,2.5rem)] font-extrabold leading-tight tracking-[-0.03em]">
                        {item.title}
                      </span>
                      <span className="hidden text-sm text-ink-soft md:block">{item.category}</span>
                      <ArrowUpRight
                        size={22}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-deep"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
