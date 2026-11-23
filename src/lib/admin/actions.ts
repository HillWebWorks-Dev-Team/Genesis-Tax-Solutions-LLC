"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { AVAILABILITY_TAG } from "@/lib/availability";
import { prisma } from "@/lib/db";
import {
  appointmentEmailCopy,
  sendEmail,
} from "@/lib/email/send";
import {
  createAndSendCampaign,
  createAndSendSmsCampaign,
  deleteMailchimpCampaign,
  deleteMailchimpSmsCampaign,
  upsertMailchimpSubscriber,
} from "@/lib/mailchimp/client";
import { siteConfig } from "@/lib/site-config";

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function updateEnquiryStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  if (!id || !status) return;

  await prisma.enquiry.update({
    where: { id },
    data: { status },
  });
  await prisma.auditLog.create({
    data: {
      action: "enquiry.status_update",
      actorId: session.sub,
      meta: JSON.stringify({ id, status }),
    },
  });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}

export async function updateAppointmentStatusAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const adminNotes = String(formData.get("adminNotes") || "").trim();
  if (!id || !status) return;

  const existing = await prisma.appointment.findUnique({ where: { id } });
  if (!existing) return;

  const shouldSendConfirmation =
    status === "confirmed" && existing.status !== "confirmed";

  const updated = await prisma.appointment.update({
    where: { id },
    data: {
      status,
      adminNotes: adminNotes || existing.adminNotes,
    },
  });

  if (shouldSendConfirmation) {
    const copy = appointmentEmailCopy(updated);
    const emailResult = await sendEmail({
      to: updated.email,
      subject: copy.subject,
      html: copy.html,
      text: copy.text,
    });

    if (emailResult.ok && !emailResult.skipped) {
      await prisma.appointment.update({
        where: { id },
        data: { confirmationSentAt: new Date() },
      });
    }

    if (updated.customerId) {
      await prisma.customerNote.create({
        data: {
          customerId: updated.customerId,
          type: "appointment",
          body: emailResult.skipped
            ? "Appointment marked confirmed. Confirmation email skipped (email provider not configured)."
            : emailResult.ok
              ? "Appointment confirmed and confirmation email sent."
              : `Appointment confirmed. Email failed: ${emailResult.error}`,
          createdBy: session.sub,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      action: "appointment.status_update",
      actorId: session.sub,
      meta: JSON.stringify({ id, status }),
    },
  });
  revalidateTag(AVAILABILITY_TAG, "max");
  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${id}`);
  revalidatePath("/admin");
  revalidatePath("/contact");
}

export async function saveAppointmentAdminNotesAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  const adminNotes = String(formData.get("adminNotes") || "").trim();
  if (!id) return;

  await prisma.appointment.update({
    where: { id },
    data: { adminNotes: adminNotes || null },
  });
  await prisma.auditLog.create({
    data: {
      action: "appointment.notes_update",
      actorId: session.sub,
      meta: JSON.stringify({ id }),
    },
  });
  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${id}`);
}

export async function deleteSubscriberAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false as const, error: "Missing subscriber." };

  const subscriber = await prisma.subscriber.findUnique({ where: { id } });
  if (!subscriber) return { ok: false as const, error: "Subscriber not found." };

  await prisma.subscriber.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      action: "subscriber.delete",
      actorId: session.sub,
      meta: JSON.stringify({
        id,
        email: subscriber.email,
        phone: subscriber.phone,
      }),
    },
  });

  revalidatePath("/admin/subscribers");
  revalidatePath("/admin/campaigns");
  revalidatePath("/admin");
  return { ok: true as const };
}

export async function syncSubscriberToMailchimpAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false as const, error: "Missing subscriber." };

  const subscriber = await prisma.subscriber.findUnique({ where: { id } });
  if (!subscriber) return { ok: false as const, error: "Subscriber not found." };

  let topicPreferences: string[] = [];
  try {
    topicPreferences = JSON.parse(subscriber.preferences || "[]") as string[];
  } catch {
    topicPreferences = [];
  }

  const result = await upsertMailchimpSubscriber({
    email: subscriber.email,
    phone: subscriber.phone,
    emailOptIn: subscriber.emailOptIn,
    smsOptIn: subscriber.smsOptIn,
    preferences: topicPreferences,
  });

  if (!result.ok) {
    return { ok: false as const, error: result.error };
  }

  if ("memberId" in result && result.memberId) {
    await prisma.subscriber.update({
      where: { id },
      data: { mailchimpMemberId: result.memberId },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: "subscriber.mailchimp_sync",
      actorId: session.sub,
      meta: JSON.stringify({ id, skipped: "skipped" in result && result.skipped }),
    },
  });

  revalidatePath("/admin/subscribers");
  revalidatePath("/admin/campaigns");
  return {
    ok: true as const,
    skipped: "skipped" in result ? Boolean(result.skipped) : false,
  };
}

