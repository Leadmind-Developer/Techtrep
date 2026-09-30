import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ProjectManagement from "./ProjectManagement";

import type {
OpportunityPriority,
ProjectStatus,
} from "../../../../../generated/prisma/client";

type PageProps = {
params: Promise<{
id: string;
}>;
};

function getStatusLabel(status: ProjectStatus) {
return status.replaceAll("_", " ");
}

function getPriorityLabel(priority: OpportunityPriority) {
return priority;
}

function getStatusClass(status: ProjectStatus) {
switch (status) {
case "PLANNING":
return "bg-slate-100 text-slate-700 ring-slate-600/20";

case "IN_PROGRESS":
  return "bg-blue-100 text-blue-700 ring-blue-600/20";

case "ON_HOLD":
  return "bg-amber-100 text-amber-700 ring-amber-600/20";

case "COMPLETED":
  return "bg-emerald-100 text-emerald-700 ring-emerald-600/20";

case "CANCELLED":
  return "bg-red-100 text-red-700 ring-red-600/20";

default:
  return "bg-slate-100 text-slate-700 ring-slate-600/20";

}
}

function getPriorityClass(priority: OpportunityPriority) {
switch (priority) {
case "LOW":
return "bg-slate-100 text-slate-700 ring-slate-600/20";

case "MEDIUM":
  return "bg-blue-100 text-blue-700 ring-blue-600/20";

case "HIGH":
  return "bg-amber-100 text-amber-700 ring-amber-600/20";

case "CRITICAL":
  return "bg-red-100 text-red-700 ring-red-600/20";

default:
  return "bg-slate-100 text-slate-700 ring-slate-600/20";

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

function formatCurrency(
value: unknown,
currency = "NGN",
) {
if (value === null || value === undefined) {
return "—";
}

const amount = Number(value);

if (!Number.isFinite(amount)) {
return "—";
}

return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
minimumFractionDigits: 2,
maximumFractionDigits: 2,
}).format(amount);
}

