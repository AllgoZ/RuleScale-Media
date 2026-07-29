import type { Where } from "payload";
import { getPayloadClient } from "@/lib/cms/payload-client";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_SUBMISSIONS_PER_WINDOW = 3;

/**
 * DB-backed, not in-memory/Redis: no rate-limiting infra is provisioned, and the deployment
 * target isn't confirmed (in-memory state is useless across serverless invocations). Querying
 * recent leads by email/IP works identically everywhere Postgres is reachable.
 */
export async function isRateLimited(email: string, ipAddress: string): Promise<boolean> {
  const payload = await getPayloadClient();
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const or: Where[] = [{ email: { equals: email } }];
  if (ipAddress) {
    or.push({ "attribution.ipAddress": { equals: ipAddress } });
  }

  const result = await payload.find({
    collection: "leads",
    where: { and: [{ or }, { createdAt: { greater_than: since } }] },
    limit: 1,
    depth: 0,
  });

  return result.totalDocs >= MAX_SUBMISSIONS_PER_WINDOW;
}
