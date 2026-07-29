import type { PayloadRequest } from "payload";
import { getPayloadClient } from "@/lib/cms/payload-client";

function escapeCsvValue(value: unknown): string {
  const str = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const COLUMNS = [
  "id",
  "name",
  "email",
  "phone",
  "company",
  "website",
  "budget",
  "servicesInterested",
  "status",
  "priority",
  "source",
  "assignedUser",
  "message",
  "internalNotes",
  "createdAt",
  "updatedAt",
] as const;

export async function GET(request: Request) {
  const payload = await getPayloadClient();

  let user;
  try {
    ({ user } = await payload.auth({
      req: request as unknown as PayloadRequest,
      headers: request.headers,
    }));
  } catch (error) {
    console.error("[leads-export] Failed to verify session", error);
    return new Response("Unauthorized", { status: 401 });
  }

  if (!user || user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await payload.find({
    collection: "leads",
    limit: 10000,
    depth: 1,
    sort: "-createdAt",
  });

  const rows = result.docs.map((doc) => {
    const assignedUserEmail =
      doc.assignedUser && typeof doc.assignedUser === "object" ? doc.assignedUser.email : "";
    return [
      doc.id,
      doc.name,
      doc.email,
      doc.phone,
      doc.company,
      doc.website,
      doc.budget,
      (doc.servicesInterested || []).join("; "),
      doc.status,
      doc.priority,
      doc.source,
      assignedUserEmail,
      doc.message,
      doc.internalNotes,
      doc.createdAt,
      doc.updatedAt,
    ]
      .map(escapeCsvValue)
      .join(",");
  });

  const csv = [COLUMNS.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
