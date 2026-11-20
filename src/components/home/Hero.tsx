import Image from "next/image";
import {
  CalendarDays,
  Coins,
  Mail,
  MapPinned,
  Smartphone,
} from "lucide-react";
import { SocialLinks } from "@/components/brand/SocialLinks";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";
import { siteConfig } from "@/lib/site-config";

const highlights = [
  { label: "Mobile Notary", Icon: Smartphone },
  { label: "Tax Prep", Icon: Coins },
  { label: "Virtual & In-Person", Icon: MapPinned },
];

function HeroCopy() {
  return (
    <div className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[34rem] lg:text-left xl:max-w-[38rem]">
      <p className="mb-4 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-brand-gold sm:text-xs">
        {siteConfig.legalName}
      </p>

      <h1 className="font-display text-[1.85rem] leading-[1.12] text-white sm:text-4xl lg:text-[2.55rem] xl:text-[2.85rem]">
        Professional Tax Preparation &amp; Notary Services in{" "}
        <span className="font-script block text-[2.35rem] leading-none text-brand-gold sm:text-5xl lg:mt-1 lg:text-[3.35rem]">
          Jacksonville, FL
        </span>
      </h1>

      <p className="mt-5 text-sm leading-relaxed text-white/85 sm:text-base lg:max-w-[32rem]">
        Trusted, accurate, and convenient tax and notary solutions for
        individuals, families, and businesses, with personalised service and
        year-round support.
      </p>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
        <Button href="/book-appointment/" size="lg" className="w-full sm:w-auto">
          <CalendarDays className="h-4 w-4" aria-hidden />
          Book Appointment
        </Button>
        <Button
          href="/contact/"
          variant="outlineGold"
          size="lg"
          className="w-full sm:w-auto"
        >
          <Mail className="h-4 w-4" aria-hidden />
          Contact Us
        </Button>
      </div>

      <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 lg:justify-start">
        {highlights.map(({ label, Icon }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold shadow-[0_0_24px_rgba(201,155,85,0.18)]">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-xs font-medium tracking-wide text-white/90 sm:text-sm">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <SocialLinks
        className="mt-7 justify-center gap-3.5 lg:justify-start [&_a]:h-12 [&_a]:w-12 sm:[&_a]:h-14 sm:[&_a]:w-14"
        iconClassName="h-5 w-5 sm:h-6 sm:w-6"
        tone="light"
      />
    </div>
  );
}

function HeroPortrait({ imageSrc }: { imageSrc?: string }) {
  const src = imageSrc || media.heroPortrait.src;

  return (
    <div className="relative mx-auto w-full max-w-[22rem] sm:max-w-[26rem] lg:max-w-none">
      <div
        aria-hidden
        className="absolute left-1/2 top-[40%] h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,155,85,0.45)_0%,rgba(233,30,130,0.12)_42%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/50 shadow-[0_0_60px_rgba(201,155,85,0.2)]"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/25"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] h-[102%] w-[102%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-pink/15"
      />

      <div className="relative overflow-hidden rounded-[1.75rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]">
        <Image
          src={src}
          alt={media.heroPortrait.alt}
          width={1086}
          height={1448}
          priority
          className="h-auto w-full object-contain"
          sizes="(max-width: 1024px) 85vw, 44vw"
        />
      </div>
    </div>
  );
}

function HeroAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Depth gradient only - no photo textures */}
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#040d1f_0%,#071b3a_42%,#123057_72%,#071b3a_100%)]" />

      {/* Soft brand light blooms */}
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-brand-pink/30 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute right-[-5rem] top-6 h-80 w-80 rounded-full bg-brand-gold/28 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      <div className="absolute bottom-28 left-[28%] h-56 w-56 rounded-full bg-brand-pink/18 blur-3xl" />
      <div className="absolute bottom-16 right-[22%] h-44 w-64 rounded-full bg-brand-gold/16 blur-3xl" />

      {/* Soft vignette for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,13,31,0.45)_100%)]" />
    </div>
  );
}

export function Hero({ imageSrc }: { imageSrc?: string } = {}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <HeroAtmosphere />

      <Container className="relative grid items-center gap-10 py-12 sm:gap-12 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:py-16 xl:gap-10">
        <HeroCopy />
        <HeroPortrait imageSrc={imageSrc} />
      </Container>
    </section>
  );
}
