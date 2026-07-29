import {
  BarChart3,
  Compass,
  Globe,
  LayoutTemplate,
  Lightbulb,
  Megaphone,
  PenLine,
  Search,
  Share2,
  Sparkles,
  Target,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import type { ServicesData } from "@/lib/cms/types";

const ICONS: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  search: Search,
  target: Target,
  "share-2": Share2,
  sparkles: Sparkles,
  video: Video,
  "pen-line": PenLine,
  compass: Compass,
  megaphone: Megaphone,
  "bar-chart-3": BarChart3,
  globe: Globe,
  lightbulb: Lightbulb,
};

export function Services({ data }: { data: ServicesData }) {
  return (
    <section id="services" className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            {data.eyebrow}
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            {data.heading}
          </h2>
          <p className="mt-3 text-base text-ink-soft">{data.description}</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((service, index) => {
            const Icon = ICONS[service.icon];
            return (
              <Reveal key={service.title} delay={(index % 6) * 0.06}>
                <div className="h-full rounded-[24px] border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="gradient-bg flex h-12 w-12 items-center justify-center rounded-full text-white">
                    <Icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-bold text-ink">{service.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{service.description}</p>
                  {service.note ? (
                    <span className="mt-4 inline-block rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-medium text-[var(--color-accent)]">
                      {service.note}
                    </span>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
