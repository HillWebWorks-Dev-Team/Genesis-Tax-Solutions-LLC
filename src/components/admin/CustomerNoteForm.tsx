"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  addCustomerNoteAction,
  type CustomerActionResult,
} from "@/lib/admin/customer-actions";

const initial: CustomerActionResult = { ok: false };

export function CustomerNoteForm({ customerId }: { customerId: string }) {
  const [state, formAction, pending] = useActionState(
    addCustomerNoteAction,
    initial,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="customerId" value={customerId} />
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Add note
        </span>
        <textarea
          name="body"
          rows={3}
          required
          placeholder="Call summary, follow-up, or internal reminder"
          className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex bg-brand-navy px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light disabled:opacity-60"
      >
        {pending ? "Saving..." : "Add to history"}
      </button>
    </form>
  );
}
