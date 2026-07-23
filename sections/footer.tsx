import { Briefcase, Camera, Mail, Play } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/doodles/logo-mark";
import { Container } from "@/components/ui/container";
import { CONTACT_EMAIL, NAV_LINKS, SITE_NAME } from "@/lib/constants";

const SERVICE_LINKS = [
  "Website Design",
  "SEO",
  "Performance Marketing",
  "Social Media",
  "Video Production",
  "Brand Strategy",
];

export function Footer() {
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
              {SITE_NAME}
            </Link>
            <p className="mt-4 max-w-xs text-sm text-ink-soft">
              A full-service marketing agency for brands who want to be remembered, not just seen.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {[
                { Icon: Camera, label: "Follow us on Instagram" },
                { Icon: Briefcase, label: "Follow us on LinkedIn" },
                { Icon: Play, label: "Subscribe on YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#top"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
              Services
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <Link
                    href="#services"
                    className="text-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    {service}
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
              {NAV_LINKS.map((link) => (
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
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-ink"
            >
              <Mail size={16} />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-hairline py-8 text-sm text-ink-soft md:flex-row">
          <p>
            © {year} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#top" className="hover:text-ink">
              Privacy Policy
            </Link>
            <Link href="#top" className="hover:text-ink">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
