import { parseVideoUrl } from "@/lib/video";

/**
 * Picks a poster image for a video tile without loading the video itself.
 *  1. The item's own thumbnail (uploaded in the CMS) always wins.
 *  2. Cloudinary-hosted MP4: derive a first-frame JPEG through a URL transformation.
 *  3. YouTube: the public thumbnail.
 * Returns null when nothing suitable exists (the tile then shows a neutral block).
 */
export function getVideoPoster(thumbnailUrl: string | null, videoUrl: string): string | null {
  if (thumbnailUrl) return thumbnailUrl;

  const parsed = parseVideoUrl(videoUrl);
  if (!parsed) return null;

  if (parsed.kind === "youtube") {
    const id = parsed.embedUrl.split("/embed/")[1];
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }

  if (parsed.kind === "mp4" && videoUrl.includes("res.cloudinary.com") && videoUrl.includes("/video/upload/")) {
    return videoUrl
      .replace("/video/upload/", "/video/upload/so_0,f_jpg,q_auto,w_540,h_960,c_fill/")
      .replace(/\.(mp4|webm|mov)(\?.*)?$/i, ".jpg");
  }

  return null;
}
