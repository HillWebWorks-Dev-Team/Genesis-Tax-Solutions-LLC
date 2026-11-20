import Image from "next/image";
import { Gift, Handshake, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { media } from "@/lib/media";

const highlights = [
  {
    title: "$40 referral reward",
    description: "Earn for every qualifying new tax preparation client.",
    Icon: Gift,
  },
  {
    title: "Easy to share",
    description: "Introduce friends and family to service they can trust.",
    Icon: Handshake,
  },
  {
    title: "Clear program terms",
    description: "Ask us for current details when you book or contact the office.",
    Icon: ShieldCheck,
  },
];

export function ReferralPromo() {
  return (
    <section
      className="bg-white py-16 sm:py-20"
      aria-labelledby="referral-heading"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-pink">
            Client Rewards
          </p>
          <h2
            id="referral-heading"
            className="mt-3 font-display text-3xl text-brand-navy sm:text-4xl"
          >
            Refer &amp; Earn with Genesis
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-brand-slate sm:text-lg">
            Great service is worth sharing. When someone you refer becomes a
            qualifying new client, you can earn a referral reward.
          </p>

          <ul className="mt-8 space-y-4">
            {highlights.map(({ title, description, Icon }) => (
              <li key={title} className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-base font-semibold text-brand-navy">
                    {title}
                  </span>
                  <span className="mt-0.5 block text-sm text-brand-slate">
                    {description}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/resources/" variant="primary" size="lg">
              View Program Details
            </Button>
            <Button href="/contact/" variant="secondary" size="lg">
              Ask About Referring
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            aria-hidden
            className="absolute -inset-3 rounded-[2rem] bg-brand-gold/15 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-brand-navy/8 bg-brand-ivory shadow-[0_24px_60px_-34px_rgba(7,27,58,0.45)]">
            <Image
              src={media.referralPromo.src}
              alt={media.referralPromo.alt}
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
              sizes="(max-width: 1024px) 100vw, 480px"
            />
          </div>
          <p className="mt-3 text-center text-xs text-brand-slate lg:text-left">
            Program terms apply. Ask us for current qualifying details.
          </p>
        </div>
      </Container>
    </section>
  );
}
