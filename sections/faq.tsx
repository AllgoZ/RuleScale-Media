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
    <section id="faq" aria-labelledby="faq-heading" className="section bg-white">
      <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className="eyebrow">{data.eyebrow}</p>
          <h2
            id="faq-heading"
            className="text-section mt-3"
          >
            {data.heading}
          </h2>
        </Reveal>

        <div className="lg:col-span-8">
          <Accordion type="single" collapsible>
            {data.items.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                data-anim="up"
                data-anim-step={(index % 3) + 1}
              >
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}
