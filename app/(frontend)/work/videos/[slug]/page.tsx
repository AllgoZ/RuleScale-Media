import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { transformImage } from "@/lib/cloudinary";
import { getAllPortfolioItems, getPortfolioItemBySlug } from "@/lib/cms/portfolio";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, videoObjectSchema } from "@/lib/schema";
import { parseVideoUrl } from "@/lib/video";

type Params = { params: Promise<{ slug: string }> };

// Prerender every published video page at build (see blog/[slug] for the rationale).
export const revalidate = 900;

export async function generateStaticParams() {
  try {
    const items = await getAllPortfolioItems();
    return items.filter((item) => item.mediaType === "video").map((item) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item || item.mediaType !== "video") return {};

  const title = item.seo.metaTitle || `${item.title} | ${item.client}`;
  const description = item.seo.metaDescription || item.description;
  const image = item.seo.metaImage || item.thumbnail?.url;

  return {
    title,
    description,
    alternates: { canonical: item.seo.canonicalUrl || `/work/videos/${item.slug}` },
    openGraph: {
      type: "video.other",
      title,
      description,
      url: `${SITE_URL}/work/videos/${item.slug}`,
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

function VideoPlayer({ videoUrl }: { videoUrl: string }) {
  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return null;

  if (parsed.kind === "mp4") {
    return (
      <video src={parsed.directUrl} controls className="h-full w-full" playsInline preload="metadata" />
    );
  }

  return (
    <iframe
      src={parsed.embedUrl}
      title="Video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="h-full w-full"
    />
  );
}

export default async function VideoWorkItemPage({ params }: Params) {
  const { slug } = await params;
  const item = await getPortfolioItemBySlug(slug);
  if (!item || item.mediaType !== "video") notFound();

  const siteSettings = await getSiteSettings();

  const jsonLd = [
    videoObjectSchema(item, siteSettings),
    breadcrumbSchema(siteSettings, [
      { name: "Home", url: SITE_URL },
      { name: "Video Work", url: `${SITE_URL}/work/videos` },
      { name: item.title, url: `${SITE_URL}/work/videos/${item.slug}` },
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
        <Reveal>
          <p className="eyebrow">{item.client || "Video"}</p>
          <h1 className="text-editorial mt-5 text-balance">{item.title}</h1>
        </Reveal>

        {item.videoUrl ? (
          <div className="relative mt-10 aspect-video overflow-hidden rounded-md bg-black">
            <VideoPlayer videoUrl={item.videoUrl} />
          </div>
        ) : null}

        {item.description ? <p className="text-lead mt-8 max-w-2xl">{item.description}</p> : null}

        {item.services.length ? (
          <p className="mt-6 text-sm text-ink-soft">{item.services.join("  ·  ")}</p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button asChild variant="accent" size="lg">
            <Link href="/contact">
              Start a project like this
              <ArrowRight size={18} />
            </Link>
          </Button>
          <Link
            href="/work/videos"
            className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            All video work
          </Link>
        </div>
      </Container>
    </main>
  );
}
