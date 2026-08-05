"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function MobileCTA() {
  // Keyed on pathname so this fully remounts on every client-side navigation instead of just
  // updating in place. This component lives in the root layout and never unmounts otherwise —
  // without the remount, its visibility state (and the IntersectionObservers below, still
  // watching whatever page they were set up on) would carry over stale onto a page with no
  // #top/#final-cta section to observe at all, e.g. /form/influencer or /work/[slug].
  const pathname = usePathname();
  return <MobileCTAInner key={pathname} />;
}

function MobileCTAInner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    const finalCta = document.getElementById("final-cta");
    const footer = document.getElementById("site-footer");
    if (!hero || !finalCta || !footer) return;

    let pastHero = false;
    let inFinal = false;
    let inFooter = false;

    const update = () => setVisible(pastHero && !inFinal && !inFooter);

    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        update();
      },
      { rootMargin: "0px 0px -85% 0px" }
    );
    const finalObserver = new IntersectionObserver(
      ([entry]) => {
        inFinal = entry.isIntersecting;
        update();
      },
      { threshold: 0.15 }
    );
    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        inFooter = entry.isIntersecting;
        update();
      },
      { threshold: 0 }
    );

    heroObserver.observe(hero);
    finalObserver.observe(finalCta);
    footerObserver.observe(footer);

    return () => {
      heroObserver.disconnect();
      finalObserver.disconnect();
      footerObserver.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper/85 px-4 pt-3 backdrop-blur-xl md:hidden"
          style={{ paddingBottom: "calc(0.75rem + var(--safe-b))" }}
        >
          <Button
            className="gradient-bg w-full text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_-8px_rgba(124,58,237,0.45)]"
            asChild
          >
            <Link href="/#final-cta">
              Start Growing
              <ArrowRight size={17} />
            </Link>
          </Button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
