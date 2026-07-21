import "server-only";

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const journalDirectory = path.join(process.cwd(), "src/content/journal");
const validSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type JournalEntry = {
  slug: string;
  title: string;
  description: string;
  pinned: boolean;
  markdown: string;
};

function titleFromMarkdown(markdown: string, slug: string) {
  const heading = markdown.match(/^#\s+(.+)$/m);

  return heading?.[1].trim() ?? slug.replaceAll("-", " ");
}

export async function getJournalEntry(slug: string): Promise<JournalEntry | null> {
  if (!validSlug.test(slug)) {
    return null;
  }

  try {
    const source = await readFile(
      path.join(journalDirectory, `${slug}.md`),
      "utf8",
    );
    const { content: markdown, data } = matter(source);

    return {
      slug,
      title: titleFromMarkdown(markdown, slug),
      description:
        typeof data.description === "string" ? data.description.trim() : "",
      pinned: data.pinned === true,
      markdown,
    };
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  const files = await readdir(journalDirectory, { withFileTypes: true });
  const entries = await Promise.all(
    files
      .filter((file) => file.isFile() && file.name.endsWith(".md"))
      .map((file) => getJournalEntry(file.name.slice(0, -3))),
  );

  return entries
    .filter((entry): entry is JournalEntry => entry !== null)
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        a.title.localeCompare(b.title),
    );
}
