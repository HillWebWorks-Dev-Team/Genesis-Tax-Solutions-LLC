"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { getSession } from "@/lib/auth/session";
import {
  AVAILABILITY_TAG,
  ensureDefaultAvailability,
} from "@/lib/availability";
import { prisma } from "@/lib/db";

function revalidateAvailability() {
  revalidateTag(AVAILABILITY_TAG, "max");
  revalidatePath("/admin/availability");
  revalidatePath("/book-appointment");
}

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function saveWeeklyHoursAction(formData: FormData) {
  const session = await requireAdmin();
  await ensureDefaultAvailability();

  const rules = await prisma.availabilityRule.findMany();
  for (const rule of rules) {
    const active = formData.get(`active_${rule.weekday}`) === "on";
    const startTime = String(formData.get(`start_${rule.weekday}`) || rule.startTime);
    const endTime = String(formData.get(`end_${rule.weekday}`) || rule.endTime);

    await prisma.availabilityRule.update({
      where: { id: rule.id },
      data: {
        active,
        startTime,
        endTime,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: "availability.hours_update",
      actorId: session.sub,
    },
  });

  revalidateAvailability();
}

export async function addBlockedDateAction(formData: FormData) {
  const session = await requireAdmin();
  const date = String(formData.get("date") || "").trim();
  const reason = String(formData.get("reason") || "").trim();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;

  await prisma.blockedDate.upsert({
    where: { date },
    create: { date, reason: reason || null },
    update: { reason: reason || null },
  });

  await prisma.auditLog.create({
    data: {
      action: "availability.block_add",
      actorId: session.sub,
      meta: JSON.stringify({ date }),
    },
  });

  revalidateAvailability();
}

export async function removeBlockedDateAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.blockedDate.delete({ where: { id } });
  await prisma.auditLog.create({
    data: {
      action: "availability.block_remove",
      actorId: session.sub,
      meta: JSON.stringify({ id }),
    },
  });

  revalidateAvailability();
}
