import type { Metadata } from "next";
import { Pagination } from "@/components/blog/pagination";
import { PostGrid } from "@/components/blog/post-grid";
import { SearchBox } from "@/components/blog/search-box";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await getSiteSettings();
  return {
    title: `Search | Blog | ${siteSettings.siteName}`,
    alternates: { canonical: "/blog/search" },
    robots: { index: false, follow: true },
  };
}

export default async function BlogSearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, Number(pageParam) || 1);

  const posts = query ? await getPublishedPosts({ page, search: query }) : null;

  return (
    <main className="py-16 md:py-24">
      <Container>
        <Reveal>
          <span className="font-hand -rotate-1 inline-block text-base text-accent">search</span>
          <h1 className="text-editorial mt-2 text-ink text-balance">
            {query ? `Results for "${query}"` : "Search the blog"}
          </h1>
          <div className="mt-6 max-w-md">
            <SearchBox defaultValue={query} />
          </div>
        </Reveal>

        <div className="mt-14">
          {posts ? (
            <PostGrid posts={posts.docs} emptyMessage={`No posts found for "${query}".`} />
          ) : (
            <div className="rounded-2xl border border-dashed border-hairline py-20 text-center">
              <p className="text-ink-soft">Enter a search term to find articles.</p>
            </div>
          )}
        </div>

        {posts ? (
          <div className="mt-10">
            <Pagination
              currentPage={posts.page}
              totalPages={posts.totalPages}
              basePath="/blog/search"
              searchParams={{ q: query }}
            />
          </div>
        ) : null}
      </Container>
    </main>
  );
}
