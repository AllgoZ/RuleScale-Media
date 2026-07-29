export const CACHE_TAGS = {
  homepage: "homepage",
  navigation: "navigation",
  footer: "footer",
  siteSettings: "site-settings",
  seoSettings: "seo-settings",
  /** Any post-*list*-shaped read: index, search, pagination, category/tag/author
   * archives, RSS, sitemap, related posts, prev/next. */
  posts: "posts",
  /** The single full article read for one post. */
  postBySlug: (slug: string) => `post-${slug}`,
  /** Categories + tags + authors list/detail reads, shared since these are small,
   * rarely-edited collections — per-type tags would be needless granularity. */
  taxonomy: "taxonomy",
} as const;
