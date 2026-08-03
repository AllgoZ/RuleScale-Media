import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { cache } from "react";
import type { Where } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { Portfolio } from "@/payload-types";
import { getPayloadClient } from "./payload-client";
import type { PortfolioItemData, PortfolioSummaryData, PortfolioThumbnail } from "./types";

// Same reasoning as posts.ts: `draft` only controls which *version* is read, not
// whether `_status` is "draft" — every public query must filter explicitly.
const PUBLISHED_ONLY: Where = { _status: { equals: "published" } };

function normalizeThumbnail(doc: Portfolio): PortfolioThumbnail {
  if (!doc.thumbnailUrl) return null;
  return {
    url: doc.thumbnailUrl,
    publicId: doc.thumbnailPublicId || "",
    width: doc.thumbnailWidth || 0,
    height: doc.thumbnailHeight || 0,
    format: doc.thumbnailFormat || "",
  };
}

function normalizeSummary(doc: Portfolio): PortfolioSummaryData {
  return {
    id: doc.id,
    title: doc.title,
    client: doc.client,
    slug: doc.slug,
    featured: doc.featured ?? false,
    mediaType: doc.mediaType,
    category: doc.category || "",
    resultHeadline: doc.resultHeadline || "",
    description: doc.description || "",
    services: (doc.services ?? []).map((entry) => entry.service),
    thumbnail: normalizeThumbnail(doc),
    liveWebsite: doc.liveWebsite || "",
    sortOrder: doc.sortOrder ?? 0,
    publishedAt: doc.publishedAt || null,
  };
}

function normalize(doc: Portfolio): PortfolioItemData {
  return {
    ...normalizeSummary(doc),
    videoUrl: doc.videoUrl || "",
    caseStudyContent: doc.caseStudyContent,
    seo: {
      metaTitle: doc.seo?.metaTitle || "",
      metaDescription: doc.seo?.metaDescription || "",
      canonicalUrl: doc.seo?.canonicalUrl || "",
      metaImage: doc.seo?.metaImage || "",
    },
  };
}

async function fetchFeaturedPortfolioItems(): Promise<PortfolioSummaryData[]> {
  const payload = await getPayloadClient();
  // Explicitly scoped to image projects — videos never appear on the homepage
  // regardless of their `featured` flag, per the product spec.
  const result = await payload.find({
    collection: "portfolio",
    where: {
      and: [{ featured: { equals: true } }, { mediaType: { equals: "image" } }, PUBLISHED_ONLY],
    },
    depth: 0,
    limit: 12,
    sort: "sortOrder",
  });
  return result.docs.map(normalizeSummary);
}

const getCachedFeaturedPortfolioItems = unstable_cache(
  fetchFeaturedPortfolioItems,
  [CACHE_TAGS.portfolio],
  { tags: [CACHE_TAGS.portfolio] }
);

export const getFeaturedPortfolioItems = cache(async (): Promise<PortfolioSummaryData[]> => {
  try {
    return await getCachedFeaturedPortfolioItems();
  } catch (error) {
    console.error("[cms] Failed to load featured portfolio items from Payload", error);
    return [];
  }
});

async function fetchAllPublishedPortfolioItems(): Promise<PortfolioSummaryData[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "portfolio",
    where: PUBLISHED_ONLY,
    depth: 0,
    limit: 1000,
    sort: "sortOrder",
  });
  return result.docs.map(normalizeSummary);
}

const getCachedAllPortfolioItems = unstable_cache(
  fetchAllPublishedPortfolioItems,
  [CACHE_TAGS.portfolio],
  { tags: [CACHE_TAGS.portfolio] }
);

/** Every published item regardless of type — for the sitemap, which needs both
 * /work/[slug] and /work/videos/[slug] entries. */
export const getAllPortfolioItems = cache(async (): Promise<PortfolioSummaryData[]> => {
  try {
    return await getCachedAllPortfolioItems();
  } catch (error) {
    console.error("[cms] Failed to load all portfolio items from Payload", error);
    return [];
  }
});

async function fetchVideoPortfolioItems(): Promise<PortfolioSummaryData[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "portfolio",
    where: { and: [{ mediaType: { equals: "video" } }, PUBLISHED_ONLY] },
    depth: 0,
    limit: 100,
    sort: "sortOrder",
  });
  return result.docs.map(normalizeSummary);
}

const getCachedVideoPortfolioItems = unstable_cache(
  fetchVideoPortfolioItems,
  [CACHE_TAGS.portfolio],
  { tags: [CACHE_TAGS.portfolio] }
);

export const getVideoPortfolioItems = cache(async (): Promise<PortfolioSummaryData[]> => {
  try {
    return await getCachedVideoPortfolioItems();
  } catch (error) {
    console.error("[cms] Failed to load video portfolio items from Payload", error);
    return [];
  }
});

async function fetchPortfolioItemBySlugFromPayload(
  slug: string,
  draft: boolean
): Promise<PortfolioItemData | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "portfolio",
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, PUBLISHED_ONLY] },
    depth: 0,
    draft,
    limit: 1,
  });
  return result.docs[0] ? normalize(result.docs[0]) : null;
}

export const getPortfolioItemBySlug = cache(
  async (slug: string): Promise<PortfolioItemData | null> => {
    try {
      const { isEnabled: isDraft } = await draftMode();
      if (isDraft) {
        return await fetchPortfolioItemBySlugFromPayload(slug, true);
      }
      const getCachedItem = unstable_cache(
        () => fetchPortfolioItemBySlugFromPayload(slug, false),
        [CACHE_TAGS.portfolioBySlug(slug)],
        { tags: [CACHE_TAGS.portfolioBySlug(slug)] }
      );
      return await getCachedItem();
    } catch (error) {
      console.error(`[cms] Failed to load portfolio item "${slug}" from Payload`, error);
      return null;
    }
  }
);

async function fetchRelatedPortfolioItemsFromPayload(
  itemId: number,
  mediaType: "image" | "video",
  category: string,
  limit: number
): Promise<PortfolioSummaryData[]> {
  const payload = await getPayloadClient();
  const and: Where[] = [
    { mediaType: { equals: mediaType } },
    { id: { not_equals: itemId } },
    PUBLISHED_ONLY,
  ];
  if (category) and.push({ category: { equals: category } });

  const payloadResult = await payload.find({
    collection: "portfolio",
    where: { and },
    depth: 0,
    limit,
    sort: "sortOrder",
  });
  return payloadResult.docs.map(normalizeSummary);
}

const getCachedRelatedPortfolioItems = unstable_cache(
  fetchRelatedPortfolioItemsFromPayload,
  [CACHE_TAGS.portfolio],
  { tags: [CACHE_TAGS.portfolio] }
);

export const getRelatedPortfolioItems = cache(
  async (item: PortfolioSummaryData, limit = 3): Promise<PortfolioSummaryData[]> => {
    try {
      return await getCachedRelatedPortfolioItems(item.id, item.mediaType, item.category, limit);
    } catch (error) {
      console.error("[cms] Failed to load related portfolio items from Payload", error);
      return [];
    }
  }
);
