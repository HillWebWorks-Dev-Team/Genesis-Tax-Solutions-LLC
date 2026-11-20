"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  WEEKDAYS,
  getOpenSlotsForDate,
  isDateOpen,
  type TimeSlot,
} from "@/lib/availability-utils";
import { BookingProcessModal } from "@/components/booking/BookingProcessModal";
import { BookingSuccessModal } from "@/components/booking/BookingSuccessModal";
import {
  submitBookingAction,
  type PublicFormResult,
} from "@/lib/forms/public-actions";

const methods = [
  {
    value: "in-office",
    label: "In-office",
    hint: "Visit our Jacksonville office",
  },
  {
    value: "virtual",
    label: "Virtual",
    hint: "Phone or video appointment",
  },
  {
    value: "mobile-notary",
    label: "Mobile notary",
    hint: "We come to you when available",
  },
] as const;

const fieldClass =
  "mt-2 w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-brand-pink";

const fieldErrorClass =
  "mt-2 w-full border border-red-400 bg-red-50/40 px-4 py-3 text-sm text-brand-navy outline-none transition-colors focus:border-red-500";

const initial: PublicFormResult = { ok: false };

type AvailabilityRuleProp = {
  weekday: number;
  startTime: string;
  endTime: string;
  active: boolean;
};

type BlockedDateProp = {
  date: string;
};

type BusyAppointmentProp = {
  preferredDate: string;
  preferredTime: string;
};

function FieldHint({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "error" | "success";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : tone === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-brand-navy/10 bg-brand-ivory text-brand-slate";

  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={`mt-2 border px-3 py-2 text-sm leading-relaxed ${toneClass}`}
    >
      {children}
    </p>
  );
}

