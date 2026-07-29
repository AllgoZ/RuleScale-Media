import type { Media } from "@/payload-types";
import type { MediaImageData } from "./types";

export function normalizeMediaImage(
  value: number | Media | null | undefined
): MediaImageData | null {
  if (!value || typeof value === "number") return null;
  if (!value.url) return null;
  return {
    url: value.url,
    alt: value.alt || "",
    width: value.width ?? null,
    height: value.height ?? null,
  };
}
