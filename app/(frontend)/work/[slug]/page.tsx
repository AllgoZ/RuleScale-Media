import type { Metadata } from "next";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { transformImage } from "@/lib/cloudinary";
import { getPortfolioItemBySlug, getRelatedPortfolioItems } from "@/lib/cms/portfolio";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, creativeWorkSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item || item.mediaType !== "image") return {};

  const title = item.seo.metaTitle || `${item.title} | ${item.client}`;
  const description = item.seo.metaDescription || item.description;
  const image = item.seo.metaImage || item.thumbnail?.url;

  return {
    title,
    description,
    alternates: { canonical: item.seo.canonicalUrl || `/work/${item.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_URL}/work/${item.slug}`,
      images: image ? [{ url: transformImage(image, { width: 1200, height: 630 }) }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [transformImage(image, { width: 1200, height: 630 })] : undefined,
    },
  };
}

export default async function WorkItemPage({ params }: Params) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item || item.mediaType !== "image") notFound();

  const [related, siteSettings] = await Promise.all([
    getRelatedPortfolioItems(item),
    getSiteSettings(),
  ]);

  const jsonLd = [
    creativeWorkSchema(item, siteSettings),
    breadcrumbSchema(siteSettings, [
      { name: "Home", url: SITE_URL },
      { name: "Work", url: `${SITE_URL}/#case-studies` },
      { name: item.title, url: `${SITE_URL}/work/${item.slug}` },
    ]),
  ];

  return (
    <main className="py-16 md:py-24" style={{ backgroundColor: "var(--color-home-bg)" }}>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Container className="max-w-3xl">
        <Reveal>
          <div className="flex items-center justify-between text-sm text-ink-soft">
            <span>{item.client}</span>
            {item.category ? (
              <span className="pill-badge inline-flex">{item.category}</span>
            ) : null}
          </div>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {item.resultHeadline || item.title}
          </h1>
          {item.description ? (
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{item.description}</p>
          ) : null}
          {item.liveWebsite ? (
            <Link
              href={item.liveWebsite}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-[var(--color-accent)]"
            >
              Visit live site
              <ArrowUpRight size={16} />
            </Link>
          ) : null}
        </Reveal>

        {item.thumbnail ? (
          <Reveal
            delay={0.1}
            className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl border border-hairline"
          >
            <Image
              src={item.thumbnail.url}
              alt={item.title}
              fill
              sizes="(min-width: 768px) 768px, 100vw"
              priority
              className="object-cover"
            />
          </Reveal>
        ) : null}
      </Container>

      <Container className="mt-12 max-w-3xl">
        {item.services.length ? (
          <div className="mb-10 flex flex-wrap gap-2">
            {item.services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-ink/[0.04] px-3 py-1 text-xs font-medium text-ink-soft"
              >
                {service}
              </span>
            ))}
          </div>
        ) : null}

        {item.caseStudyContent ? (
          <RichText data={item.caseStudyContent} className="article-body" />
        ) : null}
      </Container>

      {related.length ? (
        <Container className="mt-16 max-w-5xl border-t border-hairline pt-14">
          <Reveal>
            <h2 className="font-heading text-2xl font-extrabold text-ink">Related work</h2>
          </Reveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedItem, index) => (
              <Reveal key={relatedItem.id} delay={index * 0.08}>
                <Link
                  href={`/work/${relatedItem.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-hairline bg-white shadow-soft transition-shadow duration-300 hover:shadow-lift"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-ink/[0.04]">
                    {relatedItem.thumbnail ? (
                      <Image
                        src={relatedItem.thumbnail.url}
                        alt={relatedItem.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink-soft">{relatedItem.client}</p>
                    <h3 className="mt-1 font-heading text-base font-bold text-ink">
                      {relatedItem.resultHeadline || relatedItem.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      ) : null}
    </main>
  );
}
