import type { Origin } from "@/generated/prisma/client";

export type ImageModel = {
  id: string;
  blobId: string;
  name: string;
  width: number;
  height: number;
  origin: Origin;
  alt_text: string | null;
};