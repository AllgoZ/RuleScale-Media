import { ArrowUpRight, Plus } from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ServiceItemData, ServicesData } from "@/lib/cms/types";

/**
 * The CMS keeps one flat list of services. For scanning, they are grouped into
 * three plain-English categories by service name. A service whose name isn't
 * recognised falls into the last group, so nothing is dropped when an editor
 * adds or renames one.
 */
const GROUPS = [
  { title: "Build & get found", keys: ["website", "seo", "performance", "analytics"] },
  { title: "Create & connect", keys: ["social", "content", "video", "influencer"] },
  { title: "Plan & reach", keys: ["brand", "media buying", "localization", "consulting"] },
] as const;

function groupServices(items: ServiceItemData[]) {
  const buckets: ServiceItemData[][] = GROUPS.map(() => []);
  for (const item of items) {
    const name = item.title.toLowerCase();
    const index = GROUPS.findIndex((group) => group.keys.some((key) => name.includes(key)));
    buckets[index === -1 ? GROUPS.length - 1 : index].push(item);
  }
  return buckets;
}

/** The stored intro still tells visitors to "tap any line" (from the old accordion). */
const stripTapHint = (text: string) => text.replace(/\s*Tap any line[^.]*\./i, "").trim();

/**
 * Editorial service menu: three large numbered groups. Collapsed, each shows its
 * service names on one line; open, it shows every description. Built on native
 * <details name="…"> so it is keyboard/screen-reader accessible without JS and
 * every description stays in the page HTML for search engines.
 */
export function Services({ data }: { data: ServicesData }) {
  const buckets = groupServices(data.items);
  const description = stripTapHint(data.description);

  return (
    <section id="services" aria-labelledby="services-heading" className="section bg-paper">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-x-16">
          {/* Intro: top padding equals the first row's, so both columns start on one line. */}
          <Reveal className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start lg:pt-[var(--row-pad)]">
            <p className="eyebrow">{data.eyebrow}</p>
            <h2 id="services-heading" className="text-section mt-3">
              {data.heading}
            </h2>
            {description ? <p className="text-lead mt-5 max-w-sm">{description}</p> : null}
            <Link
              href="/contact"
              className="mt-8 inline-flex min-h-11 items-center gap-2 font-heading font-semibold text-ink underline decoration-accent decoration-2 underline-offset-4 hover:text-accent-deep"
            >
              Discuss your project
              <ArrowUpRight size={18} />
            </Link>
          </Reveal>

          <div className="flex flex-col gap-3 lg:col-span-8">
            {GROUPS.map((group, groupIndex) =>
              buckets[groupIndex].length ? (
                <details
                  key={group.title}
                  name="service-groups"
                  open={groupIndex === 0}
                  data-anim="up"
                  data-anim-step={groupIndex + 1}
                  className="details-smooth group transition-colors open:bg-white"
                >
                  {/* One column template shared by the summary and the expanded content. */}
                  <summary className="grid cursor-pointer list-none grid-cols-[2rem_1fr_auto] items-start gap-x-4 p-[var(--row-pad)] marker:hidden md:grid-cols-[2.5rem_1fr_auto] md:gap-x-6 [&::-webkit-details-marker]:hidden">
                    <span className="pt-2 font-heading text-sm font-bold text-accent-deep">
                      {String(groupIndex + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-heading text-[clamp(1.75rem,1rem+2.4vw,3rem)] font-extrabold leading-none tracking-[-0.035em]">
                        {group.title}
                      </span>
                      <span className="mt-3 block text-[15px] text-ink-soft group-open:hidden">
                        {buckets[groupIndex].map((service) => service.title).join("  /  ")}
                      </span>
                    </span>
                    <Plus
                      size={28}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-open:rotate-45 group-open:text-accent-deep"
                    />
                  </summary>
                  <div className="grid grid-cols-[2rem_1fr_auto] gap-x-4 px-[var(--row-pad)] pb-[var(--row-pad)] md:grid-cols-[2.5rem_1fr_auto] md:gap-x-6">
                    <div className="col-start-2 grid gap-x-10 gap-y-7 sm:grid-cols-2">
                      {buckets[groupIndex].map((service) => (
                        <div key={service.title}>
                          <h3 className="font-heading text-lg font-bold tracking-tight">{service.title}</h3>
                          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{service.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              ) : null
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
