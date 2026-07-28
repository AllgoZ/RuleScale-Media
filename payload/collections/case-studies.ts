import type { CollectionConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin, isAdminOrEditor } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const CaseStudies: CollectionConfig = {
  slug: "case-studies",
  admin: {
    useAsTitle: "client",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.homepage);
      },
    ],
    afterDelete: [
      () => {
        revalidateTagSafely(CACHE_TAGS.homepage);
      },
    ],
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
