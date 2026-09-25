import Link from "next/link";

import { loadStaffPerformance } from "@/lib/performance/staff-performance-page";
import PerformanceDrilldown from "./PerformanceDrilldown";

type PerformancePageProps = {
  searchParams: Promise<{
    period?: string;
    staffId?: string;
    from?: string;
    to?: string;
  }>;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-NG").format(value);
}

function formatPeriod(
  from: Date,
  to: Date,
): string {
  const formatter = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
  });

  const adjustedTo = new Date(to);
  adjustedTo.setDate(adjustedTo.getDate() - 1);

  if (
    from.getMonth() === adjustedTo.getMonth() &&
    from.getFullYear() === adjustedTo.getFullYear()
  ) {
    return formatter.format(from);
  }

  const dateFormatter = new Intl.DateTimeFormat(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );

  return `${dateFormatter.format(from)} – ${dateFormatter.format(
    adjustedTo,
  )}`;
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getActivityLabel(type: string): string {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function getPercentage(
  numerator: number,
  denominator: number,
): number {
  if (denominator <= 0) {
    return 0;
  }

  return Math.round(
    (numerator / denominator) * 100,
  );
}

export default async function PerformancePage({
  searchParams,
}: PerformancePageProps) {
  const params = await searchParams;

  const {
    user,
    performance,
    staff,
    selectedStaffId,
    selectedPeriod,
    selectedFrom,
    selectedTo,
  } = await loadStaffPerformance(
    params.period,
    params.staffId,
    params.from,
    params.to,
  );

  if (!performance) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-slate-900">
          Performance
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Performance information could not be
          loaded.
        </p>
      </div>
    );
  }

  const periodLabel = formatPeriod(
    performance.period.from,
    performance.period.to,
  );

  const closedOpportunities =
    performance.opportunities.won +
    performance.opportunities.lost;

  const winRate = getPercentage(
    performance.opportunities.won,
    closedOpportunities,
  );

  const qualificationRate = getPercentage(
    performance.leads.qualified,
    performance.leads.generated,
  );

  const leadConversionRate = getPercentage(
    performance.leads.won,
    performance.leads.generated,
  );

  const staffMemberName =
    performance.staff.name ??
    performance.staff.email;

  const periodEndDate = new Date(
    performance.period.to.getTime() -
      24 * 60 * 60 * 1000,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-indigo-600">
                  Staff Performance & Appraisal
                </p>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {performance.staff.role}
                </span>
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                {staffMemberName}
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                {performance.staff.email}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-600">
                <span className="rounded-lg bg-slate-50 px-3 py-2">
                  Appraisal period:{" "}
                  <span className="font-medium text-slate-900">
                    {periodLabel}
                  </span>
                </span>

                <span className="rounded-lg bg-slate-50 px-3 py-2">
                  {formatDate(
                    performance.period.from,
                  )}{" "}
                  –{" "}
                  {formatDate(periodEndDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Performance filters */}
          <form
            method="GET"
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {user.role === "ADMIN" && (
                <div>
                  <label
                    htmlFor="staffId"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Staff member
                  </label>

                  <select
                    id="staffId"
                    name="staffId"
                    defaultValue={selectedStaffId}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                  >
                    {staff.map((member) => (
                      <option
                        key={member.id}
                        value={member.id}
                      >
                        {member.name ??
                          member.email}{" "}
                        ({member.role})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label
                  htmlFor="period"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Period
                </label>

                <select
                  id="period"
                  name="period"
                  defaultValue={selectedPeriod}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
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
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  From
                </label>

                <input
                  id="from"
                  name="from"
                  type="date"
                  defaultValue={selectedFrom}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label
                  htmlFor="to"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  To
                </label>

                <input
                  id="to"
                  name="to"
                  type="date"
                  defaultValue={selectedTo}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                Select Custom range to use the From
                and To dates.
              </p>

              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>

        {user.role === "STAFF" && (
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Performance scope
            </p>

            <p className="mt-1 text-sm text-slate-600">
              You are viewing your own attributed
              performance. Staff users cannot view
              another staff member&apos;s appraisal.
            </p>
          </div>
        )}

        {user.role === "ADMIN" && (
          <div className="mt-5 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              Administrator view
            </p>

            <p className="mt-1 text-sm text-indigo-900">
              You are viewing performance attributed
              to{" "}
              <span className="font-semibold">
                {staffMemberName}
              </span>
              .
            </p>
          </div>
        )}
      </section>

      {/* KPI cards */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Performance Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Key activity and sales metrics for the
            selected period.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Leads Generated
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(
                performance.leads.generated,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {qualificationRate}% qualified
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Qualified Leads
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(
                performance.leads.qualified,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {qualificationRate}% of generated
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Opportunities Created
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(
                performance.opportunities.created,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Sales opportunities attributed to this
              user
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Opportunities Won
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(
                performance.opportunities.won,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Win rate: {winRate}%
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Activities
            </p>

            <p className="mt-2 text-3xl font-semibold text-slate-900">
              {formatNumber(
                performance.activities.total,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Recorded CRM activities
            </p>
          </div>
        </div>
      </section>

      {/* Revenue and pipeline */}
      <section>
        <div className="mb-3">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue & Pipeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Opportunity outcomes and attributed
            commercial value.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Won Revenue
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCurrency(
                performance.opportunities.wonValue,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              From opportunities closed as won
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Lost Value
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCurrency(
                performance.opportunities.lostValue,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              From opportunities closed as lost
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Open Pipeline
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatCurrency(
                performance.opportunities.pipelineValue,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Open value at period end
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">
              Open Opportunities
            </p>

            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatNumber(
                performance.opportunities.open,
              )}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Remaining at period end
            </p>
          </div>
        </div>
      </section>

      {/* Sales outcomes */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Sales Outcomes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Opportunities closed during the selected
            period.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Opportunities Created
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.opportunities.created,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Won
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.opportunities.won,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Lost
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.opportunities.lost,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                Closed Opportunities
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(closedOpportunities)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Win Rate
              </span>

              <span className="font-semibold text-slate-900">
                {winRate}%
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Lead Funnel
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Lead progression attributed to this staff
            member.
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Generated
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.leads.generated,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Qualified
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.leads.qualified,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Won
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.leads.won,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Lost
              </span>

              <span className="font-semibold text-slate-900">
                {formatNumber(
                  performance.leads.lost,
                )}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                Qualification Rate
              </span>

              <span className="font-semibold text-slate-900">
                {qualificationRate}%
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">
                Lead Win Rate
              </span>

              <span className="font-semibold text-slate-900">
                {leadConversionRate}%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead sources and activities */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Lead Sources
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Where attributed leads came from.
          </p>

          {Object.keys(
            performance.leadSources,
          ).length === 0 ? (
            <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              No leads were recorded for this
              period.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {Object.entries(
                performance.leadSources,
              )
                .sort(([, a], [, b]) => b - a)
                .map(([source, count]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {getActivityLabel(source)}
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {formatNumber(count)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Activity Breakdown
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            CRM activities created by this staff
            member.
          </p>

          {Object.keys(
            performance.activities.byType,
          ).length === 0 ? (
            <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
              No activities were recorded for this
              period.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {Object.entries(
                performance.activities.byType,
              )
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {getActivityLabel(type)}
                    </span>

                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                      {formatNumber(count)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* Appraisal snapshot */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Appraisal Snapshot
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Factual performance indicators for the
          selected period.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Lead Generation
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {formatNumber(
                performance.leads.generated,
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              leads generated
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Sales Conversion
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {winRate}%
            </p>

            <p className="mt-1 text-sm text-slate-500">
              opportunity win rate
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Revenue Generated
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(
                performance.opportunities.wonValue,
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              won opportunity value
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Pipeline
            </p>

            <p className="mt-2 text-xl font-semibold text-slate-900">
              {formatCurrency(
                performance.opportunities.pipelineValue,
              )}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              open opportunity value
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-lg bg-slate-50 p-4">
          <p className="text-sm leading-6 text-slate-600">
            These figures are based on CRM records
            attributed to the selected staff member.
            Lead generation uses the lead creation
            date, opportunity outcomes use their
            recorded closing date, and activities use
            their creation date. Historical records
            without attribution are not assigned to a
            staff member retroactively.
          </p>
        </div>
      </section>

      <PerformanceDrilldown
            staffId={selectedStaffId}
            period={selectedPeriod}
            from={selectedFrom}
            to={selectedTo}
          />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {user.role === "ADMIN" && (
          <Link
            href="/business/performance/team"
            className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
          >
            View Team Performance →
          </Link>
        )}

        <Link
          href="/business"
          className="text-sm font-medium text-indigo-600 transition hover:text-indigo-700 sm:ml-auto"
        >          
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}