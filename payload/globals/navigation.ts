import type { GlobalConfig } from "payload";

export const Navigation: GlobalConfig = {
  slug: "navigation",
  fields: [
    {
      name: "links",
      type: "array",
      defaultValue: [
        { label: "Work", href: "#case-studies" },
        { label: "Services", href: "#services" },
        { label: "Process", href: "#process" },
        { label: "FAQ", href: "#faq" },
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
