import { getHomepage } from "@/lib/cms/homepage";
import { getSiteSettings } from "@/lib/cms/settings";
import { SERVICES } from "@/lib/constants";
import { getTurnstileSiteKey } from "@/lib/env";
import { CaseStudies } from "@/sections/case-studies";
import { FAQ } from "@/sections/faq";
import { FinalCTA } from "@/sections/final-cta";
import { Hero } from "@/sections/hero";
import { Manifesto } from "@/sections/manifesto";
import { Problem } from "@/sections/problem";
import { Process } from "@/sections/process";
import { Results } from "@/sections/results";
import { Services } from "@/sections/services";
import { Testimonials } from "@/sections/testimonials";
import { ToolsStack } from "@/sections/tools-stack";
import { TrustLogos } from "@/sections/trust-logos";

export default async function Home() {
  const [homepage, siteSettings] = await Promise.all([getHomepage(), getSiteSettings()]);
  const services = SERVICES.map((service) => service.title);
  const turnstileSiteKey = getTurnstileSiteKey();
  const linkedinUrl = siteSettings.sameAs.find((url) => url.includes("linkedin")) ?? null;

  return (
    <main className="bg-dot-grid-light" style={{ backgroundColor: "var(--color-home-bg)" }}>
      <Hero data={homepage.hero} stats={homepage.results.stats} />
      <Results data={homepage.results} />
      <Problem data={homepage.problem} />
      <Manifesto data={homepage.manifesto} />
      <Services data={homepage.services} />
      <TrustLogos data={homepage.trustLogos} />
      <CaseStudies data={homepage.caseStudies} />
      <ToolsStack />
      <Process data={homepage.process} />
      <Testimonials data={homepage.testimonials} />
      <FAQ data={homepage.faq} />
      <FinalCTA
        data={homepage.finalCta}
        contactEmail={siteSettings.contactEmail}
        linkedinUrl={linkedinUrl}
        services={services}
        turnstileSiteKey={turnstileSiteKey}
      />
    </main>
  );
}
