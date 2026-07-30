"use client";

import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Target, TrendingUp } from "lucide-react";
import Link from "next/link";
import { GoogleIcon } from "@/components/icons/google-icon";
import { MetaIcon } from "@/components/icons/meta-icon";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { HeroData, ResultStatData } from "@/lib/cms/types";

const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

function AnimatedWords({ text, delayStart = 0 }: { text: string; delayStart?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        // The separating space is a sibling text node OUTSIDE the inline-block
        // span, not inside it — a space placed right at the edge of an
        // inline-block box gets silently trimmed during layout, which is what
        // was collapsing "We grow brands" into "Wegrowbrands".
        <Fragment key={`word-${i}`}>
          <motion.span
            initial="hidden"
            animate="visible"
            variants={wordVariants}
            transition={{ duration: 0.5, delay: delayStart + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </>
  );
}

/** A slow, gentle vertical bob — starts only after the entrance settles, loops forever. */
function Float({
  children,
  delay = 0,
  duration = 3.4,
  distance = 7,
}: {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

export function Hero({ data, stats }: { data: HeroData; stats: ResultStatData[] }) {
  const floatingStats = stats.slice(2, 4);
  const prefixWordCount = data.headingPrefix.split(" ").length;
  const highlightDelay = 0.1 + prefixWordCount * 0.06;

  return (
    <section id="top" className="relative overflow-hidden pb-24 pt-12 md:pb-36 md:pt-20">
      {/* Decorative platform badges — purely illustrative brand-recognition accents, not
          a literal capability claim (RuleScale's real service list covers broader
          performance marketing, not only these two platforms). md:-only, so they never
          compete for space with the centered copy on narrow viewports. */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.5 }}
        className="absolute left-6 top-8 hidden md:block"
      >
        <Float delay={1.1} duration={3.2} distance={6}>
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-white shadow-soft">
            <GoogleIcon size={22} />
          </div>
        </Float>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.6 }}
        className="absolute right-6 top-8 hidden md:block"
      >
        <Float delay={1.4} duration={3.6} distance={6}>
          <div className="pill-badge inline-flex">
            <MetaIcon size={16} />
            Meta Ads
          </div>
        </Float>
      </motion.div>

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="pill-badge mx-auto inline-flex"
          >
            <span className="gradient-bg h-2 w-2 rounded-full" />
            <span className="italic text-ink-soft">{data.eyebrow}</span>
          </motion.div>

          <h1 className="mt-8 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-ink text-balance sm:text-5xl lg:text-6xl">
            <AnimatedWords text={data.headingPrefix} delayStart={0.1} />{" "}
            {/* The one emphasized word/phrase gets its own bouncier "pop" entrance
                (slight overshoot easing) instead of the plain word-by-word fade,
                so it visually lands as the important part of the headline. */}
            <motion.span
              initial={{ opacity: 0, y: 16, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: highlightDelay, ease: [0.34, 1.56, 0.64, 1] }}
              className="gradient-text inline-block"
            >
              {data.headingHighlight}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mx-auto mt-6 max-w-xl text-lg text-ink-soft"
          >
            {data.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="gradient-bg rounded-[20px] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(124,58,237,0.45)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_32px_-10px_rgba(124,58,237,0.55)]"
              asChild
            >
              <Link href={data.primaryCta.href}>
                {data.primaryCta.label}
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="group rounded-[20px] border-hairline bg-white"
              asChild
            >
              <Link href={data.secondaryCta.href}>
                {data.secondaryCta.label}
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.65 }}
            className="mt-8 text-sm text-ink-soft"
          >
            {data.trustLine}
          </motion.p>
        </div>

        {floatingStats[0] ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.75 }}
            className="absolute left-4 top-28 hidden md:left-10 md:block"
          >
            <Float delay={1.6} duration={3.8} distance={8}>
              <div className="rounded-[22px] border border-hairline bg-white p-4 shadow-lift lg:flex lg:items-center lg:gap-3">
                <span className="gradient-bg flex h-10 w-10 items-center justify-center rounded-full text-white">
                  <TrendingUp size={18} />
                </span>
                <div>
                  <p className="font-heading text-lg font-extrabold text-ink">
                    {floatingStats[0].value}
                    {floatingStats[0].suffix}
                  </p>
                  <p className="text-xs text-ink-soft">{floatingStats[0].label}</p>
                </div>
              </div>
            </Float>
          </motion.div>
        ) : null}

        {floatingStats[1] ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.85 }}
            className="absolute right-4 top-44 hidden md:right-10 md:block"
          >
            <Float delay={1.9} duration={4.0} distance={8}>
              <div className="flex items-center gap-3 rounded-[22px] border border-hairline bg-white p-4 shadow-lift">
                <span className="accent-red-bg flex h-10 w-10 items-center justify-center rounded-full text-white">
                  <Target size={18} />
                </span>
                <div>
                  <p className="font-heading text-lg font-extrabold text-ink">
                    {floatingStats[1].value}
                    {floatingStats[1].suffix}
                  </p>
                  <p className="text-xs text-ink-soft">{floatingStats[1].label}</p>
                </div>
              </div>
            </Float>
          </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
