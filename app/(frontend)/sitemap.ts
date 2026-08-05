import type { MetadataRoute } from "next";
import { getAuthors } from "@/lib/cms/authors";
import { getCategories } from "@/lib/cms/categories";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getAllPortfolioItems } from "@/lib/cms/portfolio";
import { getTags } from "@/lib/cms/tags";
import { SITE_URL } from "@/lib/constants";

// Otherwise Next.js pre-renders sitemap.xml at build time by default, making
// the build depend on Postgres being reachable from Vercel's build step —
// see the same note on blog/rss.xml/route.ts. The underlying getters are
// already cached via unstable_cache, so this only removes the build-time
// dependency, not the caching.
export const dynamic = "force-dynamic";

// Uses SITE_URL (the code constant), not siteSettings.url (the CMS-editable,
// unstable_cache-wrapped field) — a domain migration once left this route
// serving stale cached URLs from the retired domain, since that cache has no
// revalidate time and is invalidated only by a tag that doesn't always fire
// (e.g. scripts running outside a request context). SITE_URL carries zero
// caching risk, so the sitemap can't regress this way again.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, authors, portfolioItems] = await Promise.all([
    getPublishedPosts({ limit: 1000 }),
    getCategories(),
    getTags(),
    getAuthors(),
    getAllPortfolioItems(),
  ]);

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...posts.docs.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${SITE_URL}/blog/tag/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...authors.map((author) => ({
      url: `${SITE_URL}/blog/author/${author.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    {
      url: `${SITE_URL}/work/videos`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/form/influencer`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...portfolioItems.map((item) => ({
      url:
        item.mediaType === "video"
          ? `${SITE_URL}/work/videos/${item.slug}`
          : `${SITE_URL}/work/${item.slug}`,
      lastModified: item.publishedAt ? new Date(item.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
