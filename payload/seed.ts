import { getPayload } from "payload";

import config from "../payload.config";
import { CASE_STUDIES, TESTIMONIALS } from "../lib/constants";

async function seed() {
  const payload = await getPayload({ config });

  const existingTestimonials = await payload.find({
    collection: "testimonials",
    limit: 1,
  });

  let testimonialIds: number[];
  if (existingTestimonials.totalDocs === 0) {
    testimonialIds = [];
    for (const [index, testimonial] of TESTIMONIALS.entries()) {
      const doc = await payload.create({
        collection: "testimonials",
        data: {
          quote: testimonial.quote,
          name: testimonial.name,
          title: testimonial.title,
          featured: true,
          order: index,
        },
      });
      testimonialIds.push(doc.id);
    }
    payload.logger.info(`Seeded ${testimonialIds.length} testimonials`);
  } else {
    const all = await payload.find({
      collection: "testimonials",
      limit: 100,
      sort: "order",
    });
    testimonialIds = all.docs.map((doc) => doc.id);
    payload.logger.info("Testimonials already seeded, reusing existing docs");
  }

  const existingCaseStudies = await payload.find({
    collection: "case-studies",
    limit: 1,
  });

  let caseStudyIds: number[];
  if (existingCaseStudies.totalDocs === 0) {
    caseStudyIds = [];
    for (const caseStudy of CASE_STUDIES) {
      const doc = await payload.create({
        collection: "case-studies",
        data: {
          client: caseStudy.client,
          industry: caseStudy.industry,
          result: caseStudy.result,
          summary: caseStudy.summary,
          tags: caseStudy.tags.map((tag) => ({ tag })),
        },
      });
      caseStudyIds.push(doc.id);
    }
    payload.logger.info(`Seeded ${caseStudyIds.length} case studies`);
  } else {
    const all = await payload.find({ collection: "case-studies", limit: 100 });
    caseStudyIds = all.docs.map((doc) => doc.id);
    payload.logger.info("Case studies already seeded, reusing existing docs");
  }

  const homepage = await payload.findGlobal({ slug: "homepage" });
  await payload.updateGlobal({
    slug: "homepage",
    data: {
      testimonials: { ...homepage.testimonials, items: testimonialIds },
      caseStudies: { ...homepage.caseStudies, items: caseStudyIds },
    },
  });

  payload.logger.info("Homepage global updated with seeded relationships");

  await payload.destroy();
}

try {
  await seed();
} catch (err) {
  console.error(err);
  process.exitCode = 1;
}
