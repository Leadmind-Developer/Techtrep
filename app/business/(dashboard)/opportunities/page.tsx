import Link from "next/link";

import { getOpportunityOrganizations, getOpportunities } from "@/lib/opportunities";

import type {
  OpportunityPriority,
  OpportunityStatus,
} from "../../../../generated/prisma/client";

type OpportunitiesPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    organizationId?: string;
    page?: string;
  }>;
};

const statusOptions: OpportunityStatus[] = [
  "IDENTIFIED",
  "DISCUSSED",
  "PROPOSED",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "DECLINED",
  "WON",
  "LOST",
];

const priorityOptions: OpportunityPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

const statusLabels: Record<OpportunityStatus, string> = {
  IDENTIFIED: "Identified",
  DISCUSSED: "Discussed",
  PROPOSED: "Proposed",
  APPROVED: "Approved",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  DECLINED: "Declined",
  WON: "Won",
  LOST: "Lost",
};

const priorityLabels: Record<OpportunityPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function getStatusClasses(status: OpportunityStatus) {
  switch (status) {
    case "IDENTIFIED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "DISCUSSED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";

    case "PROPOSED":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    case "APPROVED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "COMPLETED":
      return "bg-green-50 text-green-700 ring-green-600/20";

    case "DECLINED":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
}

function getPriorityClasses(priority: OpportunityPriority) {
  switch (priority) {
    case "CRITICAL":
      return "bg-red-50 text-red-700 ring-red-600/20";

    case "HIGH":
      return "bg-orange-50 text-orange-700 ring-orange-600/20";

    case "MEDIUM":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "LOW":
      return "bg-slate-50 text-slate-600 ring-slate-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatCurrency(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseEnum<T extends string>(
  value: string | undefined,
  values: readonly T[],
): T | undefined {
  if (!value) {
    return undefined;
  }

  return values.includes(value as T)
    ? (value as T)
    : undefined;
}

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const status = parseEnum(
    params.status,
    statusOptions,
  );

  const priority = parseEnum(
    params.priority,
    priorityOptions,
  );

  const organizationId =
    params.organizationId?.trim() ?? "";

  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const [{ opportunities, total, totalPages, page: currentPage }, organizations] =
    await Promise.all([
      getOpportunities({
        search,
        status,
        priority,
        organizationId,
        page,
      }),
      getOpportunityOrganizations(),
    ]);

  function buildPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status) {
      query.set("status", status);
    }

    if (priority) {
      query.set("priority", priority);
    }

    if (organizationId) {
      query.set("organizationId", organizationId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/opportunities?${queryString}`
      : "/business/opportunities";
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <Link
  href="/business/opportunities/new"
  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
>
  New Opportunity
</Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Opportunities
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Track potential services and business opportunities identified
            from client audits.
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <label
              htmlFor="opportunity-search"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="opportunity-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Name, description, organization or contact..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="opportunity-status"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="opportunity-status"
              name="status"
              defaultValue={status ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All statuses</option>

              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {statusLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="opportunity-priority"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="opportunity-priority"
              name="priority"
              defaultValue={priority ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All priorities</option>

              {priorityOptions.map((option) => (
                <option key={option} value={option}>
                  {priorityLabels[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="opportunity-organization"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Organization
            </label>

            <select
              id="opportunity-organization"
              name="organizationId"
              defaultValue={organizationId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All organizations</option>

              {organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-5">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>

            <Link
              href="/business/opportunities"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </Link>
          </div>
        </form>
      </section>

      {/* Summary */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {total === 1 ? "1 opportunity" : `${total} opportunities`}
        </p>

        {total > 0 && (
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Desktop */}
      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {opportunities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Opportunity</th>
                  <th className="px-5 py-3">Organization</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Value</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {opportunities.map((opportunity) => (
                  <tr
                    key={opportunity.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/business/opportunities/${opportunity.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {opportunity.name}
                      </Link>

                      {opportunity.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {opportunity.description}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/organizations/${opportunity.auditRequest.organization.id}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {opportunity.auditRequest.organization.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/contacts/${opportunity.auditRequest.contact.id}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {opportunity.auditRequest.contact.name}
                      </Link>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {opportunity.auditRequest.contact.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClasses(
                          opportunity.priority,
                        )}`}
                      >
                        {priorityLabels[opportunity.priority]}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                          opportunity.status,
                        )}`}
                      >
                        {statusLabels[opportunity.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {formatCurrency(opportunity.estimatedValue)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(opportunity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="text-sm font-semibold text-slate-900">
              No opportunities found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </section>

      {/* Mobile */}
      <section className="space-y-3 md:hidden">
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <Link
              key={opportunity.id}
              href={`/business/opportunities/${opportunity.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-slate-900">
                    {opportunity.name}
                  </h2>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {opportunity.auditRequest.organization.name}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${getPriorityClasses(
                    opportunity.priority,
                  )}`}
                >
                  {priorityLabels[opportunity.priority]}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Contact</p>
                  <p className="mt-1 truncate font-medium text-slate-700">
                    {opportunity.auditRequest.contact.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Value</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {formatCurrency(opportunity.estimatedValue)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">Status</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-2 py-1 text-[11px] font-medium ring-1 ring-inset ${getStatusClasses(
                      opportunity.status,
                    )}`}
                  >
                    {statusLabels[opportunity.status]}
                  </span>
                </div>

                <div>
                  <p className="text-slate-400">Created</p>
                  <p className="mt-1 font-medium text-slate-700">
                    {formatDate(opportunity.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              No opportunities found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {currentPage > 1 && (
              <Link
                href={buildPageUrl(currentPage - 1)}
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </p>

          <div>
            {currentPage < totalPages && (
              <Link
                href={buildPageUrl(currentPage + 1)}
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}