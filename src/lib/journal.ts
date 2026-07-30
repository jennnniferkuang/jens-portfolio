import "server-only";

import { prisma } from "@/lib/prisma";

const validId =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type JournalEntry = {
  slug: string;
  title: string;
  description: string;
  pinned: boolean;
  content: string;
};

export type JournalEntrySummary = Omit<JournalEntry, "content">;

export async function getJournalEntry(
  slug: string,
): Promise<JournalEntry | null> {
  if (!validId.test(slug)) {
    return null;
  }

  const entry = await prisma.journalEntry.findFirst({
    where: {
      id: slug,
      published_at: { not: null },
    },
    select: {
      id: true,
      title: true,
      description: true,
      pinned: true,
      content: true,
    },
  });

  if (!entry) {
    return null;
  }

  return {
    slug: entry.id,
    title: entry.title,
    description: entry.description,
    pinned: entry.pinned,
    content: entry.content,
  };
}

export async function getJournalEntries(): Promise<JournalEntrySummary[]> {
  const entries = await prisma.journalEntry.findMany({
    where: {
      published_at: { not: null },
    },
    orderBy: [
      { pinned: "desc" },
      { published_at: "desc" },
      { created_at: "desc" },
    ],
    select: {
      id: true,
      title: true,
      description: true,
      pinned: true,
    },
  });

  return entries.map((entry) => ({
    slug: entry.id,
    title: entry.title,
    description: entry.description,
    pinned: entry.pinned,
  }));
}
