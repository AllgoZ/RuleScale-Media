import type { GlobalConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.navigation);
      },
    ],
  },
  fields: [
    {
      name: "links",
      type: "array",
      defaultValue: [
        { label: "Work", href: "#case-studies" },
        { label: "Services", href: "#services" },
        { label: "Process", href: "#process" },
        { label: "FAQ", href: "#faq" },
        { label: "Blog", href: "/blog" },
      ],
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "ctaLabel",
      type: "text",
      defaultValue: "Start Growing",
    },
    {
      name: "ctaHref",
      type: "text",
      defaultValue: "#final-cta",
    },
  ],
};
