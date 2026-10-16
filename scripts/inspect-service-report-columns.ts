import "dotenv/config";

import { prisma } from "../lib/prisma";

async function main() {
  const columns = await prisma.$queryRaw<
    Array<{
      column_name: string;
      data_type: string;
      is_nullable: string;
    }>
  >`
    SELECT
      column_name,
      data_type,
      is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'service_reports'
      AND column_name IN (
        'publicTokenHash',
        'publicTokenExpiresAt',
        'publicTokenRevokedAt'
      )
    ORDER BY column_name
  `;

  console.log(
    "Service report customer-access columns:",
    JSON.stringify(columns, null, 2),
  );
}

main()
  .catch((error: unknown) => {
    console.error("Column inspection failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
