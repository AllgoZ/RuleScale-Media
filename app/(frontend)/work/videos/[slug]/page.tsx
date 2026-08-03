import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { transformImage } from "@/lib/cloudinary";
import { getPortfolioItemBySlug } from "@/lib/cms/portfolio";
import { getSiteSettings } from "@/lib/cms/settings";
import { SITE_URL } from "@/lib/constants";
import { breadcrumbSchema, videoObjectSchema } from "@/lib/schema";
import { parseVideoUrl } from "@/lib/video";

type Params = { params: Promise<{ slug: string }> };

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
    <main className="py-16 md:py-24" style={{ backgroundColor: "var(--color-home-bg)" }}>
      {jsonLd.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Container className="max-w-4xl">
        <Reveal>
          <p className="text-sm text-ink-soft">{item.client}</p>
          <h1 className="mt-2 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {item.title}
          </h1>
        </Reveal>

        {item.videoUrl ? (
          <Reveal
            delay={0.1}
            className="relative mt-8 aspect-video overflow-hidden rounded-3xl border border-hairline bg-black"
          >
            <VideoPlayer videoUrl={item.videoUrl} />
          </Reveal>
        ) : null}

        {item.description ? (
          <Reveal delay={0.15} className="mt-8 max-w-2xl text-lg text-ink-soft">
            <p>{item.description}</p>
          </Reveal>
        ) : null}

        {item.services.length ? (
          <div className="mt-6 flex flex-wrap gap-2">
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

        <Reveal delay={0.2} className="mt-10">
          <Button
            size="lg"
            className="gradient-bg text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(124,58,237,0.45)]"
            asChild
          >
            <Link href="/#final-cta">
              Start a project like this
              <ArrowRight size={18} />
            </Link>
          </Button>
        </Reveal>
      </Container>
    </main>
  );
}
