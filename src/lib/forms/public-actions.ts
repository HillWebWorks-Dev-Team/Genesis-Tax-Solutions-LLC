"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";
import {
  AVAILABILITY_TAG,
  assertSlotIsBookable,
} from "@/lib/availability";
import { prisma } from "@/lib/db";
import { notifyOfficeOfBooking } from "@/lib/email/notifications";
import {
  appointmentEmailCopy,
  sendEmail,
} from "@/lib/email/send";
import { upsertMailchimpSubscriber } from "@/lib/mailchimp/client";

export type PublicFormResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

async function upsertCustomer(input: {
  name: string;
  email?: string | null;
  phone?: string | null;
}) {
  const email = input.email?.trim().toLowerCase() || null;
  const phone = input.phone?.trim() || null;

  if (email) {
    const existing = await prisma.customer.findFirst({ where: { email } });
    if (existing) {
      return prisma.customer.update({
        where: { id: existing.id },
        data: {
          name: input.name.trim(),
          phone: phone || existing.phone,
        },
      });
    }
  }

  return prisma.customer.create({
    data: {
      name: input.name.trim(),
      email,
      phone,
    },
  });
}

const contactSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  message: z.string().min(5).max(5000),
});

export async function submitContactAction(
  _prev: PublicFormResult,
  formData: FormData,
): Promise<PublicFormResult> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: String(formData.get("phone") || "") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please complete your name, email, and message.",
    };
  }

  const customer = await upsertCustomer(parsed.data);
  await prisma.enquiry.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      message: parsed.data.message,
      customerId: customer.id,
    },
  });
  await prisma.customerNote.create({
    data: {
      customerId: customer.id,
      type: "enquiry",
      body: `Contact form message received: ${parsed.data.message}`,
    },
  });

  return {
    ok: true,
    message: "Thanks. Your message was received. We will respond soon.",
  };
}

const bookingSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(40),
  service: z.string().min(2).max(80),
  date: z.string().min(8).max(20),
  time: z.string().min(4).max(20),
  method: z.string().min(2).max(40),
  notes: z.string().max(5000).optional(),
  privacy: z.literal("on"),
});

export async function submitBookingAction(
  _prev: PublicFormResult,
  formData: FormData,
): Promise<PublicFormResult> {
  const parsed = bookingSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    service: formData.get("service"),
    date: formData.get("date"),
    time: formData.get("time"),
    method: formData.get("method") || "in-office",
    notes: String(formData.get("notes") || "") || undefined,
    privacy: formData.get("privacy"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Please complete all required fields and accept the privacy notice.",
    };
  }

  const slotOk = await assertSlotIsBookable(
    parsed.data.date,
    parsed.data.time,
  );
  if (!slotOk) {
    return {
      ok: false,
      error:
        "That time is no longer available. Please choose another open slot.",
    };
  }

  const customer = await upsertCustomer(parsed.data);
  const appointment = await prisma.appointment.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      service: parsed.data.service,
      preferredDate: parsed.data.date,
      preferredTime: parsed.data.time,
      method: parsed.data.method,
      notes: parsed.data.notes || null,
      customerId: customer.id,
    },
  });
  await prisma.customerNote.create({
    data: {
      customerId: customer.id,
      type: "appointment",
      body: `Appointment requested: ${parsed.data.service} on ${parsed.data.date} at ${parsed.data.time} (${parsed.data.method}).`,
    },
  });

  const copy = appointmentEmailCopy(appointment);
  await sendEmail({
    to: appointment.email,
    subject: copy.subject,
    html: copy.html,
    text: copy.text,
  });
  await notifyOfficeOfBooking(appointment.id);
  revalidateTag(AVAILABILITY_TAG, "max");

  return {
    ok: true,
    message:
      "Thanks. Your appointment request was received. We will confirm availability shortly.",
  };
}

const subscribeSchema = z
  .object({
    email: z.string().email().optional().or(z.literal("")),
    phone: z.string().max(40).optional().or(z.literal("")),
    emailConsent: z.enum(["on", "off"]),
    smsConsent: z.enum(["on", "off"]),
    preferences: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const emailOptIn = data.emailConsent === "on";
    const smsOptIn = data.smsConsent === "on";
    if (!emailOptIn && !smsOptIn) {
      ctx.addIssue({
        code: "custom",
        message: "Choose email, SMS, or both to continue.",
      });
    }
    if (emailOptIn && !data.email) {
      ctx.addIssue({
        code: "custom",
        message: "Enter your email address to subscribe by email.",
      });
    }
    if (smsOptIn && !data.phone) {
      ctx.addIssue({
        code: "custom",
        message: "Enter your mobile number to subscribe by SMS.",
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
    email: String(formData.get("email") || ""),
    phone: String(formData.get("phone") || ""),
    emailConsent: formData.get("emailConsent") || "off",
    smsConsent: formData.get("smsConsent") || "off",
    preferences,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message || "Unable to subscribe.",
    };
  }

  const email =
    parsed.data.emailConsent === "on"
      ? parsed.data.email!.trim().toLowerCase()
      : null;
  const phone =
    parsed.data.smsConsent === "on" ? parsed.data.phone!.trim() : null;

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

  const customer =
    linkedCustomer ||
    (await prisma.customer.create({
      data: {
        name: email || phone || "Subscriber",
        email,
        phone,
      },
    }));

  const data = {
    email,
    phone,
    emailOptIn: parsed.data.emailConsent === "on",
    smsOptIn: parsed.data.smsConsent === "on",
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
    emailOptIn: subscriber.emailOptIn,
    smsOptIn: subscriber.smsOptIn,
    preferences: savedPreferences,
  });

  if (sync.ok && "memberId" in sync && sync.memberId) {
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: { mailchimpMemberId: sync.memberId },
    });
  }

  return {
    ok: true,
    message: sync.ok
      ? "Thanks for subscribing. Your preferences are saved."
      : "Thanks for subscribing. Your preferences are saved locally. Mailchimp sync needs attention in admin.",
  };
}
