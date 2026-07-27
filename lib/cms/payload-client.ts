import { getPayload } from "payload";
import config from "@payload-config";

let clientPromise: ReturnType<typeof getPayload> | undefined;

export function getPayloadClient() {
  if (!clientPromise) {
    clientPromise = getPayload({ config });
  }
  return clientPromise;
}
