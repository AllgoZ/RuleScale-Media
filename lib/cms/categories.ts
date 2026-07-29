import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { Category } from "@/payload-types";
import { getPayloadClient } from "./payload-client";
import type { CategoryData } from "./types";

function normalize(doc: Category): CategoryData {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    description: doc.description || "",
  };
}

async function fetchCategoriesFromPayload(): Promise<CategoryData[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "categories",
    limit: 200,
    sort: "title",
  });
  return result.docs.map(normalize);
}

async function fetchCategoryBySlugFromPayload(slug: string): Promise<CategoryData | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  return result.docs[0] ? normalize(result.docs[0]) : null;
}

const getCachedCategories = unstable_cache(fetchCategoriesFromPayload, [CACHE_TAGS.taxonomy], {
  tags: [CACHE_TAGS.taxonomy],
});

const getCachedCategoryBySlug = unstable_cache(
  fetchCategoryBySlugFromPayload,
  [CACHE_TAGS.taxonomy],
  { tags: [CACHE_TAGS.taxonomy] }
);

export const getCategories = cache(async (): Promise<CategoryData[]> => {
  try {
    return await getCachedCategories();
  } catch (error) {
    console.error("[cms] Failed to load categories from Payload", error);
    return [];
  }
});

export const getCategoryBySlug = cache(async (slug: string): Promise<CategoryData | null> => {
  try {
    return await getCachedCategoryBySlug(slug);
  } catch (error) {
    console.error(`[cms] Failed to load category "${slug}" from Payload`, error);
    return null;
  }
});
