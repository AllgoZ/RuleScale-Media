"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="section">
      <Container>
        <p className="eyebrow">Something went wrong</p>
        <h1 className="text-editorial mt-5 text-balance">We hit a snag.</h1>
        <p className="text-lead mt-6 max-w-lg">
          This page failed to load. Try again, or head back to the homepage.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button type="button" variant="accent" size="lg" onClick={reset}>
            Try again
          </Button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
          >
            Back to homepage
          </Link>
        </div>
      </Container>
    </main>
  );
}
