import Link from "next/link";

import {
  getContacts,
  getContactFormOptions,
} from "@/lib/contacts";

type ContactsPageProps = {
  searchParams: Promise<{
    search?: string;
    organizationId?: string;
    page?: string;
  }>;
};

function getPageNumber(value?: string) {
  const page = Number(value);

  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  return page;
}

function formatPhone(phone: string | null) {
  return phone || "—";
}

export default async function ContactsPage({
  searchParams,
}: ContactsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";
  const organizationId = params.organizationId?.trim() ?? "";
  const page = getPageNumber(params.page);

  const [{ contacts, total, totalPages }, organizations] =
    await Promise.all([
      getContacts({
        search,
        organizationId,
        page,
      }),
      getContactFormOptions(),
    ]);

  const buildPageUrl = (nextPage: number) => {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (organizationId) {
      query.set("organizationId", organizationId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/contacts?${queryString}`
      : "/business/contacts";
  };

  const startItem =
    total === 0 ? 0 : (page - 1) * 10 + 1;

  const endItem =
    total === 0
      ? 0
      : Math.min(page * 10, total);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            CRM
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Contacts
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage people and contacts across your organizations.
          </p>
        </div>

        <Link
          href="/business/contacts/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add contact
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          action="/business/contacts"
          className="grid gap-3 md:grid-cols-[minmax(0,1fr)_260px_auto]"
        >
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
              placeholder="Name, email, phone, role or organization"
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="organizationId"
              className="mb-1.5 block text-xs font-medium text-slate-600"
            >
              Organization
            </label>

            <select
              id="organizationId"
              name="organizationId"
              defaultValue={organizationId}
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All organizations
              </option>

              {organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {organization.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="h-10 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Search
            </button>

            {(search || organizationId) && (
              <Link
                href="/business/contacts"
                className="inline-flex h-10 items-center rounded-lg border border-slate-300 px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {total === 0
            ? "No contacts found"
            : `Showing ${startItem}–${endItem} of ${total} contact${total === 1 ? "" : "s"}`}
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {contacts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Organization
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Role
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/business/contacts/${contact.id}`}
                        className="group"
                      >
                        <p className="font-medium text-slate-900 group-hover:text-slate-700">
                          {contact.name}
                        </p>

                        <p className="mt-0.5 text-sm text-slate-500">
                          {contact.email}
                        </p>
                      </Link>
                    </td>

                    <td className="px-5 py-4">
                      <Link
                        href={`/business/organizations/${contact.organization.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        {contact.organization.name}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {contact.role || "—"}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatPhone(contact.phone)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/business/contacts/${contact.id}`}
                        className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              No contacts found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Try changing your search or organization filter,
              or create a new contact.
            </p>

            <Link
              href="/business/contacts/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add contact
            </Link>
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/business/contacts/${contact.id}`}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    {contact.name}
                  </Link>

                  <p className="mt-1 break-all text-sm text-slate-500">
                    {contact.email}
                  </p>
                </div>

                <Link
                  href={`/business/contacts/${contact.id}`}
                  className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  View
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Organization
                  </p>

                  <Link
                    href={`/business/organizations/${contact.organization.id}`}
                    className="mt-1 block text-sm font-medium text-slate-700 hover:underline"
                  >
                    {contact.organization.name}
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Role
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {contact.role || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Phone
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {formatPhone(contact.phone)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">
              No contacts found
            </h2>

            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Try changing your search or organization filter,
              or create a new contact.
            </p>

            <Link
              href="/business/contacts/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Add contact
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex items-center gap-2">
            {page > 1 ? (
              <Link
                href={buildPageUrl(page - 1)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            ) : (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-400">
                Previous
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={buildPageUrl(page + 1)}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Next
              </Link>
            ) : (
              <span className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-400">
                Next
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}