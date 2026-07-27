"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import Link from "next/link";
import { HeroCollage } from "@/components/hero-collage";
import { ScribbleUnderline } from "@/components/doodles/scribble-underline";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Spotlight } from "@/components/ui/spotlight";
import type { HeroData } from "@/lib/cms/types";

export function Hero({ data }: { data: HeroData }) {
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-8 md:pb-28 md:pt-14">
      <Spotlight color="rgba(236, 48, 19, 0.07)">
        <Container className="relative grid items-center gap-x-10 gap-y-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-hairline bg-paper px-4 py-2 shadow-soft"
            >
              <Sparkle className="text-accent" size={16} />
              <span className="font-hand text-lg text-ink">{data.eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-7 font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-ink text-balance sm:text-6xl lg:text-[3.75rem]"
            >
              {data.headingPrefix}{" "}
              <span className="relative inline-block sm:whitespace-nowrap">
                {data.headingHighlight}
                <ScribbleUnderline className="-bottom-1 h-3" delay={0.7} />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 max-w-xl text-lg text-ink-soft"
            >
              {data.subheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Button variant="accent" size="lg" asChild>
                <Link href={data.primaryCta.href}>
                  {data.primaryCta.label}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href={data.secondaryCta.href}>{data.secondaryCta.label}</Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 text-sm text-ink-soft"
            >
              {data.trustLine}
            </motion.p>
          </div>

          <div className="min-w-0 lg:col-span-5">
            <HeroCollage />
          </div>
        </Container>
      </Spotlight>
    </section>
  );
}
