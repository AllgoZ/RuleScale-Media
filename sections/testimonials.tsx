import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { TestimonialsData } from "@/lib/cms/types";

/**
 * One large featured quote with the rest set small beside it. All static — no
 * carousel, nothing auto-advances. Quotes are rendered exactly as stored in the CMS.
 */
export function Testimonials({ data }: { data: TestimonialsData }) {
  const [featured, ...others] = data.items;
  if (!featured) return null;

  return (
    <section aria-labelledby="testimonials-heading" className="section bg-paper">
      <Container>
        <h2 id="testimonials-heading" className="sr-only">
          What clients say
        </h2>
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          {/* The quote mark is an ordinary row above the quote, not an absolutely positioned glyph. */}
          <span
            aria-hidden="true"
            className="block h-[0.55em] select-none font-heading text-[8rem] font-extrabold leading-[0.9] text-accent md:text-[11rem] lg:col-span-8"
          >
            &ldquo;
          </span>

          <Reveal className="lg:col-span-8 lg:row-start-2">
            <figure>
              <blockquote className="font-heading text-[clamp(1.75rem,1rem+2.8vw,3.5rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
                <p>{featured.quote}</p>
              </blockquote>
              <figcaption className="mt-8">
                <span className="block font-heading text-lg font-bold text-ink">{featured.name}</span>
                <span className="block text-ink-soft">{featured.title}</span>
              </figcaption>
            </figure>
          </Reveal>

          {others.length ? (
            <div className="flex flex-col gap-8 lg:col-span-4 lg:row-start-2">
              {others.map((item, index) => (
                <figure
                  key={`${item.name}-${item.title}`}
                  data-anim="up"
                  data-anim-step={Math.min(index + 1, 5)}
                >
                  <blockquote className="text-[15px] leading-relaxed text-ink">
                    <p>&ldquo;{item.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-3 text-sm">
                    <span className="font-semibold text-ink">{item.name}</span>
                    <span className="text-ink-soft"> · {item.title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
