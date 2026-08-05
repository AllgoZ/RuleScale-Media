import type { Metadata } from "next";
import { InfluencerForm } from "@/components/forms/influencer/influencer-form";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SITE_URL } from "@/lib/constants";

// The root layout's metadata sets a `%s | RuleScale Media` title template, so the page-level
// title below is just "Influencer Registration" — Next.js appends the suffix, producing the
// brief's exact required title ("Influencer Registration | RuleScale Media") without doubling it.
const TITLE = "Influencer Registration";
const FULL_TITLE = "Influencer Registration | RuleScale Media";
const DESCRIPTION =
  "Join RuleScale Media's influencer network and collaborate with leading brands across multiple industries.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: "/form/influencer" },
    openGraph: { title: FULL_TITLE, description: DESCRIPTION, url: `${SITE_URL}/form/influencer` },
    twitter: { title: FULL_TITLE, description: DESCRIPTION },
  };
}

export default function InfluencerFormPage() {
  return (
    <main className="bg-dot-grid-light py-16 md:py-24" style={{ backgroundColor: "var(--color-home-bg)" }}>
      <Container className="max-w-3xl">
        <Reveal>
          <span className="font-hand -rotate-1 inline-block text-base text-accent-solid">
            join the network
          </span>
          <h1 className="text-editorial mt-2 text-ink text-balance">
            Become a <span className="gradient-text">RuleScale</span> creator
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            Tell us about yourself and your audience. Our team reviews every application and
            reaches out when there&apos;s a fit with a live campaign.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 rounded-3xl border border-hairline bg-white p-6 md:p-10">
          <InfluencerForm />
        </Reveal>
      </Container>
    </main>
  );
}
