import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  const opportunity = await prisma.opportunity.findFirst({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      assignedToUserId: true,
      assignments: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          assignedToUserId: true,
          assignedByUserId: true,
          assignedAt: true,
          unassignedAt: true,
          createdAt: true,
        },
      },
    },
  });

  if (!opportunity) {
    console.log("No opportunities found.");
    return;
  }

  console.dir(opportunity, { depth: null });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });