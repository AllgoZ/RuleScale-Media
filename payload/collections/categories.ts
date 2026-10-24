import type { CollectionConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin, isAdminOrEditor } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.taxonomy);
        revalidateTagSafely(CACHE_TAGS.posts);
      },
    ],
    afterDelete: [
      () => {
        revalidateTagSafely(CACHE_TAGS.taxonomy);
        revalidateTagSafely(CACHE_TAGS.posts);
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
