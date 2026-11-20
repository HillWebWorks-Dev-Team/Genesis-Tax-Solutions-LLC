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
      type?: string;
      status?: string;
      create_time?: string;
      settings?: { subject_line?: string; title?: string };
      report_summary?: { opens?: number; unique_opens?: number; clicks?: number };
    }>;
  };

  return {
    ok: true as const,
    campaigns: (data.campaigns || []).map((campaign) => ({
      id: campaign.id,
      title:
        campaign.settings?.title ||
        campaign.settings?.subject_line ||
        "Untitled campaign",
      status: campaign.status || "unknown",
      type: campaign.type || "regular",
      createdAt: campaign.create_time || "",
      opens: campaign.report_summary?.unique_opens ?? campaign.report_summary?.opens ?? 0,
      clicks: campaign.report_summary?.clicks ?? 0,
    })),
  };
}
