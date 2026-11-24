import { Briefcase, Camera, Play, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/doodles/logo-mark";
import { Container } from "@/components/ui/container";
import type { FooterData, NavLinkData } from "@/lib/cms/types";
import { WHATSAPP_DISPLAY, WHATSAPP_URL } from "@/lib/contact";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Camera,
  linkedin: Briefcase,
  youtube: Play,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  youtube: "YouTube",
};

/** A CMS link that still holds the "/#top" placeholder goes nowhere useful — don't render it. */
const isRealExternalUrl = (url: string) => /^https?:\/\//i.test(url);
const isRealLink = (href: string) => Boolean(href) && !href.startsWith("/#top");

function dedupeByLabel<T extends { label: string }>(links: T[]): T[] {
  const seen = new Set<string>();
  return links.filter((link) => {
    const key = link.label.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function Footer({
  footer,
  companyLinks,
  siteName,
  contactEmail,
}: {
  footer: FooterData;
  companyLinks: NavLinkData[];
  siteName: string;
  contactEmail: string;
}) {
  const year = new Date().getFullYear();
  const socials = footer.socialLinks.filter((social) => isRealExternalUrl(social.url));
  const legal = footer.legalLinks.filter((link) => isRealLink(link.href));

  return (
    <footer id="site-footer" className="on-ink pt-16 md:pt-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-4">
            <Link
              href="/#top"
              className="flex items-center gap-2.5 font-heading text-xl font-extrabold tracking-tight"
            >
              <span aria-hidden="true">
                <LogoMark size={32} inverted />
              </span>
              {siteName}
            </Link>
            <p className="muted mt-5 max-w-xs text-[15px] leading-relaxed">{footer.blurb}</p>
          </div>

          <nav aria-label="Services" className="lg:col-span-2 lg:col-start-6">
            <p className="eyebrow">Services</p>
            <ul className="mt-5 flex flex-col gap-3">
              {dedupeByLabel(footer.serviceLinks).map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-[15px] text-paper/75 transition-colors hover:text-white"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company" className="lg:col-span-2">
            <p className="eyebrow">Company</p>
            <ul className="mt-5 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-paper/75 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow">Contact</p>
            <ul className="mt-5 flex flex-col gap-3 text-[15px]">
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-paper/75 transition-colors hover:text-white"
                >
                  {contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper/75 transition-colors hover:text-white"
                >
                  WhatsApp {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-paper/75 transition-colors hover:text-white">
                  Contact form
                </Link>
              </li>
            </ul>
            {socials.length ? (
              <div className="mt-6 flex items-center gap-3">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.platform] ?? Camera;
                  const label = SOCIAL_LABELS[social.platform] ?? social.platform;
                  return (
                    <a
                      key={social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline-light text-paper/75 transition-colors hover:border-paper hover:text-white"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 py-8 text-sm text-paper/60 md:flex-row md:items-center">
          <p>
            © {year} {siteName}. All rights reserved.
          </p>
          {legal.length ? (
            <ul className="flex items-center gap-6">
              {legal.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {/* Decorative wordmark, sized to the container (never wider than it). */}
        <div
          aria-hidden="true"
          className="select-none overflow-hidden whitespace-nowrap pb-4 text-center font-heading text-[min(9.6vw,8.6rem)] font-extrabold leading-[0.82] tracking-[-0.05em] text-paper/[0.07]"
        >
          {siteName}
        </div>
      </Container>
    </footer>
  );
}
