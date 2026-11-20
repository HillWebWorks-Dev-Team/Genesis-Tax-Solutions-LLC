"use server";

import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { revalidatePath, revalidateTag } from "next/cache";
import { SITE_CONTENT_TAG } from "@/lib/content/public-content";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

function revalidatePublic() {
  revalidateTag(SITE_CONTENT_TAG, "max");
  revalidatePath("/", "layout");
  revalidatePath("/admin/content");
}

export async function saveContentFieldAction(formData: FormData) {
  const session = await requireAdmin();
  const key = String(formData.get("key") || "").trim();
  const type = String(formData.get("type") || "text");
  let value = String(formData.get("value") || "");

  if (!key) return;

  if (type === "toggle") {
    value = formData.get("value") === "on" ? "true" : "false";
  }

  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: value.trim() },
    update: { value: value.trim() },
  });

  await prisma.auditLog.create({
    data: {
      action: "content.update",
      actorId: session.sub,
      meta: JSON.stringify({ key }),
    },
  });

  revalidatePublic();
}

export async function uploadContentImageAction(formData: FormData) {
  const session = await requireAdmin();
  const key = String(formData.get("key") || "").trim();
  const file = formData.get("file");

  if (!key || !(file instanceof File) || file.size === 0) {
    return { ok: false as const, error: "Choose an image file to upload." };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { ok: false as const, error: "Image must be 5MB or smaller." };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type)) {
    return {
      ok: false as const,
      error: "Upload a JPG, PNG, WebP, or GIF image.",
    };
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : file.type === "image/gif"
          ? "gif"
          : "jpg";

  const fileName = `${key.replace(/[^a-z0-9_-]/gi, "-")}-${randomBytes(8).toString("hex")}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "cms");
  await mkdir(uploadDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, fileName), buffer);

  const publicPath = `/uploads/cms/${fileName}`;
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: publicPath },
    update: { value: publicPath },
  });

  await prisma.auditLog.create({
    data: {
      action: "content.image_upload",
      actorId: session.sub,
      meta: JSON.stringify({ key, publicPath }),
    },
  });

  revalidatePublic();
  return { ok: true as const, path: publicPath };
}

export async function clearContentImageAction(formData: FormData) {
  const session = await requireAdmin();
  const key = String(formData.get("key") || "").trim();
  if (!key) return;

  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value: "" },
    update: { value: "" },
  });

  await prisma.auditLog.create({
    data: {
      action: "content.image_clear",
      actorId: session.sub,
      meta: JSON.stringify({ key }),
    },
  });

  revalidatePublic();
}
