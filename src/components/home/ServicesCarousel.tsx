"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ServiceSlide = {
  slug: string;
  title: string;
  summary: string;
  href: string;
  image: {
    src: string;
    alt: string;
  };
};

export function ServicesCarousel({ services }: { services: ServiceSlide[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;

    const slides = Array.from(track.children) as HTMLElement[];
    if (!slides.length) return;

    const center = track.scrollLeft + track.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(slideCenter - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    });

    setIndex(nearest);
    setCanPrev(track.scrollLeft > 8);
    setCanNext(
      track.scrollLeft + track.clientWidth < track.scrollWidth - 8,
    );
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    syncFromScroll();
    track.addEventListener("scroll", syncFromScroll, { passive: true });
    window.addEventListener("resize", syncFromScroll);

    return () => {
      track.removeEventListener("scroll", syncFromScroll);
      window.removeEventListener("resize", syncFromScroll);
    };
  }, [syncFromScroll, services.length]);

  const scrollToIndex = (nextIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[nextIndex] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  const go = (direction: -1 | 1) => {
    const next = Math.min(
      services.length - 1,
      Math.max(0, index + direction),
    );
    scrollToIndex(next);
  };

  return (
    <div className="relative mt-8 sm:mt-12">
      <ul
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 [&::-webkit-scrollbar]:hidden"
        aria-label="Services"
      >
        {services.map((service) => (
          <li
            key={service.slug}
            className="group flex w-[min(18.5rem,82vw)] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-brand-navy/8 bg-white shadow-[0_12px_40px_-24px_rgba(7,27,58,0.35)] transition-transform duration-300 sm:w-[min(22rem,46vw)] sm:rounded-3xl xl:w-[min(20rem,23vw)]"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-brand-navy">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                fill
                sizes="(max-width: 640px) 82vw, (max-width: 1280px) 46vw, 23vw"
                className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-1 flex-col p-4 sm:p-5">
              <h3 className="font-display text-lg text-brand-navy sm:text-xl">
                {service.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-slate sm:mt-3">
                {service.summary}
              </p>
              <Link
                href={service.href}
                className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-brand-pink transition-colors hover:text-brand-pink-dark sm:mt-5"
              >
                Learn more
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-6">
        <div className="flex items-center gap-2" role="tablist" aria-label="Service slides">
          {services.map((service, i) => (
            <button
              key={service.slug}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${service.title}`}
              onClick={() => scrollToIndex(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === index
                  ? "w-7 bg-brand-pink"
                  : "w-2.5 bg-brand-navy/20 hover:bg-brand-navy/35",
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous service"
            disabled={!canPrev}
            onClick={() => go(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next service"
            disabled={!canNext}
            onClick={() => go(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
