import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Genesis Tax & Notary Solutions in Jacksonville, FL by phone, email, or message.",
};

export default async function ContactPage() {
  const content = await getPublicContent();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in Touch"
        description="Reach out by phone, email, or the form below. We will respond as soon as we can."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <section className="bg-white py-10 sm:py-20">
        <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-brand-navy sm:text-4xl">
              Office details
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-slate sm:mt-5 sm:text-lg">
              Call, email, or send a message. Appointments are available in
              person and virtually.
            </p>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4">
              <article className="border border-brand-navy/10 bg-brand-ivory p-4 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                  Phone
                </h3>
                <a
                  href={`tel:${content.phoneTel}`}
                  className="mt-3 inline-flex min-h-11 items-center text-lg text-brand-navy transition-colors hover:text-brand-pink"
                >
                  {content.phoneDisplay}
                </a>
                <p className="mt-1 text-sm text-brand-slate">
                  Fax: {content.faxDisplay}
                </p>
              </article>

              <article className="border border-brand-navy/10 bg-brand-ivory p-4 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                  Email
                </h3>
                <a
                  href={`mailto:${content.email}`}
                  className="mt-3 inline-block break-all text-base text-brand-navy transition-colors hover:text-brand-pink sm:text-lg"
                >
                  {content.email}
                </a>
              </article>

              <article className="border border-brand-navy/10 bg-brand-ivory p-4 sm:col-span-2 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                  Office
                </h3>
                <p className="mt-3 text-sm text-brand-navy sm:text-base">
                  {content.address.line1}
                  <br />
                  {content.address.line2}
                </p>
                <p className="mt-2 text-sm text-brand-slate">
                  {content.address.note}
                </p>
              </article>

              <article className="border border-brand-navy/10 bg-brand-ivory p-4 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                  Mailing
                </h3>
                <p className="mt-3 text-sm text-brand-navy sm:text-base">
                  {content.mailingAddress.line1}
                  <br />
                  {content.mailingAddress.line2}
                </p>
              </article>

              <article className="border border-brand-navy/10 bg-brand-ivory p-4 sm:p-6">
                <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                  Hours
                </h3>
                <p className="mt-3 text-sm text-brand-navy sm:text-base">
                  By appointment
                </p>
                <p className="mt-1 text-sm text-brand-slate">
                  Contact us for availability
                </p>
              </article>
            </div>

            <div className="mt-8 sm:mt-10">
              <Link
                href="/book-appointment/"
                className="inline-flex w-full items-center justify-center bg-brand-pink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark sm:w-auto"
              >
                Book an Appointment
              </Link>
            </div>
          </div>

          <div className="bg-brand-ivory p-4 sm:p-8 lg:p-10">
            <h2 className="font-display text-2xl text-brand-navy sm:text-4xl">
              Send a message
            </h2>
            <p className="mt-4 text-base leading-relaxed text-brand-slate">
              Tell us what you need and the best way to reach you. We will
              follow up shortly.
            </p>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
