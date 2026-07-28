import { Pin } from "lucide-react";
import Link from "next/link";

import { getJournalEntries } from "@/lib/journal";

export default async function Journal() {
  const entries = await getJournalEntries();

  return (
    <div className="px-4 py-24">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <h1 className="text-3xl">Journal</h1>

        <div className="flex flex-col">
          {entries.map((entry) => (
            <Link
              className="group border-b-2 border-white px-3 py-5 text-lg transition hover:bg-white hover:text-black"
              href={`/journal/${entry.slug}`}
              key={entry.slug}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl">{entry.title}</h2>
                {entry.pinned ? (
                  <span title="Pinned entry">
                    <Pin aria-hidden="true" className="size-4" />
                    <span className="sr-only">Pinned entry</span>
                  </span>
                ) : null}
              </div>
              {entry.description ? (
                <p className="mt-2 text-base text-neutral-300 transition-colors group-hover:text-black">
                  {entry.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
