"use client";

import { useTransition } from "react";
import { deleteCustomerAction } from "@/lib/admin/customer-actions";

export function DeleteCustomerButton({ customerId }: { customerId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) => {
        const confirmed = window.confirm(
          "Delete this customer? Enquiries and appointments stay in the system but are unlinked.",
        );
        if (!confirmed) return;
        startTransition(async () => {
          await deleteCustomerAction(formData);
        });
      }}
    >
      <input type="hidden" name="id" value={customerId} />
      <button
        type="submit"
        disabled={pending}
        className="border border-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 transition-colors hover:bg-red-50 disabled:opacity-60"
      >
        {pending ? "Deleting..." : "Delete contact"}
      </button>
    </form>
  );
}
