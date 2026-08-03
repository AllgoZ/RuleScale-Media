export type ParsedVideo =
  | { kind: "youtube"; embedUrl: string }
  | { kind: "vimeo"; embedUrl: string }
  | { kind: "mp4"; directUrl: string }
  | null;

/** Recognizes YouTube, Vimeo, and direct Cloudinary-hosted MP4 URLs — the three
 * source types this project's video portfolio items support. Anything else (a
 * malformed or unsupported URL) returns null so callers can skip rendering a
 * player rather than embedding something broken. */
export function parseVideoUrl(url: string): ParsedVideo {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{6,})/
  );
  if (youtubeMatch) {
    return { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}` };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}` };
  }

  if (/\.(mp4|webm|mov)(\?.*)?$/i.test(url)) {
    return { kind: "mp4", directUrl: url };
  }

  return null;
}
