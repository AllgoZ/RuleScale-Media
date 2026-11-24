import { notFound } from "next/navigation";
import { BlogIndex, blogIndexMetadata } from "@/components/blog/blog-index";
import { getPublishedPosts } from "@/lib/cms/posts";

// Internal target of the `/blog?page=N` rewrite in next.config.ts (see components/blog/blog-index.tsx).
export const revalidate = 900;

export const generateMetadata = blogIndexMetadata;

export async function generateStaticParams() {
  try {
    const { totalPages } = await getPublishedPosts({ page: 1 });
    return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({ page: String(i + 2) }));
  } catch {
    return [];
  }
}

export default async function BlogIndexPageN({ params }: { params: Promise<{ page: string }> }) {
  const page = Number((await params).page);
  if (!Number.isInteger(page) || page < 1) notFound();
  return <BlogIndex page={page} />;
}
