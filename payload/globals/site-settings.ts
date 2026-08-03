import type { GlobalConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.siteSettings);
      },
    ],
  },
  fields: [
    {
      name: "siteName",
      type: "text",
      defaultValue: "RuleScale Media",
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "We grow brands people remember.",
    },
    {
      name: "description",
      type: "textarea",
      defaultValue:
        "RuleScale Media is a full-service marketing agency for website design & development, SEO, social, influencer, video, and performance advertising — built to turn attention into revenue.",
    },
    {
      name: "url",
      type: "text",
      defaultValue: "https://www.rulescale.in",
    },
    {
      name: "contactEmail",
      type: "email",
      defaultValue: "hello@rulescale.media",
    },
    {
      name: "sameAs",
      type: "array",
      defaultValue: [
        { url: "https://www.linkedin.com/company/rulescale-media" },
        { url: "https://www.instagram.com/rulescalemedia" },
      ],
      fields: [{ name: "url", type: "text", required: true }],
    },
  ],
};
