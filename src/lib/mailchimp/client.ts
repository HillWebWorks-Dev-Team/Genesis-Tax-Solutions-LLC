import { createHash } from "crypto";

export type MailchimpConfig = {
  apiKey: string;
  audienceId: string;
  dataCenter: string;
};

export type MailchimpStatus = {
  configured: boolean;
  connected: boolean;
  audienceName?: string;
  audienceWebId?: number;
  memberCount?: number;
  smsSupported: boolean;
  smsMessage: string;
  error?: string;
};

function getConfig(): MailchimpConfig | null {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  if (!apiKey || !audienceId) return null;
  const dataCenter = apiKey.includes("-") ? apiKey.split("-").pop()! : "";
  if (!dataCenter) return null;
  return { apiKey, audienceId, dataCenter };
}

export function isMailchimpConfigured() {
  return Boolean(getConfig());
}

export function subscriberHash(email: string) {
  return createHash("md5").update(email.trim().toLowerCase()).digest("hex");
}

async function mailchimpFetch(
  config: MailchimpConfig,
  path: string,
  init?: RequestInit,
) {
  const response = await fetch(
    `https://${config.dataCenter}.api.mailchimp.com/3.0${path}`,
    {
      ...init,
      headers: {
        Authorization: `Basic ${Buffer.from(`any:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
        ...(init?.headers || {}),
      },
    },
  );

  const text = await response.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  return { response, json };
}

export async function getMailchimpStatus(): Promise<MailchimpStatus> {
  const config = getConfig();
  if (!config) {
    return {
      configured: false,
      connected: false,
      smsSupported: false,
      smsMessage:
        "Add MAILCHIMP_API_KEY and MAILCHIMP_AUDIENCE_ID to enable sync and campaigns.",
    };
  }

  try {
    const list = await mailchimpFetch(
      config,
      `/lists/${config.audienceId}`,
    );
    if (!list.response.ok) {
      return {
        configured: true,
        connected: false,
        smsSupported: false,
        smsMessage: "Could not verify SMS capability until the audience connects.",
        error: `Audience lookup failed (${list.response.status}).`,
      };
    }

    const listData = list.json as {
      name?: string;
      web_id?: number;
      stats?: { member_count?: number };
    };

    const sms = await mailchimpFetch(config, "/sms-campaigns?count=1");
    const smsSupported = sms.response.ok;
    const smsMessage = smsSupported
      ? "SMS campaign endpoints are available on this account."
      : "SMS create/send is not available yet. Keep SMS in Mailchimp until an approved SMS program is active.";

    return {
      configured: true,
      connected: true,
      audienceName: listData.name,
      audienceWebId:
        typeof listData.web_id === "number" ? listData.web_id : undefined,
      memberCount: listData.stats?.member_count,
      smsSupported,
      smsMessage,
    };
  } catch (error) {
    return {
      configured: true,
      connected: false,
      smsSupported: false,
      smsMessage: "SMS status unknown until connection succeeds.",
      error: error instanceof Error ? error.message : "Mailchimp connection failed.",
    };
  }
}

