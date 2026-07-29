import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleContent } from "@/components/blog/article-content";
import { AuthorByline } from "@/components/blog/author-byline";
import { CategoryPill } from "@/components/blog/category-pill";
import { NewsletterCta } from "@/components/blog/newsletter-cta";
import { PostNavigation } from "@/components/blog/post-navigation";
import { RelatedPosts } from "@/components/blog/related-posts";
import { ShareButtons } from "@/components/blog/share-buttons";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { extractHeadings } from "@/lib/blog/toc";
import { getAdjacentPosts, getPostBySlug, getRelatedPosts } from "@/lib/cms/posts";
import { getSiteSettings } from "@/lib/cms/settings";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const [post, siteSettings] = await Promise.all([getPostBySlug(slug), getSiteSettings()]);
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
      url: `${siteSettings.url}/blog/${post.slug}`,
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
      { name: "Home", url: siteSettings.url },
      { name: "Blog", url: `${siteSettings.url}/blog` },
      ...(post.category
        ? [
            {
              name: post.category.title,
              url: `${siteSettings.url}/blog/category/${post.category.slug}`,
            },
          ]
        : []),
      { name: post.title, url: `${siteSettings.url}/blog/${post.slug}` },
    ]),
  ];

  return (
    <main className="py-16 md:py-24">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Container className="max-w-3xl">
        <Reveal>
          {post.category ? (
            <CategoryPill label={post.category.title} href={`/blog/category/${post.category.slug}`} />
          ) : null}
          <h1 className="text-editorial mt-4 text-ink text-balance">{post.title}</h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">{post.excerpt}</p>
          <div className="mt-6">
            <AuthorByline
              author={post.author}
              publishedDate={post.publishedDate}
              readingTime={post.readingTime}
            />
          </div>
        </Reveal>

        {post.featuredImage ? (
          <Reveal delay={0.1} className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-hairline">
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

      <Container className="mt-12 max-w-3xl">
        {headings.length > 1 ? (
          <div className="mb-10 lg:hidden">
            <TableOfContents headings={headings} />
          </div>
        ) : null}

        <ArticleContent content={post.content} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-8">
          {post.tags.length ? (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <CategoryPill key={tag.id} label={`#${tag.title}`} href={`/blog/tag/${tag.slug}`} />
              ))}
            </div>
          ) : (
            <span />
          )}
          <ShareButtons url={`${siteSettings.url}/blog/${post.slug}`} title={post.title} />
        </div>

        {publishedDate ? (
          <p className="mt-6 text-xs text-ink-soft/60">
            Published {publishedDate}
            {post.updatedAt && post.updatedAt !== post.publishedDate
              ? ` · Updated ${new Date(post.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`
              : null}
          </p>
        ) : null}

        <div className="mt-12">
          <NewsletterCta />
        </div>

        <div className="mt-14">
          <PostNavigation previous={adjacent.previous} next={adjacent.next} />
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
