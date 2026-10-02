import Link from "next/link";

import { prisma } from "@/lib/prisma";
import type { InvoiceStatus } from "../../../../generated/prisma/client";

const INVOICE_STATUSES: InvoiceStatus[] = [
  "DRAFT",
  "SENT",
  "PARTIALLY_PAID",
  "PAID",
  "OVERDUE",
  "VOID",
];

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: "Draft",
  SENT: "Sent",
  PARTIALLY_PAID: "Partially Paid",
  PAID: "Paid",
  OVERDUE: "Overdue",
  VOID: "Void",
};

function getStatusClasses(status: InvoiceStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-slate-50 text-slate-700 ring-slate-600/20";

    case "SENT":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";

    case "PARTIALLY_PAID":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";

    case "PAID":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "OVERDUE":
      return "bg-red-50 text-red-700 ring-red-600/20";

    case "VOID":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";

    default:
      return "bg-slate-50 text-slate-700 ring-slate-600/20";
  }
}

function formatDate(value: Date | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function formatCurrency(
  value: unknown,
  currency = "NGN",
) {
  if (value === null || value === undefined) {
    return "—";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "—";
  }

  if (currency === "NGN") {
    return `₦${numericValue.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${currency} ${numericValue.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function parseEnum<T extends string>(
  value: string | undefined,
  values: readonly T[],
): T | undefined {
  if (!value) {
    return undefined;
  }

  return values.includes(value as T)
    ? (value as T)
    : undefined;
}

type InvoicesPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    contractId?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 20;

export default async function InvoicesPage({
  searchParams,
}: InvoicesPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const status = parseEnum(
    params.status,
    INVOICE_STATUSES,
  );

  const contractId =
    params.contractId?.trim() ?? "";

  const requestedPage = Number(
    params.page ?? "1",
  );

  const page =
    Number.isInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  const where = {
    ...(status
      ? {
          status,
        }
      : {}),
    ...(contractId
      ? {
          contractId,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              invoiceNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              title: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              contract: {
                contractNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              contract: {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              contract: {
                proposal: {
                  opportunity: {
                    auditRequest: {
                      organization: {
                        name: {
                          contains: search,
                          mode: "insensitive" as const,
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [
    invoices,
    total,
    contracts,
  ] = await Promise.all([
    prisma.invoice.findMany({
      where,
      select: {
        id: true,
        invoiceNumber: true,
        title: true,
        amount: true,
        currency: true,
        status: true,
        issuedAt: true,
        dueDate: true,
        contract: {
          select: {
            id: true,
            contractNumber: true,
            title: true,
            proposal: {
              select: {
                opportunity: {
                  select: {
                    auditRequest: {
                      select: {
                        organization: {
                          select: {
                            id: true,
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.invoice.count({
      where,
    }),

    prisma.contract.findMany({
      select: {
        id: true,
        contractNumber: true,
        title: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / PAGE_SIZE),
  );

  const currentPage = Math.min(
    page,
    totalPages,
  );

  function buildPageUrl(nextPage: number) {
    const query = new URLSearchParams();

    if (search) {
      query.set("search", search);
    }

    if (status) {
      query.set("status", status);
    }

    if (contractId) {
      query.set("contractId", contractId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/invoices?${queryString}`
      : "/business/invoices";
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Invoices
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create and track client invoices from active
            contracts through payment.
          </p>
        </div>

        <Link
          href="/business/invoices/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          New Invoice
        </Link>
      </div>

      {/* Filters */}
      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <form
          method="GET"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          <div className="lg:col-span-2">
            <label
              htmlFor="invoice-search"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="invoice-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Invoice number, title, contract, organization..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="invoice-status"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="invoice-status"
              name="status"
              defaultValue={status ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All statuses
              </option>

              {INVOICE_STATUSES.map((option) => (
                <option
                  key={option}
                  value={option}
                >
                  {STATUS_LABELS[option]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="invoice-contract"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Contract
            </label>

            <select
              id="invoice-contract"
              name="contractId"
              defaultValue={contractId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All contracts
              </option>

              {contracts.map((contract) => (
                <option
                  key={contract.id}
                  value={contract.id}
                >
                  {contract.contractNumber}
                  {" — "}
                  {contract.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>

            <Link
              href="/business/invoices"
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </Link>
          </div>
        </form>
      </section>

      {/* Summary */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          {total === 1
            ? "1 invoice"
            : `${total} invoices`}
        </p>

        {total > 0 && (
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Desktop */}
      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">
                    Invoice
                  </th>

                  <th className="px-5 py-3">
                    Organization
                  </th>

                  <th className="px-5 py-3">
                    Contract
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3">
                    Amount
                  </th>

                  <th className="px-5 py-3">
                    Issued
                  </th>

                  <th className="px-5 py-3">
                    Due
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {invoices.map((invoice) => {
                  const organization =
                    invoice.contract.proposal
                      .opportunity.auditRequest
                      .organization;

                  return (
                    <tr
                      key={invoice.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/business/invoices/${invoice.id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {invoice.title}
                        </Link>

                        <p className="mt-1 text-xs text-slate-500">
                          {invoice.invoiceNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/business/organizations/${organization.id}`}
                          className="text-sm text-slate-700 hover:underline"
                        >
                          {organization.name}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/business/contracts/${invoice.contract.id}`}
                          className="text-sm text-slate-700 hover:underline"
                        >
                          {invoice.contract.contractNumber}
                        </Link>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {invoice.contract.title}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                            invoice.status,
                          )}`}
                        >
                          {STATUS_LABELS[
                            invoice.status
                          ]}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {formatCurrency(
                          invoice.amount,
                          invoice.currency,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(invoice.issuedAt)}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(invoice.dueDate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-14 text-center">
            <h2 className="text-sm font-semibold text-slate-900">
              No invoices found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Invoices created from active contracts will
              appear here.
            </p>
          </div>
        )}
      </section>

      {/* Mobile */}
      <section className="space-y-3 md:hidden">
        {invoices.length > 0 ? (
          invoices.map((invoice) => {
            const organization =
              invoice.contract.proposal.opportunity
                .auditRequest.organization;

            return (
              <Link
                key={invoice.id}
                href={`/business/invoices/${invoice.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {invoice.title}
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {invoice.invoiceNumber}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {organization.name}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${getStatusClasses(
                      invoice.status,
                    )}`}
                  >
                    {STATUS_LABELS[
                      invoice.status
                    ]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400">
                      Contract
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {invoice.contract.contractNumber}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatCurrency(
                        invoice.amount,
                        invoice.currency,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Issued
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(invoice.issuedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Due
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(invoice.dueDate)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              No invoices found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Invoices created from active contracts will
              appear here.
            </p>
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4">
          <div>
            {currentPage > 1 && (
              <Link
                href={buildPageUrl(
                  currentPage - 1,
                )}
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Page {currentPage} of {totalPages}
          </p>

          <div>
            {currentPage < totalPages && (
              <Link
                href={buildPageUrl(
                  currentPage + 1,
                )}
                className="inline-flex rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
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