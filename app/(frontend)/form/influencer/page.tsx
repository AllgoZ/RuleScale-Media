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
    <main className="section">
      <Container>
        <Reveal>
          <p className="eyebrow">Join the network</p>
          <h1 className="text-editorial mt-5 text-balance">Become a RuleScale creator</h1>
          <p className="text-lead mt-6 max-w-xl">
            Tell us about yourself and your audience. Our team reviews every application and
            reaches out when there&apos;s a fit with a live campaign.
          </p>
        </Reveal>

        <div className="mt-10 max-w-3xl rounded-md bg-paper-2 p-6 md:mt-12 md:p-10">
          <InfluencerForm />
        </div>
      </Container>
    </main>
  );
}
