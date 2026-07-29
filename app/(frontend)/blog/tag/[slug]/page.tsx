import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/blog/pagination";
import { PostGrid } from "@/components/blog/post-grid";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { getTagBySlug } from "@/lib/cms/tags";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [tag, siteSettings] = await Promise.all([getTagBySlug(slug), getSiteSettings()]);
  if (!tag) return {};

  const title = `#${tag.title} | Blog | ${siteSettings.siteName}`;
  const description = `Posts tagged #${tag.title}.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    openGraph: { title, description, url: `${siteSettings.url}/blog/tag/${tag.slug}` },
    twitter: { title, description },
  };
}

export default async function TagArchivePage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const posts = await getPublishedPosts({ page, tagSlug: slug });

  return (
    <main className="py-16 md:py-24">
      <Container>
        <Reveal>
          <span className="font-hand -rotate-1 inline-block text-base text-accent">tag</span>
          <h1 className="text-editorial mt-2 text-ink text-balance">#{tag.title}</h1>
        </Reveal>

        <div className="mt-14">
          <PostGrid posts={posts.docs} emptyMessage={`No posts tagged #${tag.title} yet.`} />
        </div>

        <div className="mt-10">
          <Pagination
            currentPage={posts.page}
            totalPages={posts.totalPages}
            basePath={`/blog/tag/${tag.slug}`}
          />
        </div>
      </Container>
    </main>
  );
}
