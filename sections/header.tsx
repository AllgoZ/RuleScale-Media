"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/doodles/logo-mark";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { NavigationData } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

function TwoToneName({ siteName }: { siteName: string }) {
  const [first, ...rest] = siteName.split(" ");
  return (
    <span className="flex items-center gap-1">
      <span className="text-ink">{first}</span>
      {rest.length ? <span className="gradient-text">{rest.join(" ")}</span> : null}
    </span>
  );
}

export function Header({
  navigation,
  siteName,
}: {
  navigation: NavigationData;
  siteName: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 py-3">
      <Container>
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0.5)",
            borderColor: scrolled ? "rgba(32, 30, 29, 0.09)" : "rgba(32, 30, 29, 0.06)",
            boxShadow: scrolled ? "0 8px 30px rgba(32,30,29,0.08)" : "0 0px 0px rgba(32,30,29,0)",
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-16 items-center justify-between rounded-full border px-4 backdrop-blur-xl transition-[padding]"
        >
          <Link href="#top" className="flex items-center gap-2.5 font-heading text-base font-bold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-white">
              <LogoMark size={22} />
            </span>
            <TwoToneName siteName={siteName} />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[14px] font-medium text-ink-soft transition-colors hover:bg-ink/[0.04] hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button
              size="default"
              className="h-11 gradient-bg px-6 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(124,58,237,0.45)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_16px_32px_-10px_rgba(124,58,237,0.55)]"
              asChild
            >
              <Link href={navigation.ctaHref}>{navigation.ctaLabel}</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </motion.div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden"
          >
            <Container>
              <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-hairline bg-white/95 p-4 shadow-lift backdrop-blur-xl">
                {navigation.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink hover:bg-ink/[0.04]"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button
                  className={cn(
                    "mt-2 w-full gradient-bg text-white",
                    "shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(124,58,237,0.45)]"
                  )}
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link href={navigation.ctaHref}>{navigation.ctaLabel}</Link>
                </Button>
              </div>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
