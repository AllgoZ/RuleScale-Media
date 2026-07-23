import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { FAQS } from "@/lib/constants";

export function FAQ() {
  return (
    <section id="faq" className="py-28 md:py-40">
      <Container className="max-w-2xl">
        <Reveal>
          <span className="font-hand -rotate-1 inline-block text-base text-accent">
            questions
          </span>
          <h2 className="text-editorial mt-3 text-ink text-balance">
            Everything you&apos;re wondering.
          </h2>
        </Reveal>

        <Reveal className="mt-14">
          <Accordion type="single" collapsible>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.question} value={faq.question}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
