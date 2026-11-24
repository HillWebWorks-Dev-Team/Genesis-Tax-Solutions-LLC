"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { buildSlots } from "@/lib/availability-utils";
import {
  submitAppointmentRequestAction,
  type PublicFormResult,
} from "@/lib/forms/public-actions";
import { siteConfig } from "@/lib/site-config";

const initial: PublicFormResult = { ok: false };

const times = buildSlots("09:00", "17:00");
const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: siteConfig.timezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const methods = [
  { value: "in-office", label: "In office" },
  { value: "virtual", label: "Virtual" },
  { value: "mobile", label: "Mobile notary" },
];

const fieldClass =
  "mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink";
const labelClass =
  "text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50";

export function AppointmentInquiry() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(
    submitAppointmentRequestAction,
    initial,
  );

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <div className="mt-14 border border-brand-navy/10 bg-white p-5 shadow-[0_24px_60px_-36px_rgba(7,27,58,0.35)] sm:mt-16 sm:p-8">
      {pending ? <LoadingModal label="Sending your request" /> : null}
      <div className="max-w-2xl">
        <h3 className="font-display text-3xl text-brand-navy sm:text-4xl">
          Request an appointment
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-slate sm:text-base">
          Tell us what you need and a time that works. The office reviews every
          request before it is confirmed.
        </p>
      </div>

      <form ref={formRef} action={formAction} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelClass}>Full name</span>
            <input
              name="name"
              required
              autoComplete="name"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Phone</span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              className={fieldClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className={labelClass}>Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Service</span>
            <select name="service" required defaultValue="" className={fieldClass}>
              <option value="" disabled>
                Select a service
              </option>
              {siteConfig.services.map((service) => (
                <option key={service.slug} value={service.title}>
                  {service.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>How should we meet?</span>
            <select name="method" required defaultValue="in-office" className={fieldClass}>
              {methods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>Preferred date</span>
            <input
              type="date"
              name="preferredDate"
              required
              min={today}
              className={fieldClass}
            />
          </label>
          <label className="block">
            <span className={labelClass}>Preferred time</span>
            <select
              name="preferredTime"
              required
              defaultValue=""
              className={fieldClass}
            >
              <option value="" disabled>
                Select a time
              </option>
              {times.map((slot) => (
                <option key={slot.value} value={slot.value}>
                  {slot.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className={labelClass}>What do you need help with?</span>
          <textarea
            name="notes"
            rows={4}
            className={fieldClass}
            placeholder="Documents, tax year, IRS notice, or anything we should know."
          />
        </label>

        <Button type="submit" variant="primary" size="lg" disabled={pending}>
          {pending ? "Sending..." : "Submit request"}
        </Button>

        {state.error ? (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state.message ? (
          <p role="status" className="text-sm text-emerald-800">
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
