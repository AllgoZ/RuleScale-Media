import type { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { DefaultNodeTypes, SerializedHeadingNode } from "@payloadcms/richtext-lexical";
import { collectNodeText, createHeadingIdAssigner } from "@/lib/blog/toc";
import type { LexicalContent } from "@/lib/cms/types";

export function ArticleContent({ content }: { content: LexicalContent }) {
  // One id assigner per render so repeated heading text gets the same
  // dedup-numbered ids the TOC computed for the same document (see
  // lib/blog/toc.ts) — this is what makes the TOC's anchor links land correctly.
  const assignId = createHeadingIdAssigner();

  const converters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const headingNode = node as SerializedHeadingNode;
      const id = assignId(collectNodeText(headingNode));
      const Tag = headingNode.tag;
      return <Tag id={id}>{nodesToJSX({ nodes: headingNode.children })}</Tag>;
    },
  });

  return <RichText data={content} converters={converters} className="article-body" />;
}
