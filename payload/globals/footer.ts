import type { GlobalConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.footer);
      },
    ],
  },
  fields: [
    {
      name: "blurb",
      type: "text",
      defaultValue:
        "A full-service marketing agency for brands who want to be remembered, not just seen.",
    },
    {
      name: "serviceLinks",
      type: "array",
      defaultValue: [
        { label: "Website Design", href: "/#services" },
        { label: "SEO", href: "/#services" },
        { label: "Performance Marketing", href: "/#services" },
        { label: "Social Media", href: "/#services" },
        { label: "Video Production", href: "/#services" },
        { label: "Brand Strategy", href: "/#services" },
        { label: "Influencer Program", href: "/form/influencer" },
      ],
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "legalLinks",
      type: "array",
      defaultValue: [
        { label: "Privacy Policy", href: "/#top" },
        { label: "Terms of Service", href: "/#top" },
      ],
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text", required: true },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      defaultValue: [
        { platform: "instagram", url: "https://www.instagram.com/rulescalemedia?lqvp=MXhocXAweWJ0cDJ2aw==" },
        { platform: "linkedin", url: "/#top" },
        { platform: "youtube", url: "/#top" },
      ],
      fields: [
        {
          name: "platform",
          type: "select",
          required: true,
          options: [
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "YouTube", value: "youtube" },
          ],
        },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
