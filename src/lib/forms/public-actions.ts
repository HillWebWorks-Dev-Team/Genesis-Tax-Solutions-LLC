"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { buildSlots, formatTimeLabel } from "@/lib/availability-utils";
import { prisma } from "@/lib/db";
import {
  sendSingleRecipientNotification,
  upsertMailchimpSubscriber,
} from "@/lib/mailchimp/client";
import { siteConfig } from "@/lib/site-config";

const appointmentTimes = buildSlots("09:00", "17:00").map((slot) => slot.value);
const appointmentServices = siteConfig.services.map((service) => service.title);
const appointmentMethods = ["in-office", "virtual", "mobile"] as const;

export type PublicFormResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

const subscribeSchema = z
  .object({
    name: z.string().max(120).optional().or(z.literal("")),
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().max(40).optional().or(z.literal("")),
    preferences: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.email?.trim() && !data.phone?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Enter an email or mobile number.",
      });
    }
  });

export async function submitSubscribeAction(
  _prev: PublicFormResult,
  formData: FormData,
): Promise<PublicFormResult> {
  const preferences = formData
    .getAll("preferences")
    .map(String)
    .filter(Boolean);

  const parsed = subscribeSchema.safeParse({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    preferences,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Unable to subscribe.",
    };
  }

  const name = parsed.data.name?.trim() || "";
  const email = parsed.data.email?.trim().toLowerCase() || null;
  const phone = parsed.data.phone?.trim() || null;

  const existing = email
    ? await prisma.subscriber.findFirst({ where: { email } })
    : phone
      ? await prisma.subscriber.findFirst({ where: { phone } })
      : null;

  const linkedCustomer =
    email
      ? await prisma.customer.findFirst({ where: { email } })
      : phone
        ? await prisma.customer.findFirst({ where: { phone } })
        : null;

  const customer = linkedCustomer
    ? await prisma.customer.update({
        where: { id: linkedCustomer.id },
        data: {
          name: name || linkedCustomer.name,
          phone: linkedCustomer.phone || phone,
          email: linkedCustomer.email || email,
        },
      })
    : await prisma.customer.create({
        data: {
          name: name || email || phone || "Subscriber",
          email,
          phone,
        },
      });

  const data = {
    email,
    phone,
    emailOptIn: Boolean(email),
    smsOptIn: Boolean(phone),
    preferences: JSON.stringify(parsed.data.preferences || []),
    status: "active",
    customerId: customer.id,
  };

  const subscriber = existing
    ? await prisma.subscriber.update({ where: { id: existing.id }, data })
    : await prisma.subscriber.create({ data });

  await prisma.customerNote.create({
    data: {
      customerId: customer.id,
      type: "subscription",
      body: `Website signup: email ${data.emailOptIn ? "on" : "off"}, SMS ${data.smsOptIn ? "on" : "off"}.`,
    },
  });

  let savedPreferences: string[] = [];
  try {
    savedPreferences = JSON.parse(subscriber.preferences || "[]") as string[];
  } catch {
    savedPreferences = [];
  }

  const sync = await upsertMailchimpSubscriber({
    email: subscriber.email,
    phone: subscriber.phone,
    name: customer.name,
    emailOptIn: subscriber.emailOptIn,
    smsOptIn: subscriber.smsOptIn,
    preferences: savedPreferences,
  });

  if (sync.ok && "memberId" in sync && sync.memberId) {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { mailchimpMemberId: sync.memberId },
    });
  } else if (!sync.ok) {
    await prisma.auditLog.create({
      data: {
        action: "subscriber.mailchimp_sync_failed",
        meta: JSON.stringify({
          subscriberId: subscriber.id,
          error: "error" in sync ? sync.error : "Mailchimp sync failed",
        }),
      },
    });
  }

  // Always show a visitor-friendly message. Sync failures stay in admin/audit.
  return {
    ok: true,
    message: "Thanks for subscribing. Your preferences are saved.",
  };
}

function todayInNewYork() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: siteConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const appointmentSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name.").max(120),
  email: z.string().trim().email("Enter a valid email address.").max(160),
  phone: z.string().trim().min(7, "Enter a phone number.").max(40),
  service: z.enum(appointmentServices as [string, ...string[]]),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose a preferred date."),
  preferredTime: z.enum(appointmentTimes as [string, ...string[]]),
  method: z.enum(appointmentMethods),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function submitAppointmentRequestAction(
  _prev: PublicFormResult,
  formData: FormData,
): Promise<PublicFormResult> {
  const parsed = appointmentSchema.safeParse({
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    service: String(formData.get("service") || ""),
    preferredDate: String(formData.get("preferredDate") || ""),
    preferredTime: String(formData.get("preferredTime") || ""),
    method: String(formData.get("method") || ""),
    notes: String(formData.get("notes") || ""),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Check the form and try again.",
    };
  }

  if (parsed.data.preferredDate < todayInNewYork()) {
    return { ok: false, error: "Choose a date that is today or later." };
  }

  const name = parsed.data.name.trim();
  const email = parsed.data.email.trim().toLowerCase();
  const phone = parsed.data.phone.trim();
  const notes = parsed.data.notes?.trim() || null;
  const when = `${parsed.data.preferredDate} at ${formatTimeLabel(parsed.data.preferredTime)}`;
  const methodLabel = parsed.data.method.replace(/-/g, " ");

  try {
    const existing = await prisma.customer.findFirst({ where: { email } });
    const customer = existing
      ? await prisma.customer.update({
          where: { id: existing.id },
          data: { phone: existing.phone || phone },
        })
      : await prisma.customer.create({
          data: { name, email, phone },
        });

    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone,
        service: parsed.data.service,
        preferredDate: parsed.data.preferredDate,
        preferredTime: parsed.data.preferredTime,
        method: parsed.data.method,
        notes,
        status: "requested",
        customerId: customer.id,
      },
    });

    const notification = await sendSingleRecipientNotification({
      to: siteConfig.notifyEmail,
      fromName: siteConfig.brandName,
      replyTo: siteConfig.notifyEmail,
      subject: `New appointment request · ${name}`,
      text: [
        "A new appointment request was submitted on the website.",
        "",
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Service: ${parsed.data.service}`,
        `Preferred time: ${when}`,
        `Meeting type: ${methodLabel}`,
        `Details: ${notes || "None"}`,
        "",
        "Open Admin → Appointments to review it.",
      ].join("\n"),
    });

    const emailNote = notification.ok
      ? `Notification emailed to ${siteConfig.notifyEmail}.`
      : `Request saved. Notification email was not sent${notification.error ? `: ${notification.error}` : "."}`;

    await prisma.customerNote.create({
      data: {
        customerId: customer.id,
        type: "appointment",
        body: `Appointment request for ${parsed.data.service} on ${when} (${methodLabel}). ${emailNote}`,
      },
    });

    if (!notification.ok) {
      await prisma.auditLog.create({
        data: {
          action: "appointment.notify_failed",
          meta: JSON.stringify({
            appointmentId: appointment.id,
            error: notification.error || "Mailchimp notification failed",
          }),
        },
      });
    }

    revalidatePath("/admin");
    revalidatePath("/admin/appointments");
    revalidatePath("/admin/customers");

    return {
      ok: true,
      message:
        "Your appointment request was sent. The office will follow up to confirm a time.",
    };
  } catch (error) {
    console.error("[appointment] save failed", error);
    return {
      ok: false,
      error:
        "We couldn't save your request. Please call the office and we'll book it with you.",
    };
  }
}
