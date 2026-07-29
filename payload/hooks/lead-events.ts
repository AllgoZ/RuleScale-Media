import { sendLeadEmails } from "@/lib/email/send-lead-emails";
import type { Lead } from "@/payload-types";

type LeadEvent = "created" | "updated" | "statusChanged";

type LeadEventPayload = {
  event: LeadEvent;
  doc: Lead;
  previousDoc?: Lead;
};

/**
 * Single seam every Leads afterChange event flows through, so a future integration (Slack,
 * Notion, WhatsApp, ...) is one more call inside this function, not a new hook wired into
 * leads.ts's collection config.
 */
export async function dispatchLeadEvent({ event, doc }: LeadEventPayload) {
  if (event === "created") {
    try {
      await sendLeadEmails(doc);
    } catch (error) {
      console.error("[lead-events] Failed to send lead emails", error);
    }
  }
}
