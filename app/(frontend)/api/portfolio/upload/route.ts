import type { PayloadRequest } from "payload";
import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";
import { getPayloadClient } from "@/lib/cms/payload-client";

const MAX_FILE_BYTES = 10 * 1024 * 1024;

export async function POST(request: Request) {
  const payload = await getPayloadClient();

  let user;
  try {
    ({ user } = await payload.auth({
      req: request as unknown as PayloadRequest,
      headers: request.headers,
    }));
  } catch (error) {
    console.error("[portfolio-upload] Failed to verify session", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user || (user.role !== "admin" && user.role !== "editor")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "File is larger than 10MB." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadImage(buffer, { folder: "rulescale-portfolio" });
    return NextResponse.json({
      secureUrl: result.secureUrl,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
      format: result.format,
      resourceType: result.resourceType,
    });
  } catch (error) {
    console.error("[portfolio-upload] Upload failed", error);
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
