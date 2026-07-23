export const SITE_URL = "https://www.rulescalemedia.com";
export const SITE_NAME = "RuleScale Media";
export const SITE_TAGLINE = "We grow brands people remember.";
export const SITE_DESCRIPTION =
  "RuleScale Media is a full-service marketing agency for website design & development, SEO, social, influencer, video, and performance advertising — built to turn attention into revenue.";

export const CONTACT_EMAIL = "hello@rulescale.media";

export const NAV_LINKS = [
  { label: "Work", href: "#case-studies" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "FAQ", href: "#faq" },
] as const;

export const TRUST_LOGOS = [
  "Google",
  "Meta",
  "LinkedIn",
  "Shopify",
  "HubSpot",
  "TikTok",
  "YouTube",
] as const;

export const PROBLEM_CARDS = [
  {
    tag: "CHAOS",
    title: "My website gets traffic...",
    highlight: "but nobody converts.",
    note: "Pretty isn't the same as persuasive.",
    rotate: -3,
  },
  {
    tag: "BURNED",
    title: "I've tried agencies before.",
    highlight: "",
    note: "Big decks, vague reports, zero accountability.",
    rotate: 2,
  },
  {
    tag: "STUCK",
    title: "We post on social media...",
    highlight: "but nothing happens.",
    note: "Content without strategy is just noise.",
    rotate: -1,
  },
] as const;

export const MANIFESTO = {
  eyebrow: "why we exist",
  lines: [
    "Most agencies sell activity.",
    "We sell the moment someone",
    "remembers your name.",
  ],
  note: "That's the only metric that compounds.",
};

export const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discover",
    description:
      "We dig into your brand, customers, and competitors until we know what actually moves your market.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "A clear, written plan for channels, messaging, and budget — tied to real business goals, not vanity metrics.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Websites, creative, campaigns, and content get built with craft — nothing goes out half-finished.",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "We ship in public, watch the data from day one, and fix what needs fixing before it costs you money.",
  },
  {
    step: "05",
    title: "Scale",
    description:
      "Once something works, we double down — more budget, more channels, more of what's already winning.",
  },
] as const;

export const SERVICES = [
  {
    title: "Website Design",
    note: "make it click",
    description:
      "Fast, beautiful, conversion-first websites that make a stranger trust you in five seconds.",
    icon: "layout",
  },
  {
    title: "SEO",
    note: "get found",
    description:
      "Technical fixes, content, and links that move you up the page — and keep you there.",
    icon: "search",
  },
  {
    title: "Performance Marketing",
    note: "spend smarter",
    description:
      "Paid media across search, social, and programmatic, optimized toward real ROAS, not clicks.",
    icon: "target",
  },
  {
    title: "Social Media",
    note: "stay top of mind",
    description:
      "Strategy, content, and community management that turns followers into actual customers.",
    icon: "share-2",
  },
  {
    title: "Influencers",
    note: "borrow trust",
    description:
      "Creator partnerships matched to your brand — vetted, negotiated, and measured properly.",
    icon: "sparkles",
  },
  {
    title: "Video",
    note: "show, don't tell",
    description:
      "Scroll-stopping video for ads, social, and your site — shot, edited, and captioned to convert.",
    icon: "video",
  },
  {
    title: "Content",
    note: "earn attention",
    description:
      "Articles, guides, and assets that answer real questions and quietly do the selling for you.",
    icon: "pen-line",
  },
  {
    title: "Brand Strategy",
    note: "know your why",
    description:
      "Positioning, voice, and messaging so every channel sounds like the same confident brand.",
    icon: "compass",
  },
  {
    title: "Media Buying",
    note: "own the space",
    description:
      "Smart, negotiated placement across digital and programmatic inventory for maximum reach per dollar.",
    icon: "megaphone",
  },
  {
    title: "Analytics",
    note: "trust the numbers",
    description:
      "Dashboards and reporting that show exactly what's working — no vanity metrics, ever.",
    icon: "bar-chart-3",
  },
  {
    title: "Localization",
    note: "go global",
    description:
      "Multi-lingual campaigns and content adapted for culture, not just translated word for word.",
    icon: "globe",
  },
  {
    title: "Consulting",
    note: "think it through",
    description:
      "Hands-on marketing strategy for teams who need an expert in the room, not just an execution arm.",
    icon: "lightbulb",
  },
] as const;

