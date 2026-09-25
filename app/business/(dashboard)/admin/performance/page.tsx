import Link from "next/link";

import { requireRole } from "@/lib/auth/authorization";
import { getStaffPerformance } from "@/lib/performance/staff-performance";
import { prisma } from "@/lib/prisma";

const DATE_INPUT_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function getMonthRange(
  year: number,
  month: number,
) {
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

function parsePeriod(
  period: string | undefined,
  fromInput: string | undefined,
  toInput: string | undefined,
) {
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
    const from = parseDateInput(fromInput);
    const toDate = parseDateInput(toInput);

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

function formatCurrency(
  value: number,
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function formatDate(
  value: Date,
) {
  return value.toLocaleDateString(
    "en-NG",
  );
}

export default async function AdminPerformancePage({
  searchParams,
}: {
  searchParams: Promise<{
    period?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const user = await requireRole("ADMIN");

  const params = await searchParams;

  const selectedPeriod =
    params.period ?? "this-month";

  const selectedFrom =
    params.from ?? "";

  const selectedTo =
    params.to ?? "";

  const period = parsePeriod(
    selectedPeriod,
    selectedFrom,
    selectedTo,
  );

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
    },
    orderBy: [
      {
        active: "desc",
      },
      {
        name: "asc",
      },
      {
        email: "asc",
      },
    ],
  });

  const performanceResults =
    await Promise.all(
      users.map((staff) =>
        getStaffPerformance(
          staff.id,
          period,
        ),
      ),
    );

  const staffRows = users.map(
    (staff, index) => ({
      ...staff,
      performance:
        performanceResults[index],
    }),
  );

  const activeStaff = staffRows.filter(
    (staff) => staff.active,
  );

  const inactiveStaff = staffRows.filter(
    (staff) => !staff.active,
  );

  return (
    <main className="space-y-6">
      <section>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Administration
            </p>

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Staff Performance
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Administrative overview of staff
              performance, account status, and
              sales activity for the selected
              reporting period.
            </p>
          </div>

          <Link
            href="/business/performance/team"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Team Performance
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <form
          method="GET"
          className="grid gap-4 lg:grid-cols-4"
        >
          <div>
            <label
              htmlFor="period"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Period
            </label>

            <select
              id="period"
              name="period"
              defaultValue={selectedPeriod}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            >
              <option value="this-month">
                This month
              </option>
              <option value="last-month">
                Last month
              </option>
              <option value="this-quarter">
                This quarter
              </option>
              <option value="this-year">
                This year
              </option>
              <option value="last-year">
                Last year
              </option>
              <option value="custom">
                Custom range
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="from"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              From
            </label>

            <input
              id="from"
              name="from"
              type="date"
              defaultValue={selectedFrom}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </div>

          <div>
            <label
              htmlFor="to"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              To
            </label>

            <input
              id="to"
              name="to"
              type="date"
              defaultValue={selectedTo}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>
          </div>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          The reporting period runs from{" "}
          <span className="font-medium text-slate-900">
            {selectedFrom ||
              formatDate(period.from)}
          </span>{" "}
          through{" "}
          <span className="font-medium text-slate-900">
            {selectedTo ||
              formatDate(
                new Date(
                  period.to.getTime() -
                    24 * 60 * 60 * 1000,
                ),
              )}
          </span>
          .
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Total Staff
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {staffRows.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Staff
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {activeStaff.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Inactive Staff
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {inactiveStaff.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Reporting Period
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {selectedPeriod === "this-month"
              ? "This month"
              : selectedPeriod === "last-month"
                ? "Last month"
                : selectedPeriod === "this-quarter"
                  ? "This quarter"
                  : selectedPeriod === "this-year"
                    ? "This year"
                    : selectedPeriod ===
                        "last-year"
                      ? "Last year"
                      : "Custom range"}
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Staff Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Performance metrics are based on
            the attribution rules used by the
            performance module.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Staff
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Leads
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Qualified
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Won
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Lost
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Won Revenue
                </th>

                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Pipeline
                </th>

                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {staffRows.map(
                (staff) => {
                  const performance =
                    staff.performance;

                  return (
                    <tr
                      key={staff.id}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">
                          {staff.name ||
                            staff.email}
                        </div>

                        {staff.name && (
                          <div className="mt-1 text-xs text-slate-500">
                            {staff.email}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={
                            staff.active
                              ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                              : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                          }
                        >
                          {staff.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {performance?.leads.generated ??
                          0}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {performance?.leads.qualified ??
                          0}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {performance?.opportunities.won ??
                          0}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {performance?.opportunities.lost ??
                          0}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatCurrency(
                          performance?.opportunities
                            .wonValue ?? 0,
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatCurrency(
                          performance?.opportunities
                            .pipelineValue ?? 0,
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/business/performance?staffId=${encodeURIComponent(
                            staff.id,
                          )}&period=${encodeURIComponent(
                            selectedPeriod,
                          )}${
                            selectedFrom
                              ? `&from=${encodeURIComponent(
                                  selectedFrom,
                                )}`
                              : ""
                          }${
                            selectedTo
                              ? `&to=${encodeURIComponent(
                                  selectedTo,
                                )}`
                              : ""
                          }`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                        >
                          View appraisal
                        </Link>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Attribution Rules
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Leads
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Performance ownership is based on
              the assigned staff member.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Opportunities
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Performance ownership is based on
              the assigned staff member.
            </p>
          </div>

          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Activities
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Activity performance is attributed
              to the user who created the activity.
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          Historical records without attribution
          remain unattributed. The system does not
          fabricate ownership for older records.
        </p>
      </section>
    </main>
  );
}