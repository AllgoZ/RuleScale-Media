import type { CollectionConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin, isAdminOrEditor } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    useAsTitle: "title",
    preview: (doc) => {
      const params = new URLSearchParams({
        path: `/blog/${doc.slug ?? ""}`,
        previewSecret: process.env.PREVIEW_SECRET || "",
      });
      return `/next/preview?${params.toString()}`;
    },
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterChange: [
      ({ doc, previousDoc }) => {
        revalidateTagSafely(CACHE_TAGS.posts);
        revalidateTagSafely(CACHE_TAGS.postBySlug(doc.slug));
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidateTagSafely(CACHE_TAGS.postBySlug(previousDoc.slug));
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTagSafely(CACHE_TAGS.posts);
        revalidateTagSafely(CACHE_TAGS.postBySlug(doc.slug));
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
      name: "excerpt",
      type: "textarea",
      required: true,
    },
    {
      name: "content",
      type: "richText",
      required: true,
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
    },
    {
      name: "publishedDate",
      type: "date",
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
        { name: "canonicalUrl", type: "text" },
        { name: "ogImage", type: "upload", relationTo: "media" },
        { name: "twitterImage", type: "upload", relationTo: "media" },
      ],
    },
  ],
};
