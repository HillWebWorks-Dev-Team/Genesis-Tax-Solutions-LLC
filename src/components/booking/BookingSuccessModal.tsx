"use client";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function BookingSuccessModal({
  open,
  message,
  onClose,
}: {
  open: boolean;
  message?: string;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-success-title"
    >
      <div className="w-full max-w-md border border-white/15 bg-brand-ivory p-6 text-center shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out] sm:p-8">
        <Image
          src="/images/logo.png"
          alt={siteConfig.brandName}
          width={1983}
          height={793}
          className="mx-auto h-11 w-auto object-contain"
        />

        <span className="mx-auto mt-7 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Check className="h-7 w-7" strokeWidth={2.5} aria-hidden />
        </span>

        <h2
          id="booking-success-title"
          className="mt-5 font-display text-2xl text-brand-navy sm:text-3xl"
        >
          Request received
        </h2>

        <p
          role="status"
          className="mt-3 text-sm leading-relaxed text-brand-navy sm:text-base"
        >
          {message ||
            "Thanks. Your appointment request was received. We will confirm availability shortly."}
        </p>

        <div className="mt-6 border border-brand-navy/10 bg-white px-4 py-4 text-left">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
            What happens next
          </p>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-brand-slate">
            <li>1. Our team reviews your preferred time.</li>
            <li>2. We follow up to confirm the appointment.</li>
            <li>3. You receive confirmation once the slot is set.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex flex-1 items-center justify-center bg-brand-pink px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark"
          >
            Done
          </button>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center border border-brand-navy/15 bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy transition-colors hover:border-brand-navy/35"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