export function BookingForm({
  services,
  rules,
  blockedDates,
  busyAppointments,
}: {
  services: Array<{ slug: string; title: string; summary: string }>;
  rules: AvailabilityRuleProp[];
  blockedDates: BlockedDateProp[];
  busyAppointments: BusyAppointmentProp[];
}) {
  const [service, setService] = useState("");
  const [method, setMethod] =
    useState<(typeof methods)[number]["value"]>("in-office");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [attempted, setAttempted] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitBookingAction,
    initial,
  );
  const [minDate, setMinDate] = useState("");

  useEffect(() => {
    const next = new Date();
    next.setDate(next.getDate() + 1);
    setMinDate(next.toISOString().slice(0, 10));
  }, []);

  useEffect(() => {
    if (pending) {
      setProcessOpen(true);
      setSuccessOpen(false);
    }
  }, [pending]);

  useEffect(() => {
    if (!pending && state.ok) {
      setProcessOpen(false);
      setSuccessOpen(true);
    }
    if (!pending && state.error) {
      setProcessOpen(true);
    }
  }, [pending, state.error, state.ok]);

  useEffect(() => {
    const lock = pending || processOpen || successOpen;
    document.body.style.overflow = lock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [pending, processOpen, successOpen]);

  const openSlots = useMemo(() => {
    if (!date) return [] as TimeSlot[];
    return getOpenSlotsForDate({
      date,
      rules,
      blockedDates,
      busyAppointments,
    });
  }, [busyAppointments, blockedDates, date, rules]);

  const dateIsOpen = useMemo(() => {
    if (!date) return true;
    return isDateOpen({ date, rules, blockedDates });
  }, [blockedDates, date, rules]);

  const openWeekdays = useMemo(() => {
    return WEEKDAYS.filter((day) =>
      rules.some((rule) => rule.weekday === day.value && rule.active),
    ).map((day) => day.label);
  }, [rules]);

  const dateError = Boolean(date && !dateIsOpen);
  const slotsEmpty = Boolean(date && dateIsOpen && openSlots.length === 0);
  const needsTime = Boolean(date && dateIsOpen && openSlots.length > 0 && !time);

  const clientErrors = useMemo(() => {
    if (!attempted) return [] as string[];
    const errors: string[] = [];
    if (!service) errors.push("Choose a service.");
    if (!date) errors.push("Choose a preferred date.");
    else if (!dateIsOpen) {
      errors.push(
        openWeekdays.length
          ? `That date is closed. Open days are ${openWeekdays.join(", ")}.`
          : "That date is closed. Please choose another day.",
      );
    } else if (openSlots.length === 0) {
      errors.push("No open slots remain on this date. Choose another day.");
    } else if (!time) {
      errors.push("Select a preferred time.");
    }
    return errors;
  }, [
    attempted,
    date,
    dateIsOpen,
    openSlots.length,
    openWeekdays,
    service,
    time,
  ]);

  useEffect(() => {
    if (time && !openSlots.some((slot) => slot.value === time)) {
      setTime("");
    }
  }, [openSlots, time]);

  const canSubmit =
    Boolean(service && date && time && dateIsOpen && openSlots.length > 0) &&
    !pending;

  return (
    <>
    <BookingProcessModal
      open={processOpen && (pending || Boolean(state.error))}
      pending={pending}
      success={false}
      error={pending ? undefined : state.error}
      onClose={() => setProcessOpen(false)}
    />
    <BookingSuccessModal
      open={successOpen}
      message={state.message}
      onClose={() => setSuccessOpen(false)}
    />
    <form
      action={formAction}
      className="space-y-8 sm:space-y-10"
      noValidate
      onSubmit={(event) => {
        setAttempted(true);
        if (!canSubmit) {
          event.preventDefault();
          return;
        }
        setProcessOpen(true);
      }}
    >
      <fieldset>
        <legend className="font-display text-xl text-brand-navy sm:text-2xl">
          1. Choose a service
        </legend>
        <p className="mt-2 text-sm text-brand-slate">
          Select what you need help with. We will confirm details after you
          submit.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {services.map((item) => {
            const selected = service === item.slug;
            const showError = attempted && !service;
            return (
              <label
                key={item.slug}
                className={`cursor-pointer border p-4 transition-colors ${
                  selected
                    ? "border-brand-pink bg-brand-pink/5"
                    : showError
                      ? "border-red-300 bg-red-50/30"
                      : "border-brand-navy/10 bg-white hover:border-brand-navy/25"
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value={item.slug}
                  required
                  checked={selected}
                  onChange={() => setService(item.slug)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-brand-navy">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-brand-slate">
                  {item.summary}
                </span>
              </label>
            );
          })}
        </div>
        {attempted && !service ? (
          <FieldHint tone="error">Please choose a service to continue.</FieldHint>
        ) : null}
      </fieldset>

      <fieldset>
        <legend className="font-display text-xl text-brand-navy sm:text-2xl">
          2. Pick a time
        </legend>
        <p className="mt-2 text-sm text-brand-slate">
          Choose an open date and hourly slot based on our current office hours.
          {openWeekdays.length > 0
            ? ` We are currently open ${openWeekdays.join(", ")}.`
            : ""}
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Preferred date
            </span>
            <input
              type="date"
              name="date"
              required
              min={minDate}
              value={date}
              aria-invalid={dateError || (attempted && !date) || undefined}
              onChange={(event) => {
                setDate(event.target.value);
                setTime("");
              }}
              className={
                dateError || (attempted && !date) ? fieldErrorClass : fieldClass
              }
            />
            {attempted && !date ? (
              <FieldHint tone="error">Select a preferred date.</FieldHint>
            ) : null}
            {dateError ? (
              <FieldHint tone="error">
                That date is closed
                {openWeekdays.length
                  ? ` (we are open ${openWeekdays.join(", ")})`
                  : ""}
                . Please choose another day.
              </FieldHint>
            ) : null}
            {slotsEmpty ? (
              <FieldHint tone="error">
                No open slots remain on this date. Please choose another day.
              </FieldHint>
            ) : null}
          </label>

          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Preferred time
            </span>
            <input type="hidden" name="time" value={time} required />
            <div
              className={`mt-2 min-h-[3rem] ${
                (attempted && needsTime) || dateError || slotsEmpty
                  ? "rounded-sm border border-red-200 bg-red-50/40 p-3"
                  : ""
              }`}
            >
              <div className="flex flex-wrap gap-2">
                {!date ? (
                  <FieldHint>
                    Select a date first to see available times.
                  </FieldHint>
                ) : dateError ? (
                  <FieldHint tone="error">
                    Pick an open day to unlock time slots.
                  </FieldHint>
                ) : slotsEmpty ? (
                  <FieldHint tone="error">
                    All slots are taken for this date. Try a different day.
                  </FieldHint>
                ) : (
                  openSlots.map((slot) => {
                    const selected = time === slot.value;
                    return (
                      <button
                        key={slot.value}
                        type="button"
                        onClick={() => setTime(slot.value)}
                        className={`px-3.5 py-2 text-sm transition-colors ${
                          selected
                            ? "bg-brand-navy text-white"
                            : "border border-brand-navy/15 bg-white text-brand-navy hover:border-brand-navy/35"
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })
                )}
              </div>
              {attempted && needsTime ? (
                <FieldHint tone="error">
                  Select one of the available times above.
                </FieldHint>
              ) : null}
              {time && dateIsOpen && openSlots.length > 0 ? (
                <FieldHint tone="success">
                  Time selected. Continue with your details below.
                </FieldHint>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
            Appointment method
          </span>
          <input type="hidden" name="method" value={method} />
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {methods.map((item) => {
              const selected = method === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setMethod(item.value)}
                  className={`border p-4 text-left transition-colors ${
                    selected
                      ? "border-brand-pink bg-brand-pink/5"
                      : "border-brand-navy/10 bg-white hover:border-brand-navy/25"
                  }`}
                >
                  <span className="block text-sm font-semibold text-brand-navy">
                    {item.label}
                  </span>
                  <span className="mt-1 block text-xs text-brand-slate">
                    {item.hint}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </fieldset>

      <fieldset>
        <legend className="font-display text-xl text-brand-navy sm:text-2xl">
          3. Your details
        </legend>
        <p className="mt-2 text-sm text-brand-slate">
          We only need enough information to confirm your appointment.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Phone
            </span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              className={fieldClass}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/50">
              Notes{" "}
              <span className="normal-case tracking-normal text-brand-slate">
                (optional)
              </span>
            </span>
            <textarea
              name="notes"
              rows={4}
              placeholder="Anything we should know before your appointment"
              className={`${fieldClass} resize-y`}
            />
          </label>
        </div>
      </fieldset>

      <div className="border-t border-brand-navy/10 pt-6">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-brand-slate">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-1 h-4 w-4 shrink-0 border-brand-navy/30 text-brand-pink focus:ring-brand-pink"
          />
          <span>
            I agree to the{" "}
            <Link
              href="/privacy-policy/"
              className="text-brand-pink transition-colors hover:underline"
            >
              Privacy Policy
            </Link>
            . Do not include Social Security numbers or tax documents in this
            request.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="mt-6 inline-flex w-full items-center justify-center bg-brand-pink px-8 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-colors hover:bg-brand-pink-dark disabled:opacity-60 sm:w-auto"
        >
          {pending ? "Submitting..." : "Request Appointment"}
        </button>

        {clientErrors.length > 0 ? (
          <div role="alert" className="mt-4 border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-800">
              Please fix the following before submitting:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-700">
              {clientErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {state.error && !processOpen && !successOpen ? (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
      </div>
    </form>
    </>
  );
}
