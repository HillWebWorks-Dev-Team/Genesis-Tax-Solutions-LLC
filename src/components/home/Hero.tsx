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

function HeroIntro() {
  return (
    <div className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:max-w-[34rem] lg:text-left xl:max-w-[38rem]">
      <p className="mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-brand-gold sm:mb-4 sm:text-[0.68rem] sm:tracking-[0.28em]">
        {siteConfig.legalName}
      </p>

      <h1 className="font-display text-[1.7rem] leading-[1.15] text-white sm:text-4xl lg:text-[2.55rem] xl:text-[2.85rem]">
        Professional Tax Preparation &amp; Notary Services in{" "}
        <span className="font-script mt-1 block text-[2.1rem] leading-none text-brand-gold sm:text-5xl lg:mt-1 lg:text-[3.35rem]">
          Jacksonville, FL
        </span>
      </h1>

      <p className="mt-4 text-sm leading-relaxed text-white/85 sm:mt-5 sm:text-base lg:max-w-[32rem]">
        Trusted, accurate, and convenient tax and notary solutions for
        individuals, families, and businesses, with personalised service and
        year-round support.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:justify-center lg:justify-start">
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
    </div>
  );
}

function HeroMeta() {
  return (
    <div className="relative z-10 mx-auto max-w-xl lg:mx-0 lg:max-w-[34rem] xl:max-w-[38rem]">
      <ul className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-7 sm:gap-y-4 lg:justify-start">
        {highlights.map(({ label, Icon }) => (
          <li
            key={label}
            className="flex flex-col items-center gap-2 text-center sm:flex-row sm:gap-2.5 sm:text-left"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold shadow-[0_0_24px_rgba(201,155,85,0.18)] sm:h-9 sm:w-9">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-[0.68rem] font-medium leading-snug tracking-wide text-white/90 sm:text-sm">
              {label}
            </span>
          </li>
        ))}
      </ul>

      <SocialLinks
        className="mt-5 justify-center gap-2.5 sm:mt-7 sm:gap-3.5 lg:justify-start [&_a]:h-10 [&_a]:w-10 sm:[&_a]:h-12 sm:[&_a]:w-12 md:[&_a]:h-14 md:[&_a]:w-14"
        iconClassName="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
        tone="light"
      />
    </div>
  );
}

function HeroPortrait({ imageSrc }: { imageSrc?: string }) {
  const src = imageSrc || media.heroPortrait.src;

  return (
    <div className="relative mx-auto w-full max-w-[18rem] sm:max-w-[24rem] lg:max-w-none">
      <div
        aria-hidden
        className="absolute left-1/2 top-[40%] h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,155,85,0.45)_0%,rgba(233,30,130,0.12)_42%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] hidden h-[86%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/50 shadow-[0_0_60px_rgba(201,155,85,0.2)] sm:block"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] hidden h-[94%] w-[94%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-gold/25 sm:block"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-[46%] hidden h-[102%] w-[102%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-pink/15 sm:block"
      />

      <div className="relative overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)] sm:rounded-[1.75rem]">
        <Image
          src={src}
          alt={media.heroPortrait.alt}
          width={1086}
          height={1448}
          priority
          className="h-auto w-full object-contain"
          sizes="(max-width: 640px) 72vw, (max-width: 1024px) 85vw, 44vw"
        />
      </div>
    </div>
  );
}

function HeroAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(145deg,#040d1f_0%,#071b3a_42%,#123057_72%,#071b3a_100%)]" />
      <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-brand-pink/25 blur-3xl sm:h-96 sm:w-96 sm:bg-brand-pink/30" />
      <div className="absolute right-[-5rem] top-6 h-64 w-64 rounded-full bg-brand-gold/22 blur-3xl sm:h-[28rem] sm:w-[28rem] sm:bg-brand-gold/28" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,13,31,0.45)_100%)]" />
    </div>
  );
}

export function Hero({ imageSrc }: { imageSrc?: string } = {}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-navy text-white">
      <HeroAtmosphere />

      <Container className="relative grid items-center gap-6 py-8 sm:gap-10 sm:py-12 lg:grid-cols-[1.05fr_0.95fr] lg:grid-rows-[auto_auto] lg:gap-x-8 lg:gap-y-8 lg:py-16 xl:gap-x-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <HeroIntro />
        </div>

        <div className="lg:col-start-1 lg:row-start-2">
          <HeroMeta />
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <HeroPortrait imageSrc={imageSrc} />
        </div>
      </Container>
    </section>
  );
}
