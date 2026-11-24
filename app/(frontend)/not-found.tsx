import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main className="section">
      <Container>
        <p className="eyebrow">Error 404</p>
        <h1 className="text-editorial mt-5 text-balance">This page doesn&apos;t exist.</h1>
        <p className="text-lead mt-6 max-w-lg">
          The link may be broken or the page may have moved. Head back to the homepage or read
          the latest from the blog.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button asChild variant="accent" size="lg">
            <Link href="/">Back to homepage</Link>
          </Button>
          <Link
            href="/blog"
            className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            Visit the blog
          </Link>
        </div>
      </Container>
    </main>
  );
}