export async function upsertMailchimpSubscriber(input: {
  email?: string | null;
  phone?: string | null;
  emailOptIn: boolean;
  smsOptIn: boolean;
  preferences?: string[];
}) {
  const config = getConfig();
  if (!config) {
    return { ok: true as const, skipped: true as const };
  }

  if (!input.email) {
    return {
      ok: true as const,
      skipped: true as const,
      reason: "Mailchimp member sync requires an email address.",
    };
  }

  const email = input.email.trim().toLowerCase();
  const hash = subscriberHash(email);
  const status = input.emailOptIn ? "subscribed" : "unsubscribed";
  const mergeFields: Record<string, string> = {};
  if (input.phone) {
    mergeFields.PHONE = input.phone;
  }

  const body: Record<string, unknown> = {
    email_address: email,
    status_if_new: status,
    status,
    merge_fields: mergeFields,
    tags: input.preferences || [],
  };

  if (input.smsOptIn && input.phone) {
    body.sms_phone_number = input.phone;
    body.sms_subscription_status = "subscribed";
  }

  const { response, json } = await mailchimpFetch(
    config,
    `/lists/${config.audienceId}/members/${hash}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      error:
        typeof json === "object" &&
        json &&
        "detail" in json &&
        typeof (json as { detail?: string }).detail === "string"
          ? (json as { detail: string }).detail
          : `Mailchimp sync failed (${response.status}).`,
    };
  }

  const member = json as { id?: string; contact_id?: string };
  return {
    ok: true as const,
    memberId: member.contact_id || member.id || hash,
  };
}

function mailchimpErrorMessage(json: unknown, fallback: string) {
  if (
    typeof json === "object" &&
    json &&
    "detail" in json &&
    typeof (json as { detail?: string }).detail === "string"
  ) {
    return (json as { detail: string }).detail;
  }
  return fallback;
}

function plainTextToCampaignHtml(body: string, subject: string) {
  const paragraphs = body
    .trim()
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) =>
          line
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"),
        )
        .join("<br />");
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#1f2937;">${lines}</p>`;
    })
    .join("");

  const safeSubject = subject
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f1ea;font-family:Georgia,serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f1ea;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:28px 28px 8px;background:#071b3a;color:#ffffff;">
                <p style="margin:0;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#c99b55;">Genesis Tax &amp; Notary Solutions</p>
                <h1 style="margin:12px 0 0;font-size:24px;line-height:1.3;font-weight:normal;">${safeSubject}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                ${paragraphs || `<p style="margin:0;font-size:16px;line-height:1.6;color:#1f2937;">${safeSubject}</p>`}
              </td>
            </tr>
            <tr>
              <td style="padding:0 28px 28px;font-size:13px;line-height:1.5;color:#6b7280;">
                <p style="margin:0;">Genesis Tax Solutions LLC · Jacksonville, FL</p>
                <p style="margin:8px 0 0;">You received this email because you subscribed to updates.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function createAndSendCampaign(input: {
  subject: string;
  body: string;
  fromName: string;
  replyTo: string;
  previewText?: string;
  title?: string;
}) {
  const config = getConfig();
  if (!config) {
    return {
      ok: false as const,
      error: "Mailchimp is not configured.",
    };
  }

  const subject = input.subject.trim();
  const body = input.body.trim();
  const fromName = input.fromName.trim();
  const replyTo = input.replyTo.trim();
  const title = (input.title || subject).trim();
  const previewText = input.previewText?.trim() || undefined;

  if (!subject || !body || !fromName || !replyTo) {
    return {
      ok: false as const,
      error: "Subject, message, from name, and reply-to email are required.",
    };
  }

  const create = await mailchimpFetch(config, "/campaigns", {
    method: "POST",
    body: JSON.stringify({
      type: "regular",
      recipients: {
        list_id: config.audienceId,
      },
      settings: {
        subject_line: subject,
        title,
        from_name: fromName,
        reply_to: replyTo,
        preview_text: previewText,
        auto_footer: true,
        inline_css: true,
      },
    }),
  });

  if (!create.response.ok) {
    return {
      ok: false as const,
      error: mailchimpErrorMessage(
        create.json,
        `Could not create campaign (${create.response.status}).`,
      ),
    };
  }

  const created = create.json as { id?: string };
  const campaignId = created.id;
  if (!campaignId) {
    return {
      ok: false as const,
      error: "Mailchimp created a campaign without an id.",
    };
  }

  const content = await mailchimpFetch(
    config,
    `/campaigns/${campaignId}/content`,
    {
      method: "PUT",
      body: JSON.stringify({
        html: plainTextToCampaignHtml(body, subject),
        plain_text: body,
      }),
    },
  );

  if (!content.response.ok) {
    return {
      ok: false as const,
      campaignId,
      error: mailchimpErrorMessage(
        content.json,
        `Campaign created, but content failed (${content.response.status}).`,
      ),
    };
  }

  const send = await mailchimpFetch(
    config,
    `/campaigns/${campaignId}/actions/send`,
    { method: "POST" },
  );

  if (!send.response.ok && send.response.status !== 204) {
    return {
      ok: false as const,
      campaignId,
      error: mailchimpErrorMessage(
        send.json,
        `Campaign saved as draft, but send failed (${send.response.status}). Open Mailchimp to finish sending.`,
      ),
    };
  }

  return {
    ok: true as const,
    campaignId,
  };
}

export async function listRecentCampaigns(count = 6) {
  const config = getConfig();
  if (!config) return { ok: true as const, skipped: true as const, campaigns: [] };

  const { response, json } = await mailchimpFetch(
    config,
    `/campaigns?count=${count}&sort_field=create_time&sort_dir=DESC`,
  );

  if (!response.ok) {
    return {
      ok: false as const,
      campaigns: [],
      error: `Could not load campaigns (${response.status}).`,
    };
  }

  const data = json as {
    campaigns?: Array<{
      id: string;
      web_id?: number;
      type?: string;
      status?: string;
      create_time?: string;
      archive_url?: string;
      long_archive_url?: string;
      settings?: { subject_line?: string; title?: string };
      report_summary?: { opens?: number; unique_opens?: number; clicks?: number };
    }>;
  };

  return {
    ok: true as const,
    campaigns: (data.campaigns || []).map((campaign) => ({
      id: campaign.id,
      webId: campaign.web_id,
      title:
        campaign.settings?.title ||
        campaign.settings?.subject_line ||
        "Untitled campaign",
      status: campaign.status || "unknown",
      type: campaign.type || "regular",
      createdAt: campaign.create_time || "",
      archiveUrl: campaign.long_archive_url || campaign.archive_url || "",
      opens: campaign.report_summary?.unique_opens ?? campaign.report_summary?.opens ?? 0,
      clicks: campaign.report_summary?.clicks ?? 0,
    })),
  };
}

