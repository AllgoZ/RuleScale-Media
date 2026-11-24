import { getHomepage } from "@/lib/cms/homepage";
import { getFeaturedPortfolioItems, getVideoPortfolioItems } from "@/lib/cms/portfolio";
import { getSiteSettings } from "@/lib/cms/settings";
import { FAQ } from "@/sections/faq";
import { FeaturedWork } from "@/sections/featured-work";
import { FinalCTA } from "@/sections/final-cta";
import { Hero } from "@/sections/hero";
import { Process } from "@/sections/process";
import { Results } from "@/sections/results";
import { Services } from "@/sections/services";
import { Testimonials } from "@/sections/testimonials";
import { TrustLogos } from "@/sections/trust-logos";
import { Videos } from "@/sections/videos";
import { Why } from "@/sections/why";

export default async function Home() {
  const [homepage, siteSettings, featuredWork, videoWork] = await Promise.all([
    getHomepage(),
    getSiteSettings(),
    getFeaturedPortfolioItems(),
    getVideoPortfolioItems(),
  ]);
  const instagramUrl = siteSettings.sameAs.find((url) => url.includes("instagram.com")) ?? null;

  return (
    <main>
      <Hero items={featuredWork} />
      <TrustLogos items={featuredWork} />
      <FeaturedWork items={featuredWork} />
      <Videos items={videoWork} />
      <Services data={homepage.services} />
      <Why problem={homepage.problem} manifesto={homepage.manifesto} />
      <Results data={homepage.results} />
      <Process data={homepage.process} />
      <Testimonials data={homepage.testimonials} />
      <FAQ data={homepage.faq} />
      <FinalCTA
        data={homepage.finalCta}
        contactEmail={siteSettings.contactEmail}
        instagramUrl={instagramUrl}
      />
    </main>
  );
}
