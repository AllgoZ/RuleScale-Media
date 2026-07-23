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

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustLogos />
      <Problem />
      <Manifesto />
      <Process />
      <Services />
      <Results />
      <CaseStudies />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </main>
  );
}
