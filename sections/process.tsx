import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ProcessData } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

/**
 * Process on ink: five zig-zag rows led by giant outlined step numbers. A
 * deliberately different composition from every other section; no scroll-linked
 * drawing, nothing animated except the quiet reveal.
 */
export function Process({ data }: { data: ProcessData }) {
  return (
    <section id="process" aria-labelledby="process-heading" className="section on-ink overflow-hidden">
      <Container>
        <Reveal className="max-w-xl">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2
            id="process-heading"
            className="text-section mt-3"
          >
            {data.heading}
          </h2>
          <p className="text-lead mt-5">{data.description}</p>
        </Reveal>

        <ol className="mt-12 md:mt-16">
          {data.steps.map((step, index) => {
            const flip = index % 2 === 1;
            return (
              <li
                key={step.step}
                className={cn(
                  "grid items-center gap-2 py-6 md:grid-cols-12 md:gap-8 md:py-10",
                  flip && "md:[&>*:first-child]:order-2"
                )}
              >
                <span
                  aria-hidden="true"
                  data-anim={flip ? "right" : "left"}
                  className={cn(
                    "outline-num block font-heading text-[clamp(5rem,3rem+10vw,12rem)] font-extrabold leading-[0.85] tracking-[-0.05em] md:col-span-5",
                    flip ? "md:col-start-8 md:text-right" : "md:col-start-1 md:text-left"
                  )}
                >
                  {step.step}
                </span>
                <div
                  data-anim="up"
                  data-anim-step="1"
                  className={cn("md:col-span-6", flip ? "md:col-start-1" : "md:col-start-7")}
                >
                  <h3 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
                    <span className="sr-only">Step {step.step}: </span>
                    {step.title}
                  </h3>
                  <p className="muted mt-3 max-w-md text-base leading-relaxed">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
