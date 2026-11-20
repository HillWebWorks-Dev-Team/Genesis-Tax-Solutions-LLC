import Link from "next/link";
import { notFound } from "next/navigation";
import { CustomerForm } from "@/components/admin/CustomerForm";
import { CustomerNoteForm } from "@/components/admin/CustomerNoteForm";
import { CustomerSubscriptionForm } from "@/components/admin/CustomerSubscriptionForm";
import { DeleteCustomerButton } from "@/components/admin/DeleteCustomerButton";
import { updateCustomerAction } from "@/lib/admin/customer-actions";
import { prisma } from "@/lib/db";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      subscriber: true,
      enquiries: { orderBy: { createdAt: "desc" } },
      appointments: { orderBy: { createdAt: "desc" } },
      history: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!customer) notFound();

  let preferences: string[] = [];
  try {
    preferences = JSON.parse(customer.subscriber?.preferences || "[]") as string[];
  } catch {
    preferences = [];
  }

  type TimelineItem = {
    id: string;
    at: Date;
    label: string;
    detail: string;
    tone: "note" | "enquiry" | "appointment" | "subscription" | "system";
  };

  const timeline: TimelineItem[] = [
    ...customer.history.map((item) => ({
      id: `note-${item.id}`,
      at: item.createdAt,
      label:
        item.type === "subscription"
          ? "Subscription"
          : item.type === "system"
            ? "System"
            : "Note",
      detail: item.body,
      tone: (item.type as TimelineItem["tone"]) || "note",
    })),
    ...customer.enquiries.map((item) => ({
      id: `enquiry-${item.id}`,
      at: item.createdAt,
      label: `Enquiry · ${item.status}`,
      detail: item.message,
      tone: "enquiry" as const,
    })),
    ...customer.appointments.map((item) => ({
      id: `appointment-${item.id}`,
      at: item.createdAt,
      label: `Appointment · ${item.status}`,
      detail: `${item.service} on ${item.preferredDate} at ${item.preferredTime} (${item.method})${item.notes ? ` · ${item.notes}` : ""}`,
      tone: "appointment" as const,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/customers/"
            className="text-sm text-brand-slate transition-colors hover:text-brand-pink"
          >
            ← Back to customers
          </Link>
          <h2 className="mt-3 font-display text-3xl text-brand-navy">
            {customer.name}
          </h2>
          <p className="mt-2 text-sm text-brand-slate">
            {customer.email || "No email"} · {customer.phone || "No phone"}
          </p>
        </div>
        <DeleteCustomerButton customerId={customer.id} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="border border-brand-navy/10 bg-white p-6">
          <h3 className="font-display text-xl text-brand-navy">
            Contact details
          </h3>
          <div className="mt-5">
            <CustomerForm
              action={updateCustomerAction}
              submitLabel="Save changes"
              customerId={customer.id}
              defaultValues={customer}
            />
          </div>
        </section>

        <section className="border border-brand-navy/10 bg-white p-6">
          <h3 className="font-display text-xl text-brand-navy">
            Email &amp; SMS subscriptions
          </h3>
          <p className="mt-2 text-sm text-brand-slate">
            Manage marketing opt-ins for this contact. Mailchimp sync comes in
            the next phase.
          </p>
          <div className="mt-5">
            <CustomerSubscriptionForm
              customerId={customer.id}
              emailOptIn={Boolean(customer.subscriber?.emailOptIn)}
              smsOptIn={Boolean(customer.subscriber?.smsOptIn)}
              status={customer.subscriber?.status || "active"}
              preferences={preferences}
              hasEmail={Boolean(customer.email)}
              hasPhone={Boolean(customer.phone)}
            />
          </div>
        </section>
      </div>

      <section className="border border-brand-navy/10 bg-white p-6">
        <h3 className="font-display text-xl text-brand-navy">
          Communication history
        </h3>
        <p className="mt-2 text-sm text-brand-slate">
          Notes, enquiries, appointments, and subscription changes in one place.
        </p>

        <div className="mt-5 max-w-2xl">
          <CustomerNoteForm customerId={customer.id} />
        </div>

        <ul className="mt-8 space-y-4">
          {timeline.length === 0 ? (
            <li className="text-sm text-brand-slate">No history yet.</li>
          ) : (
            timeline.map((item) => (
              <li
                key={item.id}
                className="border-l-2 border-brand-navy/15 pl-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                  {item.label} · {item.at.toLocaleString()}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-brand-navy">
                  {item.detail}
                </p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}
