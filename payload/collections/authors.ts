import type { CollectionConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
    create: isAdmin,
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
      name: "name",
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
      name: "role",
      type: "text",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "bio",
      type: "textarea",
    },
  ],
};
