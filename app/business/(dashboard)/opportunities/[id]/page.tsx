import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { getOpportunityById } from "@/lib/opportunities";

import OpportunityManagement from "./OpportunityManagement";
import OwnershipControl from "./OwnershipControl";

type OpportunityDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<string, string> = {
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

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

function getStatusClasses(status: string) {
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

function getPriorityClasses(priority: string) {
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

function formatDate(value: Date | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatDateTime(value: Date | null | undefined) {
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

function formatCurrency(value: unknown) {
  if (value === null || value === undefined) {
    return "—";
  }

  return `₦${Number(value).toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default async function OpportunityDetailPage({
  params,
}: OpportunityDetailPageProps) {
  const { id } = await params;

  const [opportunity, currentUser] =
    await Promise.all([
      getOpportunityById(id),
      getCurrentUser(),
    ]);

  if (!opportunity) {
    notFound();
  }  

  const activeUsers =
   currentUser?.role === "ADMIN"
    ? await prisma.user.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: [
          { name: "asc" },
          { email: "asc" },
        ],
      })
    : [];

  const auditRequest = opportunity.auditRequest;
  const organization = auditRequest.organization;
  const contact = auditRequest.contact;
  const lead = auditRequest.lead;

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <OpportunityManagement
  opportunity={{
    id: opportunity.id,
    name: opportunity.name,
    description: opportunity.description,
    priority: opportunity.priority,
    status: opportunity.status,
    estimatedValue: opportunity.estimatedValue,
  }}
/>
      {/* Breadcrumb + Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/business/opportunities"
            className="text-sm text-slate-500 transition hover:text-slate-900"
          >
            Opportunities
          </Link>

          <span className="text-slate-300">/</span>

          <span className="truncate text-sm text-slate-500">
            {opportunity.name}
          </span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {opportunity.name}
              </h1>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClasses(
                  opportunity.priority,
                )}`}
              >
                {priorityLabels[opportunity.priority] ??
                  opportunity.priority}
              </span>

              <span
                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                  opportunity.status,
                )}`}
              >
                {statusLabels[opportunity.status] ??
                  opportunity.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Opportunity identified from an audit request for{" "}
              <Link
                href={`/business/organizations/${organization.id}`}
                className="font-medium text-slate-700 hover:underline"
              >
                {organization.name}
              </Link>
              .
            </p>
          </div>

          <div className="shrink-0">
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Estimated Value
              </p>

              <p className="mt-1 text-xl font-semibold text-slate-900">
                {formatCurrency(opportunity.estimatedValue)}
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
            Contact
          </p>

          <Link
            href={`/business/contacts/${contact.id}`}
            className="mt-2 block truncate text-sm font-semibold text-slate-900 hover:underline"
          >
            {contact.name}
          </Link>

          <p className="mt-1 truncate text-xs text-slate-500">
            {contact.email}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(opportunity.createdAt)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Last Updated
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(opportunity.updatedAt)}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main */}
        <div className="space-y-6">
          {/* Opportunity Details */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Opportunity Details
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Business opportunity information.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Name
                </p>

                <p className="mt-2 text-sm font-medium text-slate-900">
                  {opportunity.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Description
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {opportunity.description ||
                    "No description has been provided."}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Priority
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClasses(
                      opportunity.priority,
                    )}`}
                  >
                    {priorityLabels[opportunity.priority] ??
                      opportunity.priority}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                      opportunity.status,
                    )}`}
                  >
                    {statusLabels[opportunity.status] ??
                      opportunity.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Estimated Value
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatCurrency(opportunity.estimatedValue)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Client Information */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Client Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Organization and contact associated with this opportunity.
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

                  {contact.phone && <p>{contact.phone}</p>}

                  {contact.role && <p>{contact.role}</p>}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <OwnershipControl
            opportunityId={opportunity.id}
            createdByUser={opportunity.createdByUser}
            assignedToUser={opportunity.assignedToUser}
            activeUsers={activeUsers}
            canManage={currentUser?.role === "ADMIN"}
          />
          {/* Source Audit */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Source Audit
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Audit request that generated this opportunity.
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

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      auditRequest.status as string,
                    )}`}
                  >
                    {statusLabels[auditRequest.status] ??
                      auditRequest.status}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Audit created
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {formatDateTime(auditRequest.createdAt)}
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
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        lead.status as string,
                      )}`}
                    >
                      {statusLabels[lead.status] ?? lead.status}
                    </span>
                  </div>

                  {lead.estimatedValue !== null && (
                    <p className="mt-3 text-xs text-slate-500">
                      Lead estimated value:{" "}
                      <span className="font-medium text-slate-700">
                        {formatCurrency(lead.estimatedValue)}
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
                  Created
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(opportunity.createdAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Last updated
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {formatDateTime(opportunity.updatedAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs text-slate-400">
                  Opportunity ID
                </p>

                <p className="mt-1 break-all font-mono text-xs text-slate-600">
                  {opportunity.id}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
