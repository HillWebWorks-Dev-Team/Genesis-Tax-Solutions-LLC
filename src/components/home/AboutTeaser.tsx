import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getPublicContent } from "@/lib/content/public-content";
import { media } from "@/lib/media";

const highlights = [
  "Clear communication and organized filing support",
  "In-office and virtual appointments",
  "Mobile and in-office notary options",
  "Year-round guidance beyond tax season",
];

export async function AboutTeaser() {
  const content = await getPublicContent();
  const portraitSrc =
    content.aboutPortraitImage || media.aboutPortrait.src;

  return (
    <section className="bg-white py-12 sm:py-24">
      <Container className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-brand-pink">
            About
          </p>
          <h2 className="mt-3 font-display text-[1.85rem] leading-tight text-brand-navy sm:mt-4 sm:text-4xl lg:text-5xl">
            Meet {content.ownerName}
          </h2>
          <p className="mt-2 text-base text-brand-slate sm:text-lg">
            {content.ownerTitle}
          </p>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-brand-slate sm:text-lg">
            {content.aboutTeaser}
          </p>

          <ul className="mt-8 space-y-3">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-brand-navy sm:text-base"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-pink"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 sm:mt-9">
            <Link
              href="/about/"
              className="inline-flex min-h-12 items-center justify-center bg-brand-navy px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-navy-light"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="overflow-hidden bg-brand-navy/5">
            <Image
              src={portraitSrc}
              alt={media.aboutPortrait.alt}
              width={900}
              height={1000}
              className="aspect-[4/5] h-auto w-full object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
