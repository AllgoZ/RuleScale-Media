import type { PortfolioSummaryData } from "@/lib/cms/types";
import { getVideoPoster } from "@/lib/video-poster";
import type { VideoTileData } from "./video-showcase";

/** Maps CMS video portfolio items to the plain, serializable shape the client grid needs. */
export function toVideoTiles(items: PortfolioSummaryData[]): VideoTileData[] {
  return items
    .filter((item) => item.videoUrl)
    .map((item) => ({
      slug: item.slug,
      title: item.title,
      client: item.client,
      category: item.category,
      videoUrl: item.videoUrl,
      posterUrl: getVideoPoster(item.thumbnail?.url ?? null, item.videoUrl),
    }));
}
