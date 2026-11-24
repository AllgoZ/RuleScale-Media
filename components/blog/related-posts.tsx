import type { PostSummaryData } from "@/lib/cms/types";
import { PostCard } from "./post-card";

export function RelatedPosts({ posts }: { posts: PostSummaryData[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-hairline pt-14" aria-labelledby="related-heading">
      <p className="eyebrow">Keep reading</p>
      <h2 id="related-heading" className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink">
        Related posts
      </h2>
      <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
