"use client";

import { useActionState, useState } from "react";
import { Check, Mail, MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  submitSubscribeAction,
  type PublicFormResult,
} from "@/lib/forms/public-actions";
import { cn } from "@/lib/utils";

const initial: PublicFormResult = { ok: false };

const preferences = [
  { id: "tax-tips", label: "Tax tips" },
  { id: "deadlines", label: "Filing deadlines" },
  { id: "promotions", label: "Promotions" },
  { id: "business-updates", label: "Business updates" },
];

export function NewsletterSignup() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "tax-tips",
    "deadlines",
  ]);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitSubscribeAction,
    initial,
  );

  function toggleTopic(id: string) {
    setSelectedTopics((current) =>
      current.includes(id)
        ? current.filter((topic) => topic !== id)
        : [...current, id],
    );
  }

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

        <form
          action={formAction}
          className="rounded-[1.75rem] border border-brand-navy/8 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(7,27,58,0.45)] sm:p-7"
          noValidate
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setEmailOptIn((value) => !value)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                emailOptIn
                  ? "border-brand-pink/40 bg-brand-pink/5"
                  : "border-brand-navy/10 bg-brand-ivory/50 hover:border-brand-navy/20",
              )}
              aria-pressed={emailOptIn}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full",
                  emailOptIn
                    ? "bg-brand-pink text-white"
                    : "bg-white text-brand-slate",
                )}
              >
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-navy">
                  Email
                </span>
                <span className="block text-xs text-brand-slate">
                  Tips &amp; reminders
                </span>
              </span>
              {emailOptIn ? (
                <Check className="ml-auto h-4 w-4 text-brand-pink" aria-hidden />
              ) : null}
            </button>

            <button
              type="button"
              onClick={() => setSmsOptIn((value) => !value)}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                smsOptIn
                  ? "border-brand-pink/40 bg-brand-pink/5"
                  : "border-brand-navy/10 bg-brand-ivory/50 hover:border-brand-navy/20",
              )}
              aria-pressed={smsOptIn}
            >
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full",
                  smsOptIn
                    ? "bg-brand-pink text-white"
                    : "bg-white text-brand-slate",
                )}
              >
                <MessageSquareText className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold text-brand-navy">
                  SMS
                </span>
                <span className="block text-xs text-brand-slate">
                  Text alerts
                </span>
              </span>
              {smsOptIn ? (
                <Check className="ml-auto h-4 w-4 text-brand-pink" aria-hidden />
              ) : null}
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium text-brand-navy">
              Email address
              <input
                type="email"
                name="email"
                autoComplete="email"
                disabled={!emailOptIn}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 disabled:cursor-not-allowed disabled:bg-brand-ivory/70 disabled:opacity-60"
              />
            </label>
            <label className="block text-sm font-medium text-brand-navy">
              Mobile number
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                disabled={!smsOptIn}
                placeholder="(904) 555-0123"
                className="mt-2 w-full rounded-xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 disabled:cursor-not-allowed disabled:bg-brand-ivory/70 disabled:opacity-60"
              />
            </label>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-medium text-brand-navy">
              What would you like to receive?
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {preferences.map((pref) => {
                const active = selectedTopics.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => toggleTopic(pref.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-sm transition-colors",
                      active
                        ? "border-brand-pink bg-brand-pink text-white"
                        : "border-brand-navy/15 bg-white text-brand-slate hover:border-brand-pink/40 hover:text-brand-navy",
                    )}
                    aria-pressed={active}
                  >
                    {pref.label}
                  </button>
                );
              })}
            </div>
            {selectedTopics.map((topic) => (
              <input
                key={topic}
                type="hidden"
                name="preferences"
                value={topic}
              />
            ))}
          </fieldset>

          <div className="mt-5 space-y-3 rounded-2xl bg-brand-ivory/80 p-4 text-xs leading-relaxed text-brand-slate sm:text-sm">
            {emailOptIn ? (
              <p>
                By signing up for email, you agree to receive marketing emails
                from Genesis Tax Solutions LLC. You can unsubscribe anytime.
              </p>
            ) : null}
            {smsOptIn ? (
              <p>
                By signing up for SMS, you agree to receive recurring automated
                marketing texts. Message and data rates may apply. Reply STOP to
                opt out. Consent is not a condition of purchase.{" "}
                <a
                  href="/privacy-policy/#sms"
                  className="font-medium text-brand-pink underline-offset-2 hover:underline"
                >
                  SMS Terms
                </a>
              </p>
            ) : null}
            {!emailOptIn && !smsOptIn ? (
              <p>Select email and/or SMS above to continue.</p>
            ) : null}
          </div>

          <input
            type="hidden"
            name="emailConsent"
            value={emailOptIn ? "on" : "off"}
          />
          <input
            type="hidden"
            name="smsConsent"
            value={smsOptIn ? "on" : "off"}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={pending}
            className="mt-5 w-full shadow-md shadow-brand-pink/30"
          >
            {pending ? "Saving..." : "Sign Up for Updates"}
          </Button>

          {state.error ? (
            <p
              role="alert"
              className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </p>
          ) : null}
          {state.message ? (
            <p
              role="status"
              className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </Container>
    </section>
  );
}
