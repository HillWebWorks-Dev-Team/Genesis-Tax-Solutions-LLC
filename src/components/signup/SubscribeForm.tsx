"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingModal } from "@/components/ui/LoadingModal";
import {
  submitSubscribeAction,
  type PublicFormResult,
} from "@/lib/forms/public-actions";

const initial: PublicFormResult = { ok: false };

const lineClass =
  "min-w-0 flex-1 border-0 border-b border-brand-navy/30 bg-transparent px-1 py-1.5 text-sm text-brand-navy outline-none transition focus:border-brand-pink";

function LineField({
  label,
  name,
  type,
  autoComplete,
  required,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "tel";
  autoComplete: string;
  required?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 text-sm font-medium text-brand-navy">
      <span className="w-14 shrink-0">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        aria-label={label.replace(":", "")}
        className={lineClass}
      />
    </label>
  );
}

export function SubscribeForm({
  className,
  variant = "lines",
}: {
  className?: string;
  variant?: "lines" | "popup";
}) {
  const [state, formAction, pending] = useActionState(
    submitSubscribeAction,
    initial,
  );

  return (
    <form action={formAction} className={className}>
      {pending ? <LoadingModal label="Saving your signup" /> : null}
      {variant === "popup" ? (
        <div className="flex flex-col gap-4">
          <LineField
            label="Name:"
            name="name"
            type="text"
            autoComplete="name"
            required
          />
          <LineField
            label="Email:"
            name="email"
            type="email"
            autoComplete="email"
          />
          <p className="text-center text-sm text-brand-slate">and/or</p>
          <LineField
            label="SMS:"
            name="phone"
            type="tel"
            autoComplete="tel"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={pending}
            className="mt-2 w-full"
          >
            {pending ? "Sending..." : "Submit"}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <LineField label="SMS:" name="phone" type="tel" autoComplete="tel" />
          <LineField
            label="Email:"
            name="email"
            type="email"
            autoComplete="email"
          />
          <button type="submit" className="sr-only">
            Sign up
          </button>
        </div>
      )}
      {state.error ? (
        <p role="alert" className="mt-4 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p role="status" className="mt-4 text-sm text-emerald-800">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
