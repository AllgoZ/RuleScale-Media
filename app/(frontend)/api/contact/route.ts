import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/cms/payload-client";
import { buildAttribution } from "@/lib/leads/attribution";
import { isRateLimited } from "@/lib/leads/rate-limit";
import { verifyTurnstile } from "@/lib/leads/turnstile";
import { validateContactForm } from "@/lib/leads/validate";
import type { Lead } from "@/payload-types";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateContactForm(body);
  if (!validated.ok) {
    return NextResponse.json({ status: "error", error: validated.error }, { status: 400 });
  }

  const attribution = buildAttribution(request.headers, body);

  try {
    const rateLimited = await isRateLimited(validated.data.email, attribution.ipAddress);
    if (rateLimited) {
      return NextResponse.json(
        { status: "error", error: "Too many submissions. Please try again in a few minutes." },
        { status: 429 }
      );
    }

    const turnstileToken = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
    const turnstileOk = await verifyTurnstile(turnstileToken, attribution.ipAddress);
    if (!turnstileOk) {
      return NextResponse.json(
        { status: "error", error: "Verification failed. Please try again." },
        { status: 403 }
      );
    }

    const payload = await getPayloadClient();
    await payload.create({
      collection: "leads",
      data: {
        name: validated.data.name,
        email: validated.data.email,
        phone: validated.data.phone,
        company: validated.data.company,
        website: validated.data.website,
        message: validated.data.message,
        // Already whitelisted against the collection's exact option values in validateContactForm.
        budget: (validated.data.budget || undefined) as Lead["budget"],
        servicesInterested: validated.data.servicesInterested as Lead["servicesInterested"],
        source: "website-contact-form",
        attribution,
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[contact] Failed to create lead", error);
    return NextResponse.json(
      { status: "error", error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
