import { Eye, LineChart } from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";
import { MetaIcon } from "@/components/icons/meta-icon";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const TOOLS = [
  { name: "Google Analytics 4", brand: "google" as const },
  { name: "Google Tag Manager", brand: "google" as const },
  { name: "Google Ads", brand: "google" as const },
  { name: "Meta Ads Manager", brand: "meta" as const },
  { name: "Looker Studio", brand: "looker" as const },
  { name: "Semrush", brand: "semrush" as const },
];

export function ToolsStack() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="pill-badge inline-flex">
            <span className="gradient-bg h-1.5 w-1.5 rounded-full" />
            Stack
          </span>
          <h2 className="mt-4 font-heading text-3xl font-extrabold tracking-tight text-ink text-balance md:text-4xl">
            Tools & Platforms We Use
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {TOOLS.map((tool) => (
            <Reveal key={tool.name} delay={0.05}>
              <div className="flex h-full flex-col items-center gap-3 rounded-[24px] border border-hairline bg-white p-5 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-white">
                  {tool.brand === "google" ? (
                    <GoogleIcon size={20} />
                  ) : tool.brand === "meta" ? (
                    <MetaIcon size={20} />
                  ) : tool.brand === "looker" ? (
                    <LineChart size={18} style={{ color: "var(--color-accent)" }} />
                  ) : (
                    <Eye size={18} style={{ color: "var(--color-accent-solid)" }} />
                  )}
                </span>
                <p className="text-sm font-medium text-ink">{tool.name}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
