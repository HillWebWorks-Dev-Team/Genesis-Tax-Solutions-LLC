import { SectionHeading } from "@/components/ui/SectionHeading";
import { Container } from "@/components/ui/Container";
import {
  ServicesCarousel,
  type ServiceSlide,
} from "@/components/home/ServicesCarousel";
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

  const slides: ServiceSlide[] = content.services.map((service) => {
    const image = serviceMedia[service.slug as keyof typeof serviceMedia];
    return {
      slug: service.slug,
      title: service.title,
      summary: service.summary,
      href: service.href,
      image: {
        src: image.src,
        alt: image.alt,
      },
    };
  });

  return (
    <section className="bg-brand-ivory py-12 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Comprehensive Tax & Notary Solutions"
          description="Clear support for everyday tax needs, notary appointments, and IRS correspondence, designed around convenience and personal attention."
        />

        <ServicesCarousel services={slides} />
      </Container>
    </section>
  );
}
