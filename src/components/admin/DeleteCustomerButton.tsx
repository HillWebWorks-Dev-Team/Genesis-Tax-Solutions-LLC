"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, useTransition } from "react";
import { deleteCustomerAction } from "@/lib/admin/customer-actions";
import { cn } from "@/lib/utils";

export function DeleteCustomerButton({
  customerId,
  label,
  compact = false,
}: {
  customerId: string;
  label?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirmDelete() {
    startTransition(async () => {
      const formData = new FormData();
      formData.set("id", customerId);
      await deleteCustomerAction(formData);
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={pending}
        className={cn(
          "text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition-colors disabled:opacity-60",
          compact
            ? "hover:text-red-800"
            : "border border-red-200 px-4 py-2 hover:bg-red-50",
        )}
      >
        {compact ? "Delete" : "Delete contact"}
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[240] flex items-center justify-center bg-brand-navy/60 px-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => (pending ? null : setOpen(false))}
        >
          <div
            className="w-full max-w-md border border-white/15 bg-brand-ivory p-6 shadow-[0_24px_80px_rgba(7,27,58,0.35)] animate-[loading-modal-in_280ms_ease-out]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3
                id={titleId}
                className="font-display text-2xl text-brand-navy"
              >
                Are you sure?
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="inline-flex h-9 w-9 items-center justify-center border border-brand-navy/15 text-brand-navy disabled:opacity-60"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-slate">
              Delete{" "}
              <strong className="text-brand-navy">
                {label || "this customer"}
              </strong>
              ? Enquiries and appointments stay in the system but are unlinked.
              Linked subscriber records are removed from the site database.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center bg-red-700 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-red-800 disabled:opacity-60"
              >
                {pending ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                className="inline-flex flex-1 items-center justify-center border border-brand-navy/15 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy transition-colors hover:border-brand-navy/35 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
