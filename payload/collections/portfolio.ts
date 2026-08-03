import type { CollectionConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdmin, isAdminOrEditor } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "mediaType", "featured", "sortOrder"],
    preview: (doc) => {
      const path =
        doc.mediaType === "video" ? `/work/videos/${doc.slug ?? ""}` : `/work/${doc.slug ?? ""}`;
      const params = new URLSearchParams({
        path,
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
        revalidateTagSafely(CACHE_TAGS.portfolio);
        revalidateTagSafely(CACHE_TAGS.portfolioBySlug(doc.slug));
        revalidateTagSafely(CACHE_TAGS.homepage);
        if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
          revalidateTagSafely(CACHE_TAGS.portfolioBySlug(previousDoc.slug));
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidateTagSafely(CACHE_TAGS.portfolio);
        revalidateTagSafely(CACHE_TAGS.portfolioBySlug(doc.slug));
        revalidateTagSafely(CACHE_TAGS.homepage);
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
      name: "client",
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
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show this item in the homepage Featured Work section.",
      },
    },
    {
      name: "mediaType",
      type: "select",
      required: true,
      defaultValue: "image",
      options: [
        { label: "Image project", value: "image" },
        { label: "Video project", value: "video" },
      ],
    },
    {
      name: "category",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "resultHeadline",
      type: "text",
    },
    {
      name: "services",
      type: "array",
      fields: [
        {
          name: "service",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "thumbnailUrl",
      type: "text",
      admin: {
        description:
          "Upload via the button below (requires Cloudinary to be configured), or paste a URL directly.",
        components: {
          Field: "@/payload/admin-views/cloudinary-upload-field#CloudinaryUploadField",
        },
      },
    },
    {
      name: "thumbnailPublicId",
      type: "text",
      admin: { hidden: true },
    },
    {
      name: "thumbnailWidth",
      type: "number",
      admin: { hidden: true },
    },
    {
      name: "thumbnailHeight",
      type: "number",
      admin: { hidden: true },
    },
    {
      name: "thumbnailFormat",
      type: "text",
      admin: { hidden: true },
    },
    {
      name: "videoUrl",
      type: "text",
      admin: {
        description: "YouTube, Vimeo, or a direct Cloudinary-hosted MP4 URL.",
        condition: (data) => data.mediaType === "video",
      },
    },
    {
      name: "caseStudyContent",
      type: "richText",
    },
    {
      name: "liveWebsite",
      type: "text",
      admin: {
        description:
          "If set, homepage cards link straight here instead of the internal case study page.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      admin: {
        description: "Lower numbers show first in the Featured Work section.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "seo",
      type: "group",
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
        { name: "canonicalUrl", type: "text" },
        { name: "metaImage", type: "text", admin: { description: "Cloudinary URL. Defaults to the thumbnail if left blank." } },
      ],
    },
  ],
};
