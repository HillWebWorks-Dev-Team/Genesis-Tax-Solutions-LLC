"use client";

import { useEffect, useId, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function StatusForm({
  action,
  id,
  status,
  options,
  confirmLabel = "Update status",
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  status: string;
  options: { value: string; label: string }[];
  confirmLabel?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const titleId = useId();
  const [selected, setSelected] = useState(status);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processOpen, setProcessOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setSelected(status);
  }, [status]);

  const selectedLabel =
    options.find((option) => option.value === selected)?.label || selected;
  const currentLabel =
    options.find((option) => option.value === status)?.label || status;
  const unchanged = selected === status;

  function runUpdate() {
    setConfirmOpen(false);
    setProcessOpen(true);

    const formData = new FormData();
    formData.set("id", id);
    formData.set("status", selected);

    startTransition(async () => {
      try {
        await action(formData);
        setProcessOpen(false);
        toast.push(`Status updated to ${selectedLabel}.`, "success");
        router.refresh();
      } catch (error) {
        setProcessOpen(false);
        toast.push(
          error instanceof Error ? error.message : "Could not update status.",
          "error",
        );
      }
    });
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <label className="sr-only" htmlFor={`status-${id}`}>
          Status
        </label>
        <select
          id={`status-${id}`}
          value={selected}
          onChange={(event) => setSelected(event.target.value)}
          className="border border-brand-navy/15 bg-white px-2 py-1.5 text-xs text-brand-navy"
          disabled={pending}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={pending || unchanged}
          onClick={() => setConfirmOpen(true)}
          className="px-2 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-brand-pink hover:text-brand-pink-dark disabled:opacity-50"
        >
          Update
        </button>
      </div>

      {confirmOpen ? (
        <div
          className="fixed inset-0 z-[240] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md border border-white/15 bg-brand-ivory p-6 shadow-[0_24px_80px_rgba(7,27,58,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                id={titleId}
                className="font-display text-2xl text-brand-navy"
              >
                Confirm status change
              </h3>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center border border-brand-navy/15 text-brand-navy"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-slate">
              Change status from <strong>{currentLabel}</strong> to{" "}
              <strong>{selectedLabel}</strong>?
              {selected === "confirmed"
                ? " This may also send a confirmation email if Resend is configured."
                : ""}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={runUpdate}
                className="inline-flex flex-1 items-center justify-center bg-brand-pink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink-dark"
              >
                {confirmLabel}
              </button>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="inline-flex flex-1 items-center justify-center border border-brand-navy/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy transition-colors hover:border-brand-navy/35"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {processOpen ? (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-busy="true"
          aria-label="Updating status"
        >
          <div className="w-full max-w-sm border border-white/15 bg-brand-ivory px-6 py-8 text-center shadow-[0_24px_80px_rgba(7,27,58,0.35)]">
            <div
              className="loading-spinner mx-auto h-10 w-10 rounded-full border-[3px] border-brand-navy/15 border-t-brand-pink"
              aria-hidden="true"
            />
            <p className="mt-5 font-display text-xl text-brand-navy">
              Updating status
            </p>
            <p className="mt-2 text-sm text-brand-slate">
              Changing to {selectedLabel}. Please wait.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
