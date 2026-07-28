import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import type { PayloadRequest } from "payload";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const previewSecret = searchParams.get("previewSecret");

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response("You are not allowed to preview this page", { status: 403 });
  }

  if (!path || !path.startsWith("/")) {
    return new Response("Invalid or missing path", { status: 400 });
  }

  const payload = await getPayload({ config });

  let user;
  try {
    ({ user } = await payload.auth({
      req: req as unknown as PayloadRequest,
      headers: req.headers,
    }));
  } catch (error) {
    payload.logger.error({ err: error }, "Error verifying token for preview");
    return new Response("You are not allowed to preview this page", { status: 403 });
  }

  const draft = await draftMode();

  if (!user) {
    draft.disable();
    return new Response("You are not allowed to preview this page", { status: 403 });
  }

  draft.enable();

  redirect(path);
}
