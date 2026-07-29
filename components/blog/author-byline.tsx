import { Calendar, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { AuthorSummaryData } from "@/lib/cms/types";

function formatDate(dateString: string | null) {
  if (!dateString) return null;
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function AuthorByline({
  author,
  publishedDate,
  readingTime,
  size = "default",
  linkAuthor = true,
}: {
  author: AuthorSummaryData | null;
  publishedDate: string | null;
  readingTime: number;
  size?: "default" | "sm";
  /** Set false when this byline is nested inside another link (e.g. a card that
   * links to the post) — an <a> can't contain another <a>. */
  linkAuthor?: boolean;
}) {
  const date = formatDate(publishedDate);
  const avatarSize = size === "sm" ? 28 : 40;

  return (
    <div className="flex items-center gap-3 text-sm text-ink-soft">
      {author?.avatar ? (
        <Image
          src={author.avatar.url}
          alt={author.avatar.alt || author.name}
          width={avatarSize}
          height={avatarSize}
          className="shrink-0 rounded-full object-cover"
          style={{ width: avatarSize, height: avatarSize }}
        />
      ) : author ? (
        <span
          className="flex shrink-0 items-center justify-center rounded-full bg-ink/[0.06] font-heading font-bold text-ink-soft"
          style={{ width: avatarSize, height: avatarSize, fontSize: avatarSize * 0.4 }}
        >
          {author.name.charAt(0)}
        </span>
      ) : null}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
        {author && linkAuthor ? (
          <Link
            href={`/blog/author/${author.slug}`}
            className="relative z-20 font-medium text-ink transition-colors hover:text-accent"
          >
            {author.name}
          </Link>
        ) : author ? (
          <span className="font-medium text-ink">{author.name}</span>
        ) : null}
        {author && (date || readingTime) ? <span aria-hidden="true">·</span> : null}
        {date ? (
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} />
            {date}
          </span>
        ) : null}
        {date && readingTime ? <span aria-hidden="true">·</span> : null}
        {readingTime ? (
          <span className="inline-flex items-center gap-1">
            <Clock size={13} />
            {readingTime} min read
          </span>
        ) : null}
      </div>
    </div>
  );
}
