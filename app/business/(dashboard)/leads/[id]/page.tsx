import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/authorization";
import { prisma } from "@/lib/prisma";
import { getLeadById } from "@/lib/leads";

import AddLeadActivityForm from "./AddLeadActivityForm";
import LeadStatusControl from "./LeadStatusControl";
import OwnershipControl from "./OwnershipControl";

type LeadDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    activity?: string;
  }>;
};

const STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DISCOVERY: "Discovery",
  PROPOSAL_SENT: "Proposal sent",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

const SOURCE_LABELS: Record<string, string> = {
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

const STATUS_CLASSES: Record<string, string> = {
  NEW: "bg-slate-100 text-slate-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  QUALIFIED: "bg-cyan-100 text-cyan-700",
  DISCOVERY: "bg-violet-100 text-violet-700",
  PROPOSAL_SENT: "bg-amber-100 text-amber-700",
  NEGOTIATION: "bg-orange-100 text-orange-700",
  WON: "bg-emerald-100 text-emerald-700",
  LOST: "bg-rose-100 text-rose-700",
};

const ACTIVITY_LABELS: Record<string, string> = {
  NOTE: "Note",
  EMAIL: "Email",
  PHONE_CALL: "Phone call",
  WHATSAPP: "WhatsApp",
  MEETING: "Meeting",
  AUDIT: "Audit",
  PROPOSAL: "Proposal",
  FOLLOW_UP: "Follow-up",
  STATUS_CHANGE: "Status change",
  OTHER: "Other",
};

const ACTIVITY_ICONS: Record<string, string> = {
  NOTE: "N",
  EMAIL: "@",
  PHONE_CALL: "P",
  WHATSAPP: "W",
  MEETING: "M",
  AUDIT: "A",
  PROPOSAL: "P",
  FOLLOW_UP: "F",
  STATUS_CHANGE: "S",
  OTHER: "•",
};

function formatCurrency(value: unknown): string {
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
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatDateOnly(
  date: Date | string | null | undefined,
): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(date));
}

function getStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

function getSourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source;
}

function getActivityLabel(type: string): string {
  return ACTIVITY_LABELS[type] ?? type;
}

function getActivityIcon(type: string): string {
  return ACTIVITY_ICONS[type] ?? "•";
}

export default async function LeadDetailsPage({
  params,
  searchParams,
}: LeadDetailsPageProps) {
  const { id } = await params;
  const { activity } = await searchParams;

  const [lead, currentUser] = await Promise.all([
    getLeadById(id),
    getCurrentUser(),
  ]);

  if (!lead) {
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
            {
            name: "asc",
            },
            {
              email: "asc",
            },
          ],          
        })
      : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          href="/business/leads"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to leads
        </Link>

        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              CRM / Lead
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {lead.organization.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Lead created {formatDate(lead.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                STATUS_CLASSES[lead.status] ??
                "bg-slate-100 text-slate-700"
              }`}
            >
              {getStatusLabel(lead.status)}
            </span>

            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {getSourceLabel(lead.source)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Lead information
              </h2>
            </div>

            <div className="grid gap-5 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Organization
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {lead.organization.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Contact
                </p>

                {lead.contact ? (
                  <div className="mt-1">
                    <p className="text-sm font-medium text-slate-900">
                      {lead.contact.name}
                    </p>

                    <p className="mt-0.5 text-xs text-slate-500">
                      {lead.contact.email}
                    </p>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-500">
                    No contact assigned
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Source
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {getSourceLabel(lead.source)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Estimated value
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {formatCurrency(lead.estimatedValue)}
                </p>
              </div>

              {lead.contact?.phone && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {lead.contact.phone}
                  </p>
                </div>
              )}

              {lead.contact?.role && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Contact role
                  </p>

                  <p className="mt-1 text-sm text-slate-900">
                    {lead.contact.role}
                  </p>
                </div>
              )}
            </div>

            {lead.notes && (
              <div className="border-t border-slate-200 px-5 py-5 sm:px-6">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Notes
                </p>

                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {lead.notes}
                </p>
              </div>
            )}
          </section>

          {activity === "1" && (
            <AddLeadActivityForm leadId={lead.id} />
          )}

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Activity timeline
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Recent interactions and changes for this lead.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {lead.activities.length}
              </span>
            </div>

            {lead.activities.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-700">
                  No activity yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Lead interactions will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lead.activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex gap-4 px-5 py-5 sm:px-6"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
                      {getActivityIcon(activity.type)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm font-medium text-slate-900">
                          {getActivityLabel(activity.type)}
                        </p>

                        <time
                          dateTime={activity.createdAt.toISOString()}
                          className="text-xs text-slate-400"
                        >
                          {formatDate(activity.createdAt)}
                        </time>
                      </div>

                      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Lead actions
              </h2>
            </div>

            <div className="space-y-5 p-5">
  <LeadStatusControl
    leadId={lead.id}
    currentStatus={lead.status}
  />

  <div className="border-t border-slate-200 pt-4">
    <Link
      href={`/business/leads/${lead.id}?activity=1`}
      className="block rounded-lg border border-slate-300 px-4 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      Add activity
    </Link>
  </div>
</div>
          </section>

          <OwnershipControl
            leadId={lead.id}
            createdByUser={lead.createdByUser}
            assignedToUser={lead.assignedToUser}
            activeUsers={activeUsers}
            canManage={currentUser?.role === "ADMIN"}
          />         

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Organization
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {lead.organization.name}
                </p>

                {lead.organization.website && (
                  <a
                    href={lead.organization.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block truncate text-xs text-indigo-600 hover:text-indigo-700"
                  >
                    {lead.organization.website}
                  </a>
                )}
              </div>

              {lead.organization.industry && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Industry
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {lead.organization.industry}
                  </p>
                </div>
              )}

              {lead.organization.companySize && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Company size
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {lead.organization.companySize}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Linked audit requests
              </h2>
            </div>

            {lead.auditRequests.length === 0 ? (
              <div className="p-5">
                <p className="text-sm text-slate-500">
                  No audit requests linked to this lead.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {lead.auditRequests.map((audit) => (
                  <div key={audit.id} className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-900">
                        Audit request
                      </span>

                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                        {audit.status.replaceAll("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-slate-500">
                      <p>
                        Created: {formatDateOnly(audit.createdAt)}
                      </p>

                      {audit.scheduledAt && (
                        <p>
                          Scheduled:{" "}
                          {formatDate(audit.scheduledAt)}
                        </p>
                      )}

                      {audit.completedAt && (
                        <p>
                          Completed:{" "}
                          {formatDate(audit.completedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}