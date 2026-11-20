import type { Metadata } from "next";
import { BookingForm } from "@/components/booking/BookingForm";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { getAvailabilitySnapshot } from "@/lib/availability";
import { getPublicContent } from "@/lib/content/public-content";

export const metadata: Metadata = {
  title: "Book Appointment",
  description:
    "Request a tax preparation, notary, or business support appointment with Genesis Tax & Notary Solutions in Jacksonville, FL.",
};

export default async function BookAppointmentPage() {
  const [content, availability] = await Promise.all([
    getPublicContent(),
    getAvailabilitySnapshot(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Appointments"
        title="Book Your Appointment"
        description="Choose a service and preferred time. We will review availability and confirm your appointment."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Book Appointment" },
        ]}
      />

      <section className="bg-brand-ivory py-8 sm:py-20">
        <Container className="grid items-start gap-6 sm:gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="bg-white p-4 sm:p-8 lg:p-10">
            <h2 className="font-display text-2xl text-brand-navy sm:text-4xl">
              Request a time
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-slate sm:text-base">
              Fill out the short form below. We will follow up to confirm your
              appointment. No Social Security numbers or tax documents are needed
              here.
            </p>
            <div className="mt-8">
              <BookingForm
                services={content.services.map((service) => ({
                  slug: service.slug,
                  title: service.title,
                  summary: service.summary,
                }))}
                rules={availability.rules.map((rule) => ({
                  weekday: rule.weekday,
                  startTime: rule.startTime,
                  endTime: rule.endTime,
                  active: rule.active,
                }))}
                blockedDates={availability.blockedDates.map((item) => ({
                  date: item.date,
                }))}
                busyAppointments={availability.busyAppointments}
              />
            </div>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-28">
            <article className="border border-brand-navy/10 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                What happens next
              </h3>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed text-brand-slate">
                <li>1. Submit your preferred service and time.</li>
                <li>2. We review availability and follow up.</li>
                <li>3. You receive confirmation once the slot is set.</li>
              </ol>
            </article>

            <article className="border border-brand-navy/10 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                Prefer to call
              </h3>
              <a
                href={`tel:${content.phoneTel}`}
                className="mt-3 inline-block text-lg text-brand-navy transition-colors hover:text-brand-pink"
              >
                {content.phoneDisplay}
              </a>
              <p className="mt-2 text-sm text-brand-slate">
                Or email{" "}
                <a
                  href={`mailto:${content.email}`}
                  className="text-brand-navy transition-colors hover:text-brand-pink"
                >
                  {content.email}
                </a>
              </p>
            </article>

            <article className="border border-brand-navy/10 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
                Office
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-navy">
                {content.address.line1}
                <br />
                {content.address.line2}
              </p>
              <p className="mt-2 text-sm text-brand-slate">
                {content.address.note}
              </p>
            </article>
          </aside>
        </Container>
      </section>
    </>
  );
}
