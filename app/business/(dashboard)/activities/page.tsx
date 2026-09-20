import Link from "next/link";

import {
  getActivities,
  getActivityFormOptions,
} from "@/lib/activities";

import type {
  ActivityType,
} from "../../../../generated/prisma/client";

const ACTIVITY_TYPES: ActivityType[] = [
  "NOTE",
  "EMAIL",
  "PHONE_CALL",
  "WHATSAPP",
  "MEETING",
  "AUDIT",
  "PROPOSAL",
  "FOLLOW_UP",
  "STATUS_CHANGE",
  "OTHER",
];

function formatActivityType(type: ActivityType) {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getTypeClasses(type: ActivityType) {
  switch (type) {
    case "STATUS_CHANGE":
      return "bg-blue-100 text-blue-700";
    case "MEETING":
      return "bg-purple-100 text-purple-700";
    case "EMAIL":
      return "bg-cyan-100 text-cyan-700";
    case "PHONE_CALL":
      return "bg-green-100 text-green-700";
    case "WHATSAPP":
      return "bg-emerald-100 text-emerald-700";
    case "AUDIT":
      return "bg-amber-100 text-amber-700";
    case "PROPOSAL":
      return "bg-indigo-100 text-indigo-700";
    case "FOLLOW_UP":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function buildPageUrl(
  params: Record<string, string | undefined>,
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();

  return query
    ? `/business/activities?${query}`
    : "/business/activities";
}

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const search =
    typeof params.search === "string"
      ? params.search
      : "";

  const type =
    typeof params.type === "string"
      ? params.type
      : undefined;

  const organizationId =
    typeof params.organizationId === "string"
      ? params.organizationId
      : undefined;

  const leadId =
    typeof params.leadId === "string"
      ? params.leadId
      : undefined;

  const auditRequestId =
    typeof params.auditRequestId === "string"
      ? params.auditRequestId
      : undefined;

  const pageValue =
    typeof params.page === "string"
      ? Number(params.page)
      : 1;

  const page =
    Number.isInteger(pageValue) && pageValue > 0
      ? pageValue
      : 1;

  const validType = ACTIVITY_TYPES.includes(
    type as ActivityType,
  )
    ? (type as ActivityType)
    : undefined;

  const [{ activities, total, totalPages }, options] =
    await Promise.all([
      getActivities({
        search,
        type: validType,
        organizationId,
        leadId,
        auditRequestId,
        page,
      }),
      getActivityFormOptions(),
    ]);

  const currentFilters = {
    search: search || undefined,
    type: validType,
    organizationId,
    leadId,
    auditRequestId,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Activities
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Track notes, calls, meetings, audits, proposals,
            follow-ups, and status changes.
          </p>
        </div>

        <Link
          href="/business/activities/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New Activity
        </Link>
      </div>

      <form
        method="get"
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="grid gap-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <label
              htmlFor="search"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="search"
              name="search"
              defaultValue={search}
              placeholder="Search activities or organizations..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="type"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Type
            </label>

            <select
              id="type"
              name="type"
              defaultValue={validType ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All types</option>

              {ACTIVITY_TYPES.map((activityType) => (
                <option
                  key={activityType}
                  value={activityType}
                >
                  {formatActivityType(activityType)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="organizationId"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Organization
            </label>

            <select
              id="organizationId"
              name="organizationId"
              defaultValue={organizationId ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All organizations</option>

              {options.organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="leadId"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Lead
            </label>

            <select
              id="leadId"
              name="leadId"
              defaultValue={leadId ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">All leads</option>

              {options.leads.map((lead) => (
                <option
                  key={lead.id}
                  value={lead.id}
                >
                  {lead.contact?.name ??
                    "Lead"}{" "}
                  — {lead.organization.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Apply Filters
          </button>

          <Link
            href="/business/activities"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Clear
          </Link>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {total} {total === 1 ? "activity" : "activities"}
        </p>

        <p className="text-sm text-slate-500">
          Page {page} of {totalPages}
        </p>
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-slate-900">
            No activities found
          </h2>

          <p className="mt-2 text-sm text-slate-600">
            Try changing your filters or create a new activity.
          </p>

          <Link
            href="/business/activities/new"
            className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            Create Activity
          </Link>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Activity
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Lead
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Audit
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/business/activities/${activity.id}`}
                        className="block"
                      >
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClasses(
                            activity.type,
                          )}`}
                        >
                          {formatActivityType(
                            activity.type,
                          )}
                        </span>

                        <p className="mt-2 max-w-md text-sm font-medium text-slate-900">
                          {activity.description}
                        </p>
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      <Link
                        href={`/business/organizations/${activity.organization.id}`}
                        className="font-medium text-slate-900 hover:underline"
                      >
                        {activity.organization.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {activity.lead ? (
                        <Link
                          href={`/business/leads/${activity.lead.id}`}
                          className="text-slate-700 hover:underline"
                        >
                          View lead
                        </Link>
                      ) : (
                        <span className="text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {activity.auditRequest ? (
                        <Link
                          href={`/business/audit-requests/${activity.auditRequest.id}`}
                          className="text-slate-700 hover:underline"
                        >
                          View audit
                        </Link>
                      ) : (
                        <span className="text-slate-400">
                          —
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {formatDate(activity.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 lg:hidden">
            {activities.map((activity) => (
              <Link
                key={activity.id}
                href={`/business/activities/${activity.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getTypeClasses(
                      activity.type,
                    )}`}
                  >
                    {formatActivityType(activity.type)}
                  </span>

                  <span className="text-xs text-slate-400">
                    {formatDate(activity.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-slate-900">
                  {activity.description}
                </p>

                <p className="mt-2 text-sm text-slate-600">
                  {activity.organization.name}
                </p>

                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                  {activity.lead && (
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      Lead
                    </span>
                  )}

                  {activity.auditRequest && (
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      Audit
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          {page > 1 ? (
            <Link
              href={buildPageUrl({
                ...currentFilters,
                page: String(page - 1),
              })}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Previous
            </Link>
          ) : (
            <span />
          )}

          {page < totalPages ? (
            <Link
              href={buildPageUrl({
                ...currentFilters,
                page: String(page + 1),
              })}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Next
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </div>
  );
}