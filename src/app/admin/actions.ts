"use server";

import { randomUUID } from "node:crypto";
import { imageSize } from "image-size";
import { redirect } from "next/navigation";
import { Origin } from "@/generated/prisma/client";
import { isSoleAdmin, requireAdmin } from "@/lib/auth/admin";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const MEDIA_BUCKET = "portfolio-media";
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const allowedOrigins = new Set<Origin>(Object.values(Origin));

export async function login(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    redirect("/admin/login?error=missing");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    redirect("/admin/login?error=invalid");
  }

  if (!(await isSoleAdmin(data.user.id))) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=unauthorized");
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function safeFileName(fileName: string) {
  const extension = fileName.toLowerCase().match(/\.[a-z0-9]{1,10}$/)?.[0] ?? "";
  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return `${baseName || "image"}${extension}`;
}

async function ensureMediaBucket() {
  const supabase = createAdminClient();
  const { data } = await supabase.storage.getBucket(MEDIA_BUCKET);

  if (!data) {
    const { error } = await supabase.storage.createBucket(MEDIA_BUCKET, {
      public: true,
      allowedMimeTypes: ["image/*"],
      fileSizeLimit: MAX_IMAGE_SIZE,
    });

    if (error) {
      throw new Error("Unable to create the media bucket.", { cause: error });
    }
  }

  return supabase;
}

export async function uploadImage(origin: Origin, formData: FormData) {
  await requireAdmin();

  if (!allowedOrigins.has(origin)) {
    redirect("/admin?tab=gallery&error=invalid-origin");
  }

  const file = formData.get("image");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin?tab=gallery&error=missing-image");
  }

  if (!file.type.startsWith("image/")) {
    redirect("/admin?tab=gallery&error=invalid-image");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    redirect("/admin?tab=gallery&error=image-too-large");
  }

  const imageBytes = new Uint8Array(await file.arrayBuffer());
  let dimensions: ReturnType<typeof imageSize>;

  try {
    dimensions = imageSize(imageBytes);
  } catch {
    redirect("/admin?tab=gallery&error=invalid-image");
  }

  const path = `${origin.toLowerCase()}/${randomUUID()}-${safeFileName(file.name)}`;
  const supabase = await ensureMediaBucket();
  const { error: uploadError } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, imageBytes, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Admin image upload failed.", uploadError);
    redirect("/admin?tab=gallery&error=upload-failed");
  }

  try {
    await prisma.image.create({
      data: {
        name: file.name,
        width: dimensions.width,
        height: dimensions.height,
        origin,
        blob: {
          create: {
            bucket: MEDIA_BUCKET,
            path,
            media_type: file.type,
            size: file.size,
          },
        },
      },
    });
  } catch (error) {
    await supabase.storage.from(MEDIA_BUCKET).remove([path]);
    console.error("Admin image metadata write failed.", error);
    redirect("/admin?tab=gallery&error=database-write-failed");
  }

  redirect("/admin?tab=gallery&success=image-uploaded");
}

export async function createJournalEntry(formData: FormData) {
  await requireAdmin();

  const title = formData.get("title");
  const description = formData.get("description");
  const content = formData.get("content");

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    typeof content !== "string" ||
    !title.trim() ||
    !description.trim() ||
    !content.trim()
  ) {
    redirect("/admin?tab=journal&error=missing-journal-fields");
  }

  try {
    await prisma.journalEntry.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        pinned: formData.get("pinned") === "on",
        published_at: new Date(),
      },
    });
  } catch (error) {
    console.error("Admin journal write failed.", error);
    redirect("/admin?tab=journal&error=database-write-failed");
  }

  redirect("/admin?tab=journal&success=journal-created");
}
