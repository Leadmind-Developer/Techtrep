import Link from "next/link";

import { getOrganizations } from "@/lib/organizations";

type OrganizationsPageProps = {
  searchParams: Promise<{
    search?: string;
    industry?: string;
    page?: string;
  }>;
};

const INDUSTRY_LABELS: Record<string, string> = {};

function formatIndustry(industry: string | null): string {
  if (!industry) {
    return "—";
  }

  return (
    INDUSTRY_LABELS[industry] ??
    industry
      .replaceAll("_", " ")
      .replace(/\b\w/g, (character) =>
        character.toUpperCase(),
      )
  );
}

function createPageUrl(
  page: number,
  search: string,
  industry: string,
): string {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (industry) {
    params.set("industry", industry);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();

  return query
    ? `/business/organizations?${query}`
    : "/business/organizations";
}

export default async function OrganizationsPage({
  searchParams,
}: OrganizationsPageProps) {
  const params = await searchParams;

  const search =
    typeof params.search === "string"
      ? params.search.trim()
      : "";

  const industry =
    typeof params.industry === "string"
      ? params.industry.trim()
      : "";

  const pageNumber = Number(params.page ?? "1");

  const page =
    Number.isInteger(pageNumber) && pageNumber > 0
      ? pageNumber
      : 1;

  const result = await getOrganizations({
    search,
    industry,
    page,
  });

  const {
    organizations,
    total,
    totalPages,
  } = result;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-600">
            CRM
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Organizations
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage companies and organizations in your CRM.
          </p>
        </div>

        <Link
          href="/business/organizations/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Add organization
        </Link>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <form
          method="GET"
          className="flex flex-col gap-3 lg:flex-row"
        >
          <div className="flex-1">
            <label
              htmlFor="organization-search"
              className="sr-only"
            >
              Search organizations
            </label>

            <input
              id="organization-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search organization, website or industry..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex gap-3">
            <input
              name="industry"
              type="text"
              defaultValue={industry}
              placeholder="Industry"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:w-48"
            />

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <p className="text-sm text-slate-500">
            {total}{" "}
            {total === 1 ? "organization" : "organizations"}
          </p>
        </div>

        {organizations.length === 0 ? (
          <div className="px-5 py-16 text-center sm:px-6">
            <h2 className="text-base font-semibold text-slate-900">
              No organizations found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or create a new
              organization.
            </p>

            <Link
              href="/business/organizations/new"
              className="mt-5 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Add organization
            </Link>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Organization
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Industry
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                      Size
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                      Contacts
                    </th>

                    <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wide text-slate-500">
                      Leads
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {organizations.map((organization) => (
                    <tr
                      key={organization.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/business/organizations/${organization.id}`}
                            className="font-medium text-slate-900 hover:text-indigo-600"
                          >
                            {organization.name}
                          </Link>

                          {organization.website && (
                            <p className="mt-0.5 max-w-xs truncate text-xs text-slate-500">
                              {organization.website}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatIndustry(
                          organization.industry,
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {organization.companySize ?? "—"}
                      </td>

                      <td className="px-6 py-4 text-center text-sm text-slate-600">
                        {organization._count.contacts}
                      </td>

                      <td className="px-6 py-4 text-center text-sm text-slate-600">
                        {organization._count.leads}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/business/organizations/${organization.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-slate-100 lg:hidden">
              {organizations.map((organization) => (
                <Link
                  key={organization.id}
                  href={`/business/organizations/${organization.id}`}
                  className="block p-5 transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">
                        {organization.name}
                      </p>

                      {organization.website && (
                        <p className="mt-1 truncate text-xs text-slate-500">
                          {organization.website}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-slate-500">
                        {formatIndustry(
                          organization.industry,
                        )}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs font-medium text-indigo-600">
                      View →
                    </span>
                  </div>

                  <div className="mt-4 flex gap-5 text-xs text-slate-500">
                    <span>
                      {organization._count.contacts}{" "}
                      {organization._count.contacts === 1
                        ? "contact"
                        : "contacts"}
                    </span>

                    <span>
                      {organization._count.leads}{" "}
                      {organization._count.leads === 1
                        ? "lead"
                        : "leads"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={createPageUrl(
                  page - 1,
                  search,
                  industry,
                )}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Previous
              </Link>
            )}

            {page < totalPages && (
              <Link
                href={createPageUrl(
                  page + 1,
                  search,
                  industry,
                )}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}