"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  ensureAdminForAccessCodeLogin,
  getAdminAccountState,
  isValidSetupCode,
} from "@/lib/auth/admin";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const accessCodeSchema = z.object({
  accessCode: z.string().min(1),
});

export type ActionResult = {
  ok: boolean;
  error?: string;
};

const databaseUnavailable =
  "The database is unavailable. Try again in a moment.";

export async function loginAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const account = await getAdminAccountState();
  if (account === "unavailable") {
    return { ok: false, error: databaseUnavailable };
  }

  const parsed = accessCodeSchema.safeParse({
    accessCode: formData.get("accessCode") || formData.get("setupCode"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Enter the access code." };
  }

  if (!isValidSetupCode(parsed.data.accessCode)) {
    return { ok: false, error: "Invalid access code." };
  }

  let user: Awaited<ReturnType<typeof ensureAdminForAccessCodeLogin>>;
  try {
    user = await ensureAdminForAccessCodeLogin();
  } catch (error) {
    const state = await getAdminAccountState();
    if (state === "unavailable") {
      return { ok: false, error: databaseUnavailable };
    }
    throw error;
  }

  await prisma.auditLog.create({
    data: {
      action: "admin.login",
      actorId: user.id,
      meta: JSON.stringify({ method: "access_code" }),
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);
  redirect("/admin/");
}

/** Kept for old bookmarks; same flow as login. */
export async function setupAdminAction(
  prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  return loginAdminAction(prev, formData);
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  redirect("/admin/login/");
}
