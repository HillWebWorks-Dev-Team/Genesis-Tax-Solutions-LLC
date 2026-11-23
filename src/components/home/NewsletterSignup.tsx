import { Mail, MessageSquareText } from "lucide-react";
import { SubscribeForm } from "@/components/signup/SubscribeForm";
import { Container } from "@/components/ui/Container";

export function NewsletterSignup() {
  return (
    <section
      id="newsletter"
      className="relative overflow-hidden bg-brand-ivory py-12 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-10 h-56 w-56 rounded-full bg-brand-pink/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-brand-gold/15 blur-3xl"
      />

      <Container className="relative grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="max-w-md lg:pt-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-pink">
            Newsletter &amp; Updates
          </p>
          <h2 className="mt-3 font-display text-[1.85rem] text-brand-navy sm:text-4xl">
            Stay Connected
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-slate sm:text-lg">
            Get practical tax reminders, filing deadline updates, and business
            news. Choose email, text, or both. Each channel requires its own
            opt-in.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-brand-navy/85">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                <Mail className="h-3.5 w-3.5" aria-hidden />
              </span>
              Email updates you can unsubscribe from anytime
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink/10 text-brand-pink">
                <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
              </span>
              Optional SMS alerts with clear STOP instructions
            </li>
          </ul>
        </div>

        <SubscribeForm className="rounded-[1.75rem] border border-brand-navy/8 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(7,27,58,0.45)] sm:p-7" />
      </Container>
    </section>
  );
}
