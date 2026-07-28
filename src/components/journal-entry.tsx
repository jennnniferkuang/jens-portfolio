import ReactMarkdown, { type Components } from "react-markdown";

const markdownComponents: Components = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-semibold tracking-tight">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-10 text-3xl font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 text-2xl font-semibold">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="mt-5 text-lg leading-8 text-neutral-200">{children}</p>
  ),
  a: ({ children, href }) => (
    <a className="underline underline-offset-4" href={href}>
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-6 border-l-2 border-neutral-500 pl-5 italic text-neutral-300">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-neutral-200">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-neutral-200">
      {children}
    </ol>
  ),
  code: ({ children }) => (
    <code className="rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto rounded border border-neutral-800 bg-neutral-950 p-4">
      {children}
    </pre>
  ),
  hr: () => <hr className="my-8 border-neutral-700" />,
};

type JournalEntryProps = {
  markdown: string;
};

export default function JournalEntry({ markdown }: JournalEntryProps) {
  return (
    <article className="mx-auto max-w-2xl">
      <ReactMarkdown components={markdownComponents}>{markdown}</ReactMarkdown>
    </article>
  );
}
