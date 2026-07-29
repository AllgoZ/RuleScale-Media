import type { MetadataRoute } from "next";
import { getAuthors } from "@/lib/cms/authors";
import { getCategories } from "@/lib/cms/categories";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { getTags } from "@/lib/cms/tags";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteSettings = await getSiteSettings();
  const [posts, categories, tags, authors] = await Promise.all([
    getPublishedPosts({ limit: 1000 }),
    getCategories(),
    getTags(),
    getAuthors(),
  ]);

  return [
    {
      url: siteSettings.url,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1,
    },
    {
      url: `${siteSettings.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    ...posts.docs.map((post) => ({
      url: `${siteSettings.url}/blog/${post.slug}`,
      lastModified: post.publishedDate ? new Date(post.publishedDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...categories.map((category) => ({
      url: `${siteSettings.url}/blog/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((tag) => ({
      url: `${siteSettings.url}/blog/tag/${tag.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...authors.map((author) => ({
      url: `${siteSettings.url}/blog/author/${author.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
