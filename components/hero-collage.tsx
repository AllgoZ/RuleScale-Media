"use client";

import {
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Camera, Coffee, Heart, MessageCircle, Play, Search, Sparkle } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { PaperClip } from "@/components/doodles/paper-clip";

function FloatCard({
  children,
  className,
  delay = 0,
  duration = 7,
  depth = 1,
  parallaxX,
  parallaxY,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  depth?: number;
  parallaxX: MotionValue<number>;
  parallaxY: MotionValue<number>;
}) {
  const x = useTransform(parallaxX, (v) => v * depth);
  const y = useTransform(parallaxY, (v) => v * depth);

  return (
    <motion.div style={{ x, y }} className={className}>
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.7, delay },
          scale: { duration: 0.7, delay },
          y: { duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.5 },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function HeroCollage() {
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 50, damping: 20, mass: 0.5 });
  const springY = useSpring(mvY, { stiffness: 50, damping: 20, mass: 0.5 });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    mvX.set(((event.clientX - rect.left) / rect.width - 0.5) * 24);
    mvY.set(((event.clientY - rect.top) / rect.height - 0.5) * 24);
  }

  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto aspect-[4/5] w-full max-w-[360px] sm:max-w-[440px] lg:max-w-[520px]"
      aria-hidden="true"
    >
      <div className="absolute -inset-10 -z-10 rounded-full bg-accent/[0.06] blur-3xl" />

      <svg
        viewBox="0 0 500 560"
        className="pointer-events-none absolute inset-0 h-full w-full text-ink/20"
        fill="none"
      >
        <path
          d="M150 110C170 160 140 190 190 220C230 244 260 210 300 235"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path
          d="M300 235C340 255 330 300 370 330"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path
          d="M190 220C160 260 175 300 130 340"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
      </svg>

      <FloatCard
        depth={1.6}
        delay={0.1}
        duration={7.5}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute left-[2%] top-[8%] w-[44%] rotate-[-3deg] rounded-2xl border border-hairline bg-paper p-4 shadow-lift"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-hand text-lg text-ink">Reach this month</span>
          <Sparkle className="text-[#F97316]" size={16} />
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {[40, 65, 50, 80, 95].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-[3px] bg-[#2563EB]" style={{ height: `${h}%` }} />
          ))}
        </div>
        <p className="mt-2 text-xs font-semibold text-emerald-600">+186% vs last month</p>
      </FloatCard>

      <FloatCard
        depth={0.8}
        delay={0.3}
        duration={8}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute right-[0%] top-[2%] w-[48%] rotate-[3deg] rounded-2xl border border-hairline bg-paper p-3 shadow-lift"
      >
        <div className="flex items-center gap-1.5 rounded-full bg-ink/[0.04] px-3 py-1.5 text-[11px] text-ink-soft">
          <Search size={12} />
          <span className="truncate">rulescale-clients.com</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-[#2563EB]">Best Marketing Agency 2026</p>
        <p className="mt-1 text-xs text-ink-soft">
          Ranked #1 for &ldquo;marketing agency near me&rdquo; — Page 1, position 1.
        </p>
      </FloatCard>

      <FloatCard
        depth={1.3}
        delay={0.45}
        duration={6.5}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute left-[6%] top-[46%] w-[42%] rotate-[3deg] rounded-2xl border border-hairline bg-paper p-3 shadow-lift"
      >
        <div className="flex items-center gap-1.5">
          <span className="h-6 w-6 rounded-full bg-[#F97316]" />
          <span className="text-xs font-semibold text-ink">rulescale.co</span>
        </div>
        <div className="mt-2 flex aspect-square items-center justify-center rounded-xl bg-ink/[0.05]">
          <Camera className="text-ink-soft" size={26} strokeWidth={1.5} />
        </div>
        <div className="mt-2 flex items-center gap-3 text-ink-soft">
          <Heart size={16} />
          <MessageCircle size={16} />
          <span className="text-[11px]">2,481 likes</span>
        </div>
      </FloatCard>

      <FloatCard
        depth={0.6}
        delay={0.2}
        duration={7}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute right-[4%] bottom-[26%] w-[38%] rotate-[-4deg] rounded-2xl border border-hairline bg-paper p-4 shadow-lift"
      >
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
            <Play size={14} fill="currentColor" />
          </span>
          <div>
            <p className="text-xs font-semibold text-ink">New campaign video</p>
            <p className="text-[11px] text-ink-soft">0:32 · ready to publish</p>
          </div>
        </div>
      </FloatCard>

      <FloatCard
        depth={1.9}
        delay={0.6}
        duration={9}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute bottom-[-2%] left-[30%] w-[36%] rotate-[-2deg] rounded-lg bg-[#FDE68A] px-4 py-3 shadow-soft"
      >
        <p className="font-hand text-xl leading-tight text-ink">
          &ldquo;This actually worked.&rdquo;
        </p>
      </FloatCard>

      <FloatCard
        depth={0.4}
        delay={0.4}
        duration={5.5}
        parallaxX={springX}
        parallaxY={springY}
        className="absolute bottom-[2%] right-[16%] flex h-14 w-14 items-center justify-center rounded-full border border-hairline bg-paper shadow-lift"
      >
        <Coffee className="text-[#F97316]" size={22} strokeWidth={1.5} />
      </FloatCard>

      <PaperClip className="absolute left-[42%] top-[2%] rotate-[18deg] text-ink-soft" />
      <PaperClip className="absolute right-[30%] bottom-[18%] rotate-[-24deg] text-ink-soft" />
    </div>
  );
}
