import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { PostSummaryData } from "@/lib/cms/types";
import { AuthorByline } from "./author-byline";
import { CategoryPill } from "./category-pill";
import { PostCover } from "./post-cover";

/** `step` (1-5) opts the card into the scroll reveal with a stagger; omit for no animation. */
export function PostCard({ post, step }: { post: PostSummaryData; step?: number }) {
  return (
    <article
      data-anim={step ? "up" : undefined}
      data-anim-step={step}
      className="group relative flex h-full flex-col"
    >
      <PostCover post={post} sizes="(min-width: 1024px) 32vw, (min-width: 640px) 50vw, 100vw" />
      <div className="mt-4 flex flex-1 flex-col gap-2.5">
        {post.category ? <CategoryPill label={post.category.title} className="self-start" /> : null}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl font-extrabold leading-snug tracking-tight text-ink">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {post.title}
            </Link>
          </h3>
          <ArrowUpRight
            size={20}
            aria-hidden="true"
            className="mt-1 shrink-0 text-ink transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-deep"
          />
        </div>
        <p className="line-clamp-2 flex-1 text-[15px] leading-relaxed text-ink-soft">{post.excerpt}</p>
        <div className="pt-1">
          <AuthorByline
            author={post.author}
            publishedDate={post.publishedDate}
            readingTime={post.readingTime}
            size="sm"
            linkAuthor={false}
          />
        </div>
      </div>
    </article>
  );
}
