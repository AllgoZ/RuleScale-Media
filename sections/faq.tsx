import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { FaqData } from "@/lib/cms/types";

export function FAQ({ data }: { data: FaqData }) {
  return (
    <section id="faq" className="py-20 md:py-28">
      <Container className="max-w-2xl">
        <Reveal className="text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {data.heading}
          </h2>
        </Reveal>

        <Reveal className="mt-12 flex flex-col gap-3">
          <Accordion type="single" collapsible>
            {data.items.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="mb-3 rounded-[24px] border border-hairline bg-white px-6 last:mb-0"
              >
                <AccordionTrigger className="py-5 text-base">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
