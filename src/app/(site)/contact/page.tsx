import type { Metadata } from "next";
import { Mail, Mailbox, MapPin, Phone, Printer } from "lucide-react";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Phone, fax, email, and office details for Genesis Tax & Notary Solutions in Jacksonville, FL.",
};

export default async function ContactPage() {
  const content = await getPublicContent();

  const methods: Array<{
    label: string;
    icon: typeof Phone;
    value: string;
    href?: string;
    note?: string;
  }> = [
    {
      label: "Phone",
      icon: Phone,
      value: content.phoneDisplay,
      href: `tel:${content.phoneTel}`,
    },
    {
      label: "Fax",
      icon: Printer,
      value: content.faxDisplay,
    },
    {
      label: "Email",
      icon: Mail,
      value: content.email,
      href: `mailto:${content.email}`,
    },
    {
      label: "Office",
      icon: MapPin,
      value: `${content.address.line1}, ${content.address.line2}`,
      note: content.address.note,
    },
    {
      label: "Mailing address",
      icon: Mailbox,
      value: `${content.mailingAddress.line1}, ${content.mailingAddress.line2}`,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Call, fax, email, or visit the Jacksonville office."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <section className="bg-white py-10 sm:py-16">
        <Container className="max-w-3xl">
          <ul className="divide-y divide-brand-navy/10 border border-brand-navy/10 bg-brand-ivory">
            {methods.map((method) => {
              const Icon = method.icon;
              const body = (
                <>
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-brand-pink">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                      {method.label}
                    </span>
                    <span className="mt-1 block text-base text-brand-navy sm:text-lg">
                      {method.value}
                    </span>
                    {method.note ? (
                      <span className="mt-1 block text-sm text-brand-slate">
                        {method.note}
                      </span>
                    ) : null}
                  </span>
                </>
              );

              return (
                <li key={method.label}>
                  {method.href ? (
                    <a
                      href={method.href}
                      className="flex items-start gap-4 px-4 py-5 transition-colors hover:bg-white sm:px-6"
                    >
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 px-4 py-5 sm:px-6">
                      {body}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border border-brand-navy/10 px-4 py-5 sm:px-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
              Social
            </h2>
            <SocialLinks
              tone="dark"
              className="mt-4 justify-start [&_a]:h-11 [&_a]:w-11"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
