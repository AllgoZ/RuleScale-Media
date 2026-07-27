import {
  CASE_STUDIES,
  FAQS,
  MANIFESTO,
  PROBLEM_CARDS,
  PROCESS_STEPS,
  RESULTS_STATS,
  SERVICES,
  TESTIMONIALS,
  TRUST_LOGOS,
} from "@/lib/constants";
import type { CaseStudy, Homepage as PayloadHomepage, Testimonial } from "@/payload-types";
import { getPayloadClient } from "./payload-client";
import type { HomepageData } from "./types";

const FALLBACK_HOMEPAGE: HomepageData = {
  hero: {
    eyebrow: "Hi, we're RuleScale Media",
    headingPrefix: "We grow brands",
    headingHighlight: "people remember.",
    subheading:
      "Marketing that actually moves businesses. We pair sharp strategy with website design, SEO, social, influencer, and video production — so growth isn't left to chance.",
    primaryCta: { label: "Start Growing", href: "#final-cta" },
    secondaryCta: { label: "See Our Work", href: "#case-studies" },
    trustLine: "Trusted by 250+ brands across DTC, hospitality, SaaS, and retail.",
  },
  trustLogos: {
    label: "Our clients have been featured on",
    logos: [...TRUST_LOGOS],
  },
  problem: {
    eyebrow: "The problem",
    heading: "Sound familiar?",
    cards: PROBLEM_CARDS.map((card) => ({
      tag: card.tag,
      title: card.title,
      highlight: card.highlight,
      note: card.note,
      rotate: card.rotate,
    })),
  },
  manifesto: {
    eyebrow: MANIFESTO.eyebrow,
    lines: [...MANIFESTO.lines],
    note: MANIFESTO.note,
  },
  process: {
    eyebrow: "here's how we think",
    heading: "A plan, not a guess.",
    description: "Five steps, every time — so you always know what happens next and why.",
    steps: PROCESS_STEPS.map((step) => ({
      step: step.step,
      title: step.title,
      description: step.description,
    })),
  },
  services: {
    eyebrow: "here's what we build",
    heading: "One team. Every channel.",
    description:
      "Pick a single service, or hand us the whole growth engine. Tap any line to see what it actually includes.",
    items: SERVICES.map((service) => ({
      title: service.title,
      note: service.note,
      description: service.description,
      icon: service.icon,
    })),
  },
  results: {
    eyebrow: "the numbers",
    heading: "Growth you can measure.",
    note: "Every engagement is measured against outcomes we agree on before we start — no vanity metrics.",
    stats: RESULTS_STATS.map((stat) => ({
      value: stat.value,
      suffix: stat.suffix,
      label: stat.label,
    })),
  },
  caseStudies: {
    eyebrow: "here's proof",
    heading: "Recent work we're proud of.",
    items: CASE_STUDIES.map((study) => ({
      client: study.client,
      industry: study.industry,
      result: study.result,
      summary: study.summary,
      tags: [...study.tags],
    })),
  },
  testimonials: {
    eyebrow: "kind words",
    items: TESTIMONIALS.map((testimonial) => ({
      quote: testimonial.quote,
      name: testimonial.name,
      title: testimonial.title,
    })),
  },
  faq: {
    eyebrow: "questions",
    heading: "Everything you're wondering.",
    items: FAQS.map((faq) => ({ question: faq.question, answer: faq.answer })),
  },
  finalCta: {
    eyebrow: "let's make something people remember",
    heading: "Ready to become the brand everyone remembers?",
    subheading:
      "Tell us where you're stuck. We'll tell you exactly how we'd fix it — no obligation, no jargon.",
    cta: { label: "Start Growing", href: "mailto:hello@rulescale.media" },
  },
};

function isPopulatedCaseStudy(item: number | CaseStudy): item is CaseStudy {
  return typeof item === "object" && item !== null;
}

function isPopulatedTestimonial(item: number | Testimonial): item is Testimonial {
  return typeof item === "object" && item !== null;
}

