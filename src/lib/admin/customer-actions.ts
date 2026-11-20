"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { upsertMailchimpSubscriber } from "@/lib/mailchimp/client";

export type CustomerActionResult = {
  ok: boolean;
  error?: string;
};

async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

function emptyToNull(value: FormDataEntryValue | string | null | undefined) {
  const text = String(value || "").trim();
  return text ? text : null;
}

const customerSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

async function logHistory(
  customerId: string,
  type: string,
  body: string,
  actorId?: string,
) {
  await prisma.customerNote.create({
    data: {
      customerId,
      type,
      body,
      createdBy: actorId || null,
    },
  });
}

export async function createCustomerAction(
  _prev: CustomerActionResult,
  formData: FormData,
): Promise<CustomerActionResult> {
  const session = await requireAdmin();
  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Enter a valid name. Email must be valid if provided." };
  }

  const email = emptyToNull(parsed.data.email);
  const phone = emptyToNull(parsed.data.phone);
  const notes = emptyToNull(parsed.data.notes);

  const customer = await prisma.customer.create({
    data: {
      name: parsed.data.name.trim(),
      email: email?.toLowerCase() || null,
      phone,
      notes,
    },
  });

  await logHistory(
    customer.id,
    "system",
    "Customer record created in admin.",
    session.sub,
  );
  await prisma.auditLog.create({
    data: {
      action: "customer.create",
      actorId: session.sub,
      meta: JSON.stringify({ id: customer.id }),
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath("/admin");
  redirect(`/admin/customers/${customer.id}/`);
}

export async function updateCustomerAction(
  _prev: CustomerActionResult,
  formData: FormData,
): Promise<CustomerActionResult> {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return { ok: false, error: "Missing customer id." };

  const parsed = customerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Enter a valid name. Email must be valid if provided." };
  }

  const email = emptyToNull(parsed.data.email);
  const phone = emptyToNull(parsed.data.phone);
  const notes = emptyToNull(parsed.data.notes);

  await prisma.customer.update({
    where: { id },
    data: {
      name: parsed.data.name.trim(),
      email: email?.toLowerCase() || null,
      phone,
      notes,
    },
  });

  await logHistory(
    id,
    "system",
    "Customer contact details updated.",
    session.sub,
  );
  await prisma.auditLog.create({
    data: {
      action: "customer.update",
      actorId: session.sub,
      meta: JSON.stringify({ id }),
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath(`/admin/customers/${id}`);
  return { ok: true };
}

export async function deleteCustomerAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.enquiry.updateMany({
    where: { customerId: id },
    data: { customerId: null },
  });
  await prisma.appointment.updateMany({
    where: { customerId: id },
    data: { customerId: null },
  });
  await prisma.subscriber.deleteMany({ where: { customerId: id } });
  await prisma.customerNote.deleteMany({ where: { customerId: id } });
  await prisma.customer.delete({ where: { id } });

  await prisma.auditLog.create({
    data: {
      action: "customer.delete",
      actorId: session.sub,
      meta: JSON.stringify({ id }),
    },
  });

  revalidatePath("/admin/customers");
  revalidatePath("/admin");
  redirect("/admin/customers/");
}

export async function addCustomerNoteAction(
  _prev: CustomerActionResult,
  formData: FormData,
): Promise<CustomerActionResult> {
  const session = await requireAdmin();
  const customerId = String(formData.get("customerId") || "");
  const body = String(formData.get("body") || "").trim();

  if (!customerId || body.length < 2) {
    return { ok: false, error: "Enter a note before saving." };
  }

  await logHistory(customerId, "note", body, session.sub);
  await prisma.customer.update({
    where: { id: customerId },
    data: { updatedAt: new Date() },
  });

  revalidatePath(`/admin/customers/${customerId}`);
  return { ok: true };
}

export async function updateCustomerSubscriptionAction(
  _prev: CustomerActionResult,
  formData: FormData,
): Promise<CustomerActionResult> {
  const session = await requireAdmin();
  const customerId = String(formData.get("customerId") || "");
  if (!customerId) return { ok: false, error: "Missing customer." };

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
    include: { subscriber: true },
  });
  if (!customer) return { ok: false, error: "Customer not found." };

  const emailOptIn = formData.get("emailOptIn") === "on";
  const smsOptIn = formData.get("smsOptIn") === "on";
  const status = String(formData.get("status") || "active");
  const preferences = formData
    .getAll("preferences")
    .map(String)
    .filter(Boolean);

  if (emailOptIn && !customer.email) {
    return {
      ok: false,
      error: "Add an email address to the customer before enabling email opt-in.",
    };
  }
  if (smsOptIn && !customer.phone) {
    return {
      ok: false,
      error: "Add a phone number to the customer before enabling SMS opt-in.",
    };
  }

  const data = {
    email: customer.email,
    phone: customer.phone,
    emailOptIn,
    smsOptIn,
    status,
    preferences: JSON.stringify(preferences),
  };

  if (customer.subscriber) {
    await prisma.subscriber.update({
      where: { id: customer.subscriber.id },
      data,
    });
  } else if (emailOptIn || smsOptIn) {
    await prisma.subscriber.create({
      data: {
        ...data,
        customerId,
      },
    });
  } else {
    return { ok: true };
  }

  await logHistory(
    customerId,
    "subscription",
    `Subscription updated: email ${emailOptIn ? "on" : "off"}, SMS ${smsOptIn ? "on" : "off"}, status ${status}.`,
    session.sub,
  );

  const sync = await upsertMailchimpSubscriber({
    email: customer.email,
    phone: customer.phone,
    emailOptIn,
    smsOptIn,
    preferences,
  });

  if (sync.ok && "memberId" in sync && sync.memberId) {
    await prisma.subscriber.updateMany({
      where: { customerId },
      data: { mailchimpMemberId: sync.memberId },
    });
  }

  revalidatePath(`/admin/customers/${customerId}`);
  revalidatePath("/admin/subscribers");
  revalidatePath("/admin/campaigns");
  return { ok: true };
}
