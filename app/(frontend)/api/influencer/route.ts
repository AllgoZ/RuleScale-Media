import { NextResponse } from "next/server";
import { getPayloadClient } from "@/lib/cms/payload-client";
import { buildAttribution } from "@/lib/leads/attribution";
import { isDuplicateApplication } from "@/lib/influencer/duplicate-check";
import { isRateLimited } from "@/lib/influencer/rate-limit";
import { validateInfluencerForm } from "@/lib/influencer/validate";
import type { InfluencerApplication } from "@/payload-types";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "error", error: "Invalid request body." }, { status: 400 });
  }

  const validated = validateInfluencerForm(body);
  if (!validated.ok) {
    return NextResponse.json({ status: "error", error: validated.error }, { status: 400 });
  }

  const attribution = buildAttribution(request.headers, body);

  try {
    const rateLimited = await isRateLimited(validated.data.email, attribution.ipAddress);
    if (rateLimited) {
      return NextResponse.json(
        { status: "error", error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const duplicate = await isDuplicateApplication(validated.data.email, validated.data.instagram);
    if (duplicate) {
      return NextResponse.json(
        {
          status: "error",
          error: "You've already applied recently — our team will be in touch soon.",
        },
        { status: 409 }
      );
    }

    const payload = await getPayloadClient();
    await payload.create({
      collection: "influencer-applications",
      data: {
        ...validated.data,
        // Already whitelisted against the collection's exact option values in
        // validateInfluencerForm — same cast pattern as /api/contact's `budget` field.
        gender: (validated.data.gender || undefined) as InfluencerApplication["gender"],
        primaryCategory: validated.data.primaryCategory as InfluencerApplication["primaryCategory"],
        creatorType: validated.data.creatorType as InfluencerApplication["creatorType"],
        participateEcommerce: (validated.data.participateEcommerce || undefined) as InfluencerApplication["participateEcommerce"],
        interestedCampaigns: validated.data.interestedCampaigns as InfluencerApplication["interestedCampaigns"],
        acceptingCollaborations: (validated.data.acceptingCollaborations || undefined) as InfluencerApplication["acceptingCollaborations"],
        availableForTravel: (validated.data.availableForTravel || undefined) as InfluencerApplication["availableForTravel"],
        heardAboutUs: (validated.data.heardAboutUs || undefined) as InfluencerApplication["heardAboutUs"],
        status: "applied",
        attribution: {
          ipAddress: attribution.ipAddress,
          userAgent: attribution.userAgent,
          referrer: attribution.referrer,
          landingPage: attribution.landingPage,
          device: attribution.device,
          browser: attribution.browser,
        },
      },
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[influencer] Failed to create application", error);
    return NextResponse.json(
      { status: "error", error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