function normalize(doc: PayloadHomepage): HomepageData {
  const caseStudyDocs = (doc.caseStudies?.items ?? []).filter(isPopulatedCaseStudy);
  const testimonialDocs = (doc.testimonials?.items ?? []).filter(isPopulatedTestimonial);

  return {
    hero: {
      eyebrow: doc.hero?.eyebrow || FALLBACK_HOMEPAGE.hero.eyebrow,
      headingPrefix: doc.hero?.headingPrefix || FALLBACK_HOMEPAGE.hero.headingPrefix,
      headingHighlight: doc.hero?.headingHighlight || FALLBACK_HOMEPAGE.hero.headingHighlight,
      subheading: doc.hero?.subheading || FALLBACK_HOMEPAGE.hero.subheading,
      primaryCta: {
        label: doc.hero?.primaryCta?.label || FALLBACK_HOMEPAGE.hero.primaryCta.label,
        href: doc.hero?.primaryCta?.href || FALLBACK_HOMEPAGE.hero.primaryCta.href,
      },
      secondaryCta: {
        label: doc.hero?.secondaryCta?.label || FALLBACK_HOMEPAGE.hero.secondaryCta.label,
        href: doc.hero?.secondaryCta?.href || FALLBACK_HOMEPAGE.hero.secondaryCta.href,
      },
      trustLine: doc.hero?.trustLine || FALLBACK_HOMEPAGE.hero.trustLine,
    },
    trustLogos: {
      label: doc.trustLogos?.label || FALLBACK_HOMEPAGE.trustLogos.label,
      logos: doc.trustLogos?.logos?.length
        ? doc.trustLogos.logos.map((logo) => logo.name)
        : FALLBACK_HOMEPAGE.trustLogos.logos,
    },
    problem: {
      eyebrow: doc.problem?.eyebrow || FALLBACK_HOMEPAGE.problem.eyebrow,
      heading: doc.problem?.heading || FALLBACK_HOMEPAGE.problem.heading,
      cards: doc.problem?.cards?.length
        ? doc.problem.cards.map((card) => ({
            tag: card.tag,
            title: card.title,
            highlight: card.highlight || "",
            note: card.note || "",
            rotate: card.rotate ?? 0,
          }))
        : FALLBACK_HOMEPAGE.problem.cards,
    },
    manifesto: {
      eyebrow: doc.manifesto?.eyebrow || FALLBACK_HOMEPAGE.manifesto.eyebrow,
      lines: doc.manifesto?.lines?.length
        ? doc.manifesto.lines.map((entry) => entry.line)
        : FALLBACK_HOMEPAGE.manifesto.lines,
      note: doc.manifesto?.note || FALLBACK_HOMEPAGE.manifesto.note,
    },
    process: {
      eyebrow: doc.process?.eyebrow || FALLBACK_HOMEPAGE.process.eyebrow,
      heading: doc.process?.heading || FALLBACK_HOMEPAGE.process.heading,
      description: doc.process?.description || FALLBACK_HOMEPAGE.process.description,
      steps: doc.process?.steps?.length
        ? doc.process.steps.map((step) => ({
            step: step.step,
            title: step.title,
            description: step.description,
          }))
        : FALLBACK_HOMEPAGE.process.steps,
    },
    services: {
      eyebrow: doc.services?.eyebrow || FALLBACK_HOMEPAGE.services.eyebrow,
      heading: doc.services?.heading || FALLBACK_HOMEPAGE.services.heading,
      description: doc.services?.description || FALLBACK_HOMEPAGE.services.description,
      items: doc.services?.items?.length
        ? doc.services.items.map((item) => ({
            title: item.title,
            note: item.note || "",
            description: item.description,
            icon: item.icon,
          }))
        : FALLBACK_HOMEPAGE.services.items,
    },
    results: {
      eyebrow: doc.results?.eyebrow || FALLBACK_HOMEPAGE.results.eyebrow,
      heading: doc.results?.heading || FALLBACK_HOMEPAGE.results.heading,
      note: doc.results?.note || FALLBACK_HOMEPAGE.results.note,
      stats: doc.results?.stats?.length
        ? doc.results.stats.map((stat) => ({
            value: stat.value,
            suffix: stat.suffix || "",
            label: stat.label,
          }))
        : FALLBACK_HOMEPAGE.results.stats,
    },
    caseStudies: {
      eyebrow: doc.caseStudies?.eyebrow || FALLBACK_HOMEPAGE.caseStudies.eyebrow,
      heading: doc.caseStudies?.heading || FALLBACK_HOMEPAGE.caseStudies.heading,
      items: caseStudyDocs.length
        ? caseStudyDocs.map((study) => ({
            client: study.client,
            industry: study.industry,
            result: study.result,
            summary: study.summary,
            tags: (study.tags ?? []).map((entry) => entry.tag),
          }))
        : FALLBACK_HOMEPAGE.caseStudies.items,
    },
    testimonials: {
      eyebrow: doc.testimonials?.eyebrow || FALLBACK_HOMEPAGE.testimonials.eyebrow,
      items: testimonialDocs.length
        ? testimonialDocs.map((testimonial) => ({
            quote: testimonial.quote,
            name: testimonial.name,
            title: testimonial.title,
          }))
        : FALLBACK_HOMEPAGE.testimonials.items,
    },
    faq: {
      eyebrow: doc.faq?.eyebrow || FALLBACK_HOMEPAGE.faq.eyebrow,
      heading: doc.faq?.heading || FALLBACK_HOMEPAGE.faq.heading,
      items: doc.faq?.items?.length
        ? doc.faq.items.map((item) => ({ question: item.question, answer: item.answer }))
        : FALLBACK_HOMEPAGE.faq.items,
    },
    finalCta: {
      eyebrow: doc.finalCta?.eyebrow || FALLBACK_HOMEPAGE.finalCta.eyebrow,
      heading: doc.finalCta?.heading || FALLBACK_HOMEPAGE.finalCta.heading,
      subheading: doc.finalCta?.subheading || FALLBACK_HOMEPAGE.finalCta.subheading,
      cta: {
        label: doc.finalCta?.cta?.label || FALLBACK_HOMEPAGE.finalCta.cta.label,
        href: doc.finalCta?.cta?.href || FALLBACK_HOMEPAGE.finalCta.cta.href,
      },
    },
  };
}

export async function getHomepage(): Promise<HomepageData> {
  try {
    const payload = await getPayloadClient();
    const doc = await payload.findGlobal({ slug: "homepage", depth: 1 });
    return normalize(doc);
  } catch (error) {
    console.error(
      "[cms] Failed to load homepage from Payload, falling back to constants.ts",
      error
    );
    return FALLBACK_HOMEPAGE;
  }
}
