import { revalidateTag } from "next/cache";

export function revalidateTagSafely(tag: string) {
  try {
    revalidateTag(tag, "max");
  } catch (error) {
    console.error(`[payload] Failed to revalidate cache tag "${tag}"`, error);
  }
}
