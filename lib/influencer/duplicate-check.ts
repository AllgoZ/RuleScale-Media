import { getPayloadClient } from "@/lib/cms/payload-client";

const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;

/** Blocks a second application from the same email or Instagram handle within 24 hours. */
export async function isDuplicateApplication(email: string, instagram: string): Promise<boolean> {
  const payload = await getPayloadClient();
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MS).toISOString();

  const result = await payload.find({
    collection: "influencer-applications",
    where: {
      and: [
        { or: [{ email: { equals: email } }, { instagram: { equals: instagram } }] },
        { createdAt: { greater_than: since } },
      ],
    },
    limit: 1,
    depth: 0,
  });

  return result.totalDocs > 0;
}
