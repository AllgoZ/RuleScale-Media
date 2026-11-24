/**
 * Primary navigation (header). Deliberately short. The complete link set
 * (including Influencers and FAQ) still comes from the CMS `navigation` global
 * and is rendered in the footer, so no existing destination is lost.
 * Anchors keep their original ids (#case-studies, #services, #process).
 */
export const PRIMARY_NAV = [
  { label: "Work", href: "/#case-studies" },
  { label: "Services", href: "/#services" },
  { label: "Videos", href: "/work/videos" },
  { label: "Process", href: "/#process" },
  { label: "Blog", href: "/blog" },
] as const;

export const PRIMARY_CTA = { label: "Start a project", href: "/contact" } as const;
