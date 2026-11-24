import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { toVideoTiles } from "@/components/video/to-tiles";
import { VideoShowcase } from "@/components/video/video-showcase";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { PortfolioSummaryData } from "@/lib/cms/types";
import { VIDEO_COPY } from "@/lib/home-copy";

/**
 * Homepage video wall (dark, edge to edge). Renders only when at least one video
 * project is published — never an empty or placeholder band. The full wall lives
 * at /work/videos.
 */
export function Videos({ items }: { items: PortfolioSummaryData[] }) {
  const tiles = toVideoTiles(items).slice(0, 5);
  if (!tiles.length) return null;

  return (
    <section id="videos" aria-labelledby="videos-heading" className="section on-ink overflow-hidden">
      <Container>
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow">{VIDEO_COPY.eyebrow}</p>
            <h2
              id="videos-heading"
              className="text-section mt-3"
            >
              {VIDEO_COPY.heading}
            </h2>
          </div>
          <Link
            href="/work/videos"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap font-heading font-semibold underline decoration-accent decoration-2 underline-offset-4 hover:text-white"
          >
            {VIDEO_COPY.allLabel}
            <ArrowRight size={18} />
          </Link>
        </Reveal>
      </Container>

      <Container className="mt-12 md:mt-16">
        <VideoShowcase items={tiles} tone="dark" />
      </Container>
    </section>
  );
}
