import type { Metadata } from "next";
import { toVideoTiles } from "@/components/video/to-tiles";
import { VideoShowcase } from "@/components/video/video-showcase";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getVideoPortfolioItems } from "@/lib/cms/portfolio";
import { SITE_URL } from "@/lib/constants";
import { VIDEO_COPY } from "@/lib/home-copy";

export const metadata: Metadata = {
  title: "Video Work",
  description: "Video projects from the RuleScale Media portfolio.",
  alternates: { canonical: "/work/videos" },
  openGraph: {
    title: "Video Work",
    description: "Video projects from the RuleScale Media portfolio.",
    url: `${SITE_URL}/work/videos`,
  },
};

export default async function VideoWorkIndexPage() {
  const items = await getVideoPortfolioItems();
  const tiles = toVideoTiles(items);
  const categories = new Set(tiles.map((tile) => tile.category).filter(Boolean));
  // Filters only appear once there is enough work for them to be useful.
  const filterable = tiles.length >= 8 && categories.size >= 2;

  return (
    <main className="section on-ink min-h-[70vh]">
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{VIDEO_COPY.eyebrow}</p>
          <h1 className="text-editorial mt-4 text-balance">Projects we&apos;ve brought to life on screen</h1>
          <p className="text-lead mt-6 max-w-xl">{VIDEO_COPY.lead}</p>
        </Reveal>

        {tiles.length ? (
          <div className="mt-12 md:mt-16">
            <VideoShowcase items={tiles} filterable={filterable} tone="dark" />
          </div>
        ) : (
          <p className="mt-12 text-paper/70 md:mt-16">No video projects published yet — check back soon.</p>
        )}
      </Container>
    </main>
  );
}
