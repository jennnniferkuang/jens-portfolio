import "server-only";

import { randomInt } from "node:crypto";

import { Origin } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

function shuffle<T>(values: T[]) {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

export async function getGalleryImageSources(limit: number) {
  if (limit <= 0) {
    return [];
  }

  const images = await prisma.image.findMany({
    where: {
      origin: Origin.GALLERY,
    },
    select: {
      blob: {
        select: {
          bucket: true,
          path: true,
        },
      },
    },
  });

  const supabase = createAdminClient();
  const uniqueSources = Array.from(
    new Set(
      images.map(
        ({ blob }) =>
          supabase.storage.from(blob.bucket).getPublicUrl(blob.path).data
            .publicUrl,
      ),
    ),
  );

  return shuffle(uniqueSources).slice(0, limit);
}
