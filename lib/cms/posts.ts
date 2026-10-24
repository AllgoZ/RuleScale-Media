import { unstable_cache } from "next/cache";
import { draftMode } from "next/headers";
import { cache } from "react";
import type { Where } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { calculateReadingTime } from "@/lib/blog/reading-time";
import type { Post } from "@/payload-types";
import { getAuthorBySlug } from "./authors";
import { getCategoryBySlug } from "./categories";
import { normalizeMediaImage } from "./media";
import { getPayloadClient } from "./payload-client";
import { getTagBySlug } from "./tags";
import type { PaginatedPosts, PostData, PostSummaryData } from "./types";

const POSTS_PER_PAGE = 9;

// Payload's `draft` find option only controls which version's *content* is
// returned — it does NOT exclude documents whose current `_status` is
// "draft". Every publicly-facing query must filter on `_status` explicitly,
// or unpublished posts leak into listings/RSS/sitemap/related posts.
const PUBLISHED_ONLY: Where = { _status: { equals: "published" } };

function emptyPage(page: number): PaginatedPosts {
  return { docs: [], totalDocs: 0, totalPages: 0, page, hasNextPage: false, hasPrevPage: false };
}

function normalizeSummary(doc: Post): PostSummaryData {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    featuredImage:
      normalizeMediaImage(doc.featuredImage) ??
      (doc.featuredImageUrl
        ? { url: doc.featuredImageUrl, alt: doc.featuredImageAlt || "", width: null, height: null }
        : null),
    category:
      doc.category && typeof doc.category === "object"
        ? {
            id: doc.category.id,
            title: doc.category.title,
            slug: doc.category.slug,
            description: doc.category.description || "",
          }
        : null,
    tags: (doc.tags ?? [])
      .filter((tag): tag is Exclude<typeof tag, number> => typeof tag === "object")
      .map((tag) => ({ id: tag.id, title: tag.title, slug: tag.slug })),
    author:
      doc.author && typeof doc.author === "object"
        ? {
            id: doc.author.id,
            name: doc.author.name,
            slug: doc.author.slug,
            role: doc.author.role || "",
            avatar: normalizeMediaImage(doc.author.avatar),
          }
        : null,
    publishedDate: doc.publishedDate || null,
    featured: doc.featured ?? false,
    readingTime: calculateReadingTime(doc.content),
  };
}

function normalize(doc: Post): PostData {
  return {
    ...normalizeSummary(doc),
    content: doc.content,
    updatedAt: doc.updatedAt,
    seo: {
      metaTitle: doc.seo?.metaTitle || "",
      metaDescription: doc.seo?.metaDescription || "",
      canonicalUrl: doc.seo?.canonicalUrl || "",
      ogImage: normalizeMediaImage(doc.seo?.ogImage),
      twitterImage: normalizeMediaImage(doc.seo?.twitterImage),
    },
  };
}

export type PostsQueryParams = {
  page?: number;
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  authorSlug?: string;
  search?: string;
};

async function fetchPublishedPosts(params: PostsQueryParams): Promise<PaginatedPosts> {
  const { page = 1, limit = POSTS_PER_PAGE, categorySlug, tagSlug, authorSlug, search } = params;
  const and: Where[] = [PUBLISHED_ONLY];

  if (categorySlug) {
    const category = await getCategoryBySlug(categorySlug);
    if (!category) return emptyPage(page);
    and.push({ category: { equals: category.id } });
  }
  if (tagSlug) {
    const tag = await getTagBySlug(tagSlug);
    if (!tag) return emptyPage(page);
    and.push({ tags: { in: [tag.id] } });
  }
  if (authorSlug) {
    const author = await getAuthorBySlug(authorSlug);
    if (!author) return emptyPage(page);
    and.push({ author: { equals: author.id } });
  }
  if (search) {
    and.push({ or: [{ title: { contains: search } }, { excerpt: { contains: search } }] });
  }

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: and.length ? { and } : undefined,
    depth: 2,
    page,
    limit,
    sort: "-publishedDate",
  });

  return {
    docs: result.docs.map(normalizeSummary),
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page ?? page,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  };
}

const getCachedPublishedPosts = unstable_cache(fetchPublishedPosts, [CACHE_TAGS.posts], {
  tags: [CACHE_TAGS.posts],
});

export const getPublishedPosts = cache(
  async (params: PostsQueryParams = {}): Promise<PaginatedPosts> => {
    try {
      // Search results aren't cached: unbounded query cardinality (every distinct
      // search string would mint a new cache entry) and freshness matters more
      // than hit-rate for a low-traffic search box.
      if (params.search) {
        return await fetchPublishedPosts(params);
      }
      return await getCachedPublishedPosts(params);
    } catch (error) {
      console.error("[cms] Failed to load posts from Payload", error);
      return emptyPage(params.page ?? 1);
    }
  }
);