export default async function ProjectDetailPage({
params,
}: PageProps) {
const { id } = await params;

const [project, projectManagers] =
  await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        projectManager: {
          select: {
            id: true,
            name: true,
            email: true,
            active: true,
          },
        },

        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        proposal: {
          include: {
            opportunity: {
              include: {
                auditRequest: {
                  include: {
                    organization: {
                      select: {
                        id: true,
                        name: true,
                        website: true,
                        industry: true,
                        companySize: true,
                      },
                    },

                    contact: {
                      select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        role: true,
                      },
                    },

                    lead: {
                      select: {
                        id: true,
                        status: true,
                        source: true,
                        estimatedValue: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }),

    prisma.user.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

if (!project) {
  notFound();
}

const organization =
project.proposal.opportunity.auditRequest.organization;

const contact =
project.proposal.opportunity.auditRequest.contact;

const opportunity =
project.proposal.opportunity;

const proposal = project.proposal;

return ( <div className="mx-auto w-full max-w-7xl space-y-6">
{/* Breadcrumb */} <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500"> <Link
       href="/business/projects"
       className="hover:text-slate-900 hover:underline"
     >
Projects </Link>

    <span>/</span>

    <span className="text-slate-700">
      {project.projectNumber}
    </span>
  </div>

  {/* Header */}
  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClass(
            project.status,
          )}`}
        >
          {getStatusLabel(project.status)}
        </span>

        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClass(
            project.priority,
          )}`}
        >
          {getPriorityLabel(project.priority)}
        </span>
      </div>

      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
        {project.name}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        {project.projectNumber}
      </p>

      {project.description && (
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600">
          {project.description}
        </p>
      )}
    </div>

    <div className="flex flex-wrap items-center gap-2">
      <Link
        href="/business/projects"
        className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        All Projects
      </Link>

      <Link
        href={`/business/proposals/${proposal.id}`}
        className="rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
      >
        View Proposal
      </Link>
    </div>
  </div>

  {/* Summary */}
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Contract value
      </p>

      <p className="mt-2 text-xl font-semibold text-slate-900">
        {formatCurrency(
          project.contractValue,
          project.currency,
        )}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Project manager
      </p>

      <p className="mt-2 font-medium text-slate-900">
        {project.projectManager?.name ?? "Unassigned"}
      </p>

      {project.projectManager && (
        <p className="mt-1 truncate text-xs text-slate-500">
          {project.projectManager.email}
        </p>
      )}
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Start date
      </p>

      <p className="mt-2 font-medium text-slate-900">
        {formatDate(project.startDate)}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Target completion
      </p>

      <p className="mt-2 font-medium text-slate-900">
        {formatDate(project.targetEndDate)}
      </p>
    </div>
  </div>

  <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
    {/* Main content */}
    <div className="space-y-6">
      {/* Project details */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Project Details
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Core delivery information for this project.
          </p>
        </div>

        <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Project number
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {project.projectNumber}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Status
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {getStatusLabel(project.status)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Priority
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {getPriorityLabel(project.priority)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Currency
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {project.currency}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Start date
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {formatDate(project.startDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Target end date
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {formatDate(project.targetEndDate)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Completed
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {formatDate(project.completedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created
            </p>

            <p className="mt-1 text-sm text-slate-900">
              {formatDateTime(project.createdAt)}
            </p>
          </div>

          {project.description && (
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Description
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {project.description}
              </p>
            </div>
          )}
        </div>
      </section>

      <ProjectManagement
        project={{
         id: project.id,
         projectNumber: project.projectNumber,
         name: project.name,
         description: project.description,
         status: project.status,
         priority: project.priority,
         contractValue: project.contractValue,
         currency: project.currency,
         startDate: project.startDate
           ? project.startDate.toISOString()
           : null,
         targetEndDate: project.targetEndDate
           ? project.targetEndDate.toISOString()
           : null,
         projectManagerId:
         project.projectManagerId,
       }}
       projectManagers={projectManagers}
      />

      {/* Client information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Client Information
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            Organization and primary contact associated with the project.
          </p>
        </div>

        <div className="grid gap-6 px-5 py-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Organization
            </p>

            <Link
              href={`/business/organizations/${organization.id}`}
              className="mt-2 block font-medium text-[#39358c] hover:underline"
            >
              {organization.name}
            </Link>

            {organization.industry && (
              <p className="mt-1 text-sm text-slate-500">
                {organization.industry}
              </p>
            )}

            {organization.website && (
              <p className="mt-1 text-sm text-slate-500">
                {organization.website}
              </p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Primary contact
            </p>

            <Link
              href={`/business/contacts/${contact.id}`}
              className="mt-2 block font-medium text-[#39358c] hover:underline"
            >
              {contact.name}
            </Link>

            <p className="mt-1 text-sm text-slate-500">
              {contact.email}
            </p>

            {contact.phone && (
              <p className="mt-1 text-sm text-slate-500">
                {contact.phone}
              </p>
            )}

            {contact.role && (
              <p className="mt-1 text-sm text-slate-500">
                {contact.role}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Proposal and opportunity */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Commercial Context
          </h2>

          <p className="mt-0.5 text-sm text-slate-500">
            The approved proposal and opportunity that created this project.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <span className="text-sm text-slate-500">
              Proposal
            </span>

            <Link
              href={`/business/proposals/${proposal.id}`}
              className="text-sm font-medium text-[#39358c] hover:underline"
            >
              {proposal.proposalNumber} — {proposal.title}
            </Link>
          </div>

          <div className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <span className="text-sm text-slate-500">
              Proposal status
            </span>

            <span className="text-sm font-medium text-slate-900">
              {proposal.status.replaceAll("_", " ")}
            </span>
          </div>

          <div className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <span className="text-sm text-slate-500">
              Proposal amount
            </span>

            <span className="text-sm font-medium text-slate-900">
              {formatCurrency(
                proposal.amount,
                proposal.currency,
              )}
            </span>
          </div>

          <div className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <span className="text-sm text-slate-500">
              Opportunity
            </span>

            <Link
              href={`/business/opportunities/${opportunity.id}`}
              className="text-sm font-medium text-[#39358c] hover:underline"
            >
              {opportunity.name}
            </Link>
          </div>

          <div className="grid gap-2 px-5 py-4 sm:grid-cols-[180px_1fr]">
            <span className="text-sm text-slate-500">
              Opportunity status
            </span>

            <span className="text-sm text-slate-900">
              {opportunity.status.replaceAll("_", " ")}
            </span>
          </div>
        </div>
      </section>
    </div>

    {/* Sidebar */}
    <aside className="space-y-6">
      {/* Project manager */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Project Manager
          </h2>
        </div>

        <div className="px-5 py-5">
          {project.projectManager ? (
            <>
              <p className="font-medium text-slate-900">
                {project.projectManager.name}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {project.projectManager.email}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                  project.projectManager.active
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {project.projectManager.active
                  ? "Active"
                  : "Inactive"}
              </span>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              No project manager assigned.
            </p>
          )}
        </div>
      </section>

      {/* Source proposal */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Source Proposal
          </h2>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Proposal
            </p>

            <Link
              href={`/business/proposals/${proposal.id}`}
              className="mt-1 block text-sm font-medium text-[#39358c] hover:underline"
            >
              {proposal.proposalNumber}
            </Link>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Opportunity
            </p>

            <Link
              href={`/business/opportunities/${opportunity.id}`}
              className="mt-1 block text-sm font-medium text-[#39358c] hover:underline"
            >
              {opportunity.name}
            </Link>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Audit request
            </p>

            <Link
              href={`/business/audit-requests/${project.proposal.opportunity.auditRequest.id}`}
              className="mt-1 block text-sm font-medium text-[#39358c] hover:underline"
            >
              View audit request
            </Link>
          </div>
        </div>
      </section>

      {/* Record information */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Record Information
          </h2>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDateTime(project.createdAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Last updated
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDateTime(project.updatedAt)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Created by
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {project.createdByUser?.name ?? "System"}
            </p>

            {project.createdByUser?.email && (
              <p className="mt-1 text-xs text-slate-500">
                {project.createdByUser.email}
              </p>
            )}
          </div>

          {project.completedAt && (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {formatDateTime(project.completedAt)}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Linked lead */}
      {project.proposal.opportunity.auditRequest.lead && (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Linked Lead
            </h2>
          </div>

          <div className="space-y-4 px-5 py-5">
            <Link
              href={`/business/leads/${project.proposal.opportunity.auditRequest.lead.id}`}
              className="text-sm font-medium text-[#39358c] hover:underline"
            >
              View lead
            </Link>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {project.proposal.opportunity.auditRequest.lead.status.replaceAll(
                  "_",
                  " ",
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Source
              </p>

              <p className="mt-1 text-sm text-slate-700">
                {project.proposal.opportunity.auditRequest.lead.source.replaceAll(
                  "_",
                  " ",
                )}
              </p>
            </div>
          </div>
        </section>
      )}
    </aside>
  </div>
</div>
);
}
