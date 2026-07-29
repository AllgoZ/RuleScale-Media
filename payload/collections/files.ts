import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

export const Files: CollectionConfig = {
  slug: "files",
  admin: {
    useAsTitle: "title",
    hidden: true,
  },
  access: {
    read: isAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "client",
      type: "relationship",
      relationTo: "clients",
    },
  ],
};
