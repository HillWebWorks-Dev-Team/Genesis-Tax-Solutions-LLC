import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { PublicContent } from "@/lib/content/public-content";

export function OfficeMap({ content }: { content: PublicContent }) {
  const query = `${content.address.line1}, ${content.address.line2}`;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <section className="bg-white py-12 sm:py-20" aria-labelledby="office-map-heading">
      <Container className="grid items-center gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-pink">
            Find the office
          </p>
          <h2
            id="office-map-heading"
            className="mt-3 font-display text-[1.85rem] text-brand-navy sm:text-4xl"
          >
            Visit Genesis in Jacksonville
          </h2>
          <p className="mt-4 flex items-start gap-3 text-base text-brand-navy sm:text-lg">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-brand-pink" aria-hidden />
            <span>
              {content.address.line1}
              <br />
              {content.address.line2}
            </span>
          </p>
          {content.address.note ? (
            <p className="mt-3 text-sm leading-relaxed text-brand-slate sm:text-base">
              {content.address.note}
            </p>
          ) : null}
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold text-brand-pink underline-offset-4 hover:underline"
          >
            Open in Google Maps
          </a>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-brand-navy/10 bg-brand-ivory shadow-[0_24px_60px_-36px_rgba(7,27,58,0.45)]">
          <iframe
            title={`Map of ${content.address.line1}, ${content.address.line2}`}
            src={mapSrc}
            className="h-[18rem] w-full sm:h-[26rem]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
