import type { CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel, isAdminOrEditor, isAdminOrSelf } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    // Widened from isAdminOrSelf so the Leads "Assigned User" relationship field's admin-UI
    // dropdown can list every staff member (Payload resolves relationship options through the
    // target collection's own read access) — create/update/delete stay exactly as strict as before.
    read: isAdminOrEditor,
    create: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  fields: [
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
};
