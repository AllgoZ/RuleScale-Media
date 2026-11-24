import type { Metadata } from "next";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { transformImage } from "@/lib/cloudinary";
import { getAllPortfolioItems, getPortfolioItemBySlug, getRelatedPortfolioItems } from "@/lib/cms/portfolio";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, creativeWorkSchema } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

// Prerender every published image case study at build (see blog/[slug] for the rationale).
export const revalidate = 900;

export async function generateStaticParams() {
  try {
    const items = await getAllPortfolioItems();
    return items.filter((item) => item.mediaType === "image").map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

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
    <main className="section">
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Container>
        <Reveal className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="eyebrow">{item.category || "Case study"}</p>
            <h1 className="text-editorial mt-5 text-balance">{item.resultHeadline || item.title}</h1>
            {item.description ? <p className="text-lead mt-6 max-w-2xl">{item.description}</p> : null}
          </div>
          <dl className="grid gap-6 self-end border-t-2 border-ink pt-5 text-[15px] sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <div>
              <dt className="eyebrow">Client</dt>
              <dd className="mt-2 font-heading text-lg font-bold text-ink">{item.title}</dd>
            </div>
            {item.services.length ? (
              <div>
                <dt className="eyebrow">Services</dt>
                <dd className="mt-2 text-ink">{item.services.join(", ")}</dd>
              </div>
            ) : null}
            {item.liveWebsite ? (
              <div>
                <dt className="eyebrow">Website</dt>
                <dd className="mt-1">
                  <Link
                    href={item.liveWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
                  >
                    Visit live site
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </dd>
              </div>
            ) : null}
          </dl>
        </Reveal>

        {item.thumbnail ? (
          <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-md bg-surface">
            <Image
              src={item.thumbnail.url}
              alt={`${item.title}: ${item.category || "project"} by RuleScale Media`}
              fill
              sizes="(min-width: 1280px) 1176px, 100vw"
              priority
              className="object-cover"
            />
          </div>
        ) : null}
      </Container>

      {item.caseStudyContent ? (
        <Container className="mt-16">
          <RichText data={item.caseStudyContent} className="article-body max-w-3xl" />
        </Container>
      ) : null}

      <Container className="mt-16">
        <div className="on-ink flex flex-col items-start gap-6 rounded-md p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <p className="font-heading text-2xl font-extrabold tracking-tight">
            Want results like this?
          </p>
          <Button asChild variant="accent" size="lg" className="hover:bg-paper hover:text-ink">
            <Link href="/contact">
              Start a project
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </Container>

      {related.length ? (
        <Container className="mt-20 border-t border-hairline pt-14">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-ink">Related work</h2>
          <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((relatedItem) => (
              <article key={relatedItem.id} className="group relative">
                <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface">
                  {relatedItem.thumbnail ? (
                    <Image
                      src={relatedItem.thumbnail.url}
                      alt={`${relatedItem.title}: ${relatedItem.category || "project"} by RuleScale Media`}
                      fill
                      sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : null}
                </div>
                <h3 className="mt-4 font-heading text-xl font-extrabold tracking-tight text-ink">
                  <Link
                    href={`/work/${relatedItem.slug}`}
                    className="after:absolute after:inset-0 after:content-['']"
                  >
                    {relatedItem.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {relatedItem.resultHeadline || relatedItem.category}
                </p>
              </article>
            ))}
          </div>
        </Container>
      ) : null}
    </main>
  );
}
