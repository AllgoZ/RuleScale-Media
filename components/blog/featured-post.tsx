import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { PostSummaryData } from "@/lib/cms/types";
import { AuthorByline } from "./author-byline";
import { CategoryPill } from "./category-pill";
import { PostCover } from "./post-cover";

export function FeaturedPost({ post }: { post: PostSummaryData }) {
  return (
    <article className="group relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7">
        <PostCover
          post={post}
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="aspect-[16/10]"
        />
      </div>
      <div className="flex flex-col gap-4 lg:col-span-5">
        <p className="eyebrow">Featured</p>
        {post.category ? <CategoryPill label={post.category.title} className="self-start" /> : null}
        <h2 className="font-heading text-3xl font-extrabold leading-[1.05] tracking-[-0.03em] text-ink text-balance md:text-4xl">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </h2>
        <p className="text-base leading-relaxed text-ink-soft">{post.excerpt}</p>
        <AuthorByline
          author={post.author}
          publishedDate={post.publishedDate}
          readingTime={post.readingTime}
          linkAuthor={false}
        />
        <span className="mt-1 inline-flex items-center gap-2 font-heading font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 group-hover:text-accent-deep">
          Read article
          <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
