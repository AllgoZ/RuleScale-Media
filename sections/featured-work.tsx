import { ArrowUpRight, ExternalLink, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { PortfolioSummaryData } from "@/lib/cms/types";

function WorkCard({ item, index }: { item: PortfolioSummaryData; index: number }) {
  return (
    <Reveal delay={index * 0.1}>
      <article className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
        <Link
          href={`/work/${item.slug}`}
          className="absolute inset-0 z-10"
          aria-label={`View case study: ${item.title}`}
        />
        {item.liveWebsite ? (
          <a
            href={item.liveWebsite}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit the live ${item.title} website`}
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur-sm transition-colors hover:bg-white hover:text-[var(--color-accent)]"
          >
            <ExternalLink size={15} />
          </a>
        ) : null}
        <div className="relative aspect-[16/10] overflow-hidden bg-ink/[0.04]">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail.url}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-ink-soft">{item.client}</span>
            {item.category ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-semibold text-[var(--color-accent)]">
                {item.category}
              </span>
            ) : null}
          </div>
          {item.resultHeadline ? (
            <h3 className="font-heading text-xl font-bold leading-snug text-ink">
              {item.resultHeadline}
            </h3>
          ) : null}
          {item.description ? (
            <p className="line-clamp-2 flex-1 text-sm text-ink-soft">{item.description}</p>
          ) : null}
          {item.services.length ? (
            <div className="flex flex-wrap gap-2 border-t border-hairline pt-4">
              {item.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full bg-ink/[0.04] px-3 py-1 text-xs font-medium text-ink-soft"
                >
                  {service}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-ink transition-colors group-hover:text-[var(--color-accent)]">
            View Case Study
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function FeaturedWork({ items }: { items: PortfolioSummaryData[] }) {
  if (!items.length) return null;

  return (
    <section id="case-studies" className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="pill-badge mx-auto inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            Featured Work
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            Projects we&apos;re proud of
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <WorkCard key={item.slug} item={item} index={index} />
          ))}
        </div>

        <Reveal className="mt-10 flex justify-center">
          <Link
            href="/work/videos"
            className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
          >
            <Film size={16} />
            View All Video Work
            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
