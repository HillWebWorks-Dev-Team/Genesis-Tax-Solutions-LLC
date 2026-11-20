import Link from "next/link";
import { prisma } from "@/lib/db";

type SearchParams = Promise<{
  q?: string;
  filter?: string;
}>;

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const filter = params.filter || "all";

  const customers = await prisma.customer.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { phone: { contains: q } },
              ],
            }
          : {},
        filter === "email" ? { email: { not: null } } : {},
        filter === "phone" ? { phone: { not: null } } : {},
        filter === "subscribed"
          ? {
              subscriber: {
                is: {
                  status: "active",
                  OR: [{ emailOptIn: true }, { smsOptIn: true }],
                },
              },
            }
          : {},
        filter === "unsubscribed"
          ? {
              subscriber: {
                is: { status: "unsubscribed" },
              },
            }
          : {},
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      subscriber: true,
      _count: {
        select: {
          enquiries: true,
          appointments: true,
          history: true,
        },
      },
    },
  });

  const filters = [
    { value: "all", label: "All" },
    { value: "email", label: "Has email" },
    { value: "phone", label: "Has phone" },
    { value: "subscribed", label: "Subscribed" },
    { value: "unsubscribed", label: "Unsubscribed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl text-brand-navy">Customers</h2>
          <p className="mt-2 text-sm text-brand-slate">
            Search, filter, and manage customer contacts.
          </p>
        </div>
        <Link
          href="/admin/customers/new/"
          className="inline-flex items-center justify-center bg-brand-pink px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-brand-pink-dark"
        >
          Add contact
        </Link>
      </div>

      <form className="grid gap-3 border border-brand-navy/10 bg-white p-4 sm:grid-cols-[1fr_12rem_auto]">
        <label className="block">
          <span className="sr-only">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={q}
            placeholder="Search name, email, or phone"
            className="w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter</span>
          <select
            name="filter"
            defaultValue={filter}
            className="w-full border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-pink"
          >
            {filters.map((item) => (
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

      <div className="overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-ivory text-xs uppercase tracking-[0.12em] text-brand-navy/55">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Subscriptions</th>
              <th className="px-4 py-3 font-semibold">Activity</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-brand-slate">
                  No customers match this search.
                </td>
              </tr>
            ) : (
              customers.map((item) => {
                const channels = [
                  item.subscriber?.emailOptIn ? "Email" : null,
                  item.subscriber?.smsOptIn ? "SMS" : null,
                ].filter(Boolean);

                return (
                  <tr
                    key={item.id}
                    className="border-t border-brand-navy/8 hover:bg-brand-ivory/60"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/customers/${item.id}/`}
                        className="font-medium text-brand-navy hover:text-brand-pink"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {item.email || "-"}
                      <br />
                      {item.phone || "-"}
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {item.subscriber
                        ? `${channels.join(" · ") || "None"} · ${item.subscriber.status}`
                        : "None"}
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {item._count.enquiries} enquiries ·{" "}
                      {item._count.appointments} appointments ·{" "}
                      {item._count.history} notes
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {item.updatedAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
