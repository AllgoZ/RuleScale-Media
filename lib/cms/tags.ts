import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { Tag } from "@/payload-types";
import { getPayloadClient } from "./payload-client";
import type { TagData } from "./types";

function normalize(doc: Tag): TagData {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
  };
}

async function fetchTagsFromPayload(): Promise<TagData[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "tags",
    limit: 200,
    sort: "title",
  });
  return result.docs.map(normalize);
}

async function fetchTagBySlugFromPayload(slug: string): Promise<TagData | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "tags",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] ? normalize(result.docs[0]) : null;
}

const getCachedTags = unstable_cache(fetchTagsFromPayload, [CACHE_TAGS.taxonomy], {
  tags: [CACHE_TAGS.taxonomy],
});

const getCachedTagBySlug = unstable_cache(fetchTagBySlugFromPayload, [CACHE_TAGS.taxonomy], {
  tags: [CACHE_TAGS.taxonomy],
});

export const getTags = cache(async (): Promise<TagData[]> => {
  try {
    return await getCachedTags();
  } catch (error) {
    console.error("[cms] Failed to load tags from Payload", error);
    return [];
  }
});

export const getTagBySlug = cache(async (slug: string): Promise<TagData | null> => {
  try {
    return await getCachedTagBySlug(slug);
  } catch (error) {
    console.error(`[cms] Failed to load tag "${slug}" from Payload`, error);
    return null;
  }
});
