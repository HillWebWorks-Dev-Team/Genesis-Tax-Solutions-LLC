import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { PageHero } from "@/components/content/PageHero";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";

export async function ServicePage({
  slug,
  bullets,
  image,
}: {
  slug: string;
  bullets: string[];
  image: { src: string; alt: string; width: number; height: number };
}) {
  const content = await getPublicContent();
  const service = content.services.find((item) => item.slug === slug);

  if (!service) return null;

  return (
    <>
      <PageHero
        eyebrow="Services"
        title={service.title}
        description={service.summary}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services" },
          { label: service.title },
        ]}
      />

      <section className="bg-brand-ivory py-12 sm:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="space-y-6 text-brand-slate">
            <p>{service.body}</p>
            <ul className="space-y-3">
              {bullets.map((item) => (
                <li key={item} className="flex items-start gap-3 text-brand-navy">
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-pink"
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Button href="/book-appointment/" size="lg">
              <CalendarDays className="h-4 w-4" aria-hidden />
              Book an Appointment
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-brand-navy/8 bg-brand-navy shadow-[0_20px_50px_-24px_rgba(7,27,58,0.45)]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
