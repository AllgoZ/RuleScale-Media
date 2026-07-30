import type { GlobalConfig } from "payload";
import { CACHE_TAGS } from "@/lib/cache/tags";
import { isAdminOrEditor } from "../access";
import { revalidateTagSafely } from "../hooks/revalidate";

const SERVICE_ICON_OPTIONS = [
  { label: "Layout", value: "layout" },
  { label: "Search", value: "search" },
  { label: "Target", value: "target" },
  { label: "Share", value: "share-2" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Video", value: "video" },
  { label: "Pen line", value: "pen-line" },
  { label: "Compass", value: "compass" },
  { label: "Megaphone", value: "megaphone" },
  { label: "Bar chart", value: "bar-chart-3" },
  { label: "Globe", value: "globe" },
  { label: "Lightbulb", value: "lightbulb" },
];

export const Homepage: GlobalConfig = {
  slug: "homepage",
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  admin: {
    preview: () => {
      const params = new URLSearchParams({
        path: "/",
        previewSecret: process.env.PREVIEW_SECRET || "",
      });
      return `/next/preview?${params.toString()}`;
    },
  },
  hooks: {
    afterChange: [
      () => {
        revalidateTagSafely(CACHE_TAGS.homepage);
      },
    ],
  },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Hi, we're RuleScale Media" },
        { name: "headingPrefix", type: "text", defaultValue: "We grow brands" },
        { name: "headingHighlight", type: "text", defaultValue: "people remember." },
        {
          name: "subheading",
          type: "textarea",
          defaultValue:
            "Marketing that actually moves businesses. We pair sharp strategy with website design, SEO, social, influencer, and video production — so growth isn't left to chance.",
        },
        {
          name: "primaryCta",
          type: "group",
          fields: [
            { name: "label", type: "text", defaultValue: "Start Growing" },
            { name: "href", type: "text", defaultValue: "/#final-cta" },
          ],
        },
        {
          name: "secondaryCta",
          type: "group",
          fields: [
            { name: "label", type: "text", defaultValue: "See Our Work" },
            { name: "href", type: "text", defaultValue: "/#case-studies" },
          ],
        },
        {
          name: "trustLine",
          type: "text",
          defaultValue: "Trusted by 250+ brands across DTC, hospitality, SaaS, and retail.",
        },
      ],
    },
    {
      name: "trustLogos",
      type: "group",
      fields: [
        {
          name: "label",
          type: "text",
          defaultValue: "Our clients have been featured on",
        },
        {
          name: "logos",
          type: "array",
          defaultValue: [
            { name: "Google" },
            { name: "Meta" },
            { name: "LinkedIn" },
            { name: "Shopify" },
            { name: "HubSpot" },
            { name: "TikTok" },
            { name: "YouTube" },
          ],
          fields: [{ name: "name", type: "text", required: true }],
        },
      ],
    },
    {
      name: "problem",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "The problem" },
        { name: "heading", type: "text", defaultValue: "Sound familiar?" },
        {
          name: "cards",
          type: "array",
          defaultValue: [
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
          ],
          fields: [
            { name: "tag", type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "highlight", type: "text" },
            { name: "note", type: "text" },
            { name: "rotate", type: "number", defaultValue: 0 },
          ],
        },
      ],
    },
    {
      name: "manifesto",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "About" },
        {
          name: "lines",
          type: "array",
          defaultValue: [
            { line: "Most agencies sell activity." },
            { line: "We sell the moment someone" },
            { line: "remembers your name." },
          ],
          fields: [{ name: "line", type: "text", required: true }],
        },
        {
          name: "note",
          type: "text",
          defaultValue: "That's the only metric that compounds.",
        },
      ],
    },
    {
      name: "process",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Process" },
        { name: "heading", type: "text", defaultValue: "A plan, not a guess." },
        {
          name: "description",
          type: "text",
          defaultValue: "Five steps, every time — so you always know what happens next and why.",
        },
        {
          name: "steps",
          type: "array",
          minRows: 5,
          maxRows: 5,
          defaultValue: [
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
          ],
          fields: [
            { name: "step", type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "services",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Services" },
        { name: "heading", type: "text", defaultValue: "One team. Every channel." },
        {
          name: "description",
          type: "text",
          defaultValue:
            "Pick a single service, or hand us the whole growth engine. Tap any line to see what it actually includes.",
        },
        {
          name: "items",
          type: "array",
          defaultValue: [
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
          ],
          fields: [
            { name: "title", type: "text", required: true },
            { name: "note", type: "text" },
            { name: "description", type: "textarea", required: true },
            {
              name: "icon",
              type: "select",
              required: true,
              options: SERVICE_ICON_OPTIONS,
            },
          ],
        },
      ],
    },
    {
      name: "results",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Proof" },
        { name: "heading", type: "text", defaultValue: "Growth you can measure." },
        {
          name: "note",
          type: "text",
          defaultValue:
            "Every engagement is measured against outcomes we agree on before we start — no vanity metrics.",
        },
        {
          name: "stats",
          type: "array",
          minRows: 4,
          maxRows: 4,
          defaultValue: [
            { value: 250, suffix: "+", label: "Projects delivered" },
            { value: 18, suffix: "M+", label: "Monthly reach generated" },
            { value: 5, suffix: "x", label: "Average client ROAS" },
            { value: 98, suffix: "%", label: "Client retention rate" },
          ],
          fields: [
            { name: "value", type: "number", required: true },
            { name: "suffix", type: "text" },
            { name: "label", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "caseStudies",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Case Studies" },
        { name: "heading", type: "text", defaultValue: "Recent work we're proud of." },
        {
          name: "items",
          type: "relationship",
          relationTo: "case-studies",
          hasMany: true,
        },
      ],
    },
    {
      name: "testimonials",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "Testimonials" },
        {
          name: "items",
          type: "relationship",
          relationTo: "testimonials",
          hasMany: true,
        },
      ],
    },
    {
      name: "faq",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", defaultValue: "FAQ" },
        { name: "heading", type: "text", defaultValue: "Everything you're wondering." },
        {
          name: "items",
          type: "array",
          defaultValue: [
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
          ],
          fields: [
            { name: "question", type: "text", required: true },
            { name: "answer", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "finalCta",
      type: "group",
      fields: [
        {
          name: "eyebrow",
          type: "text",
          defaultValue: "Get in touch",
        },
        {
          name: "heading",
          type: "text",
          defaultValue: "Ready to become the brand everyone remembers?",
        },
        {
          name: "subheading",
          type: "textarea",
          defaultValue:
            "Tell us where you're stuck. We'll tell you exactly how we'd fix it — no obligation, no jargon.",
        },
        {
          name: "cta",
          type: "group",
          fields: [
            { name: "label", type: "text", defaultValue: "Start Growing" },
            { name: "href", type: "text", defaultValue: "/contact" },
          ],
        },
      ],
    },
  ],
};
