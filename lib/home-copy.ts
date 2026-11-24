/**
 * Layout-owned homepage copy: the headline and section framing that belong to
 * the redesigned composition. Services, process steps, stats, testimonials,
 * FAQ, manifesto, problem statements and the closing CTA are NOT here: those
 * still come from the Payload `homepage` global (with lib/constants.ts as the
 * fallback), so editors keep control of them.
 *
 * Only claims that are true of the business and its published work belong
 * here. Keep it that way: no invented clients, metrics or locations.
 */
export const HERO_COPY = {
  kicker: "Digital marketing agency",
  headline: "Creative that gets noticed. Marketing that gets results.",
  lead: "Websites, SEO, social, video and performance campaigns, planned, built and measured by one team.",
  primaryCta: { label: "Start a project", href: "/contact" },
  secondaryCta: { label: "See our work", href: "/#case-studies" },
} as const;

export const CLIENTS_COPY = {
  label: "Brands we've built for",
} as const;

export const WORK_COPY = {
  eyebrow: "Selected work",
  heading: "Websites and brands we've shipped.",
  cta: { label: "Talk about your project", href: "/contact" },
} as const;

export const VIDEO_COPY = {
  eyebrow: "Video",
  heading: "Content made for the scroll.",
  lead: "Short-form video and campaign content, built for social and ads.",
  allLabel: "See all video work",
} as const;
