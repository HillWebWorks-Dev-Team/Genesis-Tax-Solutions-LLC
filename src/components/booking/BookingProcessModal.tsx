"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Submit request",
    detail: "We receive your preferred service, date, and time.",
  },
  {
    id: 2,
    title: "Review availability",
    detail: "Our team checks the calendar and confirms the slot.",
  },
  {
    id: 3,
    title: "Get confirmation",
    detail: "You receive confirmation once the appointment is set.",
  },
] as const;

export function BookingProcessModal({
  open,
  pending,
  success,
  error,
  message,
  onClose,
}: {
  open: boolean;
  pending: boolean;
  success: boolean;
  error?: string;
  message?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-process-title"
      aria-busy={pending}
    >
      <div className="w-full max-w-md border border-white/15 bg-brand-ivory p-6 shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out] sm:p-8">
        <Image
          src="/images/logo.png"
          alt={siteConfig.brandName}
          width={1983}
          height={793}
          className="mx-auto h-11 w-auto object-contain"
        />

        <h2
          id="booking-process-title"
          className="mt-6 text-center font-display text-2xl text-brand-navy"
        >
          {success
            ? "Request received"
            : error
              ? "Almost there"
              : "Submitting your request"}
        </h2>
        <p className="mt-2 text-center text-sm leading-relaxed text-brand-slate">
          {success
            ? message ||
              "Thanks. We will review availability and follow up shortly."
            : error
              ? "Something needs attention before we can finish."
              : "Hang tight while we send your appointment request."}
        </p>

        {pending ? (
          <div
            className="loading-spinner mx-auto mt-6 h-9 w-9 rounded-full border-[3px] border-brand-navy/15 border-t-brand-pink"
            aria-hidden="true"
          />
        ) : null}

        <ol className="mt-7 space-y-3">
          {steps.map((step) => {
            const current = pending && step.id === 1;
            const upcoming = !success && !current;

            return (
              <li
                key={step.id}
                className={cn(
                  "flex gap-3 border px-3.5 py-3 transition-colors",
                  success
                    ? "border-emerald-200 bg-emerald-50"
                    : current
                      ? "border-brand-pink/30 bg-brand-pink/5"
                      : "border-brand-navy/10 bg-white",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center text-xs font-semibold",
                    success
                      ? "bg-emerald-600 text-white"
                      : current
                        ? "bg-brand-pink text-white"
                        : "border border-brand-navy/15 text-brand-navy/50",
                  )}
                >
                  {success ? (
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  ) : (
                    step.id
                  )}
                </span>
                <span>
                  <span
                    className={cn(
                      "block text-sm font-semibold",
                      upcoming && !current
                        ? "text-brand-navy/55"
                        : "text-brand-navy",
                    )}
                  >
                    {step.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-brand-slate">
                    {step.detail}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>

        {error ? (
          <p
            role="alert"
            className="mt-5 border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {error}
          </p>
        ) : null}

        {!pending ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-6 inline-flex w-full items-center justify-center bg-brand-navy px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-navy-light"
          >
            {success ? "Done" : "Close and fix"}
          </button>
        ) : (
          <p className="mt-6 text-center text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-navy/45">
            Please wait
          </p>
        )}
      </div>
    </div>
  );
}
