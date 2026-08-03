import { v2 as cloudinary } from "cloudinary";
import { getCloudinaryConfig } from "@/lib/env";

export type CloudinaryUploadResult = {
  secureUrl: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType: string;
};

function configureCloudinary() {
  const config = getCloudinaryConfig();
  if (!config) return null;
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret,
    secure: true,
  });
  return cloudinary;
}

/** Uploads a file buffer to Cloudinary. Throws if Cloudinary isn't configured — callers
 * (the upload API route) turn that into a clear 4xx response, never a silent no-op, since
 * an upload the editor explicitly triggered should never appear to succeed when it didn't. */
export async function uploadImage(
  fileBuffer: Buffer,
  options?: { folder?: string; resourceType?: "image" | "video" | "auto" }
): Promise<CloudinaryUploadResult> {
  const client = configureCloudinary();
  if (!client) {
    throw new Error("Cloudinary is not configured (missing CLOUDINARY_* env vars).");
  }

  const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: options?.folder || "rulescale-portfolio",
        resource_type: options?.resourceType || "image",
      },
      (error, uploadResult) => {
        if (error || !uploadResult) {
          reject(error || new Error("Cloudinary upload returned no result."));
          return;
        }
        resolve(uploadResult);
      }
    );
    stream.end(fileBuffer);
  });

  return {
    secureUrl: String(result.secure_url),
    publicId: String(result.public_id),
    width: Number(result.width) || 0,
    height: Number(result.height) || 0,
    format: String(result.format || ""),
    resourceType: String(result.resource_type || "image"),
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  const client = configureCloudinary();
  if (!client) {
    throw new Error("Cloudinary is not configured (missing CLOUDINARY_* env vars).");
  }
  await client.uploader.destroy(publicId);
}

/** Inserts a transformation segment into an already-uploaded Cloudinary delivery URL
 * (`.../upload/<transformations>/<rest>`) via plain string manipulation — no SDK
 * config or API call needed at read time, so this keeps working to render pages even
 * if CLOUDINARY_* env vars are unset or rotated after the original upload. Falls back
 * to the untouched URL if it doesn't look like a Cloudinary delivery URL (e.g. a
 * manually-pasted non-Cloudinary thumbnail, allowed as an escape hatch when Cloudinary
 * isn't configured yet). */
export function transformImage(
  secureUrl: string,
  transformations: { width?: number; height?: number; crop?: string } = {}
): string {
  const marker = "/upload/";
  const index = secureUrl.indexOf(marker);
  if (index === -1) return secureUrl;

  const parts = [`f_auto`, `q_auto`, `c_${transformations.crop || "fill"}`];
  if (transformations.width) parts.push(`w_${transformations.width}`);
  if (transformations.height) parts.push(`h_${transformations.height}`);

  const insertAt = index + marker.length;
  return `${secureUrl.slice(0, insertAt)}${parts.join(",")}/${secureUrl.slice(insertAt)}`;
}
