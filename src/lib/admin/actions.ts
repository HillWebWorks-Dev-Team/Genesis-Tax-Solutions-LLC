"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import { AVAILABILITY_TAG } from "@/lib/availability";
import { prisma } from "@/lib/db";
import {
  appointmentEmailCopy,
  sendEmail,
} from "@/lib/email/send";
import { upsertMailchimpSubscriber } from "@/lib/mailchimp/client";

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
  revalidatePath("/book-appointment");
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

