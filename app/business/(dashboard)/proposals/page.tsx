import Link from "next/link";

import {
  getProposalOpportunities,
  getProposals,
} from "@/lib/proposals";

import type {
  ProposalStatus,
} from "../../../../generated/prisma/client";

type ProposalsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    opportunityId?: string;
    page?: string;
  }>;
};

const statusOptions: ProposalStatus[] = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
  "WITHDRAWN",
];

const statusLabels: Record<ProposalStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  WITHDRAWN: "Withdrawn",
};

function getStatusClasses(status: ProposalStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-slate-50 text-slate-700 ring-slate-600/20";

    case "SENT":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "REJECTED":
      return "bg-red-50 text-red-700 ring-red-600/20";

    case "EXPIRED":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "WITHDRAWN":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
}

function formatDate(value: Date | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatCurrency(
  value: unknown,
  currency = "NGN",
) {
  if (value === null || value === undefined) {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  if (currency === "NGN") {
    return `₦${numericValue.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${currency} ${numericValue.toLocaleString("en-NG", {
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

export default async function ProposalsPage({
  searchParams,
}: ProposalsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const status = parseEnum(
    params.status,
    statusOptions,
  );

  const opportunityId =
    params.opportunityId?.trim() ?? "";

  const requestedPage = Number(params.page ?? "1");

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const [
    {
      proposals,
      total,
      totalPages,
      page: currentPage,
    },
    opportunities,
  ] = await Promise.all([
    getProposals({
      search,
      status,
      opportunityId,
      page,
    }),
    getProposalOpportunities(),
  ]);

  function buildPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status) {
      query.set("status", status);
    }

    if (opportunityId) {
      query.set("opportunityId", opportunityId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/proposals?${queryString}`
      : "/business/proposals";
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <Link
        href="/business/proposals/new"
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        New Proposal
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Proposals
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and track commercial proposals for qualified
            business opportunities.
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label
              htmlFor="proposal-search"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="proposal-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Proposal number, title, opportunity, organization..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="proposal-status"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="proposal-status"
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
              htmlFor="proposal-opportunity"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Opportunity
            </label>

            <select
              id="proposal-opportunity"
              name="opportunityId"
              defaultValue={opportunityId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All opportunities</option>

              {opportunities.map((opportunity) => (
                <option
                  key={opportunity.id}
                  value={opportunity.id}
                >
                  {opportunity.name}
                  {" — "}
                  {opportunity.auditRequest.organization.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>

            <Link
              href="/business/proposals"
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
          {total === 1
            ? "1 proposal"
            : `${total} proposals`}
        </p>

        {total > 0 && (
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Desktop */}
      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {proposals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Proposal</th>
                  <th className="px-5 py-3">Organization</th>
                  <th className="px-5 py-3">Opportunity</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Valid Until</th>
                  <th className="px-5 py-3">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {proposals.map((proposal) => (
                  <tr
                    key={proposal.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/business/proposals/${proposal.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {proposal.title}
                      </Link>

                      <p className="mt-1 text-xs text-slate-500">
                        {proposal.proposalNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/organizations/${proposal.opportunity.auditRequest.organization.id}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {proposal.opportunity.auditRequest.organization.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/opportunities/${proposal.opportunity.id}`}
                        className="text-sm text-slate-700 hover:underline"
                      >
                        {proposal.opportunity.name}
                      </Link>

                      <p className="mt-0.5 text-xs text-slate-400">
                        {proposal.opportunity.auditRequest.contact.name}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                          proposal.status,
                        )}`}
                      >
                        {statusLabels[proposal.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {formatCurrency(
                        proposal.amount,
                        proposal.currency,
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(proposal.validUntil)}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(proposal.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="text-sm font-semibold text-slate-900">
              No proposals found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </section>

      {/* Mobile */}
      <section className="space-y-3 md:hidden">
        {proposals.length > 0 ? (
          proposals.map((proposal) => (
            <Link
              key={proposal.id}
              href={`/business/proposals/${proposal.id}`}
              className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-slate-900">
                    {proposal.title}
                  </h2>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {proposal.proposalNumber}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {proposal.opportunity.auditRequest.organization.name}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${getStatusClasses(
                    proposal.status,
                  )}`}
                >
                  {statusLabels[proposal.status]}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">
                    Opportunity
                  </p>

                  <p className="mt-1 truncate font-medium text-slate-700">
                    {proposal.opportunity.name}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Amount
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {formatCurrency(
                      proposal.amount,
                      proposal.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Valid Until
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {formatDate(proposal.validUntil)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400">
                    Created
                  </p>

                  <p className="mt-1 font-medium text-slate-700">
                    {formatDate(proposal.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              No proposals found
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