"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/doodles/logo-mark";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { NavigationData } from "@/lib/cms/types";
import { PRIMARY_CTA, PRIMARY_NAV } from "@/lib/nav";
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
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const ctaHref = navigation.ctaHref || PRIMARY_CTA.href;

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock background scroll, Escape closes, Tab stays inside the menu.
  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("modal-open");
    panelRef.current?.querySelector<HTMLElement>("a,button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab") return;
      const focusables = [
        toggleRef.current,
        ...Array.from(panelRef.current?.querySelectorAll<HTMLElement>("a,button") ?? []),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("modal-open");
    };
  }, [open, close]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-paper transition-[border-color] duration-200",
        scrolled || open ? "border-hairline" : "border-transparent"
      )}
    >
      <Container className="grid h-[var(--header-h)] grid-cols-[1fr_auto] items-center gap-6 lg:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/#top"
          className="flex items-center gap-2.5 justify-self-start font-heading text-[17px] font-extrabold leading-none tracking-tight"
        >
          <span aria-hidden="true">
            <LogoMark size={30} />
          </span>
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {PRIMARY_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link text-[15px] font-medium text-ink-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-3">
          <Button asChild variant="accent" className="hidden h-11 px-5 sm:inline-flex">
            <Link href={ctaHref}>{PRIMARY_CTA.label}</Link>
          </Button>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close(false) : setOpen(true))}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-ink/5 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          ref={panelRef}
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-paper lg:hidden"
        >
          <Container className="flex min-h-full flex-col pb-10 pt-6">
            <nav aria-label="Mobile" className="flex flex-col">
              {PRIMARY_NAV.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => close(false)}
                  className="border-b border-hairline py-4 font-heading text-3xl font-extrabold tracking-tight text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 flex flex-col gap-3">
              <Button asChild variant="accent" size="lg" className="w-full">
                <Link href={ctaHref} onClick={() => close(false)}>
                  {PRIMARY_CTA.label}
                </Link>
              </Button>
              <Link
                href="/form/influencer"
                onClick={() => close(false)}
                className="py-2 text-center text-sm font-medium text-ink-soft hover:text-ink"
              >
                Creator? Join the network
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
