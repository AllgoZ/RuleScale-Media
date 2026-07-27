import type { CollectionConfig } from "payload";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    useAsTitle: "client",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "client",
      type: "text",
      required: true,
    },
    {
      name: "industry",
      type: "text",
      required: true,
    },
    {
      name: "result",
      type: "text",
      required: true,
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
    },
    {
      name: "tags",
      type: "array",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "slug",
      type: "text",
    },
  ],
};
