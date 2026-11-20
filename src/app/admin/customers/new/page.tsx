import Link from "next/link";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { createCustomerAction } from "@/lib/admin/customer-actions";

export default function AdminNewCustomerPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/customers/"
          className="text-sm text-brand-slate transition-colors hover:text-brand-pink"
        >
          ← Back to customers
        </Link>
        <h2 className="mt-3 font-display text-3xl text-brand-navy">
          Add contact
        </h2>
        <p className="mt-2 text-sm text-brand-slate">
          Create a customer record manually.
        </p>
      </div>

      <div className="max-w-2xl border border-brand-navy/10 bg-white p-6">
        <CustomerForm action={createCustomerAction} submitLabel="Create contact" />
      </div>
    </div>
  );
}
