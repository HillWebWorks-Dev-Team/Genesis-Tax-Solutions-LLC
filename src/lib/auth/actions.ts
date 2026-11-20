"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  changeAdminPassword,
  createAdminFromSetupCode,
  getAdminById,
  hasAdminUser,
  isValidSetupCode,
  verifyAdminCredentials,
} from "@/lib/auth/admin";
import {
  clearSessionCookie,
  createSessionToken,
  getSession,
  setSessionCookie,
} from "@/lib/auth/session";
import { prisma } from "@/lib/db";

const setupSchema = z.object({
  setupCode: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type ActionResult = {
  ok: boolean;
  error?: string;
};

export async function setupAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  if (await hasAdminUser()) {
    return { ok: false, error: "Admin account already exists. Please sign in." };
  }

  const parsed = setupSchema.safeParse({
    setupCode: formData.get("setupCode"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Enter the setup code." };
  }

  if (!isValidSetupCode(parsed.data.setupCode)) {
    return { ok: false, error: "Invalid setup code." };
  }

  const user = await createAdminFromSetupCode();
  await prisma.auditLog.create({
    data: {
      action: "admin.setup",
      actorId: user.id,
      meta: JSON.stringify({ email: user.email }),
    },
  });

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);
  redirect("/admin/settings/");
}

export async function loginAdminAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email and password." };
  }

  const user = await verifyAdminCredentials(
    parsed.data.email,
    parsed.data.password,
  );
  if (!user) {
    return { ok: false, error: "Incorrect email or password." };
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
  });
  await setSessionCookie(token);
  redirect("/admin/");
}

export async function logoutAdminAction() {
  await clearSessionCookie();
  redirect("/admin/login/");
}

export async function changePasswordAction(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, error: "You must be signed in." };
  }

  const admin = await getAdminById(session.sub);
  if (!admin) {
    return { ok: false, error: "Admin not found." };
  }

  const nextPassword = String(formData.get("nextPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  const currentPassword = String(formData.get("currentPassword") || "");

  if (nextPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters." };
  }

  if (nextPassword !== confirmPassword) {
    return { ok: false, error: "New passwords do not match." };
  }

  if (!admin.mustChangePassword && !currentPassword) {
    return { ok: false, error: "Enter your current password." };
  }

  const result = await changeAdminPassword(
    session.sub,
    currentPassword,
    nextPassword,
  );

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  await prisma.auditLog.create({
    data: {
      action: "admin.password_change",
      actorId: session.sub,
    },
  });

  if (admin.mustChangePassword) {
    redirect("/admin/");
  }

  return { ok: true };
}
