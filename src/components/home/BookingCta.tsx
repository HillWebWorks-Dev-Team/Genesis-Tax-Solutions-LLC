import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export function BookingCta() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-14 text-white sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_80%_50%,rgba(201,155,85,0.18),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_10%_40%,rgba(233,30,130,0.12),transparent_50%)]"
      />

      <Container className="relative max-w-3xl text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-brand-gold">
          {siteConfig.brandName}
        </p>

        <h2 className="mt-4 font-display text-[1.85rem] leading-tight sm:mt-5 sm:text-5xl">
          Book your next appointment
          <span className="font-script mt-2 block text-3xl text-brand-gold sm:text-5xl">
            with confidence
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-lg">
          Tax preparation, notary services, and year-round support for
          individuals, families, and businesses in Jacksonville.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 sm:gap-5">
          <Link
            href="/book-appointment/"
            className="inline-flex w-full max-w-sm items-center justify-center bg-brand-pink px-8 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark sm:w-auto sm:min-w-[14rem]"
          >
            Book Appointment
          </Link>

          <p className="flex flex-col items-center gap-1 text-sm text-white/65 sm:block">
            <span>Questions?</span>
            <span>
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="text-brand-gold transition-colors hover:text-brand-gold-light"
              >
                {siteConfig.phoneDisplay}
              </a>
              <span className="hidden sm:inline">{" · "}</span>
              <span className="block sm:inline">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-brand-gold transition-colors hover:text-brand-gold-light"
                >
                  {siteConfig.email}
                </a>
              </span>
            </span>
          </p>
        </div>
      </Container>
    </section>
  );
}
