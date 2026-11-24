import { BlogIndex, blogIndexMetadata } from "@/components/blog/blog-index";

// Prerendered; refreshed by the CMS revalidate tags, with this as a safety net.
export const revalidate = 900;

export const generateMetadata = blogIndexMetadata;

export default function BlogIndexPage() {
  return <BlogIndex page={1} />;
}
