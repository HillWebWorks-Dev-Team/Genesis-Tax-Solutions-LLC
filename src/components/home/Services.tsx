import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";
import { media } from "@/lib/media";

const serviceMedia = {
  "tax-preparation": media.taxPrepBanner,
  "notary-services": media.notaryBanner,
  "business-support": media.businessBanner,
  "irs-tax-support": media.nationwideGraphic,
} as const;

export async function Services() {
  const content = await getPublicContent();

  return (
    <section className="bg-brand-ivory py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive Tax & Notary Solutions"
          description="Clear support for everyday tax needs, notary appointments, and IRS correspondence, designed around convenience and personal attention."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {content.services.map((service) => {
            const image =
              serviceMedia[service.slug as keyof typeof serviceMedia];
            return (
              <li
                key={service.slug}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-brand-navy/8 bg-white shadow-[0_12px_40px_-24px_rgba(7,27,58,0.35)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-navy">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1280px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl text-brand-navy">
                    {service.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-brand-slate">
                    {service.summary}
                  </p>
                  <Link
                    href={service.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-pink transition-colors hover:text-brand-pink-dark"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
