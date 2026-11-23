"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { upsertMailchimpSubscriber } from "@/lib/mailchimp/client";

export type PublicFormResult = {
  ok: boolean;
  error?: string;
  message?: string;
};

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
