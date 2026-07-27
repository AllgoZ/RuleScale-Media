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
            backgroundColor: scrolled ? "rgba(243, 242, 242, 0.75)" : "rgba(243, 242, 242, 0)",
            borderColor: scrolled ? "rgba(32, 30, 29, 0.09)" : "rgba(32, 30, 29, 0)",
            boxShadow: scrolled ? "0 8px 30px rgba(32,30,29,0.06)" : "0 0px 0px rgba(32,30,29,0)",
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "flex h-14 items-center justify-between rounded-full border px-5 backdrop-blur-xl transition-[padding]"
          )}
        >
          <Link
            href="#top"
            className="flex items-center gap-2 font-heading text-[15px] font-bold text-ink"
          >
            <LogoMark size={24} />
            {siteName}
          </Link>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navigation.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-ink-soft transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button variant="accent" size="default" className="h-10 px-5 text-sm" asChild>
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
              <div className="mt-2 flex flex-col gap-1 rounded-3xl border border-hairline bg-paper/95 p-4 shadow-lift backdrop-blur-xl">
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
                  variant="accent"
                  className="mt-2 w-full"
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
