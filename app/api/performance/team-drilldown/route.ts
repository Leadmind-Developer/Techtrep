import { NextResponse } from "next/server";

import { requireApiRole } from "@/lib/auth/api";
import {
  getTeamPerformanceDrilldown,
} from "@/lib/performance/team-performance-drilldown";
import type { PerformanceDrilldownMetric } from "@/lib/performance/staff-performance-drilldown";
import type { PerformancePeriod } from "@/lib/performance/staff-performance";

const VALID_METRICS: PerformanceDrilldownMetric[] = [
  "leads-generated",
  "qualified-leads",
  "opportunities-created",
  "opportunities-won",
  "opportunities-lost",
  "open-opportunities",
  "activities",
];

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parseDateInput(
  value: string | null,
): Date | null {
  if (
    !value ||
    !DATE_INPUT_REGEX.test(value)
  ) {
    return null;
  }

  const [year, month, day] =
    value.split("-").map(Number);

  const date = new Date(
    year,
    month - 1,
    day,
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function getMonthRange(
  year: number,
  month: number,
): PerformancePeriod {
  return {
    from: new Date(
      year,
      month,
      1,
    ),
    to: new Date(
      year,
      month + 1,
      1,
    ),
  };
}

function parsePeriod(
  period: string | null,
  fromInput: string | null,
  toInput: string | null,
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
      Math.floor(
        now.getMonth() / 3,
      ) * 3;

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
    const from =
      parseDateInput(fromInput);

    const toDate =
      parseDateInput(toInput);

    if (
      from &&
      toDate &&
      from <= toDate
    ) {
      return {
        from,
        to: new Date(
          toDate.getFullYear(),
          toDate.getMonth(),
          toDate.getDate() + 1,
        ),
      };
    }
  }

  return getMonthRange(
    now.getFullYear(),
    now.getMonth(),
  );
}

function parsePositiveInteger(
  value: string | null,
  fallback: number,
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    return fallback;
  }

  return parsed;
}

export async function GET(
  request: Request,
) {
  const auth =
    await requireApiRole("ADMIN");

  if (auth.response) {
    return auth.response;
  }

  const url = new URL(
    request.url,
  );

  const metricInput =
    url.searchParams.get("metric");

  if (
    !metricInput ||
    !VALID_METRICS.includes(
      metricInput as PerformanceDrilldownMetric,
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message:
          "Invalid performance metric.",
      },
      { status: 400 },
    );
  }

  const period =
    parsePeriod(
      url.searchParams.get(
        "period",
      ),
      url.searchParams.get(
        "from",
      ),
      url.searchParams.get(
        "to",
      ),
    );

  const page =
    parsePositiveInteger(
      url.searchParams.get(
        "page",
      ),
      1,
    );

  const pageSize =
    parsePositiveInteger(
      url.searchParams.get(
        "pageSize",
      ),
      25,
    );

  const result =
    await getTeamPerformanceDrilldown(
      metricInput as PerformanceDrilldownMetric,
      period,
      page,
      pageSize,
    );

  return NextResponse.json({
    success: true,
    data: {
      ...result,
      period: {
        from:
          period.from.toISOString(),
        to:
          period.to.toISOString(),
      },
    },
  });
}