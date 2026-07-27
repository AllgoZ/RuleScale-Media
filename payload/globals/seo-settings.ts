import type { GlobalConfig } from "payload";

export const SEOSettings: GlobalConfig = {
  slug: "seoSettings",
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
  ],
};