export async function updateSiteSettingAction(formData: FormData) {
  const session = await requireAdmin();
  const key = String(formData.get("key") || "").trim();
  const value = String(formData.get("value") || "").trim();
  if (!key) return;

  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  await prisma.auditLog.create({
    data: {
      action: "site_setting.update",
      actorId: session.sub,
      meta: JSON.stringify({ key }),
    },
  });
  revalidatePath("/admin/content");
  revalidatePath("/", "layout");
}

export type CampaignActionResult = {
  ok: boolean;
  error?: string;
  message?: string;
  campaignId?: string;
};

export async function sendMassEmailCampaignAction(
  _prev: CampaignActionResult,
  formData: FormData,
): Promise<CampaignActionResult> {
  const session = await requireAdmin();

  const subject = String(formData.get("subject") || "").trim();
  const previewText = String(formData.get("previewText") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const confirmed = String(formData.get("confirmSend") || "") === "on";

  if (!subject || subject.length < 3) {
    return { ok: false, error: "Enter a subject line." };
  }
  if (!body || body.length < 10) {
    return { ok: false, error: "Enter a message for your audience." };
  }
  if (!confirmed) {
    return {
      ok: false,
      error: "Check the confirmation box to send this email now.",
    };
  }

  const result = await createAndSendCampaign({
    subject,
    body,
    previewText: previewText || undefined,
    fromName: siteConfig.brandName,
    replyTo: siteConfig.email,
    title: subject,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      campaignId: "campaignId" in result ? result.campaignId : undefined,
    };
  }

  await prisma.auditLog.create({
    data: {
      action: "campaign.mailchimp_send",
      actorId: session.sub,
      meta: JSON.stringify({
        campaignId: result.campaignId,
        subject,
      }),
    },
  });

  revalidatePath("/admin/campaigns");
  return {
    ok: true,
    campaignId: result.campaignId,
    message: "Campaign sent to your Mailchimp audience.",
  };
}

export async function sendMassSmsCampaignAction(
  _prev: CampaignActionResult,
  formData: FormData,
): Promise<CampaignActionResult> {
  const session = await requireAdmin();

  const name = String(formData.get("name") || "").trim();
  const message = String(formData.get("message") || "").trim();
  const listWebId = Number(formData.get("listWebId") || "");
  const confirmed = String(formData.get("confirmSend") || "") === "on";

  if (!name || name.length < 2) {
    return { ok: false, error: "Enter an internal campaign name." };
  }
  if (!message || message.length < 5) {
    return { ok: false, error: "Enter an SMS message." };
  }
  if (message.length > 320) {
    return { ok: false, error: "SMS message must be 320 characters or fewer." };
  }
  if (!Number.isFinite(listWebId)) {
    return { ok: false, error: "Missing Mailchimp audience id for SMS." };
  }
  if (!confirmed) {
    return {
      ok: false,
      error: "Check the confirmation box to send this SMS now.",
    };
  }

  const result = await createAndSendSmsCampaign({
    name,
    message,
    listWebId,
  });

  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      campaignId: "campaignId" in result ? result.campaignId : undefined,
    };
  }

  await prisma.auditLog.create({
    data: {
      action: "campaign.mailchimp_sms_send",
      actorId: session.sub,
      meta: JSON.stringify({
        campaignId: result.campaignId,
        name,
      }),
    },
  });

  revalidatePath("/admin/campaigns");
  return {
    ok: true,
    campaignId: result.campaignId,
    message: "SMS campaign sent to your Mailchimp SMS audience.",
  };
}

export async function deleteEmailCampaignAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return { ok: false as const, error: "Missing campaign." };

  const result = await deleteMailchimpCampaign(id);
  if (!result.ok) return result;

  await prisma.auditLog.create({
    data: {
      action: "campaign.mailchimp_delete",
      actorId: session.sub,
      meta: JSON.stringify({ campaignId: id }),
    },
  });

  revalidatePath("/admin/campaigns");
  return { ok: true as const };
}

export async function deleteSmsCampaignAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "").trim();
  if (!id) return { ok: false as const, error: "Missing SMS campaign." };

  const result = await deleteMailchimpSmsCampaign(id);
  if (!result.ok) return result;

  await prisma.auditLog.create({
    data: {
      action: "campaign.mailchimp_sms_delete",
      actorId: session.sub,
      meta: JSON.stringify({ campaignId: id }),
    },
  });

  revalidatePath("/admin/campaigns");
  return { ok: true as const };
}

