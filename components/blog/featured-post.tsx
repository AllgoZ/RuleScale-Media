import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { PostSummaryData } from "@/lib/cms/types";
import { AuthorByline } from "./author-byline";
import { CategoryPill } from "./category-pill";

export function FeaturedPost({ post }: { post: PostSummaryData }) {
  return (
    <Reveal>
      <article className="group relative grid overflow-hidden rounded-3xl border border-hairline bg-paper shadow-soft lg:grid-cols-2">
        <Link
          href={`/blog/${post.slug}`}
          className="absolute inset-0 z-10"
          aria-label={post.title}
        />
        <div className="relative aspect-[16/10] overflow-hidden bg-ink/[0.04] lg:aspect-auto">
          {post.featuredImage ? (
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.alt || post.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              priority
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : null}
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
          <span className="font-hand -rotate-1 inline-block self-start text-base text-accent">
            featured
          </span>
          {post.category ? (
            <CategoryPill label={post.category.title} className="self-start" />
          ) : null}
          <h2 className="font-heading text-2xl font-extrabold leading-tight text-ink sm:text-3xl">
            {post.title}
          </h2>
          <p className="text-base text-ink-soft">{post.excerpt}</p>
          <AuthorByline
            author={post.author}
            publishedDate={post.publishedDate}
            readingTime={post.readingTime}
            linkAuthor={false}
          />
          <Button variant="ghost" size="default" asChild className="relative z-20 mt-2 self-start">
            <Link href={`/blog/${post.slug}`}>
              Read article
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
      </article>
    </Reveal>
  );
}
