import Link from "next/link";

import { getProjects } from "@/lib/projects";
import { prisma } from "@/lib/prisma";
import {
  OpportunityPriority,
  ProjectStatus,
} from "../../../../generated/prisma/client";

const PROJECT_STATUSES: ProjectStatus[] = [
  "PLANNING",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const PROJECT_PRIORITIES: OpportunityPriority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "CRITICAL",
];

function getStatusLabel(status: ProjectStatus) {
  return status.replaceAll("_", " ");
}

function getPriorityLabel(priority: OpportunityPriority) {
  return priority;
}

function getStatusClass(status: ProjectStatus) {
  switch (status) {
    case "PLANNING":
      return "bg-slate-100 text-slate-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "ON_HOLD":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getPriorityClass(priority: OpportunityPriority) {
  switch (priority) {
    case "LOW":
      return "bg-slate-100 text-slate-700";
    case "MEDIUM":
      return "bg-blue-100 text-blue-700";
    case "HIGH":
      return "bg-amber-100 text-amber-700";
    case "CRITICAL":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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

function buildQuery(
  params: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  return searchParams.toString();
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : "";

  const statusParam =
    typeof params.status === "string"
      ? params.status
      : "";

  const priorityParam =
    typeof params.priority === "string"
      ? params.priority
      : "";

  const projectManagerId =
    typeof params.projectManagerId === "string"
      ? params.projectManagerId
      : "";

  const pageParam =
    typeof params.page === "string"
      ? Number(params.page)
      : 1;

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const status = PROJECT_STATUSES.includes(
    statusParam as ProjectStatus,
  )
    ? (statusParam as ProjectStatus)
    : undefined;

  const priority = PROJECT_PRIORITIES.includes(
    priorityParam as OpportunityPriority,
  )
    ? (priorityParam as OpportunityPriority)
    : undefined;

  const [
    { projects, total, totalPages },
    projectManagers,
  ] = await Promise.all([
      getProjects({      
        search,
        status,
        priority,
        projectManagerId,
        page,
      }),
      prisma.user.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        orderBy: {
          name: "asc",
        },
      }),
    ]);

  const previousPage =
    Math.max(1, page - 1);

  const nextPage =
    Math.min(totalPages, page + 1);

  const previousQuery = buildQuery({
    search,
    status,
    priority,
    projectManagerId,
    page:
      previousPage > 1
        ? String(previousPage)
        : undefined,
  });

  const nextQuery = buildQuery({
    search,
    status,
    priority,
    projectManagerId,
    page:
      nextPage > 1
        ? String(nextPage)
        : undefined,
  });

  const clearQuery = buildQuery({});

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 text-sm text-slate-500">
            Business / Projects
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Projects
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Manage approved client work from planning through completion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/business/proposals"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Proposals
          </Link>
        </div>
      </div>

      <form
        method="GET"
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_auto]">
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
              placeholder="Project number, name, client..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
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
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
            >
              <option value="">All statuses</option>

              {PROJECT_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {getStatusLabel(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Priority
            </label>

            <select
              id="priority"
              name="priority"
              defaultValue={priority ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
            >
              <option value="">All priorities</option>

              {PROJECT_PRIORITIES.map((item) => (
                <option key={item} value={item}>
                  {getPriorityLabel(item)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="projectManagerId"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Project manager
            </label>

            <select
              id="projectManagerId"
              name="projectManagerId"
              defaultValue={projectManagerId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
            >
              <option value="">
                All managers
              </option>

              {projectManagers.map((manager) => (
                <option
                  key={manager.id}
                  value={manager.id}
                >
                  {manager.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-lg bg-[#39358c] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              Filter
            </button>

            <Link
              href="/business/projects"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </Link>
          </div>
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Project pipeline
            </h2>

            <p className="mt-0.5 text-sm text-slate-500">
              {total} {total === 1 ? "project" : "projects"}
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <h3 className="text-base font-semibold text-slate-900">
              No projects found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Projects created from accepted proposals will appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Project
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Client
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Priority
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Value
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Manager
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Start
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {projects.map((project) => {
                    const client =
                      project.proposal.opportunity
                        .auditRequest.organization;

                    return (
                      <tr
                        key={project.id}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/business/projects/${project.id}`}
                            className="font-medium text-[#39358c] hover:underline"
                          >
                            {project.projectNumber}
                          </Link>

                          <div className="mt-1 text-sm text-slate-900">
                            {project.name}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-slate-900">
                            {client.name}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {project.proposal.opportunity.name}
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(project.status)}`}
                          >
                            {getStatusLabel(project.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(project.priority)}`}
                          >
                            {getPriorityLabel(project.priority)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {formatCurrency(
                            project.contractValue,
                            project.currency,
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="text-sm text-slate-900">
                            {project.projectManager?.name ??
                              "Unassigned"}
                          </div>

                          {project.projectManager?.active === false && (
                            <div className="mt-1 text-xs text-red-600">
                              Inactive
                            </div>
                          )}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-600">
                          {formatDate(project.startDate)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-200 md:hidden">
              {projects.map((project) => {
                const client =
                  project.proposal.opportunity
                    .auditRequest.organization;

                return (
                  <Link
                    key={project.id}
                    href={`/business/projects/${project.id}`}
                    className="block p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-[#39358c]">
                          {project.projectNumber}
                        </div>

                        <div className="mt-1 font-medium text-slate-900">
                          {project.name}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(project.status)}`}
                      >
                        {getStatusLabel(project.status)}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500">
                          Client
                        </div>

                        <div className="mt-1 text-sm text-slate-900">
                          {client.name}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">
                          Priority
                        </div>

                        <div className="mt-1">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(project.priority)}`}
                          >
                            {getPriorityLabel(project.priority)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">
                          Value
                        </div>

                        <div className="mt-1 text-sm text-slate-900">
                          {formatCurrency(
                            project.contractValue,
                            project.currency,
                          )}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-slate-500">
                          Manager
                        </div>

                        <div className="mt-1 text-sm text-slate-900">
                          {project.projectManager?.name ??
                            "Unassigned"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}

        {total > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </div>

            <div className="flex items-center gap-2">
              {page > 1 ? (
                <Link
                  href={`/business/projects?${previousQuery}`}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-400">
                  Previous
                </span>
              )}

              {page < totalPages ? (
                <Link
                  href={`/business/projects?${nextQuery}`}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-400">
                  Next
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}