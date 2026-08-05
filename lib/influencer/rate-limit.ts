import type { Where } from "payload";
import { getPayloadClient } from "@/lib/cms/payload-client";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 2;

/**
 * DB-backed, same reasoning as lib/leads/rate-limit.ts: no in-memory/Redis infra is
 * provisioned, and in-memory state doesn't survive serverless invocations anyway. This is a
 * heavier one-time application form, so the window allows fewer submissions than the contact
 * form's.
 */
export async function isRateLimited(email: string, ipAddress: string): Promise<boolean> {
  const payload = await getPayloadClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const or: Where[] = [{ email: { equals: email } }];
  if (ipAddress) {
    or.push({ "attribution.ipAddress": { equals: ipAddress } });
  }

  const result = await payload.find({
    collection: "influencer-applications",
    where: { and: [{ or }, { createdAt: { greater_than: since } }] },
    limit: 1,
    depth: 0,
  });

  return result.totalDocs >= MAX_SUBMISSIONS_PER_WINDOW;
}
