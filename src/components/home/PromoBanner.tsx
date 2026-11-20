import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { PublicContent } from "@/lib/content/public-content";

export function PromoBanner({ content }: { content: PublicContent }) {
  if (!content.promoEnabled) return null;

  return (
    <section className="bg-brand-navy py-10 text-white sm:py-12">
      <Container className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-brand-gold">
            Featured
          </p>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl">
            {content.promoHeading}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
            {content.promoText}
          </p>
          <Link
            href={content.promoLinkHref}
            className="mt-6 inline-flex bg-brand-pink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark"
          >
            {content.promoLinkLabel}
          </Link>
        </div>
        {content.promoImage ? (
          <div className="relative aspect-[16/10] overflow-hidden bg-white/5">
            <Image
              src={content.promoImage}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
