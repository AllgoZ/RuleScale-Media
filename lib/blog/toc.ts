import type { LexicalContent } from "@/lib/cms/types";

type LexicalNode = {
  type?: string;
  tag?: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

export type Heading = {
  level: number;
  text: string;
  id: string;
};

const HEADING_TAGS = new Set(["h2", "h3", "h4"]);

export function collectNodeText(node: LexicalNode): string {
  if (node.type === "text" && typeof node.text === "string") return node.text;
  if (Array.isArray(node.children)) {
    return node.children.map(collectNodeText).join("");
  }
  return "";
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Returns a per-document id assigner so repeated heading text produces stable,
 * unique ids (`x`, `x-1`, `x-2`...). The TOC and the article renderer each create
 * their own instance and walk the same document in the same order, so the ids
 * they produce for a given heading always match — this is what makes the TOC's
 * anchor links actually land on the right heading. */
export function createHeadingIdAssigner() {
  const seenIds = new Map<string, number>();
  return (text: string): string => {
    const base = slugifyHeading(text);
    const seenCount = seenIds.get(base) ?? 0;
    seenIds.set(base, seenCount + 1);
    return seenCount > 0 ? `${base}-${seenCount}` : base;
  };
}

/** Extracts h2-h4 headings for a table of contents. h1 is skipped since it's the
 * article title itself, rendered separately from the body. */
export function extractHeadings(content: LexicalContent): Heading[] {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root || !Array.isArray(root.children)) return [];

  const headings: Heading[] = [];
  const assignId = createHeadingIdAssigner();

  for (const node of root.children) {
    if (node.type !== "heading" || typeof node.tag !== "string" || !HEADING_TAGS.has(node.tag)) {
      continue;
    }
    const text = collectNodeText(node).trim();
    if (!text) continue;

    headings.push({ level: Number(node.tag.slice(1)), text, id: assignId(text) });
  }

  return headings;
}
