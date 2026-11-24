"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";

export type WheelItem = {
  id: number;
  slug: string;
  title: string;
  category: string;
  imageUrl: string;
};

/** Page scroll (in viewport heights) needed to roll the wheel on by one card. */
const STEP_VH = 38;
/** Angle between neighbouring cards on the wheel. */
const STEP_DEG = 28;
/** Lifts the whole wheel a little above centre so more of the next cards shows below. */
const REST_LIFT = 0.11;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/**
 * Where a card sits on the wheel. `d` is its signed distance from the front in cards:
 * 0 = the front card (full size), 1 = the next one down, -1 = the one that just rolled up.
 *
 * Distances are fractions of `--wheel-h` (the stage height), so the same strings render on
 * the server and on the client without measuring anything.
 */
export function wheelStyle(d: number) {
  const dc = clamp(d, -1.5, 2.6);
  const theta = (dc * STEP_DEG * Math.PI) / 180;
  // Position on a drum whose axis is horizontal: down the front face as it curves away.
  // The card rolling away travels further and faster than the ones waiting below, so it clears the
  // arriving card instead of overlapping it for long.
  const y = d < 0 ? 0.85 * Math.sin(theta) + d * 0.1 - REST_LIFT : 0.5 * Math.sin(theta) - REST_LIFT;
  const z = -0.5 * (1 - Math.cos(theta));
  const tilt = -dc * STEP_DEG * 0.55;
  const scale = 1 - 0.075 * Math.min(Math.abs(d), 2.6);
  // Cards stay opaque (transparency would let the red show through and wash them out); they are
  // dimmed with a dark `shade` instead. Only the far end and the card that rolled up actually fade.
  const opacity = d >= 0 ? clamp((2.4 - d) / 0.5, 0, 1) : clamp((d + 1.05) / 0.45, 0, 1);
  const shade = d >= 0 ? clamp(0.3 * d, 0, 0.6) : clamp(-d * 0.3, 0, 0.3);

  return {
    transform: `translate3d(0, calc(var(--wheel-h) * ${y.toFixed(4)}), calc(var(--wheel-h) * ${z.toFixed(4)})) rotateX(${tilt.toFixed(2)}deg) scale(${scale.toFixed(4)})`,
    opacity: Number(opacity.toFixed(3)),
    shade: Number(shade.toFixed(3)),
    // Nearer cards on top; at the halfway point the arriving card beats the departing one.
    zIndex: Math.round(50 - Math.abs(d) * 10 - (d < 0 ? 1 : 0)),
    visibility: opacity < 0.02 ? ("hidden" as const) : ("visible" as const),
  };
}

/**
 * Hero project wheel: a rotary "dial" of project cards driven by normal page scrolling.
 *
 * A tall track holds a sticky stage; scrolling the page through the track rolls the wheel
 * (front card shrinks, curves away and rolls up out of sight while the next one rotates
 * forward). Motion is eased towards the scroll position in a requestAnimationFrame loop that
 * only runs while the wheel is moving, and only touches transform / opacity.
 *
 * - First paint: the server renders the resting position (wheel at card 0), so nothing jumps.
 * - Reduced motion: no scroll handler; CSS (`.wheel-*` in globals.css) lays the cards out as a
 *   plain list instead.
 * - No JS: the first card and the peek of the next are shown; every project is also in the
 *   Work section below.
 */
export function ProjectWheel({ items }: { items: WheelItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const count = items.length;

  useEffect(() => {
    if (count < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    let target = 0;
    let current = 0;
    let raf = 0;
    let stick = 0;

    const measure = () => {
      stick = parseFloat(getComputedStyle(stage).top) || 0;
    };
    const read = () => {
      const scrollable = track.offsetHeight - stage.offsetHeight;
      if (scrollable <= 0) return 0;
      const progress = (stick - track.getBoundingClientRect().top) / scrollable;
      return clamp(progress, 0, 1) * (count - 1);
    };
    const apply = (position: number) => {
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        const style = wheelStyle(index - position);
        el.style.transform = style.transform;
        el.style.opacity = String(style.opacity);
        el.style.setProperty("--shade", String(style.shade));
        el.style.zIndex = String(style.zIndex);
        el.style.visibility = style.visibility;
      });
    };
    const tick = () => {
      current += (target - current) * 0.16;
      if (Math.abs(target - current) < 0.0008) current = target;
      apply(current);
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = read();
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    target = current = read();
    apply(current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count]);

  return (
    <div
      ref={trackRef}
      className="wheel-track [--wheel-h:calc(100svh-var(--header-h))]"
      style={{ height: `calc(var(--wheel-h) + ${(count - 1) * STEP_VH}svh)` }}
    >
      <div
        ref={stageRef}
        className="wheel-stage sticky top-[var(--header-h)] h-[var(--wheel-h)] overflow-clip"
      >
        <ol
          aria-label="Selected projects"
          className="grid h-full place-items-center [perspective:1500px]"
        >
          {items.map((item, index) => {
            const { shade, ...style } = wheelStyle(index);
            return (
              <li
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={{ ...style, "--shade": shade } as CSSProperties}
                className="wheel-card col-start-1 row-start-1 w-full max-w-[calc(var(--wheel-h)*0.82)] rounded-[4px] shadow-lift will-change-[transform,opacity]"
              >
                <Link
                  href={`/work/${item.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-[4px] bg-white lg:block lg:bg-surface"
                >
                  <div className="relative aspect-[16/10]">
                    <Image
                      src={item.imageUrl}
                      alt={`${item.title}: ${item.category || "website"} by RuleScale Media`}
                      fill
                      priority={index === 0}
                      sizes="(min-width: 1024px) 44vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-ink opacity-[var(--shade,0)]"
                  />
                  {/* Desktop: caption chip over the image. Phones: a caption strip under it (taller,
                      bigger card that fills the screen instead of a small card on a lot of red). */}
                  <span className="absolute bottom-3 left-3 hidden bg-paper px-3 py-1.5 text-xs font-semibold text-ink lg:block">
                    {item.title}
                    {item.category ? (
                      <span className="font-normal text-ink-soft"> · {item.category}</span>
                    ) : null}
                  </span>
                  <span className="flex items-center justify-between gap-3 px-4 py-3.5 text-ink lg:hidden">
                    <span className="min-w-0">
                      <span className="block truncate font-heading text-lg font-extrabold tracking-tight">
                        {item.title}
                      </span>
                      {item.category ? (
                        <span className="block truncate text-sm text-ink-soft">{item.category}</span>
                      ) : null}
                    </span>
                    <ArrowUpRight size={22} aria-hidden="true" className="shrink-0 text-accent-deep" />
                  </span>
                  {count > 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute right-3 top-3 bg-ink px-2.5 py-1 text-[11px] font-semibold tabular-nums text-paper"
                    >
                      {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
