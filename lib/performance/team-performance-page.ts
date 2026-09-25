import { requireRole } from "@/lib/auth/authorization";
import {
  getTeamPerformance,
  type TeamPerformance,
} from "@/lib/performance/team-performance";
import type { PerformancePeriod } from "@/lib/performance/staff-performance";

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getMonthRange(
  year: number,
  month: number,
): PerformancePeriod {
  return {
    from: new Date(year, month, 1),
    to: new Date(year, month + 1, 1),
  };
}

function parseDateInput(
  value: string | undefined,
): Date | null {
  if (!value || !DATE_INPUT_REGEX.test(value)) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getCustomRange(
  fromInput: string | undefined,
  toInput: string | undefined,
): PerformancePeriod | null {
  const from = parseDateInput(fromInput);
  const toDate = parseDateInput(toInput);

  if (!from || !toDate || from > toDate) {
    return null;
  }

  return {
    from,
    to: new Date(
      toDate.getFullYear(),
      toDate.getMonth(),
      toDate.getDate() + 1,
    ),
  };
}

function parsePeriod(
  period: string | undefined,
  fromInput?: string,
  toInput?: string,
): PerformancePeriod {
  const now = new Date();

  if (period === "last-month") {
    return getMonthRange(
      now.getFullYear(),
      now.getMonth() - 1,
    );
  }

  if (period === "this-quarter") {
    const quarterStartMonth =
      Math.floor(now.getMonth() / 3) * 3;

    return {
      from: new Date(
        now.getFullYear(),
        quarterStartMonth,
        1,
      ),
      to: new Date(
        now.getFullYear(),
        quarterStartMonth + 3,
        1,
      ),
    };
  }

  if (period === "this-year") {
    return {
      from: new Date(
        now.getFullYear(),
        0,
        1,
      ),
      to: new Date(
        now.getFullYear() + 1,
        0,
        1,
      ),
    };
  }

  if (period === "last-year") {
    return {
      from: new Date(
        now.getFullYear() - 1,
        0,
        1,
      ),
      to: new Date(
        now.getFullYear(),
        0,
        1,
      ),
    };
  }

  if (period === "custom") {
    const customRange = getCustomRange(
      fromInput,
      toInput,
    );

    if (customRange) {
      return customRange;
    }
  }

  return getMonthRange(
    now.getFullYear(),
    now.getMonth(),
  );
}

export async function loadTeamPerformance(
  period?: string,
  fromInput?: string,
  toInput?: string,
): Promise<{
  performance: TeamPerformance;
  selectedPeriod: string;
  selectedFrom: string;
  selectedTo: string;
}> {
  await requireRole("ADMIN");

  const performancePeriod = parsePeriod(
    period,
    fromInput,
    toInput,
  );

  const performance =
    await getTeamPerformance(
      performancePeriod,
    );

  return {
    performance,
    selectedPeriod: period ?? "this-month",
    selectedFrom: fromInput ?? "",
    selectedTo: toInput ?? "",
  };
}