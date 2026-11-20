import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { Container } from "@/components/ui/Container";
import type { PublicContent } from "@/lib/content/public-content";
import { media } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about/" },
  { label: "Tax Preparation", href: "/tax-preparation/" },
  { label: "Notary Services", href: "/notary-services/" },
  { label: "Business Support", href: "/business-support/" },
  { label: "Book Appointment", href: "/book-appointment/" },
];

const resourceLinks = [
  { label: "Tax Reminders", href: "/resources/" },
  { label: "Forms & Documents", href: "/resources/" },
  { label: "FAQs", href: "/resources/" },
  { label: "Refer & Earn", href: "/resources/" },
  { label: "Newsletter", href: "/#newsletter" },
];

export function Footer({ content }: { content: PublicContent }) {
  const year = 2026;

  return (
    <footer>
      <div className="bg-brand-navy text-white">
        <Container className="grid gap-8 py-10 text-center sm:gap-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr_0.85fr_1fr_1.15fr] lg:gap-8 lg:text-left xl:gap-10">
          <div className="flex flex-col items-center sm:col-span-2 lg:col-span-1 lg:items-start">
            <Logo variant="footer" tone="light" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/75">
              Professional tax preparation and notary services for individuals,
              families, and businesses.
            </p>
            <SocialLinks
              className="mt-5 justify-center lg:justify-start [&_a]:h-10 [&_a]:w-10"
              tone="light"
            />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:contents">
            <div>
              <h3 className="text-sm font-bold text-brand-gold">Quick Links</h3>
              <ul className="mt-4 space-y-2.5">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-brand-gold">Resources</h3>
              <ul className="mt-4 space-y-2.5">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/80 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-brand-gold">Contact Us</h3>
            <ul className="mt-4 space-y-4 text-sm text-white/80">
              <li>
                <a
                  href={`tel:${content.phoneTel}`}
                  className="inline-flex min-h-11 items-start justify-center gap-3 transition-colors hover:text-white lg:justify-start"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                  <span>{content.phoneDisplay}</span>
                </a>
              </li>
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                <span className="min-w-0 text-left">
                  {content.address.line1}
                  <br />
                  {content.address.line2}
                </span>
              </li>
              <li className="flex items-start justify-center gap-3 lg:justify-start">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-gold" aria-hidden />
                <span className="min-w-0 text-left">
                  {content.mailingAddress.line1}
                  <br />
                  {content.mailingAddress.line2}
                </span>
              </li>
            </ul>
          </div>

          <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl lg:mx-0 lg:max-w-none">
            <Image
              src={media.footerJacksonville.src}
              alt={media.footerJacksonville.alt}
              width={1200}
              height={675}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 280px"
            />
          </div>
        </Container>
      </div>

      <div className="bg-[#6b1a3a] text-white">
        <Container className="flex flex-col items-center gap-3 py-4 text-center text-xs text-white/90 sm:flex-row sm:items-center sm:justify-between sm:text-left sm:text-sm">
          <p className="m-0">
            © {year} {siteConfig.legalName}. All Rights Reserved.
          </p>
          <ul className="m-0 flex list-none flex-wrap items-center justify-center gap-x-3 gap-y-2 p-0 sm:justify-end">
            <li>
              <Link href="/privacy-policy/" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li className="text-white/40" aria-hidden="true">
              |
            </li>
            <li>
              <Link href="/terms/" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li className="text-white/40" aria-hidden="true">
              |
            </li>
            <li>
              <Link href="/admin/" className="hover:text-white">
                Admin
              </Link>
            </li>
          </ul>
        </Container>
      </div>
    </footer>
  );
}
