import { StatusForm } from "@/components/admin/StatusForm";
import { updateEnquiryStatusAction } from "@/lib/admin/actions";
import { prisma } from "@/lib/db";

const statuses = [
  { value: "new", label: "New" },
  { value: "in-progress", label: "In progress" },
  { value: "closed", label: "Closed" },
];

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Enquiries</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Messages submitted through the contact form.
        </p>
      </div>

      <div className="overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-ivory text-xs uppercase tracking-[0.12em] text-brand-navy/55">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Received</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-brand-slate">
                  No enquiries yet.
                </td>
              </tr>
            ) : (
              enquiries.map((item) => (
                <tr key={item.id} className="border-t border-brand-navy/8 align-top">
                  <td className="px-4 py-4">
                    <p className="font-medium text-brand-navy">{item.name}</p>
                    <p className="text-brand-slate">{item.email}</p>
                    {item.phone ? (
                      <p className="text-brand-slate">{item.phone}</p>
                    ) : null}
                  </td>
                  <td className="max-w-md px-4 py-4 text-brand-slate">
                    {item.message}
                  </td>
                  <td className="px-4 py-4">
                    <StatusForm
                      action={updateEnquiryStatusAction}
                      id={item.id}
                      status={item.status}
                      options={statuses}
                    />
                  </td>
                  <td className="px-4 py-4 text-brand-slate">
                    {item.createdAt.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
