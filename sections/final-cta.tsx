import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HandArrow } from "@/components/doodles/hand-arrow";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Spotlight } from "@/components/ui/spotlight";
import type { FinalCtaData } from "@/lib/cms/types";

export function FinalCTA({ data }: { data: FinalCtaData }) {
  return (
    <Spotlight
      color="rgba(236, 48, 19, 0.1)"
      className="bg-ink py-32 text-paper md:py-44"
    >
      <section id="final-cta">
        <Container className="relative text-center">
          <Reveal>
            <span className="font-hand -rotate-1 inline-block text-lg text-paper/60">
              {data.eyebrow}
            </span>

            <h2 className="text-display mx-auto mt-6 max-w-4xl text-paper text-balance">
              {data.heading}
            </h2>

            <p className="mx-auto mt-8 max-w-md text-lg text-paper/60">{data.subheading}</p>

            <div className="relative mt-12 inline-block">
              <Button variant="accent" size="lg" asChild>
                <Link href={data.cta.href}>
                  {data.cta.label}
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <HandArrow
                variant="pointUp"
                color="rgba(243, 242, 242, 0.4)"
                className="absolute -left-16 top-full hidden h-16 w-16 sm:block"
              />
            </div>
          </Reveal>
        </Container>
      </section>
    </Spotlight>
  );
}
