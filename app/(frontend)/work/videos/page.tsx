import type { Metadata } from "next";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { getVideoPortfolioItems } from "@/lib/cms/portfolio";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Video Work",
  description: "Video projects from the RuleScale Media portfolio.",
  alternates: { canonical: "/work/videos" },
  openGraph: {
    title: "Video Work",
    description: "Video projects from the RuleScale Media portfolio.",
    url: `${SITE_URL}/work/videos`,
  },
};

export default async function VideoWorkIndexPage() {
  const items = await getVideoPortfolioItems();

  return (
    <main className="py-16 md:py-24" style={{ backgroundColor: "var(--color-home-bg)" }}>
      <Container>
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="pill-badge mx-auto inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            Video Work
          </span>
          <h1 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            Projects we&apos;ve brought to life on screen
          </h1>
        </Reveal>

        {items.length ? (
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.1}>
                <Link
                  href={`/work/videos/${item.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-hairline bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="relative aspect-video overflow-hidden bg-ink/[0.06]">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail.url}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                    <div className="absolute inset-0 flex items-center justify-center bg-ink/20 transition-colors group-hover:bg-ink/30">
                      <span className="gradient-bg flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lift">
                        <Play size={22} fill="currentColor" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-ink-soft">{item.client}</p>
                    <h3 className="mt-1 font-heading text-base font-bold text-ink">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-14 text-center text-ink-soft">
            No video projects published yet — check back soon.
          </p>
        )}
      </Container>
    </main>
  );
}
