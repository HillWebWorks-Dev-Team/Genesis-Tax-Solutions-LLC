import { AppointmentsBoard } from "@/components/admin/AppointmentsBoard";
import { isEmailConfigured } from "@/lib/email/send";
import { prisma } from "@/lib/db";

const statuses = [
  { value: "requested", label: "Requested" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

type SearchParams = Promise<{
  q?: string;
  status?: string;
}>;

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const status = params.status || "all";
  const emailReady = isEmailConfigured();

  const appointments = await prisma.appointment.findMany({
    where: {
      AND: [
        status === "all" ? {} : { status },
        q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
                { phone: { contains: q } },
                { service: { contains: q, mode: "insensitive" } },
                { preferredDate: { contains: q } },
              ],
            }
          : {},
      ],
    },
    include: {
      customer: { select: { id: true, name: true } },
    },
    orderBy: [{ preferredDate: "asc" }, { preferredTime: "asc" }],
  });

  const rows = appointments.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    service: item.service,
    preferredDate: item.preferredDate,
    preferredTime: item.preferredTime,
    method: item.method,
    notes: item.notes,
    adminNotes: item.adminNotes,
    status: item.status,
    confirmationSentAt: item.confirmationSentAt
      ? item.confirmationSentAt.toISOString()
      : null,
    customerId: item.customerId,
    customerName: item.customer?.name || null,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Appointments</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Search and filter booking requests. Click View to open details.
        </p>
        <p className="mt-2 text-sm text-brand-slate">
          Email confirmations:{" "}
          {emailReady
            ? "configured (Resend)."
            : "not configured yet. Add RESEND_API_KEY and EMAIL_FROM to enable sending."}
        </p>
      </div>

      <form className="grid gap-3 border border-brand-navy/10 bg-white p-4 sm:grid-cols-[1fr_12rem_auto]">
        <label className="block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone, service, or date"
            className="w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
          />
        </label>
        <label className="block">
          <span className="sr-only">Status filter</span>
          <select
            name="status"
            defaultValue={status}
            className="w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
          >
            <option value="all">All statuses</option>
            {statuses.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="bg-brand-navy px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-navy-light"
        >
          Search
        </button>
      </form>

      <AppointmentsBoard appointments={rows} emailReady={emailReady} />
    </div>
  );
}
