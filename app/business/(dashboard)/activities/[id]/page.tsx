import Link from "next/link";
import { notFound } from "next/navigation";

import { getActivityById } from "@/lib/activities";

import type {
  ActivityType,
} from "../../../../../generated/prisma/client";

function formatActivityType(type: ActivityType) {
  return type
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1),
    )
    .join(" ");
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "long",
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

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const activity = await getActivityById(id);

  if (!activity) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          href="/business/activities"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Activities
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getTypeClasses(
                activity.type,
              )}`}
            >
              {formatActivityType(
                activity.type,
              )}
            </span>

            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              Activity Details
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Created {formatDate(activity.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Description
        </h2>

        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-800">
          {activity.description}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Organization
          </h2>

          <div className="mt-4 space-y-2 text-sm">
            <Link
              href={`/business/organizations/${activity.organization.id}`}
              className="font-medium text-slate-900 hover:underline"
            >
              {activity.organization.name}
            </Link>

            {activity.organization.website && (
              <p className="text-slate-600">
                {activity.organization.website}
              </p>
            )}

            {activity.organization.industry && (
              <p className="text-slate-600">
                Industry:{" "}
                {activity.organization.industry}
              </p>
            )}

            {activity.organization.companySize && (
              <p className="text-slate-600">
                Company size:{" "}
                {activity.organization.companySize}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Related Records
          </h2>

          <div className="mt-4 space-y-3 text-sm">
            {activity.lead ? (
              <div>
                <span className="text-slate-500">
                  Lead
                </span>

                <Link
                  href={`/business/leads/${activity.lead.id}`}
                  className="mt-1 block font-medium text-slate-900 hover:underline"
                >
                  View Lead
                </Link>
              </div>
            ) : null}

            {activity.auditRequest ? (
              <div>
                <span className="text-slate-500">
                  Audit Request
                </span>

                <Link
                  href={`/business/audit-requests/${activity.auditRequest.id}`}
                  className="mt-1 block font-medium text-slate-900 hover:underline"
                >
                  View Audit Request
                </Link>
              </div>
            ) : null}

            {!activity.lead &&
              !activity.auditRequest && (
                <p className="text-slate-500">
                  No additional records are linked
                  to this activity.
                </p>
              )}
          </div>
        </section>
      </div>

      {activity.lead && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Lead Context
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.lead.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Source
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.lead.source}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Estimated Value
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.lead.estimatedValue !==
                null
                  ? `₦${Number(
                      activity.lead
                        .estimatedValue,
                    ).toLocaleString(
                      "en-NG",
                    )}`
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Created
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(
                  activity.lead.createdAt,
                )}
              </p>
            </div>
          </div>
        </section>
      )}

      {activity.auditRequest && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Audit Request Context
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Status
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.auditRequest.status}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Source
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.auditRequest.source}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Scheduled
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.auditRequest
                  .scheduledAt
                  ? formatDate(
                      activity.auditRequest
                        .scheduledAt,
                    )
                  : "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Completed
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {activity.auditRequest
                  .completedAt
                  ? formatDate(
                      activity.auditRequest
                        .completedAt,
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </section>
      )}

      {activity.metadata && (
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Activity Metadata
          </h2>

          <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-6 text-slate-100">
            {JSON.stringify(
              activity.metadata,
              null,
              2,
            )}
          </pre>
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
        Activity ID: {activity.id}
      </section>
    </div>
  );
}