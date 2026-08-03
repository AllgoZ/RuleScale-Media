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

export async function generateMetadata(): Promise<Metadata> {
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

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [featured, categories, posts] = await Promise.all([
    getFeaturedPost(),
    getCategories(),
    getPublishedPosts({ page }),
  ]);

  const gridPosts =
    page === 1 && featured ? posts.docs.filter((post) => post.id !== featured.id) : posts.docs;

  return (
    <main className="py-16 md:py-24">
      <Container>
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="font-hand -rotate-1 inline-block text-base text-accent">
              from the team
            </span>
            <h1 className="text-editorial mt-2 text-ink text-balance">The Blog</h1>
          </div>
          <SearchBox />
        </Reveal>

        {categories.length ? (
          <Reveal delay={0.1} className="mt-8 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-hairline px-4 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink hover:text-ink"
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
