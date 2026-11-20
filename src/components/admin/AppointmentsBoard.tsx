"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { StatusForm } from "@/components/admin/StatusForm";
import {
  saveAppointmentAdminNotesAction,
  updateAppointmentStatusAction,
} from "@/lib/admin/actions";
import { formatTimeLabel } from "@/lib/availability-utils";

const statuses = [
  { value: "requested", label: "Requested" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export type AppointmentRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  preferredTime: string;
  method: string;
  notes: string | null;
  adminNotes: string | null;
  status: string;
  confirmationSentAt: string | null;
  customerId: string | null;
  customerName: string | null;
};

function statusLabel(value: string) {
  return statuses.find((item) => item.value === value)?.label || value;
}

function statusClass(value: string) {
  switch (value) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-800";
    case "completed":
      return "bg-brand-navy/5 text-brand-navy";
    case "cancelled":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-800";
  }
}

export function AppointmentsBoard({
  appointments,
  emailReady,
}: {
  appointments: AppointmentRow[];
  emailReady: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = appointments.find((item) => item.id === selectedId) || null;

  useEffect(() => {
    document.body.style.overflow = selected ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  return (
    <>
      <div className="overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-ivory/70 text-xs uppercase tracking-[0.12em] text-brand-navy/55">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Service</th>
              <th className="px-4 py-3 font-semibold">Date</th>
              <th className="px-4 py-3 font-semibold">Time</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-brand-slate"
                >
                  No appointments match this search.
                </td>
              </tr>
            ) : (
              appointments.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-brand-navy/8 last:border-b-0"
                >
                  <td className="px-4 py-3.5 font-medium text-brand-navy">
                    {item.name}
                  </td>
                  <td className="px-4 py-3.5 text-brand-slate">
                    <span className="block">{item.email}</span>
                    <span className="block text-xs">{item.phone}</span>
                  </td>
                  <td className="px-4 py-3.5 text-brand-navy">
                    <span className="block">{item.service}</span>
                    <span className="block text-xs capitalize text-brand-slate">
                      {item.method.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-brand-slate">
                    {item.preferredDate}
                  </td>
                  <td className="px-4 py-3.5 text-brand-slate">
                    {formatTimeLabel(item.preferredTime)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] ${statusClass(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-pink transition-colors hover:text-brand-pink-dark"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center bg-brand-navy/55 px-3 py-3 backdrop-blur-[2px] sm:items-center sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="appointment-modal-title"
          onClick={() => setSelectedId(null)}
        >
          <div
            className="max-h-[92vh] w-full max-w-3xl overflow-y-auto border border-white/15 bg-brand-ivory shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-brand-navy/10 bg-brand-ivory px-5 py-4 sm:px-6">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
                  Appointment
                </p>
                <h3
                  id="appointment-modal-title"
                  className="mt-1 font-display text-2xl text-brand-navy"
                >
                  {selected.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex h-10 w-10 items-center justify-center border border-brand-navy/15 text-brand-navy transition-colors hover:border-brand-pink hover:text-brand-pink"
                aria-label="Close appointment details"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1.15fr_0.85fr]">
              <section className="border border-brand-navy/10 bg-white p-5">
                <h4 className="font-display text-lg text-brand-navy">
                  Details
                </h4>
                <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Email
                    </dt>
                    <dd className="mt-1 text-sm text-brand-navy">
                      {selected.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Phone
                    </dt>
                    <dd className="mt-1 text-sm text-brand-navy">
                      {selected.phone}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Service
                    </dt>
                    <dd className="mt-1 text-sm text-brand-navy">
                      {selected.service}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Method
                    </dt>
                    <dd className="mt-1 text-sm capitalize text-brand-navy">
                      {selected.method.replace(/-/g, " ")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Preferred date
                    </dt>
                    <dd className="mt-1 text-sm text-brand-navy">
                      {selected.preferredDate}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Preferred time
                    </dt>
                    <dd className="mt-1 text-sm text-brand-navy">
                      {formatTimeLabel(selected.preferredTime)}
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                      Client notes
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-brand-slate">
                      {selected.notes || "No client notes provided."}
                    </dd>
                  </div>
                  {selected.customerId ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                        Linked customer
                      </dt>
                      <dd className="mt-1 text-sm">
                        <Link
                          href={`/admin/customers/${selected.customerId}/`}
                          className="text-brand-pink transition-colors hover:text-brand-pink-dark"
                        >
                          {selected.customerName || "View customer"}
                        </Link>
                      </dd>
                    </div>
                  ) : null}
                  {selected.confirmationSentAt ? (
                    <div className="sm:col-span-2">
                      <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                        Confirmation email
                      </dt>
                      <dd className="mt-1 text-sm text-emerald-700">
                        Sent{" "}
                        {new Date(selected.confirmationSentAt).toLocaleString()}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </section>

              <section className="space-y-5">
                <div className="border border-brand-navy/10 bg-white p-5">
                  <h4 className="font-display text-lg text-brand-navy">
                    Status
                  </h4>
                  <div className="mt-4">
                    <StatusForm
                      key={`${selected.id}-${selected.status}`}
                      action={updateAppointmentStatusAction}
                      id={selected.id}
                      status={selected.status}
                      options={statuses}
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-brand-slate">
                    Setting status to Confirmed sends the client email when
                    Resend is configured
                    {emailReady ? " (ready)." : " (not configured yet)."}
                  </p>
                </div>

                <div className="border border-brand-navy/10 bg-white p-5">
                  <h4 className="font-display text-lg text-brand-navy">
                    Admin notes
                  </h4>
                  <form
                    key={`${selected.id}-notes`}
                    action={saveAppointmentAdminNotesAction}
                    className="mt-4 space-y-3"
                  >
                    <input type="hidden" name="id" value={selected.id} />
                    <label className="block">
                      <span className="sr-only">Admin notes</span>
                      <textarea
                        name="adminNotes"
                        rows={5}
                        defaultValue={selected.adminNotes || ""}
                        placeholder="Internal notes for this appointment"
                        className="w-full border border-brand-navy/15 bg-white px-3 py-2 text-sm text-brand-navy outline-none focus:border-brand-pink"
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex bg-brand-pink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink-dark"
                    >
                      Save notes
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
