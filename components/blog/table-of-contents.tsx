import type { Heading } from "@/lib/blog/toc";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="border-y border-hairline py-5">
      <p className="eyebrow">On this page</p>
      <ul className="mt-4 flex flex-col gap-2.5">
        {headings.map((heading) => (
          <li key={heading.id} style={{ paddingLeft: (heading.level - 2) * 14 }}>
            <a
              href={`#${heading.id}`}
              className="text-[15px] text-ink-soft transition-colors hover:text-accent-deep"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
