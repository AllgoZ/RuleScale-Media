import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { PostSummaryData } from "@/lib/cms/types";
import { AuthorByline } from "./author-byline";
import { CategoryPill } from "./category-pill";

export function PostCard({ post }: { post: PostSummaryData }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-paper shadow-soft transition-shadow duration-300 hover:shadow-lift">
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-10"
        aria-label={post.title}
      />
      <div className="relative aspect-[16/10] overflow-hidden bg-ink/[0.04]">
        {post.featuredImage ? (
          <Image
            src={post.featuredImage.url}
            alt={post.featuredImage.alt || post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        {post.category ? <CategoryPill label={post.category.title} className="self-start" /> : null}
        <h3 className="font-heading text-xl font-bold leading-snug text-ink">{post.title}</h3>
        <p className="line-clamp-2 flex-1 text-sm text-ink-soft">{post.excerpt}</p>
        <div className="flex items-center justify-between gap-3 pt-2">
          <AuthorByline
            author={post.author}
            publishedDate={post.publishedDate}
            readingTime={post.readingTime}
            size="sm"
            linkAuthor={false}
          />
          <ArrowUpRight
            size={16}
            className="shrink-0 text-ink-soft transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
      </div>
    </article>
  );
}
