import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";

export type AdminAccountState = "ready" | "missing" | "unavailable";

function isDatabaseUnavailable(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const record = error as { name?: string; code?: string; message?: string };
  if (record.name === "PrismaClientInitializationError") return true;
  if (record.code === "P1001" || record.code === "P1017") return true;
  const message = record.message || "";
  return (
    message.includes("Can't reach database server") ||
    message.includes("Server has closed the connection") ||
    message.includes("Error querying the database")
  );
}

export async function getAdminAccountState(): Promise<AdminAccountState> {
  try {
    const count = await prisma.adminUser.count();
    return count > 0 ? "ready" : "missing";
  } catch (error) {
    if (isDatabaseUnavailable(error)) return "unavailable";
    throw error;
  }
}

export async function hasAdminUser() {
  return (await getAdminAccountState()) === "ready";
}

export function getSetupCode() {
  return process.env.ADMIN_SETUP_CODE || "";
}

export function isValidSetupCode(code: string) {
  const expected = getSetupCode();
  if (!expected) return false;
  return code.trim() === expected;
}

export async function createAdminFromSetupCode() {
  const passwordHash = await bcrypt.hash(randomBytes(32).toString("hex"), 12);
  return prisma.adminUser.create({
    data: {
      name: siteConfig.ownerName,
      email: siteConfig.email.toLowerCase(),
      passwordHash,
      mustChangePassword: true,
    },
  });
}

export async function getAdminById(id: string) {
  return prisma.adminUser.findUnique({ where: { id } });
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  });
  if (!user) return null;
  if (user.mustChangePassword) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });
  return user;
}

export async function setAdminPassword(userId: string, nextPassword: string) {
  const passwordHash = await bcrypt.hash(nextPassword, 12);
  return prisma.adminUser.update({
    where: { id: userId },
    data: {
      passwordHash,
      mustChangePassword: false,
    },
  });
}

export async function changeAdminPassword(
  userId: string,
  currentPassword: string,
  nextPassword: string,
) {
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  if (!user) return { ok: false as const, error: "Admin not found." };

  if (user.mustChangePassword) {
    await setAdminPassword(userId, nextPassword);
    return { ok: true as const };
  }

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    return { ok: false as const, error: "Current password is incorrect." };
  }

  await setAdminPassword(userId, nextPassword);
  return { ok: true as const };
}
