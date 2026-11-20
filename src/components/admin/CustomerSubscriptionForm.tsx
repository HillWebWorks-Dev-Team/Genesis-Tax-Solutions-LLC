"use client";

import { useActionState } from "react";
import {
  updateCustomerSubscriptionAction,
  type CustomerActionResult,
} from "@/lib/admin/customer-actions";

const initial: CustomerActionResult = { ok: false };

const preferenceOptions = [
  { id: "tax-tips", label: "Tax tips" },
  { id: "deadlines", label: "Filing deadlines" },
  { id: "promotions", label: "Promotions" },
  { id: "business-updates", label: "Business updates" },
];

export function CustomerSubscriptionForm({
  customerId,
  emailOptIn,
  smsOptIn,
  status,
  preferences,
  hasEmail,
  hasPhone,
}: {
  customerId: string;
  emailOptIn: boolean;
  smsOptIn: boolean;
  status: string;
  preferences: string[];
  hasEmail: boolean;
  hasPhone: boolean;
}) {
  const [state, formAction, pending] = useActionState(
    updateCustomerSubscriptionAction,
    initial,
  );

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="customerId" value={customerId} />

      <label className="flex items-start gap-3 text-sm text-brand-navy">
        <input
          type="checkbox"
          name="emailOptIn"
          defaultChecked={emailOptIn}
          disabled={!hasEmail}
          className="mt-1 h-4 w-4 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
        />
        <span>
          Email marketing opt-in
          {!hasEmail ? (
            <span className="mt-1 block text-xs text-brand-slate">
              Add an email on the contact record first.
            </span>
          ) : null}
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-brand-navy">
        <input
          type="checkbox"
          name="smsOptIn"
          defaultChecked={smsOptIn}
          disabled={!hasPhone}
          className="mt-1 h-4 w-4 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
        />
        <span>
          SMS marketing opt-in
          {!hasPhone ? (
            <span className="mt-1 block text-xs text-brand-slate">
              Add a phone number on the contact record first.
            </span>
          ) : null}
        </span>
      </label>

      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Status
        </span>
        <select
          name="status"
          defaultValue={status}
          className="mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
        >
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </select>
      </label>

      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
          Preferences
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {preferenceOptions.map((item) => (
            <label
              key={item.id}
              className="inline-flex items-center gap-2 text-sm text-brand-navy"
            >
              <input
                type="checkbox"
                name="preferences"
                value={item.id}
                defaultChecked={preferences.includes(item.id)}
                className="h-4 w-4 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
              />
              {item.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state.error ? (
        <p role="alert" className="text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.ok ? (
        <p role="status" className="text-sm text-emerald-700">
          Subscription preferences saved.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex bg-brand-pink px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save subscriptions"}
      </button>
    </form>
  );
}
