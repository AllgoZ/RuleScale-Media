import type { Heading } from "@/lib/blog/toc";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border border-hairline p-5">
      <span className="font-hand -rotate-1 inline-block text-sm text-accent">on this page</span>
      <ul className="mt-3 flex flex-col gap-2">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: (heading.level - 2) * 12 }}>
            <a
              href={`#${heading.id}`}
              className="text-sm text-ink-soft transition-colors hover:text-accent"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
