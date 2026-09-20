import Link from "next/link";

import {
  getAuditRequestFormOptions,
  getAuditRequests,
} from "@/lib/audit-requests";
import type {
  AuditStatus,
  LeadSource,
} from "../../../../generated/prisma/client";

type AuditRequestsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    source?: string;
    organizationId?: string;
    page?: string;
  }>;
};

const AUDIT_STATUSES: AuditStatus[] = [
  "REQUESTED",
  "CONTACTED",
  "SCHEDULED",
  "COMPLETED",
  "REPORT_SENT",
  "PROPOSAL_SENT",
  "WON",
  "LOST",
];

const AUDIT_SOURCES: LeadSource[] = [
  "AUDIT",
  "WEBSITE",
  "REFERRAL",
  "WHATSAPP",
  "EMAIL",
  "PHONE",
  "LINKEDIN",
  "SOCIAL_MEDIA",
  "DIRECT",
  "OTHER",
];

function getPageNumber(value?: string) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function getAuditStatus(value?: string): AuditStatus | undefined {
  if (
    value &&
    AUDIT_STATUSES.includes(value as AuditStatus)
  ) {
    return value as AuditStatus;
  }

  return undefined;
}

function getAuditSource(value?: string): LeadSource | undefined {
  if (
    value &&
    AUDIT_SOURCES.includes(value as LeadSource)
  ) {
    return value as LeadSource;
  }

  return undefined;
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getStatusClasses(status: AuditStatus) {
  switch (status) {
    case "REQUESTED":
      return "bg-blue-50 text-blue-700";

    case "CONTACTED":
      return "bg-indigo-50 text-indigo-700";

    case "SCHEDULED":
      return "bg-amber-50 text-amber-700";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700";

    case "REPORT_SENT":
      return "bg-violet-50 text-violet-700";

    case "PROPOSAL_SENT":
      return "bg-purple-50 text-purple-700";

    case "WON":
      return "bg-green-50 text-green-700";

    case "LOST":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function getSourceClasses(source: LeadSource) {
  if (source === "AUDIT") {
    return "bg-slate-900 text-white";
  }

  return "bg-slate-100 text-slate-600";
}

export default async function AuditRequestsPage({
  searchParams,
}: AuditRequestsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const status = getAuditStatus(params.status);
  const source = getAuditSource(params.source);
  const organizationId =
    params.organizationId?.trim() ?? "";
  const page = getPageNumber(params.page);

  const [{ auditRequests, total, totalPages }, { organizations }] =
    await Promise.all([
      getAuditRequests({
        search,
        status,
        source,
        organizationId,
        page,
      }),

      getAuditRequestFormOptions(),
    ]);

  const buildPageUrl = (nextPage: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status) {
      query.set("status", status);
    }

    if (source) {
      query.set("source", source);
    }

    if (organizationId) {
      query.set("organizationId", organizationId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/audit-requests?${queryString}`
      : "/business/audit-requests";
  };

  const startItem =
    total === 0 ? 0 : (page - 1) * 10 + 1;

  const endItem =
    total === 0
      ? 0
      : Math.min(page * 10, total);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <p className="text-sm font-medium text-slate-500">
          CRM
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Audit Requests
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage technology audit requests and their progression through the sales workflow.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          action="/business/audit-requests"
          className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_200px_180px_220px_auto]"
        >
          <div>
            <label
              htmlFor="search"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Search
            </label>

            <input
              id="search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Organization, contact or request details"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue={status ?? ""}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All statuses</option>

              {AUDIT_STATUSES.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="source"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Source
            </label>

            <select
              id="source"
              name="source"
              defaultValue={source ?? ""}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All sources</option>

              {AUDIT_SOURCES.map((value) => (
                <option key={value} value={value}>
                  {formatStatus(value)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="organizationId"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Organization
            </label>

            <select
              id="organizationId"
              name="organizationId"
              defaultValue={organizationId}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All organizations
              </option>

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

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Filter
            </button>

            {(search ||
              status ||
              source ||
              organizationId) && (
              <Link
                href="/business/audit-requests"
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {total === 0
            ? "No audit requests found"
            : `Showing ${startItem}–${endItem} of ${total} audit request${total === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {auditRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Request
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Source
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Scheduled
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {auditRequests.map((audit) => (
                  <tr
                    key={audit.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/business/audit-requests/${audit.id}`}
                        className="group"
                      >
                        <p className="font-medium text-slate-900 group-hover:text-slate-700">
                          Technology audit
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {formatDate(audit.createdAt)}
                        </p>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/organizations/${audit.organization.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        {audit.organization.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {audit.contact.name}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        {audit.contact.email}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          audit.status,
                        )}`}
                      >
                        {formatStatus(audit.status)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSourceClasses(
                          audit.source,
                        )}`}
                      >
                        {formatStatus(audit.source)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(audit.scheduledAt)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/business/audit-requests/${audit.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              No audit requests found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Audit requests submitted through the public technology audit form will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {auditRequests.length > 0 ? (
          auditRequests.map((audit) => (
            <div
              key={audit.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/business/audit-requests/${audit.id}`}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    Technology audit
                  </Link>

                  <p className="mt-1 text-xs text-slate-500">
                    Submitted {formatDate(audit.createdAt)}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    audit.status,
                  )}`}
                >
                  {formatStatus(audit.status)}
                </span>
              </div>

              <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Organization
                  </p>

                  <Link
                    href={`/business/organizations/${audit.organization.id}`}
                    className="mt-1 block text-sm font-medium text-slate-700 hover:underline"
                  >
                    {audit.organization.name}
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Contact
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {audit.contact.name}
                  </p>

                  <p className="mt-0.5 break-all text-xs text-slate-500">
                    {audit.contact.email}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Source
                    </p>

                    <span
                      className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getSourceClasses(
                        audit.source,
                      )}`}
                    >
                      {formatStatus(audit.source)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Scheduled
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {formatDate(audit.scheduledAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <Link
                  href={`/business/audit-requests/${audit.id}`}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  View request
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              No audit requests found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Audit requests submitted through the public technology audit form will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-400">
                Previous
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-400">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
