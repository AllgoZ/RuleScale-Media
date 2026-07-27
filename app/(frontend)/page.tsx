import { getHomepage } from "@/lib/cms/homepage";
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
import { TrustLogos } from "@/sections/trust-logos";

export default async function Home() {
  const homepage = await getHomepage();

  return (
    <main>
      <Hero data={homepage.hero} />
      <TrustLogos data={homepage.trustLogos} />
      <Problem data={homepage.problem} />
      <Manifesto data={homepage.manifesto} />
      <Process data={homepage.process} />
      <Services data={homepage.services} />
      <Results data={homepage.results} />
      <CaseStudies data={homepage.caseStudies} />
      <Testimonials data={homepage.testimonials} />
      <FAQ data={homepage.faq} />
      <FinalCTA data={homepage.finalCta} />
    </main>
  );
}
