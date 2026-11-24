import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Pagination } from "@/components/blog/pagination";
import { PostGrid } from "@/components/blog/post-grid";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getAuthorBySlug } from "@/lib/cms/authors";
import { getPublishedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";

type Params = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [author, siteSettings] = await Promise.all([getAuthorBySlug(slug), getSiteSettings()]);
  if (!author) return {};

  const title = `${author.name} | Blog | ${siteSettings.siteName}`;
  const description = author.bio || `Posts by ${author.name}.`;
  return {
    title,
    description,
    alternates: { canonical: `/blog/author/${author.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/blog/author/${author.slug}` },
    twitter: { title, description },
  };
}

export default async function AuthorArchivePage({ params, searchParams }: Params) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const posts = await getPublishedPosts({ page, authorSlug: slug });

  return (
    <main className="section">
      <Container>
        <Reveal className="flex items-center gap-4">
          {author.avatar ? (
            <Image
              src={author.avatar.url}
              alt={author.avatar.alt || author.name}
              width={64}
              height={64}
              className="shrink-0 rounded-full object-cover"
              style={{ width: 64, height: 64 }}
            />
          ) : (
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] font-heading text-2xl font-bold text-ink-soft">
              {author.name.charAt(0)}
            </span>
          )}
          <div>
            <p className="eyebrow">{author.role || "author"}</p>
            <h1 className="text-editorial mt-1 text-ink text-balance">{author.name}</h1>
          </div>
        </Reveal>

        {author.bio ? (
          <Reveal delay={0.1} className="mt-6 max-w-xl text-lg text-ink-soft">
            <p>{author.bio}</p>
          </Reveal>
        ) : null}

        <div className="mt-14">
          <PostGrid posts={posts.docs} emptyMessage={`No posts by ${author.name} yet.`} />
        </div>

        <div className="mt-10">
          <Pagination
            currentPage={posts.page}
            totalPages={posts.totalPages}
            basePath={`/blog/author/${author.slug}`}
          />
        </div>
      </Container>
    </main>
  );
}
