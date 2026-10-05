import { getDashboardData } from "@/lib/dashboard";

import type { LeadStatus } from "@/./generated/prisma/client";

const leadStatusLabels: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DISCOVERY: "Discovery",
  PROPOSAL_SENT: "Proposal Sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

const activityTypeLabels: Record<string, string> = {
  NOTE: "Note",
  EMAIL: "Email",
  PHONE_CALL: "Phone Call",
  WHATSAPP: "WhatsApp",
  MEETING: "Meeting",
  AUDIT: "Audit",
  PROPOSAL: "Proposal",
  FOLLOW_UP: "Follow-up",
  STATUS_CHANGE: "Status Change",
  OTHER: "Other",
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatRelativeDate(date: Date) {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days}d ago`;
  }

  return formatDate(date);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() ?? "?";
  }

  return `${parts[0]?.charAt(0) ?? ""}${
    parts[parts.length - 1]?.charAt(0) ?? ""
  }`.toUpperCase();
}

function formatCurrency(
  value: number | bigint,
  currency: string,
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export default async function BusinessDashboardPage() {
  const {
    totalLeads,
    newLeads,
    activeOpportunities,
    pendingAudits,
    leadPipeline,
    recentActivities,
    recentLeads,
    sales,
    billing,
    projects,
  } = await getDashboardData();

  const pipelineMap = new Map(
    leadPipeline.map((item) => [
      item.status,
      item._count._all,
    ]),
  );

  const pipelineStatuses: LeadStatus[] = [
    "NEW",
    "CONTACTED",
    "QUALIFIED",
    "DISCOVERY",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "WON",
    "LOST",
  ];

  const totalPipelineLeads = leadPipeline.reduce(
    (total, item) => total + item._count._all,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          Monitor your leads, opportunities, audits and
          business performance from one place.
        </p>
      </div>

      {/* CRM summary */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Total Leads
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {totalLeads}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            All leads in the CRM
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            New Leads
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {newLeads}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Awaiting initial engagement
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Active Opportunities
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {activeOpportunities}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Opportunities not yet completed
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Pending Audits
          </p>

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {pendingAudits}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            Requests requiring attention
          </p>
        </div>
      </section>

      {/* Business overview */}
      <section className="mt-8">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Business Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Commercial performance across sales, billing and
            projects.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/api/reports/commercial"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
          >
            Export CSV
          </a>

          <a
          href="/api/reports/commercial/pdf"
          className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-3 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#302d78]"
          >
            Download PDF
          </a>
        </div>
      </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sales */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Sales
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Proposal and contract performance
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-slate-600">
                  Total Proposals
                </span>

                <span className="font-semibold text-slate-900">
                  {sales.totalProposals}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-slate-600">
                  Accepted Proposals
                </span>

                <span className="font-semibold text-slate-900">
                  {sales.acceptedProposals}
                </span>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-slate-600">
                    Accepted Value
                  </span>

                  {sales.acceptedValue.length === 0 ? (
                    <span className="font-semibold text-slate-900">
                      —
                    </span>
                  ) : (
                    <div className="space-y-1 text-right">
                      {sales.acceptedValue.map(
                        (currency) => (
                          <p
                            key={currency.currency}
                            className="font-semibold text-slate-900"
                          >
                            {formatCurrency(
                              currency.value,
                              currency.currency,
                            )}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-slate-600">
                  Active Contracts
                </span>

                <span className="font-semibold text-slate-900">
                  {sales.activeContracts}
                </span>
              </div>

              <div className="bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    Active Pipeline
                  </span>

                  {sales.pipelineValue.length === 0 ? (
                    <span className="font-semibold text-[#39358c]">
                      —
                    </span>
                  ) : (
                    <div className="space-y-1 text-right">
                      {sales.pipelineValue.map(
                        (currency) => (
                          <p
                            key={currency.currency}
                            className="font-semibold text-[#39358c]"
                          >
                            {formatCurrency(
                              currency.value,
                              currency.currency,
                            )}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Billing */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Billing
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Invoicing and payment position
              </p>
            </div>

            {billing.currencies.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">
                No issued invoices yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {billing.currencies.map((currency) => (
                  <div
                    key={currency.currency}
                    className="p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {currency.currency}
                      </span>

                      <span className="text-xs font-medium text-slate-500">
                        {Math.round(
                          currency.collectionRate,
                        )}
                        % collected
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-600">
                          Total Invoiced
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            currency.totalInvoiced,
                            currency.currency,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-600">
                          Total Paid
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            currency.totalPaid,
                            currency.currency,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-600">
                          Outstanding
                        </span>

                        <span className="font-semibold text-slate-900">
                          {formatCurrency(
                            currency.outstanding,
                            currency.currency,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <span className="text-sm text-slate-600">
                          Overdue Invoices
                        </span>

                        <span className="font-semibold text-slate-900">
                          {currency.overdueInvoices}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
                        <span className="text-sm font-medium text-slate-700">
                          Collection Rate
                        </span>

                        <span className="font-semibold text-[#39358c]">
                          {Math.round(
                            currency.collectionRate,
                          )}
                          %
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900">
                Projects
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Current delivery position
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-slate-600">
                  Active Projects
                </span>

                <span className="font-semibold text-slate-900">
                  {projects.activeProjects}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 p-4">
                <span className="text-sm text-slate-600">
                  Completed Projects
                </span>

                <span className="font-semibold text-slate-900">
                  {projects.completedProjects}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm font-medium text-slate-700">
                    Project Value
                  </span>

                  {projects.currencies.length === 0 ? (
                    <span className="font-semibold text-slate-900">
                      —
                    </span>
                  ) : (
                    <div className="space-y-1 text-right">
                      {projects.currencies.map(
                        (currency) => (
                          <p
                            key={currency.currency}
                            className="font-semibold text-slate-900"
                          >
                            {formatCurrency(
                              currency.value,
                              currency.currency,
                            )}
                          </p>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pipeline + activity */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Lead Pipeline
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Current distribution of leads by status
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {totalPipelineLeads} total
              </span>
            </div>
          </div>

          <div className="space-y-4 p-5">
            {pipelineStatuses.map((status) => {
              const count =
                pipelineMap.get(status) ?? 0;

              const percentage =
                totalPipelineLeads > 0
                  ? Math.round(
                      (count / totalPipelineLeads) * 100,
                    )
                  : 0;

              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      {leadStatusLabels[status]}
                    </span>

                    <span className="text-xs font-medium text-slate-500">
                      {count}
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900">
              Recent Activity
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Latest CRM activity
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-sm text-slate-500">
                No activity has been recorded yet.
              </div>
            ) : (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-3 p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                    {activity.organization.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-slate-900">
                        {activityTypeLabels[
                          activity.type
                        ] ?? activity.type}
                      </p>

                      <span className="shrink-0 text-xs text-slate-400">
                        {formatRelativeDate(
                          activity.createdAt,
                        )}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-600">
                      {activity.description}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {activity.organization.name}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent leads */}
      <section className="mt-6 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h2 className="font-semibold text-slate-900">
            Recent Leads
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            The latest leads entering the CRM
          </p>
        </div>

        {recentLeads.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No leads have been created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-slate-100 text-left">
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Lead
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Source
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Created
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                          {getInitials(
                            lead.organization.name,
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {lead.organization.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {lead.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {lead.contact ? (
                        <div>
                          <p className="text-sm text-slate-700">
                            {lead.contact.name}
                          </p>

                          <p className="text-xs text-slate-400">
                            {lead.contact.email}
                          </p>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400">
                          No contact
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                        {leadStatusLabels[
                          lead.status
                        ] ?? lead.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {lead.source.replaceAll(
                          "_",
                          " ",
                        )}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {formatDate(lead.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}