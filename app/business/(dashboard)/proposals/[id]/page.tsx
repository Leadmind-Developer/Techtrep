import Link from "next/link";
import { notFound } from "next/navigation";

import { getProposalById } from "@/lib/proposals";

import type { ProposalStatus } from "../../../../../generated/prisma/client";

type ProposalDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function formatDate(
  value: Date | null | undefined,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateTime(
  value: Date | null | undefined,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

  return `${currency} ${numericValue.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

export default async function ProposalDetailPage({
  params,
}: ProposalDetailPageProps) {
  const { id } = await params;

  const result = await getProposalById(id);

  if (!result) {
    notFound();
  }

  const { proposal, activities } = result;

  const opportunity = proposal.opportunity;
  const auditRequest = opportunity.auditRequest;
  const organization = auditRequest.organization;
  const contact = auditRequest.contact;
  const lead = auditRequest.lead;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/business/proposals"
            className="text-sm text-slate-500 transition hover:text-slate-900"
          >
            Proposals
          </Link>

          <span className="text-slate-300">/</span>

          <span className="truncate text-sm text-slate-500">
            {proposal.proposalNumber}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {proposal.title}
              </h1>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                  proposal.status,
                )}`}
              >
                {statusLabels[proposal.status]}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              {proposal.proposalNumber} for{" "}
              <Link
                href={`/business/organizations/${organization.id}`}
                className="font-medium text-slate-700 hover:underline"
              >
                {organization.name}
              </Link>
            </p>
          </div>

          <div className="shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Proposal Amount
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {formatCurrency(
                  proposal.amount,
                  proposal.currency,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Organization
          </p>

          <Link
            href={`/business/organizations/${organization.id}`}
            className="mt-2 block truncate text-sm font-semibold text-slate-900 hover:underline"
          >
            {organization.name}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Opportunity
          </p>

          <Link
            href={`/business/opportunities/${opportunity.id}`}
            className="mt-2 block truncate text-sm font-semibold text-slate-900 hover:underline"
          >
            {opportunity.name}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Valid Until
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(proposal.validUntil)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(proposal.createdAt)}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Proposal Details */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Proposal Details
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Commercial proposal information.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Title
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {proposal.title}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {proposal.description ||
                    "No description has been provided."}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                      proposal.status,
                    )}`}
                  >
                    {statusLabels[proposal.status]}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Amount
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatCurrency(
                      proposal.amount,
                      proposal.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Valid Until
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatDate(proposal.validUntil)}
                  </p>
                </div>
              </div>

              {proposal.notes && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Internal Notes
                  </p>

                  <div className="mt-2 whitespace-pre-wrap rounded-lg bg-amber-50 p-4 text-sm leading-6 text-slate-700">
                    {proposal.notes}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Client Information */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Client Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Organization and contact associated with this proposal.
              </p>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Organization
                </p>

                <Link
                  href={`/business/organizations/${organization.id}`}
                  className="mt-2 block text-sm font-semibold text-slate-900 hover:underline"
                >
                  {organization.name}
                </Link>

                {organization.website && (
                  <a
                    href={organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-xs text-blue-600 hover:underline"
                  >
                    {organization.website}
                  </a>
                )}

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {organization.industry && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Industry:
                      </span>{" "}
                      {organization.industry}
                    </p>
                  )}

                  {organization.companySize && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Company size:
                      </span>{" "}
                      {organization.companySize}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contact
                </p>

                <Link
                  href={`/business/contacts/${contact.id}`}
                  className="mt-2 block text-sm font-semibold text-slate-900 hover:underline"
                >
                  {contact.name}
                </Link>

                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p>{contact.email}</p>

                  {contact.phone && (
                    <p>{contact.phone}</p>
                  )}

                  {contact.role && (
                    <p>{contact.role}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Proposal Activity */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Proposal Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Activity recorded against this proposal.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-5 py-4 sm:px-6"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {activity.type.replace(
                            /_/g,
                            " ",
                          )}
                        </p>

                        <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                          {activity.description}
                        </p>
                      </div>

                      <p className="shrink-0 text-xs text-slate-400">
                        {formatDateTime(
                          activity.createdAt,
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-10 text-center sm:px-6">
                  <p className="text-sm text-slate-500">
                    No proposal activity has been recorded yet.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Opportunity */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Linked Opportunity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Business opportunity this proposal belongs to.
              </p>
            </div>

            <div className="p-5">
              <Link
                href={`/business/opportunities/${opportunity.id}`}
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                {opportunity.name}
              </Link>

              <div className="mt-3">
                <p className="text-xs text-slate-400">
                  Opportunity status
                </p>

                <span className="mt-1 inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                  {opportunity.status.replace(
                    /_/g,
                    " ",
                  )}
                </span>
              </div>

              {opportunity.description && (
                <p className="mt-3 line-clamp-4 text-xs leading-5 text-slate-500">
                  {opportunity.description}
                </p>
              )}
            </div>
          </section>

          {/* Source Audit */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Source Audit
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Audit request behind the opportunity.
              </p>
            </div>

            <div className="p-5">
              <Link
                href={`/business/audit-requests/${auditRequest.id}`}
                className="text-sm font-semibold text-slate-900 hover:underline"
              >
                View audit request
              </Link>

              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs text-slate-400">
                    Audit status
                  </p>

                  <span className="mt-1 inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                    {auditRequest.status.replace(
                      /_/g,
                      " ",
                    )}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Audit created
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDateTime(
                      auditRequest.createdAt,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Linked Lead */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Linked Lead
              </h2>
            </div>

            <div className="p-5">
              {lead ? (
                <>
                  <Link
                    href={`/business/leads/${lead.id}`}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    View linked lead
                  </Link>

                  <div className="mt-3">
                    <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/20">
                      {lead.status.replace(
                        /_/g,
                        " ",
                      )}
                    </span>
                  </div>

                  {lead.estimatedValue !== null && (
                    <p className="mt-3 text-xs text-slate-500">
                      Lead estimated value:{" "}
                      <span className="font-medium text-slate-700">
                        {formatCurrency(
                          lead.estimatedValue,
                        )}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  No lead is linked to the source audit request.
                </p>
              )}
            </div>
          </section>

          {/* Lifecycle */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Proposal Lifecycle
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Sent
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(proposal.sentAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Accepted
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(
                    proposal.acceptedAt,
                  )}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Rejected
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(
                    proposal.rejectedAt,
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* Record Information */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Record Information
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Created by
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {proposal.createdByUser?.name ??
                    proposal.createdByUser?.email ??
                    "System"}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Created
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(
                    proposal.createdAt,
                  )}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Last updated
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(
                    proposal.updatedAt,
                  )}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Proposal ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {proposal.id}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}