import { CampaignComposer } from "@/components/admin/CampaignComposer";
import { CampaignRowActions } from "@/components/admin/CampaignRowActions";
import { SmsCampaignComposer } from "@/components/admin/SmsCampaignComposer";
import {
  getMailchimpStatus,
  listRecentCampaigns,
  listRecentSmsCampaigns,
  mailchimpCampaignAdminUrl,
} from "@/lib/mailchimp/client";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export const instant = false;

export default async function AdminCampaignsPage() {
  const [status, campaignsResult, smsCampaignsResult, subscriberCount] =
    await Promise.all([
      getMailchimpStatus(),
      listRecentCampaigns(),
      listRecentSmsCampaigns(),
      prisma.subscriber.count({ where: { status: "active" } }),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-brand-navy">Campaigns</h2>
        <p className="mt-2 text-sm text-brand-slate">
          Send mass email or SMS through Mailchimp and review recent results.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="border border-brand-navy/10 bg-white p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
            Connection
          </h3>
          <p className="mt-3 text-lg text-brand-navy">
            {!status.configured
              ? "Not configured"
              : status.connected
                ? "Connected"
                : "Needs attention"}
          </p>
          <p className="mt-2 text-sm text-brand-slate">
            {status.error ||
              (status.configured
                ? status.audienceName || "Audience connected"
                : "Set MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID in .env")}
          </p>
        </article>

        <article className="border border-brand-navy/10 bg-white p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
            Local subscribers
          </h3>
          <p className="mt-3 font-display text-4xl text-brand-navy">
            {subscriberCount}
          </p>
          <p className="mt-2 text-sm text-brand-slate">
            Website signups ready to sync.
            {typeof status.memberCount === "number"
              ? ` Mailchimp audience reports ${status.memberCount} members.`
              : ""}
          </p>
        </article>

        <article className="border border-brand-navy/10 bg-white p-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-navy/45">
            SMS capability
          </h3>
          <p className="mt-3 text-lg text-brand-navy">
            {status.smsSupported ? "Available" : "Not available yet"}
          </p>
          <p className="mt-2 text-sm text-brand-slate">{status.smsMessage}</p>
        </article>
      </div>

      {status.configured && status.connected ? (
        <CampaignComposer
          audienceName={status.audienceName}
          memberCount={status.memberCount}
          replyTo={siteConfig.email}
        />
      ) : (
        <section className="border border-brand-navy/10 bg-white p-6 text-sm text-brand-slate">
          Connect Mailchimp to send mass email from this page.
        </section>
      )}

      {status.configured &&
      status.connected &&
      status.smsSupported &&
      typeof status.audienceWebId === "number" ? (
        <SmsCampaignComposer
          audienceName={status.audienceName}
          listWebId={status.audienceWebId}
        />
      ) : status.configured && status.connected ? (
        <section className="border border-brand-navy/10 bg-white p-6 text-sm leading-relaxed text-brand-slate">
          <h3 className="font-display text-xl text-brand-navy">Mass SMS</h3>
          <p className="mt-3">
            {status.smsMessage} Once Mailchimp SMS is fully enabled for this
            account, send from this page.
          </p>
        </section>
      ) : null}

      <section className="border border-brand-navy/10 bg-white p-6">
        <h3 className="font-display text-xl text-brand-navy">
          Recent email campaigns
        </h3>
        {!status.configured ? (
          <p className="mt-3 text-sm text-brand-slate">
            Connect Mailchimp to load campaign history and enable automatic
            subscriber sync from the newsletter form.
          </p>
        ) : campaignsResult.ok === false ? (
          <p className="mt-3 text-sm text-red-700">{campaignsResult.error}</p>
        ) : campaignsResult.campaigns.length === 0 ? (
          <p className="mt-3 text-sm text-brand-slate">
            No campaigns found yet. Send your first mass email above.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-brand-navy/10 text-xs uppercase tracking-[0.12em] text-brand-navy/55">
                <tr>
                  <th className="px-2 py-3 font-semibold">Campaign</th>
                  <th className="px-2 py-3 font-semibold">Status</th>
                  <th className="px-2 py-3 font-semibold">Opens</th>
                  <th className="px-2 py-3 font-semibold">Clicks</th>
                  <th className="px-2 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaignsResult.campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="border-t border-brand-navy/8"
                  >
                    <td className="px-2 py-3 text-brand-navy">
                      {campaign.title}
                    </td>
                    <td className="px-2 py-3 capitalize text-brand-slate">
                      {campaign.status}
                    </td>
                    <td className="px-2 py-3 text-brand-slate">
                      {campaign.opens}
                    </td>
                    <td className="px-2 py-3 text-brand-slate">
                      {campaign.clicks}
                    </td>
                    <td className="px-2 py-3">
                      <CampaignRowActions
                        campaignId={campaign.id}
                        title={campaign.title}
                        viewUrl={
                          campaign.archiveUrl ||
                          mailchimpCampaignAdminUrl(campaign.webId) ||
                          undefined
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {status.smsSupported ? (
        <section className="border border-brand-navy/10 bg-white p-6">
          <h3 className="font-display text-xl text-brand-navy">
            Recent SMS campaigns
          </h3>
          {smsCampaignsResult.ok === false ? (
            <p className="mt-3 text-sm text-red-700">{smsCampaignsResult.error}</p>
          ) : smsCampaignsResult.campaigns.length === 0 ? (
            <p className="mt-3 text-sm text-brand-slate">
              No SMS campaigns yet. Send your first mass SMS above.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-brand-navy/10 text-xs uppercase tracking-[0.12em] text-brand-navy/55">
                  <tr>
                    <th className="px-2 py-3 font-semibold">Campaign</th>
                    <th className="px-2 py-3 font-semibold">Status</th>
                    <th className="px-2 py-3 font-semibold">Recipients</th>
                    <th className="px-2 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {smsCampaignsResult.campaigns.map((campaign) => (
                    <tr
                      key={campaign.id}
                      className="border-t border-brand-navy/8"
                    >
                      <td className="px-2 py-3 text-brand-navy">
                        {campaign.title}
                      </td>
                      <td className="px-2 py-3 capitalize text-brand-slate">
                        {campaign.status}
                      </td>
                      <td className="px-2 py-3 text-brand-slate">
                        {campaign.recipients}
                      </td>
                      <td className="px-2 py-3">
                        <CampaignRowActions
                          campaignId={campaign.id}
                          title={campaign.title}
                          channel="sms"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