export const RESULTS_STATS = [
  { value: 250, suffix: "+", label: "Projects delivered" },
  { value: 18, suffix: "M+", label: "Monthly reach generated" },
  { value: 5, suffix: "x", label: "Average client ROAS" },
  { value: 98, suffix: "%", label: "Client retention rate" },
] as const;

export const CASE_STUDIES = [
  {
    client: "Marlow & Finch",
    industry: "DTC Home Goods",
    result: "+312% organic traffic in 6 months",
    summary:
      "A full SEO and content rebuild turned a stagnant blog into the brand's #1 acquisition channel.",
    tags: ["SEO", "Content"],
  },
  {
    client: "Northbound Outfitters",
    industry: "Outdoor Retail",
    result: "4.8x ROAS on paid social",
    summary:
      "New creative direction plus tighter audience targeting cut acquisition cost nearly in half.",
    tags: ["Performance Marketing", "Video"],
  },
  {
    client: "Ferra Skincare",
    industry: "Beauty & Wellness",
    result: "2.1M organic reach in launch month",
    summary:
      "Creator partnerships and a rebuilt brand voice made a new product launch feel inevitable.",
    tags: ["Influencers", "Brand Strategy"],
  },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "They rebuilt our site in six weeks and our conversion rate doubled the same month. No fluff, just results.",
    name: "Priya Anand",
    title: "Founder, Marlow & Finch",
    rotate: -2,
  },
  {
    quote:
      "First agency that's ever shown me a report I actually understood — and trusted enough to act on.",
    name: "Devon Marsh",
    title: "CMO, Northbound Outfitters",
    rotate: 3,
  },
  {
    quote:
      "RuleScale treats our brand like it's theirs. That's rare, and it shows in the work.",
    name: "Elena Cho",
    title: "Co-founder, Ferra Skincare",
    rotate: -1,
  },
  {
    quote:
      "We've worked with three agencies before this one. RuleScale is the first that actually scaled with us.",
    name: "Marcus Webb",
    title: "VP Growth, Ferra Skincare",
    rotate: 2,
  },
] as const;

export const FAQS = [
  {
    question: "What does RuleScale Media actually specialize in?",
    answer:
      "Website design & development, SEO, social and influencer marketing, video and content production, programmatic and performance advertising, and the brand strategy that ties it all together. Most clients start with one channel and expand once we prove it out.",
  },
  {
    question: "How long until we see results?",
    answer:
      "Paid channels usually show early signal within 2-4 weeks. SEO and content compound over 3-6 months. We'll tell you the honest timeline for your specific goals before you sign anything.",
  },
  {
    question: "Do you work with our industry?",
    answer:
      "We've run campaigns across DTC, hospitality, SaaS, retail, and professional services. What matters more than industry is whether you have a real offer and the willingness to move fast — we'll tell you upfront if we're not the right fit.",
  },
  {
    question: "What makes RuleScale different from other agencies?",
    answer:
      "We're small enough that you talk to the people doing the work, and disciplined enough to report on real numbers instead of vanity metrics. No year-long contracts, no black-box reporting.",
  },
  {
    question: "How much should we budget?",
    answer:
      "It depends on channels and ambition. Most engagements start between $3,000-$15,000/month for services, separate from ad spend. We'll scope a plan around your actual goals, not a generic package.",
  },
  {
    question: "What's the contract length?",
    answer:
      "Month-to-month after an initial 90-day onboarding period. We keep clients by continuing to earn it, not by locking you in.",
  },
] as const;
