import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HandArrow } from "@/components/doodles/hand-arrow";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Spotlight } from "@/components/ui/spotlight";

export function FinalCTA() {
  return (
    <Spotlight
      color="rgba(236, 48, 19, 0.1)"
      className="bg-ink py-32 text-paper md:py-44"
    >
      <section id="final-cta">
        <Container className="relative text-center">
          <Reveal>
            <span className="font-hand -rotate-1 inline-block text-lg text-paper/60">
              let&apos;s make something people remember
            </span>

            <h2 className="text-display mx-auto mt-6 max-w-4xl text-paper text-balance">
              Ready to become the brand everyone remembers?
            </h2>

            <p className="mx-auto mt-8 max-w-md text-lg text-paper/60">
              Tell us where you&apos;re stuck. We&apos;ll tell you exactly how we&apos;d fix
              it — no obligation, no jargon.
            </p>

            <div className="relative mt-12 inline-block">
              <Button variant="accent" size="lg" asChild>
                <Link href="mailto:hello@rulescale.media">
                  Start Growing
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
