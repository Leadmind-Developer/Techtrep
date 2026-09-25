import { requireUser } from "@/lib/auth/authorization";
import {
  getStaffPerformance,
  type PerformancePeriod,
} from "@/lib/performance/staff-performance";
import { prisma } from "@/lib/prisma";

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

  if (!from || !toDate) {
    return null;
  }

  if (from > toDate) {
    return null;
  }

  /*
   * The UI's "to" date is inclusive.
   *
   * Performance queries use an exclusive upper boundary,
   * so 2026-03-31 becomes 2026-04-01 00:00:00.
   */
  const to = new Date(
    toDate.getFullYear(),
    toDate.getMonth(),
    toDate.getDate() + 1,
  );

  return {
    from,
    to,
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
      from: new Date(now.getFullYear(), 0, 1),
      to: new Date(now.getFullYear() + 1, 0, 1),
    };
  }

  if (period === "last-year") {
    return {
      from: new Date(now.getFullYear() - 1, 0, 1),
      to: new Date(now.getFullYear(), 0, 1),
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

async function getActiveStaff() {
  return prisma.user.findMany({
    where: {
      active: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        email: "asc",
      },
    ],
  });
}

export async function loadStaffPerformance(
  period?: string,
  requestedStaffId?: string,
  fromInput?: string,
  toInput?: string,
) {
  const user = await requireUser();

  let targetUserId = user.id;

  if (user.role === "ADMIN" && requestedStaffId) {
    const targetUser = await prisma.user.findFirst({
      where: {
        id: requestedStaffId,
        active: true,
      },
      select: {
        id: true,
      },
    });

    if (targetUser) {
      targetUserId = targetUser.id;
    }
  }

  const performancePeriod = parsePeriod(
    period,
    fromInput,
    toInput,
  );

  const performance = await getStaffPerformance(
    targetUserId,
    performancePeriod,
  );

  const staff =
    user.role === "ADMIN"
      ? await getActiveStaff()
      : [];

  return {
    user,
    performance,
    staff,
    selectedStaffId: targetUserId,
    selectedPeriod: period ?? "this-month",
    selectedFrom: fromInput ?? "",
    selectedTo: toInput ?? "",
  };
}