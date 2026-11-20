"use client";

import { useActionState } from "react";
import {
  submitContactAction,
  type PublicFormResult,
} from "@/lib/forms/public-actions";

const initial: PublicFormResult = { ok: false };

const fieldClass =
  "mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-pink";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactAction,
    initial,
  );

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Full name
        </span>
        <input
          name="name"
          required
          autoComplete="name"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Email
        </span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Phone{" "}
          <span className="normal-case tracking-normal text-brand-slate">
            (optional)
          </span>
        </span>
        <input
          type="tel"
          name="phone"
          autoComplete="tel"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Message
        </span>
        <textarea
          name="message"
          required
          rows={6}
          className={`${fieldClass} resize-y`}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center bg-brand-pink px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Sending..." : "Send Message"}
      </button>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="text-sm leading-relaxed text-brand-navy">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
