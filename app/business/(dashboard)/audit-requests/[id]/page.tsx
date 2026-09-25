import Link from "next/link";
import { notFound } from "next/navigation";

import { getAuditRequestById } from "@/lib/audit-requests";
import AuditRequestManagement from "./AuditRequestManagement";

type AuditRequestDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<string, string> = {
  REQUESTED: "Requested",
  CONTACTED: "Contacted",
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  REPORT_SENT: "Report Sent",
  PROPOSAL_SENT: "Proposal Sent",
  WON: "Won",
  LOST: "Lost",
};

const sourceLabels: Record<string, string> = {
  AUDIT: "Audit",
  WEBSITE: "Website",
  REFERRAL: "Referral",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  PHONE: "Phone",
  LINKEDIN: "LinkedIn",
  SOCIAL_MEDIA: "Social Media",
  DIRECT: "Direct",
  OTHER: "Other",
};

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

function getStatusClasses(status: string) {
  switch (status) {
    case "REQUESTED":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "CONTACTED":
      return "bg-indigo-50 text-indigo-700 ring-indigo-600/20";

    case "SCHEDULED":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "REPORT_SENT":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    case "PROPOSAL_SENT":
      return "bg-violet-50 text-violet-700 ring-violet-600/20";

    case "WON":
      return "bg-green-50 text-green-700 ring-green-600/20";

    case "LOST":
      return "bg-red-50 text-red-700 ring-red-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
}

function getActivityTypeLabel(type: string) {
  switch (type) {
    case "NOTE":
      return "Note";
    case "EMAIL":
      return "Email";
    case "PHONE_CALL":
      return "Phone Call";
    case "WHATSAPP":
      return "WhatsApp";
    case "MEETING":
      return "Meeting";
    case "AUDIT":
      return "Audit";
    case "PROPOSAL":
      return "Proposal";
    case "FOLLOW_UP":
      return "Follow-up";
    case "STATUS_CHANGE":
      return "Status Change";
    default:
      return "Activity";
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

export default async function AuditRequestDetailPage({
  params,
}: AuditRequestDetailPageProps) {
  const { id } = await params;

  const auditRequest = await getAuditRequestById(id);

  if (!auditRequest) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Link
              href="/business/audit-requests"
              className="text-sm text-slate-500 transition hover:text-slate-900"
            >
              Audit Requests
            </Link>

            <span className="text-slate-300">/</span>

            <span className="text-sm text-slate-500">
              {auditRequest.id}
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Digital Audit Request
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review the client&apos;s audit requirements, business context,
            linked lead, opportunities, and activity history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
              auditRequest.status,
            )}`}
          >
            {statusLabels[auditRequest.status] ?? auditRequest.status}
          </span>

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
            {sourceLabels[auditRequest.source] ?? auditRequest.source}
          </span>
        </div>
      </div>

      {/* Summary */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Organization
          </p>

          <Link
            href={`/business/organizations/${auditRequest.organization.id}`}
            className="mt-2 block truncate text-sm font-semibold text-slate-900 hover:underline"
          >
            {auditRequest.organization.name}
          </Link>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Contact
          </p>

          <Link
            href={`/business/contacts/${auditRequest.contact.id}`}
            className="mt-2 block truncate text-sm font-semibold text-slate-900 hover:underline"
          >
            {auditRequest.contact.name}
          </Link>

          <p className="mt-1 truncate text-xs text-slate-500">
            {auditRequest.contact.email}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Created
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {formatDate(auditRequest.createdAt)}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Opportunities
          </p>

          <p className="mt-2 text-sm font-semibold text-slate-900">
            {auditRequest.opportunities.length}
          </p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Organization & Contact */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Client Information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Organization and primary contact associated with this audit.
              </p>
            </div>

            <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Organization
                </p>

                <Link
                  href={`/business/organizations/${auditRequest.organization.id}`}
                  className="mt-2 block text-sm font-medium text-slate-900 hover:underline"
                >
                  {auditRequest.organization.name}
                </Link>

                {auditRequest.organization.website && (
                  <a
                    href={auditRequest.organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-xs text-blue-600 hover:underline"
                  >
                    {auditRequest.organization.website}
                  </a>
                )}

                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  {auditRequest.organization.industry && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Industry:
                      </span>{" "}
                      {auditRequest.organization.industry}
                    </p>
                  )}

                  {auditRequest.organization.companySize && (
                    <p>
                      <span className="font-medium text-slate-700">
                        Company size:
                      </span>{" "}
                      {auditRequest.organization.companySize}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Contact
                </p>

                <Link
                  href={`/business/contacts/${auditRequest.contact.id}`}
                  className="mt-2 block text-sm font-medium text-slate-900 hover:underline"
                >
                  {auditRequest.contact.name}
                </Link>

                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <p>{auditRequest.contact.email}</p>

                  {auditRequest.contact.phone && (
                    <p>{auditRequest.contact.phone}</p>
                  )}

                  {auditRequest.contact.role && (
                    <p>{auditRequest.contact.role}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Requested Improvements */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Requested Improvements
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Areas where the client wants to improve their business or
                technology operations.
              </p>
            </div>

            <div className="p-5 sm:p-6">
              {auditRequest.improvements.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {auditRequest.improvements.map((improvement) => (
                    <div
                      key={improvement}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <p className="text-sm text-slate-700">
                        {improvement}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No specific improvement areas were provided.
                </p>
              )}
            </div>
          </section>

          {/* Business & Technology Context */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Business &amp; Technology Context
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Information provided by the client about current operations.
              </p>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Manual Work
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {auditRequest.manualWork || "No information provided."}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Existing Systems
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {auditRequest.existingSystems ||
                    "No information provided."}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Additional Information
                </p>

                <div className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                  {auditRequest.additionalInformation ||
                    "No additional information provided."}
                </div>
              </div>
            </div>
          </section>

          {/* Opportunities */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Opportunities
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Potential services or improvements identified from this
                  audit.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {auditRequest.opportunities.length}
              </span>
            </div>

            {auditRequest.opportunities.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {auditRequest.opportunities.map((opportunity) => (
                  <div
                    key={opportunity.id}
                    className="p-5 sm:px-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-900">
                          {opportunity.name}
                        </h3>

                        {opportunity.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {opportunity.description}
                          </p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getPriorityClasses(
                            opportunity.priority,
                          )}`}
                        >
                          {opportunity.priority}
                        </span>

                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {opportunity.status}
                        </span>
                      </div>
                    </div>

                    {opportunity.estimatedValue !== null && (
                      <p className="mt-3 text-xs text-slate-500">
                        Estimated value:{" "}
                        <span className="font-medium text-slate-700">
                          ₦
                          {Number(
                            opportunity.estimatedValue,
                          ).toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-sm text-slate-500">
                No opportunities have been identified for this audit yet.
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
            <AuditRequestManagement
              auditRequestId={auditRequest.id}
              status={auditRequest.status}
              scheduledAt={auditRequest.scheduledAt?.toISOString() ?? null}
              completedAt={auditRequest.completedAt?.toISOString() ?? null}
              reportSentAt={auditRequest.reportSentAt?.toISOString() ?? null}
             />
          {/* Timeline */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Audit Timeline
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Important dates for this audit request.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              <div className="px-5 py-4">
                <p className="text-xs font-medium text-slate-500">
                  Requested
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(auditRequest.createdAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs font-medium text-slate-500">
                  Scheduled
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(auditRequest.scheduledAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(auditRequest.completedAt)}
                </p>
              </div>

              <div className="px-5 py-4">
                <p className="text-xs font-medium text-slate-500">
                  Report Sent
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDateTime(auditRequest.reportSentAt)}
                </p>
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
              {auditRequest.lead ? (
                <>
                  <Link
                    href={`/business/leads/${auditRequest.lead.id}`}
                    className="text-sm font-semibold text-slate-900 hover:underline"
                  >
                    View linked lead
                  </Link>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                        auditRequest.lead.status,
                      )}`}
                    >
                      {statusLabels[auditRequest.lead.status] ??
                        auditRequest.lead.status}
                    </span>

                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {sourceLabels[auditRequest.lead.source] ??
                        auditRequest.lead.source}
                    </span>
                  </div>

                  {auditRequest.lead.estimatedValue !== null && (
                    <p className="mt-3 text-xs text-slate-500">
                      Estimated value:{" "}
                      <span className="font-medium text-slate-700">
                        ₦
                        {Number(
                          auditRequest.lead.estimatedValue,
                        ).toLocaleString("en-NG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  No lead is currently linked to this audit request.
                </p>
              )}
            </div>
          </section>

          {/* Activity */}
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Recent activity associated with this audit.
              </p>
            </div>

            {auditRequest.activities.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {auditRequest.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-slate-700">
                        {getActivityTypeLabel(activity.type)}
                      </span>

                      <span className="text-[11px] text-slate-400">
                        {formatDateTime(activity.createdAt)}
                      </span>
                    </div>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-sm text-slate-500">
                No activity has been recorded for this audit request yet.
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
