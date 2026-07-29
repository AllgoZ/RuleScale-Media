import { Briefcase, Camera, Mail, Play, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/doodles/logo-mark";
import { Container } from "@/components/ui/container";
import type { FooterData, NavLinkData } from "@/lib/cms/types";

const SOCIAL_ICONS: Record<string, LucideIcon> = {
  instagram: Camera,
  linkedin: Briefcase,
  youtube: Play,
};

const SOCIAL_LABELS: Record<string, string> = {
  instagram: "Follow us on Instagram",
  linkedin: "Follow us on LinkedIn",
  youtube: "Subscribe on YouTube",
};

export function Footer({
  footer,
  companyLinks,
  siteName,
}: {
  footer: FooterData;
  companyLinks: NavLinkData[];
  siteName: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-hairline pt-16">
      <Container>
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link
              href="#top"
              className="flex items-center gap-2.5 font-heading text-xl font-extrabold text-ink"
            >
              <LogoMark size={28} />
              {siteName}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">{footer.blurb}</p>
            <div className="mt-6 flex items-center gap-3">
              {footer.socialLinks.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? Camera;
                const label = SOCIAL_LABELS[social.platform] ?? social.platform;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-ink"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Services
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {footer.serviceLinks.map((service) => (
                <li key={service.label}>
                  <Link
                    href={service.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Company
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Get in touch
            </p>
            <Link
              href="/contact"
              className="mt-4 flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <Mail size={16} />
              Contact us
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline py-8 text-sm text-ink-soft md:flex-row">
          <p>
            © {year} {siteName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footer.legalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  );
}
