import type { CollectionConfig } from "payload";
import { isAdmin } from "../access";

export const Clients: CollectionConfig = {
  slug: "clients",
  admin: {
    useAsTitle: "name",
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
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "lead",
      type: "relationship",
      relationTo: "leads",
    },
  ],
};
