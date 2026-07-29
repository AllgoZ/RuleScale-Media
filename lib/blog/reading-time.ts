import type { LexicalContent } from "@/lib/cms/types";

type LexicalNode = {
  type?: string;
  text?: string;
  children?: LexicalNode[];
  [key: string]: unknown;
};

const WORDS_PER_MINUTE = 200;

function countWords(node: LexicalNode): number {
  if (node.type === "text" && typeof node.text === "string") {
    return node.text.trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(node.children)) {
    return node.children.reduce((sum, child) => sum + countWords(child), 0);
  }
  return 0;
}

/** Minutes, rounded up, minimum 1 — computed fresh from the Lexical content rather
 * than stored, so it can never drift from what's actually in the article. */
export function calculateReadingTime(content: LexicalContent): number {
  const root = (content as { root?: LexicalNode })?.root;
  if (!root) return 1;
  return Math.max(1, Math.ceil(countWords(root) / WORDS_PER_MINUTE));
}
