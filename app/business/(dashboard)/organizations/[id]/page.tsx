import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrganizationById } from "@/lib/organizations";

type OrganizationDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(
  date: Date | string | null | undefined,
): string {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatLabel(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "WON":
    case "COMPLETED":
    case "APPROVED":
      return "bg-emerald-50 text-emerald-700";

    case "LOST":
    case "DECLINED":
      return "bg-red-50 text-red-700";

    case "NEW":
    case "REQUESTED":
      return "bg-blue-50 text-blue-700";

    case "CONTACTED":
    case "SCHEDULED":
    case "DISCOVERY":
      return "bg-amber-50 text-amber-700";

    default:
      return "bg-slate-100 text-slate-700";
  }
}

function getActivityIcon(type: string): string {
  switch (type) {
    case "EMAIL":
      return "✉";

    case "PHONE_CALL":
      return "☎";

    case "WHATSAPP":
      return "W";

    case "MEETING":
      return "M";

    case "AUDIT":
      return "A";

    case "PROPOSAL":
      return "P";

    case "FOLLOW_UP":
      return "F";

    case "STATUS_CHANGE":
      return "S";

    case "NOTE":
      return "N";

    default:
      return "•";
  }
}

export default async function OrganizationDetailPage({
  params,
}: OrganizationDetailPageProps) {
  const { id } = await params;

  const organization = await getOrganizationById(id);

  if (!organization) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/business/organizations"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to organizations
        </Link>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Organization
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {organization.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Organization profile and CRM activity.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/business/organizations"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              All organizations
            </Link>
          </div>
        </div>
      </div>

      {/* Organization overview */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Organization information
          </h2>
        </div>

        <div className="grid gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Organization
            </p>

            <p className="mt-1 text-sm font-medium text-slate-900">
              {organization.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Website
            </p>

            {organization.website ? (
              <a
                href={organization.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block truncate text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                {organization.website}
              </a>
            ) : (
              <p className="mt-1 text-sm text-slate-500">—</p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Industry
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {organization.industry ?? "—"}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Company size
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {organization.companySize ?? "—"}
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 px-5 py-4 sm:px-6">
          <p className="text-xs text-slate-500">
            Organization created {formatDate(organization.createdAt)}
          </p>
        </div>
      </section>

      {/* Summary cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Contacts</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.contacts.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Leads</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.leads.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Audit requests
          </p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.audits.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Activities</p>

          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {organization.activities.length}
          </p>

          {organization.activities.length >= 20 && (
            <p className="mt-1 text-xs text-slate-400">
              Showing latest 20
            </p>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Contacts */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        
<div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
  <div>
    <h2 className="text-base font-semibold text-slate-900">
      Contacts
    </h2>

    <p className="mt-0.5 text-xs text-slate-500">
      People associated with this organization.
    </p>
  </div>

  <Link
    href={`/business/organizations/${organization.id}/contacts/new`}
    className="shrink-0 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
  >
    Add contact
  </Link>
</div>

            {organization.contacts.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-900">
                  No contacts yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Contacts will appear here once they are added.
                </p>
              </div>
            ) : (
              <>
                <div className="hidden overflow-x-auto sm:block">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                          Name
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                          Role
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                          Email
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                          Phone
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {organization.contacts.map((contact) => (
                        <tr key={contact.id}>
                          <td className="px-6 py-4 text-sm font-medium text-slate-900">
                            {contact.name}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {contact.role ?? "—"}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {contact.email}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-600">
                            {contact.phone ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="divide-y divide-slate-100 sm:hidden">
                  {organization.contacts.map((contact) => (
                    <div key={contact.id} className="p-5">
                      <p className="font-medium text-slate-900">
                        {contact.name}
                      </p>

                      {contact.role && (
                        <p className="mt-1 text-xs text-slate-500">
                          {contact.role}
                        </p>
                      )}

                      <p className="mt-3 text-sm text-slate-600">
                        {contact.email}
                      </p>

                      {contact.phone && (
                        <p className="mt-1 text-sm text-slate-600">
                          {contact.phone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>

          {/* Leads */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Leads
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Leads associated with this organization.
              </p>
            </div>

            {organization.leads.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-900">
                  No leads yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Leads associated with this organization will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {organization.leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/business/leads/${lead.id}`}
                    className="block p-5 transition hover:bg-slate-50 sm:px-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {lead.contact?.name ?? "Unassigned contact"}
                        </p>

                        {lead.contact?.email && (
                          <p className="mt-1 text-xs text-slate-500">
                            {lead.contact.email}
                          </p>
                        )}
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(lead.status)}`}
                      >
                        {formatLabel(lead.status)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span>
                        Source: {formatLabel(lead.source)}
                      </span>

                      <span>
                        Created: {formatDate(lead.createdAt)}
                      </span>

                      {lead.estimatedValue !== null && (
                        <span>
                          Value: ₦
                          {Number(
                            lead.estimatedValue,
                          ).toLocaleString("en-NG", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Audit requests */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Audit requests
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Technology audit requests associated with this
                organization.
              </p>
            </div>

            {organization.audits.length === 0 ? (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm font-medium text-slate-900">
                  No audit requests
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Audit requests will appear here when associated
                  with this organization.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {organization.audits.map((audit) => (
                  <div key={audit.id} className="p-5 sm:px-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          Technology audit
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Created {formatDate(audit.createdAt)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(audit.status)}`}
                      >
                        {formatLabel(audit.status)}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span>
                        Source: {formatLabel(audit.source)}
                      </span>

                      {audit.scheduledAt && (
                        <span>
                          Scheduled:{" "}
                          {formatDateTime(audit.scheduledAt)}
                        </span>
                      )}

                      {audit.completedAt && (
                        <span>
                          Completed:{" "}
                          {formatDateTime(audit.completedAt)}
                        </span>
                      )}

                      {audit.reportSentAt && (
                        <span>
                          Report sent:{" "}
                          {formatDateTime(audit.reportSentAt)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Activity sidebar */}
        <aside>
          <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Activity
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Recent CRM activity for this organization.
              </p>
            </div>

            {organization.activities.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <p className="text-sm font-medium text-slate-900">
                  No activity yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  CRM interactions will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {organization.activities.map((activity) => (
                  <div key={activity.id} className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                        {getActivityIcon(activity.type)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          {formatLabel(activity.type)}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-slate-400">
                          {formatDateTime(activity.createdAt)}
                        </p>
                      </div>
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