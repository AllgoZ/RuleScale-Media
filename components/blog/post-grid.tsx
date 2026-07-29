import { Reveal } from "@/components/ui/reveal";
import type { PostSummaryData } from "@/lib/cms/types";
import { PostCard } from "./post-card";

export function PostGrid({
  posts,
  emptyMessage,
}: {
  posts: PostSummaryData[];
  emptyMessage: string;
}) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border border-dashed border-hairline py-20 text-center">
        <p className="text-ink-soft">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <Reveal key={post.id} delay={(index % 6) * 0.06}>
          <PostCard post={post} />
        </Reveal>
      ))}
    </div>
  );
}
