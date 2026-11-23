import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/content/PageHero";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";
import { media } from "@/lib/media";

export const metadata: Metadata = {
  title: "About",
  description:
    "Meet Maxcieen Telford of Genesis Tax & Notary Solutions in Jacksonville, Florida.",
};

export default async function AboutPage() {
  const content = await getPublicContent();
  const paragraphs = content.aboutBody
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const portraitSrc =
    content.aboutPortraitImage || media.standingPortrait.src;

  return (
    <>
      <PageHero
        eyebrow="About"
        title={`Meet ${content.ownerName}`}
        description={`${content.ownerTitle} serving individuals, families, and small businesses from Jacksonville, FL.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      <section className="bg-white py-10 sm:py-20">
        <Container className="grid items-start gap-8 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden bg-brand-navy/5">
            <Image
              src={portraitSrc}
              alt={media.standingPortrait.alt}
              width={900}
              height={1100}
              className="aspect-[4/5] h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="lg:pt-4">
            <h2 className="font-display text-[1.85rem] text-brand-navy sm:text-4xl">
              {content.aboutHeadline}
            </h2>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-brand-slate sm:mt-6 sm:space-y-5 sm:text-lg">
              {paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 border-t border-brand-navy/10 pt-6 sm:mt-10 sm:pt-8">
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
              <a
                href={`tel:${content.phoneTel}`}
                className="mt-4 inline-flex min-h-11 items-center text-base text-brand-navy transition-colors hover:text-brand-pink"
              >
                {content.phoneDisplay}
              </a>
            </div>

            <div className="mt-8 sm:mt-10">
              <Link
                href="/contact/"
                className="inline-flex w-full items-center justify-center bg-brand-pink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark sm:w-auto"
              >
                Contact the office
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-brand-ivory py-10 sm:py-20">
        <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-[1.85rem] text-brand-navy sm:text-4xl">
              Personal service, practical results
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-brand-slate sm:mt-5 sm:text-lg">
              From tax season filings to notary appointments, every engagement
              is handled with care, clarity, and respect for your time.
            </p>
          </div>
          <div className="overflow-hidden bg-brand-navy/5">
            <Image
              src={media.aboutPortraitAlt.src}
              alt={media.aboutPortraitAlt.alt}
              width={900}
              height={1000}
              className="aspect-[5/4] h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
