import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { AuthorByline } from "@/components/blog/author-byline";
import { CategoryPill } from "@/components/blog/category-pill";
import { ArticleCta } from "@/components/blog/article-cta";
import { PostNavigation } from "@/components/blog/post-navigation";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { extractHeadings } from "@/lib/blog/toc";
import { getAdjacentPosts, getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

// Prerender every published post at build; new/unknown slugs still render on demand and are
// then cached. Tag revalidation (Payload hooks) refreshes them; the 15-minute revalidate is a
// safety net so a page built while the database was unreachable can't stay stale.
export const revalidate = 900;

export async function generateStaticParams() {
  try {
    const { docs } = await getPublishedPosts({ limit: 1000 });
    return docs.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.seo.metaTitle || post.title;
  const description = post.seo.metaDescription || post.excerpt;
  const canonical = post.seo.canonicalUrl || `/blog/${post.slug}`;
  const ogImage = post.seo.ogImage || post.featuredImage;
  const twitterImage = post.seo.twitterImage || post.featuredImage;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishedDate || undefined,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author.name] : undefined,
      images: ogImage ? [{ url: ogImage.url, alt: ogImage.alt || post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: twitterImage ? [twitterImage.url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [related, adjacent, siteSettings] = await Promise.all([
    getRelatedPosts(post),
    getAdjacentPosts(post),
    getSiteSettings(),
  ]);

  const headings = extractHeadings(post.content);
  const publishedDate = post.publishedDate
    ? new Date(post.publishedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const jsonLd = [
    articleSchema(post, siteSettings),
    breadcrumbSchema(siteSettings, [
      { name: "Home", url: SITE_URL },
      { name: "Blog", url: `${SITE_URL}/blog` },
      ...(post.category
        ? [
            {
              name: post.category.title,
              url: `${SITE_URL}/blog/category/${post.category.slug}`,
            },
          ]
        : []),
      { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
    ]),
  ];

  return (
    <main className="section">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Container>
        <Reveal className="max-w-3xl">
          {post.category ? (
            <CategoryPill label={post.category.title} href={`/blog/category/${post.category.slug}`} />
          ) : null}
          <h1 className="text-editorial mt-4 text-ink text-balance">{post.title}</h1>
          <p className="text-lead mt-5 max-w-2xl">{post.excerpt}</p>
          <div className="mt-6">
            <AuthorByline
              author={post.author}
              publishedDate={post.publishedDate}
              readingTime={post.readingTime}
            />
          </div>
        </Reveal>

        {post.featuredImage ? (
          <Reveal delay={0.1} className="relative mt-10 aspect-[16/9] max-w-3xl overflow-hidden rounded-md">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </Reveal>
        ) : null}
      </Container>

      <Container className="mt-12">
        <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
        {headings.length > 1 ? (
          <div className="mb-10 lg:hidden">
            <TableOfContents headings={headings} />
          </div>
        ) : null}

        <ArticleContent content={post.content} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8">
          {post.tags.length ? (
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {post.tags.map((tag) => (
                <CategoryPill key={tag.id} label={`#${tag.title}`} href={`/blog/tag/${tag.slug}`} className="inline-flex min-h-8 items-center" />
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareButtons url={`${SITE_URL}/blog/${post.slug}`} title={post.title} />
        </div>

        {publishedDate ? (
          <p className="mt-6 text-xs text-ink-soft">
            Published {publishedDate}
            {post.updatedAt && post.updatedAt !== post.publishedDate
              ? ` · Updated ${new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
              : null}
          </p>
        ) : null}

        <div className="mt-12">
          <ArticleCta />
        </div>

        <div className="mt-14">
          <PostNavigation previous={adjacent.previous} next={adjacent.next} />
        </div>
        </div>

        {headings.length > 1 ? (
          <aside className="hidden lg:col-span-3 lg:col-start-10 lg:block">
            <div className="sticky top-28">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        ) : null}
        </div>
      </Container>

      {related.length ? (
        <Container className="mt-16">
          <RelatedPosts posts={related} />
        </Container>
      ) : null}
    </main>
  );
}
