import type { CollectionConfig } from "payload";
import { isAdmin, isAdminFieldLevel, isAdminOrEditor, isAdminOrSelf } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  // useAPIKey lets a user authenticate REST/GraphQL requests with a static
  // `Authorization: users API-Key <key>` header instead of a session/JWT login — the mechanism
  // for giving an external tool (e.g. an agent posting blog content) programmatic access without
  // a browser. The key is generated per-user in /admin (or via a one-off script) and is only
  // ever shown in plaintext once, at generation time.
  auth: { useAPIKey: true },
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
