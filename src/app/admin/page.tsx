import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminOverviewPage() {
  const [
    customerCount,
    subscriberCount,
    enquiryCount,
    appointmentCount,
    recentEnquiries,
    upcomingAppointments,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.subscriber.count({ where: { status: "active" } }),
    prisma.enquiry.count({ where: { status: "new" } }),
    prisma.appointment.count({
      where: { status: { in: ["requested", "confirmed"] } },
    }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.appointment.findMany({
      where: { status: { in: ["requested", "confirmed"] } },
      orderBy: [{ preferredDate: "asc" }, { preferredTime: "asc" }],
      take: 5,
    }),
  ]);

  const stats = [
    { label: "Customers", value: customerCount, href: "/admin/customers/" },
    { label: "Subscribers", value: subscriberCount, href: "/admin/subscribers/" },
    { label: "New enquiries", value: enquiryCount, href: "/admin/enquiries/" },
    {
      label: "Open appointments",
      value: appointmentCount,
      href: "/admin/appointments/",
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="font-display text-2xl text-brand-navy sm:text-3xl">
          Overview
        </h2>
        <p className="mt-2 text-sm text-brand-slate">
          Snapshot of website activity and booking requests.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-brand-navy/10 bg-white p-4 transition-colors hover:border-brand-pink/40 sm:p-5"
          >
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand-navy/45 sm:text-xs sm:tracking-[0.16em]">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-3xl text-brand-navy sm:mt-3 sm:text-4xl">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <section className="border border-brand-navy/10 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg text-brand-navy sm:text-xl">
              Recent enquiries
            </h3>
            <Link
              href="/admin/enquiries/"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-pink"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-brand-navy/8">
            {recentEnquiries.length === 0 ? (
              <li className="py-4 text-sm text-brand-slate">No enquiries yet.</li>
            ) : (
              recentEnquiries.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <p className="font-medium text-brand-navy">{item.name}</p>
                  <p className="text-brand-slate">{item.email}</p>
                  <p className="mt-1 line-clamp-2 text-brand-slate">
                    {item.message}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="border border-brand-navy/10 bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-lg text-brand-navy sm:text-xl">
              Upcoming appointments
            </h3>
            <Link
              href="/admin/appointments/"
              className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-pink"
            >
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-brand-navy/8">
            {upcomingAppointments.length === 0 ? (
              <li className="py-4 text-sm text-brand-slate">
                No open appointments yet.
              </li>
            ) : (
              upcomingAppointments.map((item) => (
                <li key={item.id} className="py-3 text-sm">
                  <p className="font-medium text-brand-navy">{item.name}</p>
                  <p className="text-brand-slate">
                    {item.preferredDate} · {item.preferredTime} · {item.service}
                  </p>
                  <p className="mt-1 capitalize text-brand-slate">
                    {item.status.replace("-", " ")} · {item.method}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section className="border border-brand-navy/10 bg-white p-4 sm:p-5">
        <h3 className="font-display text-lg text-brand-navy sm:text-xl">
          Email &amp; SMS campaigns
        </h3>
        <p className="mt-2 text-sm text-brand-slate">
          Campaign statistics and Mailchimp sync will appear here after the
          Mailchimp integration phase. Subscriber records are already being
          stored from the website signup form.
        </p>
      </section>
    </div>
  );
}
