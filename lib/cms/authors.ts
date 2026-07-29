import { unstable_cache } from "next/cache";
import { cache } from "react";
import { CACHE_TAGS } from "@/lib/cache/tags";
import type { Author } from "@/payload-types";
import { getPayloadClient } from "./payload-client";
import { normalizeMediaImage } from "./media";
import type { AuthorData, AuthorSummaryData } from "./types";

function normalizeSummary(doc: Author): AuthorSummaryData {
  return {
    id: doc.id,
    name: doc.name,
    slug: doc.slug,
    role: doc.role || "",
    avatar: normalizeMediaImage(doc.avatar),
  };
}

function normalize(doc: Author): AuthorData {
  return {
    ...normalizeSummary(doc),
    bio: doc.bio || "",
  };
}

async function fetchAuthorsFromPayload(): Promise<AuthorData[]> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "authors",
    limit: 200,
    depth: 1,
    sort: "name",
  });
  return result.docs.map(normalize);
}

async function fetchAuthorBySlugFromPayload(slug: string): Promise<AuthorData | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "authors",
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
  });
  return result.docs[0] ? normalize(result.docs[0]) : null;
}

const getCachedAuthors = unstable_cache(fetchAuthorsFromPayload, [CACHE_TAGS.taxonomy], {
  tags: [CACHE_TAGS.taxonomy],
});

const getCachedAuthorBySlug = unstable_cache(fetchAuthorBySlugFromPayload, [CACHE_TAGS.taxonomy], {
  tags: [CACHE_TAGS.taxonomy],
});

export const getAuthors = cache(async (): Promise<AuthorData[]> => {
  try {
    return await getCachedAuthors();
  } catch (error) {
    console.error("[cms] Failed to load authors from Payload", error);
    return [];
  }
});

export const getAuthorBySlug = cache(async (slug: string): Promise<AuthorData | null> => {
  try {
    return await getCachedAuthorBySlug(slug);
  } catch (error) {
    console.error(`[cms] Failed to load author "${slug}" from Payload`, error);
    return null;
  }
});
