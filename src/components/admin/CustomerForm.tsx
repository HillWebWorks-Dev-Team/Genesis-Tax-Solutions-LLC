"use client";

import { useActionState } from "react";
import type { CustomerActionResult } from "@/lib/admin/customer-actions";

const initial: CustomerActionResult = { ok: false };

const fieldClass =
  "mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink";

export function CustomerForm({
  action,
  submitLabel,
  defaultValues,
  customerId,
}: {
  action: (
    prev: CustomerActionResult,
    formData: FormData,
  ) => Promise<CustomerActionResult>;
  submitLabel: string;
  customerId?: string;
  defaultValues?: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-5">
      {customerId ? <input type="hidden" name="id" value={customerId} /> : null}

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Full name
        </span>
        <input
          name="name"
          required
          defaultValue={defaultValues?.name || ""}
          className={fieldClass}
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
            Email
          </span>
          <input
            type="email"
            name="email"
            defaultValue={defaultValues?.email || ""}
            className={fieldClass}
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
            Phone
          </span>
          <input
            type="tel"
            name="phone"
            defaultValue={defaultValues?.phone || ""}
            className={fieldClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Internal notes
        </span>
        <textarea
          name="notes"
          rows={4}
          defaultValue={defaultValues?.notes || ""}
          className={`${fieldClass} resize-y`}
        />
      </label>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="text-sm text-emerald-700">
          Customer saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex bg-brand-pink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
