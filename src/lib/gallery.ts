import "server-only";

import { randomInt } from "node:crypto";

import { Origin } from "@/generated/prisma/client";
import type { GalleryImage } from "@/lib/gallery-placement";
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

export async function getGalleryImages(
  limit: number,
): Promise<GalleryImage[]> {
  if (limit <= 0) {
    return [];
  }

  const images = await prisma.image.findMany({
    where: {
      origin: Origin.GALLERY,
    },
    include: {
      blob: {
        select: {
          bucket: true,
          path: true,
        },
      },
    },
  });

  const supabase = createAdminClient();
  const uniqueImages = Array.from(
    new Map(
      images.map(({ blob, ...image }) => {
        const src = supabase.storage
          .from(blob.bucket)
          .getPublicUrl(blob.path).data.publicUrl;

        return [
          image.id,
          {
            src,
            image,
          } satisfies GalleryImage,
        ];
      }),
    ).values(),
  );

  return shuffle(uniqueImages).slice(0, limit);
}
