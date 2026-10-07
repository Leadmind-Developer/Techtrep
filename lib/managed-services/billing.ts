import type { ManagedServiceBillingFrequency } from "@/generated/prisma/client";

export function calculateNextBillingDate(
start: Date,
frequency: ManagedServiceBillingFrequency,
): Date {
const next = new Date(start);

switch (frequency) {
case "MONTHLY":
next.setMonth(next.getMonth() + 1);
break;

case "QUARTERLY":
  next.setMonth(next.getMonth() + 3);
  break;

case "ANNUALLY":
  next.setFullYear(next.getFullYear() + 1);
  break;

default:
  throw new Error(
    `Unsupported billing frequency: ${frequency}`,
  );
}

return next;
}
