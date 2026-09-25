import Link from "next/link";

import type {
  LeadSource,
  LeadStatus,
} from "@/./generated/prisma/client";

import { getLeads } from "@/lib/leads";

import LeadFilters from "./LeadFilters";

type LeadsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    source?: string;
    page?: string;
  }>;
};

const STATUS_LABELS: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DISCOVERY: "Discovery",
  PROPOSAL_SENT: "Proposal sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

const SOURCE_LABELS: Record<LeadSource, string> = {
  WEBSITE: "Website",
  AUDIT: "Audit",
  REFERRAL: "Referral",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  PHONE: "Phone",
  LINKEDIN: "LinkedIn",
  SOCIAL_MEDIA: "Social media",
  DIRECT: "Direct",
  OTHER: "Other",
};

const STATUS_CLASSES: Record<LeadStatus, string> = {
  NEW: "bg-blue-50 text-blue-700 ring-blue-600/20",
  CONTACTED: "bg-cyan-50 text-cyan-700 ring-cyan-600/20",
  QUALIFIED: "bg-violet-50 text-violet-700 ring-violet-600/20",
  DISCOVERY: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  PROPOSAL_SENT: "bg-amber-50 text-amber-700 ring-amber-600/20",
  NEGOTIATION: "bg-orange-50 text-orange-700 ring-orange-600/20",
  WON: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  LOST: "bg-rose-50 text-rose-700 ring-rose-600/20",
};

function isLeadStatus(value: string | undefined): value is LeadStatus {
  return (
    value === "NEW" ||
    value === "CONTACTED" ||
    value === "QUALIFIED" ||
    value === "DISCOVERY" ||
    value === "PROPOSAL_SENT" ||
    value === "NEGOTIATION" ||
    value === "WON" ||
    value === "LOST"
  );
}

function isLeadSource(value: string | undefined): value is LeadSource {
  return (
    value === "WEBSITE" ||
    value === "AUDIT" ||
    value === "REFERRAL" ||
    value === "WHATSAPP" ||
    value === "EMAIL" ||
    value === "PHONE" ||
    value === "LINKEDIN" ||
    value === "SOCIAL_MEDIA" ||
    value === "DIRECT" ||
    value === "OTHER"
  );
}

function formatCurrency(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(numericValue);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function createPageUrl(
  search: string,
  status: string,
  source: string,
  page: number,
) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (status) {
    params.set("status", status);
  }

  if (source) {
    params.set("source", source);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query ? `/business/leads?${query}` : "/business/leads";
}

export default async function LeadsPage({
  searchParams,
}: LeadsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const status = isLeadStatus(params.status)
    ? params.status
    : undefined;

  const source = isLeadSource(params.source)
    ? params.source
    : undefined;

  const parsedPage = Number.parseInt(params.page ?? "1", 10);
  const page =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const data = await getLeads({
    search,
    status,
    source,
    page,
  });

  const {
    leads,
    total,
    totalPages,
    page: currentPage,
  } = data;

  const startItem = total === 0 ? 0 : (currentPage - 1) * data.pageSize + 1;
  const endItem = Math.min(currentPage * data.pageSize, total);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            CRM
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Leads
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage prospects, track their progress, and follow up on
            opportunities.
          </p>
        </div>

        <Link
          href="/business/leads/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <svg
            className="mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </svg>
          Add lead
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <LeadFilters />
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Lead pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {total === 0
                  ? "No leads found"
                  : `Showing ${startItem}–${endItem} of ${total} lead${total === 1 ? "" : "s"}`}
              </p>
            </div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg
                className="h-6 w-6 text-slate-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No leads found
            </h3>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              {search || status || source
                ? "Try adjusting your search or filters."
                : "Your CRM does not have any leads yet."}
            </p>

            {!search && !status && !source && (
              <Link
                href="/business/leads/new"
                className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Add your first lead
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Lead
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Contact
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Status
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Source
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Est. value
                    </th>

                    <th
                      scope="col"
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 bg-white">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/business/leads/${lead.id}`}
                          className="group block"
                        >
                          <p className="font-medium text-slate-900 group-hover:text-indigo-600">
                            {lead.organization.name}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {lead.organization.id.slice(-8)}
                          </p>
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        {lead.contact ? (
                          <>
                            <p className="text-sm font-medium text-slate-800">
                              {lead.contact.name}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-500">
                              {lead.contact.email}
                            </p>
                          </>
                        ) : (
                          <span className="text-sm text-slate-400">
                            No contact
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_CLASSES[lead.status]}`}
                        >
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {SOURCE_LABELS[lead.source]}
                      </td>

                      <td className="px-5 py-4 text-right text-sm font-medium text-slate-800">
                        {formatCurrency(lead.estimatedValue)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {formatDate(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
              {leads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/business/leads/${lead.id}`}
                  className="block p-4 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">
                        {lead.organization.name}
                      </p>

                      {lead.contact && (
                        <p className="mt-1 truncate text-sm text-slate-500">
                          {lead.contact.name}
                        </p>
                      )}
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_CLASSES[lead.status]}`}
                    >
                      {STATUS_LABELS[lead.status]}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">
                        Source
                      </p>
                      <p className="mt-1 text-slate-700">
                        {SOURCE_LABELS[lead.source]}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Est. value
                      </p>
                      <p className="mt-1 font-medium text-slate-800">
                        {formatCurrency(lead.estimatedValue)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-400">
                    Created {formatDate(lead.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(
                    search,
                    status ?? "",
                    source ?? "",
                    currentPage - 1,
                  )}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-300">
                  Previous
                </span>
              )}

              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(
                    search,
                    status ?? "",
                    source ?? "",
                    currentPage + 1,
                  )}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-300">
                  Next
                </span>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}