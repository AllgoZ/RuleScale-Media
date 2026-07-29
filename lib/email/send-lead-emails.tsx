import { render } from "@react-email/render";
import { getSiteSettings } from "@/lib/cms/settings";
import { getResendClient } from "@/lib/email/resend-client";
import { LeadConfirmationEmail } from "@/lib/email/templates/lead-confirmation";
import { LeadNotificationEmail } from "@/lib/email/templates/lead-notification";
import type { Lead } from "@/payload-types";

export async function sendLeadEmails(lead: Lead) {
  const siteSettings = await getSiteSettings();
  const client = getResendClient();

  const confirmationHtml = await render(
    <LeadConfirmationEmail name={lead.name} siteName={siteSettings.siteName} />
  );
  const notificationHtml = await render(
    <LeadNotificationEmail
      name={lead.name}
      email={lead.email}
      phone={lead.phone || ""}
      company={lead.company || ""}
      website={lead.website || ""}
      budget={lead.budget || ""}
      servicesInterested={lead.servicesInterested || []}
      message={lead.message || ""}
      source={lead.source || ""}
    />
  );

  if (!client) {
    console.log(
      `[email] RESEND_API_KEY not set — confirmation email to ${lead.email} logged instead of sent:\n${confirmationHtml}`
    );
    console.log(
      `[email] RESEND_API_KEY not set — notification email to ${siteSettings.contactEmail} logged instead of sent:\n${notificationHtml}`
    );
    return;
  }

  const fromAddress = `${siteSettings.siteName} <${siteSettings.contactEmail}>`;

  try {
    await client.emails.send({
      from: fromAddress,
      to: lead.email,
      subject: `Thanks for reaching out, ${lead.name.split(" ")[0] || lead.name}`,
      html: confirmationHtml,
    });
  } catch (error) {
    console.error("[email] Failed to send lead confirmation email", error);
  }

  try {
    await client.emails.send({
      from: fromAddress,
      to: siteSettings.contactEmail,
      subject: `New lead: ${lead.name}`,
      html: notificationHtml,
    });
  } catch (error) {
    console.error("[email] Failed to send lead notification email", error);
  }
}