export async function deleteMailchimpCampaign(campaignId: string) {
  const config = getConfig();
  if (!config) {
    return { ok: false as const, error: "Mailchimp is not configured." };
  }

  const { response, json } = await mailchimpFetch(
    config,
    `/campaigns/${campaignId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    return {
      ok: false as const,
      error: mailchimpErrorMessage(
        json,
        `Could not delete campaign (${response.status}).`,
      ),
    };
  }

  return { ok: true as const };
}

export async function deleteMailchimpSmsCampaign(campaignId: string) {
  const config = getConfig();
  if (!config) {
    return { ok: false as const, error: "Mailchimp is not configured." };
  }

  const { response, json } = await mailchimpFetch(
    config,
    `/sms-campaigns/${campaignId}`,
    { method: "DELETE" },
  );

  if (!response.ok && response.status !== 204) {
    return {
      ok: false as const,
      error: mailchimpErrorMessage(
        json,
        `Could not delete SMS campaign (${response.status}).`,
      ),
    };
  }

  return { ok: true as const };
}

export function mailchimpCampaignAdminUrl(webId?: number) {
  const config = getConfig();
  if (!config || !webId) return "";
  return `https://${config.dataCenter}.admin.mailchimp.com/campaigns/show?id=${webId}`;
}

export async function createAndSendSmsCampaign(input: {
  name: string;
  message: string;
  listWebId: number;
}) {
  const config = getConfig();
  if (!config) {
    return {
      ok: false as const,
      error: "Mailchimp is not configured.",
    };
  }

  const name = input.name.trim();
  const message = input.message.trim();
  if (!name || !message) {
    return {
      ok: false as const,
      error: "Campaign name and SMS message are required.",
    };
  }
  if (!Number.isFinite(input.listWebId)) {
    return {
      ok: false as const,
      error: "Mailchimp audience numeric id is missing.",
    };
  }
  if (message.length > 320) {
    return {
      ok: false as const,
      error: "SMS message must be 320 characters or fewer.",
    };
  }

  const create = await mailchimpFetch(config, "/sms-campaigns", {
    method: "POST",
    body: JSON.stringify({
      name,
      list_id: input.listWebId,
    }),
  });

  if (!create.response.ok) {
    return {
      ok: false as const,
      error: mailchimpErrorMessage(
        create.json,
        `Could not create SMS campaign (${create.response.status}).`,
      ),
    };
  }

  const created = create.json as { id?: string };
  const campaignId = created.id;
  if (!campaignId) {
    return {
      ok: false as const,
      error: "Mailchimp created an SMS campaign without an id.",
    };
  }

  const content = await mailchimpFetch(
    config,
    `/sms-campaigns/${campaignId}/content`,
    {
      method: "PUT",
      body: JSON.stringify({
        message_body: message,
      }),
    },
  );

  if (!content.response.ok) {
    return {
      ok: false as const,
      campaignId,
      error: mailchimpErrorMessage(
        content.json,
        `SMS campaign created, but content failed (${content.response.status}).`,
      ),
    };
  }

  const send = await mailchimpFetch(
    config,
    `/sms-campaigns/${campaignId}/actions/send`,
    { method: "POST" },
  );

  if (!send.response.ok && send.response.status !== 204) {
    return {
      ok: false as const,
      campaignId,
      error: mailchimpErrorMessage(
        send.json,
        `SMS campaign saved as draft, but send failed (${send.response.status}). Open Mailchimp to finish sending.`,
      ),
    };
  }

  return {
    ok: true as const,
    campaignId,
  };
}

export async function listRecentSmsCampaigns(count = 6) {
  const config = getConfig();
  if (!config) {
    return { ok: true as const, skipped: true as const, campaigns: [] };
  }

  const { response, json } = await mailchimpFetch(
    config,
    `/sms-campaigns?count=${count}`,
  );

  if (!response.ok) {
    return {
      ok: false as const,
      campaigns: [],
      error: `Could not load SMS campaigns (${response.status}).`,
    };
  }

  const data = json as {
    sms_campaigns?: Array<{
      id: string;
      name?: string;
      status?: string;
      create_time?: string;
      recipient_count?: number;
    }>;
  };

  return {
    ok: true as const,
    campaigns: (data.sms_campaigns || []).map((campaign) => ({
      id: campaign.id,
      title: campaign.name || "Untitled SMS campaign",
      status: campaign.status || "unknown",
      createdAt: campaign.create_time || "",
      recipients: campaign.recipient_count ?? 0,
    })),
  };
}
