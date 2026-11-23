import { DeleteSubscriberButton } from "@/components/admin/DeleteSubscriberButton";
import { SyncSubscriberButton } from "@/components/admin/SyncSubscriberButton";
import { isMailchimpConfigured } from "@/lib/mailchimp/client";
import { prisma } from "@/lib/db";

export const instant = false;

export default async function AdminSubscribersPage() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
  const mailchimpReady = isMailchimpConfigured();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Subscribers</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Newsletter and SMS opt-ins from the website.
          {mailchimpReady
            ? " New signups sync to Mailchimp automatically when an email is provided."
            : " Add Mailchimp keys in .env to enable automatic sync."}
        </p>
      </div>

      <div className="overflow-x-auto border border-brand-navy/10 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-brand-navy/10 bg-brand-ivory text-xs uppercase tracking-[0.12em] text-brand-navy/55">
            <tr>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Channels</th>
              <th className="px-4 py-3 font-semibold">Preferences</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Mailchimp</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-brand-slate">
                  No subscribers yet.
                </td>
              </tr>
            ) : (
              subscribers.map((item) => {
                let prefs: string[] = [];
                try {
                  prefs = JSON.parse(item.preferences) as string[];
                } catch {
                  prefs = [];
                }
                return (
                  <tr key={item.id} className="border-t border-brand-navy/8">
                    <td className="px-4 py-4 text-brand-slate">
                      {item.email || "-"}
                      <br />
                      {item.phone || "-"}
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {[
                        item.emailOptIn ? "Email" : null,
                        item.smsOptIn ? "SMS" : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "None"}
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {prefs.length ? prefs.join(", ") : "-"}
                    </td>
                    <td className="px-4 py-4 capitalize text-brand-slate">
                      {item.status}
                    </td>
                    <td className="px-4 py-4 text-brand-slate">
                      {item.mailchimpMemberId ? (
                        <p className="text-xs">Synced</p>
                      ) : (
                        <SyncSubscriberButton subscriberId={item.id} />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <DeleteSubscriberButton
                        subscriberId={item.id}
                        label={item.email || item.phone || "this subscriber"}
                      />
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
