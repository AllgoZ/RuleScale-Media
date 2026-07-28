import type { GlobalConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const SEOSettings: GlobalConfig = {
  slug: "seoSettings",
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.seoSettings);
      },
    ],
  },
  fields: [
    {
      name: "defaultTitle",
      type: "text",
      defaultValue: "RuleScale Media | We grow brands people remember.",
    },
    {
      name: "defaultDescription",
      type: "textarea",
      defaultValue:
        "RuleScale Media is a full-service marketing agency for website design & development, SEO, social, influencer, video, and performance advertising — built to turn attention into revenue.",
    },
    {
      name: "keywords",
      type: "array",
      defaultValue: [
        { keyword: "marketing agency" },
        { keyword: "website design and development" },
        { keyword: "SEO agency" },
        { keyword: "social media marketing" },
        { keyword: "influencer marketing" },
        { keyword: "programmatic advertising" },
        { keyword: "video production" },
        { keyword: "content marketing" },
        { keyword: "brand strategy consulting" },
      ],
      fields: [{ name: "keyword", type: "text", required: true }],
    },
    {
      name: "ogImageAlt",
      type: "text",
      defaultValue: "RuleScale Media",
    },
    {
      name: "twitterHandle",
      type: "text",
    },
    {
      name: "robotsIndex",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Allow search engines to index the site.",
      },
    },
    {
      name: "robotsFollow",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Allow search engines to follow links on the site.",
      },
    },
  ],
};
