"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Compass,
  Globe,
  LayoutTemplate,
  Lightbulb,
  Megaphone,
  PenLine,
  Plus,
  Search,
  Share2,
  Sparkles,
  Target,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  search: Search,
  target: Target,
  "share-2": Share2,
  sparkles: Sparkles,
  video: Video,
  "pen-line": PenLine,
  compass: Compass,
  megaphone: Megaphone,
  "bar-chart-3": BarChart3,
  globe: Globe,
  lightbulb: Lightbulb,
};

export function Services() {
  const [open, setOpen] = useState<string | undefined>(SERVICES[0]?.title);
  const active = SERVICES.find((s) => s.title === open) ?? SERVICES[0];
  const ActiveIcon = ICONS[active.icon];

  return (
    <section id="services" className="py-28 md:py-40">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <Reveal>
              <span className="font-hand -rotate-1 inline-block text-base text-accent">
                here&apos;s what we build
              </span>
              <h2 className="text-editorial mt-3 text-ink text-balance">
                One team. Every channel.
              </h2>
              <p className="mt-5 max-w-xs text-base text-ink-soft">
                Pick a single service, or hand us the whole growth engine. Tap any line to see
                what it actually includes.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 hidden lg:block">
              <div className="relative overflow-hidden rounded-2xl border border-hairline bg-paper p-6 shadow-soft">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.title}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <ActiveIcon size={26} strokeWidth={1.75} />
                    </span>
                    <p className="mt-4 font-heading text-xl font-extrabold text-ink">
                      {active.title}
                    </p>
                    <p className="font-hand mt-1 -rotate-1 text-lg text-accent">{active.note}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-8 lg:col-start-6">
            <AccordionPrimitive.Root
              type="single"
              collapsible
              value={open}
              onValueChange={(v) => setOpen(v || undefined)}
            >
              {SERVICES.map((service, index) => {
                const isOpen = open === service.title;
                const Icon = ICONS[service.icon];
                return (
                  <AccordionPrimitive.Item
                    key={service.title}
                    value={service.title}
                    className="group/row relative border-b border-hairline pl-5 first:border-t"
                  >
                    <motion.span
                      initial={false}
                      animate={{ scaleY: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: "center" }}
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-accent"
                    />

                    <AccordionPrimitive.Header>
                      <AccordionPrimitive.Trigger className="flex w-full items-center gap-4 py-5 text-left md:gap-5">
                        <span
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                            isOpen
                              ? "border-accent bg-accent text-paper"
                              : "border-hairline bg-paper text-ink-soft group-hover/row:border-accent/50"
                          )}
                        >
                          <Icon size={18} strokeWidth={1.75} />
                        </span>

                        <div className="flex-1">
                          <span className="block font-heading text-[10px] font-semibold tracking-[0.15em] text-ink-soft/40">
                            N°{String(index + 1).padStart(2, "0")}
                          </span>
                          <div className="flex flex-wrap items-baseline gap-x-3">
                            <span
                              className={cn(
                                "font-heading text-xl font-bold transition-colors duration-300 sm:text-2xl",
                                isOpen ? "text-ink" : "text-ink/75 group-hover/row:text-ink"
                              )}
                            >
                              {service.title}
                            </span>
                            {isOpen ? (
                              <span className="font-hand -rotate-1 text-lg text-accent">
                                {service.note}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <Plus
                          size={18}
                          strokeWidth={2}
                          className={cn(
                            "shrink-0 text-ink-soft transition-transform duration-300",
                            isOpen && "rotate-45 text-accent"
                          )}
                        />
                      </AccordionPrimitive.Trigger>
                    </AccordionPrimitive.Header>

                    <AccordionPrimitive.Content forceMount asChild>
                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        aria-hidden={!isOpen}
                        className="overflow-hidden"
                      >
                        <p className="max-w-lg pb-6 pl-[3.75rem] text-base text-ink-soft">
                          {service.description}
                        </p>
                      </motion.div>
                    </AccordionPrimitive.Content>
                  </AccordionPrimitive.Item>
                );
              })}
            </AccordionPrimitive.Root>
          </div>
        </div>
      </Container>
    </section>
  );
}
