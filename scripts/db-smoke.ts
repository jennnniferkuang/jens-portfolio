import "dotenv/config";

function redactSecrets(value: string) {
  return value
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[redacted database URL]")
    .replace(/(password\s*[=:]\s*)\S+/gi, "$1[redacted]");
}

function getErrorDetails(error: unknown) {
  if (!(error instanceof Error)) {
    return "Unknown database error";
  }

  const prismaCode =
    "code" in error && typeof error.code === "string"
      ? ` (${error.code})`
      : "";

  const meta =
    "meta" in error &&
    error.meta !== null &&
    typeof error.meta === "object"
      ? error.meta
      : undefined;

  const databaseCode =
    meta &&
    "code" in meta &&
    typeof meta.code === "string"
      ? `; database code ${meta.code}`
      : "";

  const databaseMessage =
    meta &&
    "message" in meta &&
    typeof meta.message === "string"
      ? `: ${redactSecrets(meta.message)}`
      : `: ${redactSecrets(error.message)}`;

  return `${error.name}${prismaCode}${databaseCode}${databaseMessage}`;
}

async function main() {
  let prisma: Awaited<
    ReturnType<typeof importPrismaClient>
  >["prisma"] | undefined;

  try {
    ({ prisma } = await importPrismaClient());

    const startedAt = performance.now();
    await prisma.$connect();

    const result = await prisma.$queryRaw<Array<{ ok: number }>>`
      SELECT 1 AS "ok"
    `;

    if (result[0]?.ok !== 1) {
      throw new Error("Database returned an unexpected smoke-test result.");
    }

    const durationMs = Math.round(performance.now() - startedAt);
    console.log(`Database connection successful (${durationMs} ms).`);
  } catch (error) {
    console.error(`Database connection failed: ${getErrorDetails(error)}.`);
    console.error(
      "Check DATABASE_URL, the Prisma user's password, and the Supabase pooler host.",
    );
    process.exitCode = 1;
  } finally {
    await prisma?.$disconnect();
  }
}

function importPrismaClient() {
  return import("../src/lib/prisma");
}

void main();
