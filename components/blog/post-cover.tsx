import Image from "next/image";
import { LogoMark } from "@/components/doodles/logo-mark";
import type { PostSummaryData } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Cover for a post card. Uses the post's real featured image when it has one;
 * otherwise a restrained branded block (category + brand mark) — never a stock
 * or invented photo.
 */
export function PostCover({
  post,
  sizes,
  priority = false,
  className,
}: {
  post: PostSummaryData;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative aspect-[3/2] overflow-hidden rounded-md bg-ink", className)}>
      {post.featuredImage ? (
        <Image
          src={post.featuredImage.url}
          alt={post.featuredImage.alt || post.title}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full flex-col justify-between p-5 text-paper" aria-hidden="true">
          <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/70">
            {post.category?.title ?? "Insights"}
          </span>
          <LogoMark size={34} inverted />
        </div>
      )}
    </div>
  );
}
