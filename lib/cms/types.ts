export type CtaData = {
  label: string;
  href: string;
};

export type HeroData = {
  eyebrow: string;
  headingPrefix: string;
  headingHighlight: string;
  subheading: string;
  primaryCta: CtaData;
  secondaryCta: CtaData;
  trustLine: string;
};

export type TrustLogosData = {
  label: string;
  logos: string[];
};

export type ProblemCardData = {
  tag: string;
  title: string;
  highlight: string;
  note: string;
  rotate: number;
};

export type ProblemData = {
  eyebrow: string;
  heading: string;
  cards: ProblemCardData[];
};

export type ManifestoData = {
  eyebrow: string;
  lines: string[];
  note: string;
};

export type ProcessStepData = {
  step: string;
  title: string;
  description: string;
};

export type ProcessData = {
  eyebrow: string;
  heading: string;
  description: string;
  steps: ProcessStepData[];
};

export type ServiceItemData = {
  title: string;
  note: string;
  description: string;
  icon: string;
};

export type ServicesData = {
  eyebrow: string;
  heading: string;
  description: string;
  items: ServiceItemData[];
};

export type ResultStatData = {
  value: number;
  suffix: string;
  label: string;
};

export type ResultsData = {
  eyebrow: string;
  heading: string;
  note: string;
  stats: ResultStatData[];
};

export type CaseStudyData = {
  client: string;
  industry: string;
  result: string;
  summary: string;
  tags: string[];
};

export type CaseStudiesData = {
  eyebrow: string;
  heading: string;
  items: CaseStudyData[];
};

export type TestimonialData = {
  quote: string;
  name: string;
  title: string;
};

export type TestimonialsData = {
  eyebrow: string;
  items: TestimonialData[];
};

export type FaqItemData = {
  question: string;
  answer: string;
};

export type FaqData = {
  eyebrow: string;
  heading: string;
  items: FaqItemData[];
};

export type FinalCtaData = {
  eyebrow: string;
  heading: string;
  subheading: string;
  cta: CtaData;
};

export type HomepageData = {
  hero: HeroData;
  trustLogos: TrustLogosData;
  problem: ProblemData;
  manifesto: ManifestoData;
  process: ProcessData;
  services: ServicesData;
  results: ResultsData;
  caseStudies: CaseStudiesData;
  testimonials: TestimonialsData;
  faq: FaqData;
  finalCta: FinalCtaData;
};

export type NavLinkData = {
  label: string;
  href: string;
};

export type NavigationData = {
  links: NavLinkData[];
  ctaLabel: string;
  ctaHref: string;
};

export type FooterLinkData = {
  label: string;
  href: string;
};

export type SocialLinkData = {
  platform: string;
  url: string;
};

export type FooterData = {
  blurb: string;
  serviceLinks: FooterLinkData[];
  legalLinks: FooterLinkData[];
  socialLinks: SocialLinkData[];
};

export type SiteSettingsData = {
  siteName: string;
  tagline: string;
  description: string;
  url: string;
  contactEmail: string;
  sameAs: string[];
};

export type SEOSettingsData = {
  defaultTitle: string;
  defaultDescription: string;
  keywords: string[];
  ogImageAlt: string;
  twitterHandle: string;
  robotsIndex: boolean;
  robotsFollow: boolean;
};

// --- Blog ---

/** Raw Lexical document shape, reused from the generated Payload type so it can never drift. */
export type LexicalContent = import("@/payload-types").Post["content"];

export type MediaImageData = {
  url: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type AuthorSummaryData = {
  id: number;
  name: string;
  slug: string;
  role: string;
  avatar: MediaImageData | null;
};

export type AuthorData = AuthorSummaryData & {
  bio: string;
};

export type CategoryData = {
  id: number;
  title: string;
  slug: string;
  description: string;
};

export type TagData = {
  id: number;
  title: string;
  slug: string;
};

export type PostSummaryData = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage: MediaImageData | null;
  category: CategoryData | null;
  tags: TagData[];
  author: AuthorSummaryData | null;
  publishedDate: string | null;
  featured: boolean;
  readingTime: number;
};

export type PostSeoData = {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: MediaImageData | null;
  twitterImage: MediaImageData | null;
};

export type PostData = PostSummaryData & {
  content: LexicalContent;
  updatedAt: string;
  seo: PostSeoData;
};

export type PaginatedPosts = {
  docs: PostSummaryData[];
  totalDocs: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type PortfolioContent = import("@/payload-types").Portfolio["caseStudyContent"];

export type PortfolioThumbnail = {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
} | null;

export type PortfolioSummaryData = {
  id: number;
  title: string;
  client: string;
  slug: string;
  featured: boolean;
  mediaType: "image" | "video";
  category: string;
  resultHeadline: string;
  description: string;
  services: string[];
  thumbnail: PortfolioThumbnail;
  liveWebsite: string;
  sortOrder: number;
  publishedAt: string | null;
};

export type PortfolioItemData = PortfolioSummaryData & {
  videoUrl: string;
  caseStudyContent: PortfolioContent;
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    metaImage: string;
  };
};
