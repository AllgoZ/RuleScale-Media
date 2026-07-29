import { Resend } from "resend";
import { getResendApiKey } from "@/lib/env";

let client: Resend | null | undefined;

export function getResendClient(): Resend | null {
  if (client === undefined) {
    const apiKey = getResendApiKey();
    client = apiKey ? new Resend(apiKey) : null;
  }
  return client;
}
