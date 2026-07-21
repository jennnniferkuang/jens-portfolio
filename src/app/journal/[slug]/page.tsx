import type { Metadata } from "next";
import { notFound } from "next/navigation";

import JournalEntry from "@/components/journal-entry";
import { getJournalEntries, getJournalEntry } from "@/lib/journal";

type JournalEntryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const entries = await getJournalEntries();

  return entries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: JournalEntryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getJournalEntry(slug);

  return {
    title: entry?.title ?? "Journal entry not found",
    description: entry?.description,
  };
}

export default async function JournalEntryPage({
  params,
}: JournalEntryPageProps) {
  const { slug } = await params;
  const entry = await getJournalEntry(slug);

  if (!entry) {
    notFound();
  }

  return (
    <main className="px-4 py-24">
      <JournalEntry markdown={entry.markdown} />
    </main>
  );
}
