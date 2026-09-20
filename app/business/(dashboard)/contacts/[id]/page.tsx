import Link from "next/link";
import { notFound } from "next/navigation";

import { getContactById } from "@/lib/contacts";

import EditContactForm from "./EditContactForm";

type ContactDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatStatus(value: string) {
  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    );
}

export default async function ContactDetailPage({
  params,
}: ContactDetailPageProps) {
  const { id } = await params;

  const contact = await getContactById(id);

  if (!contact) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          href="/business/contacts"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to contacts
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-lg font-semibold text-white">
              {contact.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-2xl font-semibold tracking-tight text-slate-900">
                {contact.name}
              </h1>

              <p className="mt-0.5 text-sm text-slate-500">
                {contact.role || "Contact"}
              </p>
            </div>
          </div>
        </div>

        <Link
          href={`/business/organizations/${contact.organization.id}`}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          View organization
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Contact information */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <h2 className="text-base font-semibold text-slate-900">
                Contact information
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                Current contact and organization details.
              </p>
            </div>

            <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {contact.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Role
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {contact.role || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-1 block break-all text-sm text-slate-700 hover:underline"
                >
                  {contact.email}
                </a>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Phone
                </p>

                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-1 block text-sm text-slate-700 hover:underline"
                  >
                    {contact.phone}
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-slate-700">
                    —
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Organization
                </p>

                <Link
                  href={`/business/organizations/${contact.organization.id}`}
                  className="mt-1 inline-block text-sm font-medium text-slate-800 hover:underline"
                >
                  {contact.organization.name}
                </Link>

                {contact.organization.industry && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    {contact.organization.industry}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Leads */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Leads
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Leads associated with this contact.
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {contact.leads.length}
                </span>
              </div>
            </div>

            {contact.leads.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {contact.leads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/business/leads/${lead.id}`}
                    className="block px-5 py-4 transition hover:bg-slate-50 sm:px-6"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Lead
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Created{" "}
                          {formatDate(lead.createdAt)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {formatStatus(lead.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm text-slate-500">
                  No leads are associated with this contact yet.
                </p>

                <Link
                  href="/business/leads/new"
                  className="mt-4 inline-flex rounded-lg border border-slate-300 px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Create lead
                </Link>
              </div>
            )}
          </section>

          {/* Audit requests */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Audit requests
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Technology audit requests associated with this contact.
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {contact.audits.length}
                </span>
              </div>
            </div>

            {contact.audits.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {contact.audits.map((audit) => (
                  <div
                    key={audit.id}
                    className="px-5 py-4 sm:px-6"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          Audit request
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Created{" "}
                          {formatDate(audit.createdAt)}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {formatStatus(audit.status)}
                      </span>
                    </div>

                    <div className="mt-3 grid gap-3 text-xs sm:grid-cols-3">
                      <div>
                        <span className="text-slate-400">
                          Scheduled
                        </span>

                        <p className="mt-0.5 text-slate-600">
                          {formatDate(audit.scheduledAt)}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400">
                          Completed
                        </span>

                        <p className="mt-0.5 text-slate-600">
                          {formatDate(audit.completedAt)}
                        </p>
                      </div>

                      <div>
                        <span className="text-slate-400">
                          Report sent
                        </span>

                        <p className="mt-0.5 text-slate-600">
                          {formatDate(audit.reportSentAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-10 text-center sm:px-6">
                <p className="text-sm text-slate-500">
                  No audit requests are associated with this contact.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Edit panel */}
        <aside>
          <EditContactForm
            contact={{
              id: contact.id,
              organizationId: contact.organization.id,
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              role: contact.role,
            }}
          />
        </aside>
      </div>
    </div>
  );
}