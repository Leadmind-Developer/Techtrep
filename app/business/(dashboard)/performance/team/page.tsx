import Link from "next/link";

import { loadTeamPerformance } from "@/lib/performance/team-performance-page";
import TeamPerformanceDrilldown from "./TeamPerformanceDrilldown";

type SearchParams = {
  period?: string;
  from?: string;
  to?: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

export default async function TeamPerformancePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const {
    performance,
    selectedPeriod,
    selectedFrom,
    selectedTo,
  } = await loadTeamPerformance(
    params.period,
    params.from,
    params.to,
  );

  const { team, staff, period } = performance;

  const periodLabel =
    selectedPeriod === "custom"
      ? `${selectedFrom || "Start"} → ${
          selectedTo || "End"
        }`
      : formatLabel(
          selectedPeriod.replaceAll("-", " "),
        );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <Link
              href="/business/performance"
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Individual Performance
            </Link>

            <span className="text-slate-300">
              /
            </span>

            <span className="text-sm font-medium text-slate-900">
              Team Performance
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Team Performance
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Sales and business-development performance
            for the selected period.
          </p>
        </div>

        <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">
          {periodLabel}
        </div>
      </div>

      <form
        method="get"
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-3">
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            Custom range includes both the From and To dates.
          </p>

          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Apply filters
          </button>
        </div>
      </form>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Team Overview
          </h2>

          <p className="text-sm text-slate-500">
            Aggregate activity attributed to active team members.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Active Staff"
            value={String(team.staffCount)}
          />

          <MetricCard
            label="Leads Generated"
            value={String(team.leads.generated)}
          />

          <MetricCard
            label="Opportunities Created"
            value={String(
              team.opportunities.created,
            )}
          />

          <MetricCard
            label="Activities"
            value={String(
              team.activities.total,
            )}
          />
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Revenue & Pipeline
          </h2>

          <p className="text-sm text-slate-500">
            Opportunity values based on the selected period.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Won Revenue"
            value={formatCurrency(
              team.opportunities.wonValue,
            )}
          />

          <MetricCard
            label="Lost Value"
            value={formatCurrency(
              team.opportunities.lostValue,
            )}
          />

          <MetricCard
            label="Open Pipeline"
            value={formatCurrency(
              team.opportunities.pipelineValue,
            )}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Sales Outcomes"
          description="Lead and opportunity outcomes for the period."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Stat
              label="Qualified Leads"
              value={team.leads.qualified}
            />

            <Stat
              label="Won Leads"
              value={team.leads.won}
            />

            <Stat
              label="Won Opportunities"
              value={team.opportunities.won}
            />

            <Stat
              label="Lost Opportunities"
              value={team.opportunities.lost}
            />
          </div>
        </Panel>

        <Panel
          title="Pipeline"
          description="Open opportunity state at the end of the selected period."
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Stat
              label="Open"
              value={team.opportunities.open}
            />

            <Stat
              label="Won"
              value={team.opportunities.won}
            />

            <Stat
              label="Lost"
              value={team.opportunities.lost}
            />
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel
          title="Lead Sources"
          description="Where the team's leads came from."
        >
          {Object.keys(team.leadSources).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {Object.entries(team.leadSources)
                .sort(([a], [b]) =>
                  a.localeCompare(b),
                )
                .map(([source, count]) => (
                  <div
                    key={source}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-600">
                      {formatLabel(source)}
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Panel>

        <Panel
          title="Activity Breakdown"
          description="Recorded activities created by the team."
        >
          {Object.keys(team.activities.byType).length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {Object.entries(
                team.activities.byType,
              )
                .sort(([a], [b]) =>
                  a.localeCompare(b),
                )
                .map(([type, count]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-slate-600">
                      {formatLabel(type)}
                    </span>

                    <span className="text-sm font-semibold text-slate-900">
                      {count}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </Panel>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Staff Performance
          </h2>

          <p className="text-sm text-slate-500">
            Factual performance data by active team member.
            Records are shown alphabetically.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Staff
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Leads
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Qualified
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Opportunities
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Won
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Lost
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Won Revenue
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Pipeline
                  </th>

                  <th className="px-4 py-3 font-semibold text-slate-700">
                    Activities
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {staff.map((member) => (
                  <tr
                    key={member.staff.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {member.staff.name ||
                          "Unnamed user"}
                      </div>

                      <div className="text-xs text-slate-500">
                        {member.staff.email}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-900">
                      {member.leads.generated}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {member.leads.qualified}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {member.opportunities.created}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {member.opportunities.won}
                      </div>

                      <div className="text-xs text-slate-500">
                        {formatCurrency(
                          member.opportunities
                            .wonValue,
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-medium text-slate-900">
                        {member.opportunities.lost}
                      </div>

                      <div className="text-xs text-slate-500">
                        {formatCurrency(
                          member.opportunities
                            .lostValue,
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-900">
                      {formatCurrency(
                        member.opportunities
                          .wonValue,
                      )}
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-900">
                      {formatCurrency(
                        member.opportunities
                          .pipelineValue,
                      )}
                    </td>

                    <td className="px-4 py-4 text-slate-700">
                      {member.activities.total}
                    </td>
                  </tr>
                ))}

                {staff.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No active staff performance data is
                      available for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>
          <span className="font-semibold text-slate-900">
            Attribution:
          </span>{" "}
          leads and opportunities are attributed to their
          assigned owner, while activities are attributed to
          the user who created them.
        </p>

        <p className="mt-2">
          The reporting period runs from{" "}
          <span className="font-medium text-slate-900">
            {selectedFrom ||
              period.from.toLocaleDateString("en-NG")}
          </span>{" "}
          through{" "}
          <span className="font-medium text-slate-900">
            {selectedTo ||
              new Date(
                period.to.getTime() - 24 * 60 * 60 * 1000,
              ).toLocaleDateString("en-NG")}
          </span>
          .
        </p>
      </section>
      <TeamPerformanceDrilldown        
        period={selectedPeriod}
        from={selectedFrom}
        to={selectedTo}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-5">
        {children}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>    
  );       
}

function EmptyState() {
  return (
    <p className="text-sm text-slate-500">
      No data for this period.
    </p>
  );
}