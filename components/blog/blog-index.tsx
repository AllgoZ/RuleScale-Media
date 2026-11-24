import type { Metadata } from "next";
import Link from "next/link";
import { FeaturedPost } from "@/components/blog/featured-post";
import { Pagination } from "@/components/blog/pagination";
import { PostGrid } from "@/components/blog/post-grid";
import { SearchBox } from "@/components/blog/search-box";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getCategories } from "@/lib/cms/categories";
import { getFeaturedPost, getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";

/**
 * Blog index body, shared by /blog (page 1) and /blog/page/[page] (page 2+). The two routes exist so
 * both can be prerendered: reading `?page=` in a single route would force every request through a
 * serverless render. `next.config.ts` rewrites `/blog?page=N` to `/blog/page/N`, so URLs and
 * pagination links are unchanged.
 */
export async function blogIndexMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  const title = `Blog | ${siteSettings.siteName}`;
  const description = `Ideas on marketing, brand, and growth from the ${siteSettings.siteName} team.`;
  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    openGraph: { title, description, url: `${SITE_URL}/blog` },
    twitter: { title, description },
  };
}

export async function BlogIndex({ page }: { page: number }) {
  const [featured, categories, posts] = await Promise.all([
    getFeaturedPost(),
    getCategories(),
    getPublishedPosts({ page }),
  ]);

  const gridPosts =
    page === 1 && featured ? posts.docs.filter((post) => post.id !== featured.id) : posts.docs;

  return (
    <main className="section">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">From the team</p>
            <h1 className="text-editorial mt-4 text-ink text-balance">The Blog</h1>
          </div>
          <SearchBox />
        </Reveal>

        {categories.length ? (
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-flex min-h-11 items-center rounded-full border border-ink/20 px-5 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                {category.title}
              </Link>
            ))}
          </Reveal>
        ) : null}

        {page === 1 && featured ? (
          <div className="mt-12">
            <FeaturedPost post={featured} />
          </div>
        ) : null}

        <div className="mt-14">
          <PostGrid
            posts={gridPosts}
            emptyMessage="No posts yet — check back soon."
          />
        </div>

        <div className="mt-10">
          <Pagination currentPage={posts.page} totalPages={posts.totalPages} basePath="/blog" />
        </div>
      </Container>
    </main>
  );
}
