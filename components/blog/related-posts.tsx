import { Reveal } from "@/components/ui/reveal";
import type { PostSummaryData } from "@/lib/cms/types";
import { PostCard } from "./post-card";

export function RelatedPosts({ posts }: { posts: PostSummaryData[] }) {
  if (!posts.length) return null;

  return (
    <section className="border-t border-hairline pt-14">
      <Reveal>
        <span className="font-hand -rotate-1 inline-block text-base text-accent">
          keep reading
        </span>
        <h2 className="mt-2 font-heading text-2xl font-extrabold text-ink">Related posts</h2>
      </Reveal>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.id} delay={index * 0.08}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
