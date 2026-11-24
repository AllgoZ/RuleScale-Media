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
      <div className="rounded-md border border-dashed border-hairline py-20 text-center">
        <p className="text-ink-soft">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={post.id} post={post} step={(index % 3) + 1} />
      ))}
    </div>
  );
}
