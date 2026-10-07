import type { ManagedServiceSla } from "@/generated/prisma/client";

export type SlaTarget = {
  firstResponseHours: number;
  resolutionHours: number;
};

const SLA_TARGETS: Record<ManagedServiceSla, SlaTarget> = {
  BASIC: {
    firstResponseHours: 8,
    resolutionHours: 72,
  },
  STANDARD: {
    firstResponseHours: 4,
    resolutionHours: 48,
  },
  PRIORITY: {
    firstResponseHours: 2,
    resolutionHours: 24,
  },
  PREMIUM: {
    firstResponseHours: 1,
    resolutionHours: 4,
  },
};

export function getSlaTarget(
  sla: ManagedServiceSla,
): SlaTarget {
  return SLA_TARGETS[sla];
}

export function calculateSlaDeadline(
  start: Date,
  hours: number,
): Date {
  return new Date(
    start.getTime() + hours * 60 * 60 * 1000,
  );
}