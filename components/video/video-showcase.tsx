"use client";

import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseVideoUrl } from "@/lib/video";
import { cn } from "@/lib/utils";

export type VideoTileData = {
  slug: string;
  title: string;
  client: string;
  category: string;
  videoUrl: string;
  posterUrl: string | null;
};

/**
 * Vertical (9:16) video grid with a lightbox player.
 * - Tiles only render a poster; the video itself is mounted when a tile is opened,
 *   so nothing is preloaded.
 * - The lightbox is a native <dialog>: focus is trapped, Escape closes it, the page
 *   behind is inert, and focus returns to the tile that opened it.
 */
export function VideoShowcase({
  items,
  columnsClassName = "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
  filterable = false,
  tone = "light",
}: {
  items: VideoTileData[];
  columnsClassName?: string;
  filterable?: boolean;
  tone?: "light" | "dark";
}) {
  const [filter, setFilter] = useState("All");
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(items.map((item) => item.category).filter(Boolean)));
    return ["All", ...unique];
  }, [items]);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((item) => item.category === filter)),
    [items, filter]
  );

  const activeIndex = activeSlug ? visible.findIndex((item) => item.slug === activeSlug) : -1;
  const active = activeIndex >= 0 ? visible[activeIndex] : null;

  const closeDialog = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (direction: 1 | -1) => {
      if (!visible.length || activeIndex < 0) return;
      const next = (activeIndex + direction + visible.length) % visible.length;
      setActiveSlug(visible[next].slug);
    },
    [visible, activeIndex]
  );

  // Open / close the native dialog in sync with state.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active && !dialog.open) {
      dialog.showModal();
      document.documentElement.classList.add("modal-open");
    }
    if (!active && dialog.open) dialog.close();
  }, [active]);

  // Fires for Escape, the close button and backdrop clicks alike.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      document.documentElement.classList.remove("modal-open");
      setActiveSlug(null);
    };
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("close", onClose);
      document.documentElement.classList.remove("modal-open");
    };
  }, []);

  const parsed = active ? parseVideoUrl(active.videoUrl) : null;

  return (
    <div>
      {filterable && categories.length > 2 ? (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter videos">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className={cn(
                "min-h-11 rounded-full border px-5 text-sm font-medium transition-colors",
                tone === "dark"
                  ? "border-hairline-light text-paper/80 hover:border-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"
                  : "border-ink/25 text-ink hover:border-ink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      ) : null}

      <ul className={cn("grid items-start gap-2 md:gap-3", columnsClassName)}>
        {visible.map((item, index) => (
          <li
            key={item.slug}
            data-anim="up"
            data-anim-step={(index % 5) + 1}
            className="md:[&:nth-child(even)]:mt-12"
          >
            <button
              type="button"
              onClick={() => setActiveSlug(item.slug)}
              aria-label={`Play video: ${item.title}${item.client ? `, ${item.client}` : ""}`}
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[3px] bg-ink-soft/40 text-left"
            >
              {item.posterUrl ? (
                item.posterUrl.includes("res.cloudinary.com") ? (
                  <Image
                    src={item.posterUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 48vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                ) : (
                  // Non-Cloudinary posters (e.g. YouTube) are plain lazy images.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.posterUrl}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                )
              ) : null}
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/5 to-transparent transition-opacity duration-300 lg:opacity-70 lg:group-hover:opacity-100"
              />
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-deep text-white shadow-lift transition-transform duration-300 group-hover:scale-125 lg:h-14 lg:w-14"
              >
                <Play size={18} fill="currentColor" className="translate-x-px" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3 transition-all duration-300 sm:p-4 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-y-0 lg:group-focus-visible:opacity-100">
                {item.client ? (
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-paper/75">
                    {item.client}
                  </span>
                ) : null}
                <span className="mt-1 line-clamp-2 block font-heading text-sm font-bold leading-snug text-paper sm:text-base">
                  {item.title}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={active ? `Video: ${active.title}` : "Video player"}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/95"
      >
        {active ? (
          <div className="relative flex h-full w-full items-center justify-center px-4" onClick={(e) => e.target === e.currentTarget && closeDialog()}>
            <button
              type="button"
              onClick={closeDialog}
              aria-label="Close video"
              className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-white"
            >
              <X size={22} />
            </button>

            {visible.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous video"
                  className="absolute left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-white md:flex lg:left-8"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next video"
                  className="absolute right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink hover:bg-white md:flex lg:right-8"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            ) : null}

            <figure className="flex max-h-full flex-col items-center gap-3 py-16">
              <div className="aspect-[9/16] h-[min(78dvh,780px)] max-w-[92vw] overflow-hidden rounded-md bg-black">
                {parsed?.kind === "mp4" ? (
                  <video
                    key={active.slug}
                    src={parsed.directUrl}
                    poster={active.posterUrl ?? undefined}
                    controls
                    autoPlay
                    playsInline
                    className="h-full w-full object-contain"
                  />
                ) : parsed ? (
                  <iframe
                    key={active.slug}
                    src={`${parsed.embedUrl}${parsed.embedUrl.includes("?") ? "&" : "?"}autoplay=1&rel=0&playsinline=1`}
                    title={active.title}
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    className="h-full w-full"
                  />
                ) : (
                  <p className="flex h-full items-center justify-center p-6 text-center text-sm text-paper/70">
                    This video can&apos;t be played right now.
                  </p>
                )}
              </div>
              <figcaption className="text-center">
                {active.client ? (
                  <span className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-paper/70">
                    {active.client}
                  </span>
                ) : null}
                <span className="block font-heading text-base font-bold text-paper">{active.title}</span>
              </figcaption>
            </figure>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
