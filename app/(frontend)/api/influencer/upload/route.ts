import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

const MAX_FILE_BYTES = 10 * 1024 * 1024;
const ALLOWED_KINDS = new Set(["mediaKit", "rateCard"]);

// Public (unauthenticated) by necessity — this runs before an applicant has submitted anything
// to attach an identity to. Abuse surface is bounded by the strict PDF-only/10MB checks below;
// the honeypot + rate limiting + duplicate check on /api/influencer guard the actual DB writes.
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");
  const kind = formData.get("kind");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (typeof kind !== "string" || !ALLOWED_KINDS.has(kind)) {
    return NextResponse.json({ error: "Invalid upload kind." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Only PDF files are accepted." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File is larger than 10MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, {
      folder: "rulescale-influencer",
      resourceType: "raw",
    });
    return NextResponse.json({ secureUrl: result.secureUrl, publicId: result.publicId });
  } catch (error) {
    console.error("[influencer-upload] Upload failed", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
