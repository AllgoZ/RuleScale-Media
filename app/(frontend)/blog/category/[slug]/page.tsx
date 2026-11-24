import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/blog/pagination";
import { PostGrid } from "@/components/blog/post-grid";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getCategoryBySlug } from "@/lib/cms/categories";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [category, siteSettings] = await Promise.all([getCategoryBySlug(slug), getSiteSettings()]);
  if (!category) return {};

  const title = `${category.title} | Blog | ${siteSettings.siteName}`;
  const description = category.description || `Posts filed under ${category.title}.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/blog/category/${category.slug}` },
    twitter: { title, description },
  };
}

export default async function CategoryArchivePage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPublishedPosts({ page, categorySlug: slug });

  return (
    <main className="section">
      <Container>
        <Reveal>
          <p className="eyebrow">category</p>
          <h1 className="text-editorial mt-2 text-ink text-balance">{category.title}</h1>
          {category.description ? (
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{category.description}</p>
          ) : null}
        </Reveal>

        <div className="mt-14">
          <PostGrid posts={posts.docs} emptyMessage={`No posts in ${category.title} yet.`} />
        </div>

        <div className="mt-10">
          <Pagination
            currentPage={posts.page}
            totalPages={posts.totalPages}
            basePath={`/blog/category/${category.slug}`}
          />
        </div>
      </Container>
    </main>
  );
}
