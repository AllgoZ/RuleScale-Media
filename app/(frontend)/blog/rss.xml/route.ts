import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";

// force-dynamic, not revalidate: a `revalidate` export makes Next.js try to
// statically pre-render this route *at build time*, which means the build
// itself depends on Postgres being reachable from Vercel's build step. The
// underlying getPublishedPosts()/getSiteSettings() calls are already cached
// via unstable_cache, so this loses no real caching — only the build-time
// dependency, matching every other blog route (all computed per-request).
export const dynamic = "force-dynamic";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const [siteSettings, posts] = await Promise.all([
    getSiteSettings(),
    getPublishedPosts({ limit: 50 }),
  ]);

  const description = `Ideas on marketing, brand, and growth from the ${siteSettings.siteName} team.`;

  const items = posts.docs
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const pubDate = post.publishedDate ? new Date(post.publishedDate).toUTCString() : null;
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <description>${escapeXml(post.excerpt)}</description>
      ${post.author ? `<author>${escapeXml(post.author.name)}</author>` : ""}
      ${post.category ? `<category>${escapeXml(post.category.title)}</category>` : ""}
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteSettings.siteName)} Blog</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(description)}</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