async function fetchPostBySlugFromPayload(slug: string, draft: boolean): Promise<PostData | null> {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    // `draft: true` (preview only) is allowed to return a draft-status doc;
    // otherwise only ever return published content.
    where: draft
      ? { slug: { equals: slug } }
      : { and: [{ slug: { equals: slug } }, PUBLISHED_ONLY] },
    depth: 2,
    draft,
    limit: 1,
  });
  return result.docs[0] ? normalize(result.docs[0]) : null;
}

export const getPostBySlug = cache(async (slug: string): Promise<PostData | null> => {
  try {
    const { isEnabled: isDraft } = await draftMode();
    if (isDraft) {
      return await fetchPostBySlugFromPayload(slug, true);
    }
    const getCachedPost = unstable_cache(
      () => fetchPostBySlugFromPayload(slug, false),
      [CACHE_TAGS.postBySlug(slug)],
      { tags: [CACHE_TAGS.postBySlug(slug)] }
    );
    return await getCachedPost();
  } catch (error) {
    console.error(`[cms] Failed to load post "${slug}" from Payload`, error);
    return null;
  }
});

async function fetchFeaturedPostFromPayload(): Promise<PostSummaryData | null> {
  const payload = await getPayloadClient();
  const featured = await payload.find({
    collection: "posts",
    where: { and: [{ featured: { equals: true } }, PUBLISHED_ONLY] },
    depth: 2,
    limit: 1,
    sort: "-publishedDate",
  });
  if (featured.docs[0]) return normalizeSummary(featured.docs[0]);

  const recent = await payload.find({
    collection: "posts",
    where: PUBLISHED_ONLY,
    depth: 2,
    limit: 1,
    sort: "-publishedDate",
  });
  return recent.docs[0] ? normalizeSummary(recent.docs[0]) : null;
}

const getCachedFeaturedPost = unstable_cache(fetchFeaturedPostFromPayload, [CACHE_TAGS.posts], {
  tags: [CACHE_TAGS.posts],
});

export const getFeaturedPost = cache(async (): Promise<PostSummaryData | null> => {
  try {
    return await getCachedFeaturedPost();
  } catch (error) {
    console.error("[cms] Failed to load featured post from Payload", error);
    return null;
  }
});

async function fetchRelatedPostsFromPayload(
  postId: number,
  categoryId: number | null,
  tagIds: number[],
  limit: number
): Promise<PostSummaryData[]> {
  const or: Where[] = [];
  if (categoryId) or.push({ category: { equals: categoryId } });
  if (tagIds.length) or.push({ tags: { in: tagIds } });
  if (!or.length) return [];

  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { and: [{ or }, { id: { not_equals: postId } }, PUBLISHED_ONLY] },
    depth: 2,
    limit,
    sort: "-publishedDate",
  });
  return result.docs.map(normalizeSummary);
}

const getCachedRelatedPosts = unstable_cache(fetchRelatedPostsFromPayload, [CACHE_TAGS.posts], {
  tags: [CACHE_TAGS.posts],
});

export const getRelatedPosts = cache(
  async (post: PostSummaryData, limit = 3): Promise<PostSummaryData[]> => {
    try {
      return await getCachedRelatedPosts(
        post.id,
        post.category?.id ?? null,
        post.tags.map((tag) => tag.id),
        limit
      );
    } catch (error) {
      console.error("[cms] Failed to load related posts from Payload", error);
      return [];
    }
  }
);

type AdjacentPosts = { previous: PostSummaryData | null; next: PostSummaryData | null };

async function fetchAdjacentPostsFromPayload(
  publishedDate: string | null,
  postId: number
): Promise<AdjacentPosts> {
  if (!publishedDate) return { previous: null, next: null };

  const payload = await getPayloadClient();
  const [older, newer] = await Promise.all([
    payload.find({
      collection: "posts",
      where: {
        and: [
          { publishedDate: { less_than: publishedDate } },
          { id: { not_equals: postId } },
          PUBLISHED_ONLY,
        ],
      },
      depth: 2,
      limit: 1,
      sort: "-publishedDate",
    }),
    payload.find({
      collection: "posts",
      where: {
        and: [
          { publishedDate: { greater_than: publishedDate } },
          { id: { not_equals: postId } },
          PUBLISHED_ONLY,
        ],
      },
      depth: 2,
      limit: 1,
      sort: "publishedDate",
    }),
  ]);

  return {
    previous: older.docs[0] ? normalizeSummary(older.docs[0]) : null,
    next: newer.docs[0] ? normalizeSummary(newer.docs[0]) : null,
  };
}

const getCachedAdjacentPosts = unstable_cache(fetchAdjacentPostsFromPayload, [CACHE_TAGS.posts], {
  tags: [CACHE_TAGS.posts],
});

export const getAdjacentPosts = cache(async (post: PostSummaryData): Promise<AdjacentPosts> => {
  try {
    return await getCachedAdjacentPosts(post.publishedDate, post.id);
  } catch (error) {
    console.error("[cms] Failed to load adjacent posts from Payload", error);
    return { previous: null, next: null };
  }
});
