import type { CollectionConfig } from "payload";
import { SERVICES } from "@/lib/constants";
import { isAdmin, isAdminOrEditor } from "../access";
import { dispatchLeadEvent } from "../hooks/lead-events";

const SERVICE_OPTIONS = SERVICES.map((service) => ({
  label: service.title,
  value: service.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
}));

export const Leads: CollectionConfig = {
  slug: "leads",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "company", "status", "priority", "assignedUser", "createdAt"],
    listSearchableFields: ["name", "email", "phone", "company", "message"],
    components: {
      beforeList: ["@/payload/admin-views/leads-export-button#LeadsExportButton"],
    },
  },
  // Public form submissions go through /api/contact (validation, rate limiting, honeypot,
  // Turnstile) via the Local API, which bypasses access control entirely — so denying create
  // here closes off the raw REST/GraphQL create endpoint without affecting the real submit path.
  access: {
    create: () => false,
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  versions: true,
  hooks: {
    afterChange: [
      // Awaited (not fire-and-forget) so a serverless response doesn't return — and the
      // function get frozen/killed — before the notification emails finish sending.
      async ({ doc, previousDoc, operation }) => {
        await dispatchLeadEvent({
          event:
            operation === "create"
              ? "created"
              : previousDoc?.status !== doc.status
                ? "statusChanged"
                : "updated",
          doc,
          previousDoc,
        });
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
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
    },
    {
      name: "company",
      type: "text",
    },
    {
      name: "website",
      type: "text",
    },
    {
      name: "budget",
      type: "select",
      options: [
        { label: "Under $5k", value: "under-5k" },
        { label: "$5k – $15k", value: "5k-15k" },
        { label: "$15k – $50k", value: "15k-50k" },
        { label: "$50k+", value: "50k-plus" },
        { label: "Not sure yet", value: "not-sure" },
      ],
    },
    {
      name: "servicesInterested",
      type: "select",
      hasMany: true,
      options: SERVICE_OPTIONS,
    },
    {
      name: "message",
      type: "textarea",
    },
    {
      name: "source",
      type: "select",
      defaultValue: "website-contact-form",
      options: [
        { label: "Website contact form", value: "website-contact-form" },
        { label: "Newsletter", value: "newsletter" },
        { label: "Referral", value: "referral" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Qualified", value: "qualified" },
        { label: "Won", value: "won" },
        { label: "Lost", value: "lost" },
      ],
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "medium",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    },
    {
      name: "assignedUser",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "internalNotes",
      type: "textarea",
    },
    {
      name: "attribution",
      type: "group",
      admin: {
        description: "Captured automatically from the contact form — not visitor-editable.",
      },
      fields: [
        { name: "ipAddress", type: "text" },
        { name: "userAgent", type: "text" },
        { name: "referrer", type: "text" },
        { name: "landingPage", type: "text" },
        { name: "utmSource", type: "text" },
        { name: "utmMedium", type: "text" },
        { name: "utmCampaign", type: "text" },
        { name: "utmTerm", type: "text" },
        { name: "utmContent", type: "text" },
        { name: "device", type: "text" },
        { name: "browser", type: "text" },
      ],
    },
  ],
};
