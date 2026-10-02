import Link from "next/link";

import { prisma } from "@/lib/prisma";
import type { PaymentStatus } from "../../../../generated/prisma/client";

const PAYMENT_STATUSES: PaymentStatus[] = [
  "COMPLETED",
  "VOID",
  "REFUNDED",
];

const STATUS_LABELS: Record<PaymentStatus, string> = {
  COMPLETED: "Completed",
  VOID: "Void",
  REFUNDED: "Refunded",
};

function getStatusClasses(status: PaymentStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "VOID":
      return "bg-slate-50 text-slate-700 ring-slate-600/20";

    case "REFUNDED":
      return "bg-red-50 text-red-700 ring-red-600/20";

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

type PaymentsPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    invoiceId?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 20;

export default async function PaymentsPage({
  searchParams,
}: PaymentsPageProps) {
  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const status = parseEnum(
    params.status,
    PAYMENT_STATUSES,
  );

  const invoiceId =
    params.invoiceId?.trim() ?? "";

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
    ...(invoiceId
      ? {
          invoiceId,
        }
      : {}),
    ...(search
      ? {
          OR: [
            {
              paymentNumber: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              reference: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              invoice: {
                invoiceNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              invoice: {
                title: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              invoice: {
                contract: {
                  contractNumber: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
            {
              invoice: {
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
            },
          ],
        }
      : {}),
  };

  const [
    payments,
    total,
    invoices,
  ] = await Promise.all([
    prisma.payment.findMany({
      where,
      select: {
        id: true,
        paymentNumber: true,
        amount: true,
        currency: true,
        method: true,
        status: true,
        paidAt: true,
        reference: true,
        invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            title: true,
            contract: {
              select: {
                contractNumber: true,
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
        },
        receipt: {
          select: {
            id: true,
            receiptNumber: true,
          },
        },
      },
      orderBy: {
        paidAt: "desc",
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),

    prisma.payment.count({
      where,
    }),

    prisma.invoice.findMany({
      select: {
        id: true,
        invoiceNumber: true,
        title: true,
        amount: true,
        currency: true,
        status: true,
      },
      where: {
        status: {
          in: [
            "SENT",
            "PARTIALLY_PAID",
            "OVERDUE",
          ],
        },
      },
      orderBy: {
        issuedAt: "desc",
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

    if (invoiceId) {
      query.set("invoiceId", invoiceId);
    }

    if (nextPage > 1) {
      query.set("page", String(nextPage));
    }

    const queryString = query.toString();

    return queryString
      ? `/business/payments?${queryString}`
      : "/business/payments";
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Payments
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Record and track client payments against
            invoices.
          </p>
        </div>

        <Link
          href="/business/payments/new"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Record Payment
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
              htmlFor="payment-search"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Search
            </label>

            <input
              id="payment-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Payment number, reference, invoice, organization..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="payment-status"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="payment-status"
              name="status"
              defaultValue={status ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All statuses
              </option>

              {PAYMENT_STATUSES.map((option) => (
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
              htmlFor="payment-invoice"
              className="mb-1.5 block text-xs font-medium text-slate-700"
            >
              Invoice
            </label>

            <select
              id="payment-invoice"
              name="invoiceId"
              defaultValue={invoiceId}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                All invoices
              </option>

              {invoices.map((invoice) => (
                <option
                  key={invoice.id}
                  value={invoice.id}
                >
                  {invoice.invoiceNumber} —{" "}
                  {invoice.title}
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
              href="/business/payments"
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
            ? "1 payment"
            : `${total} payments`}
        </p>

        {total > 0 && (
          <p className="text-xs text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
        )}
      </div>

      {/* Desktop */}
      <section className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">
                    Payment
                  </th>

                  <th className="px-5 py-3">
                    Organization
                  </th>

                  <th className="px-5 py-3">
                    Invoice
                  </th>

                  <th className="px-5 py-3">
                    Method
                  </th>

                  <th className="px-5 py-3">
                    Status
                  </th>

                  <th className="px-5 py-3">
                    Amount
                  </th>

                  <th className="px-5 py-3">
                    Paid
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payments.map((payment) => {
                  const organization =
                    payment.invoice.contract.proposal
                      .opportunity.auditRequest
                      .organization;

                  return (
                    <tr
                      key={payment.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/business/payments/${payment.id}`}
                          className="font-medium text-slate-900 hover:underline"
                        >
                          {payment.paymentNumber}
                        </Link>

                        {payment.reference && (
                          <p className="mt-1 text-xs text-slate-500">
                            Ref: {payment.reference}
                          </p>
                        )}

                        {payment.receipt && (
                          <p className="mt-1 text-xs text-emerald-700">
                            {payment.receipt.receiptNumber}
                          </p>
                        )}
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
                          href={`/business/invoices/${payment.invoice.id}`}
                          className="text-sm text-slate-700 hover:underline"
                        >
                          {payment.invoice.invoiceNumber}
                        </Link>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {payment.invoice.title}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {payment.method.replaceAll(
                          "_",
                          " ",
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                            payment.status,
                          )}`}
                        >
                          {STATUS_LABELS[
                            payment.status
                          ]}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {formatCurrency(
                          payment.amount,
                          payment.currency,
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-500">
                        {formatDate(payment.paidAt)}
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
              No payments found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recorded client payments will appear here.
            </p>
          </div>
        )}
      </section>

      {/* Mobile */}
      <section className="space-y-3 md:hidden">
        {payments.length > 0 ? (
          payments.map((payment) => {
            const organization =
              payment.invoice.contract.proposal
                .opportunity.auditRequest
                .organization;

            return (
              <Link
                key={payment.id}
                href={`/business/payments/${payment.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-slate-900">
                      {payment.paymentNumber}
                    </h2>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {organization.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {payment.invoice.invoiceNumber}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${getStatusClasses(
                      payment.status,
                    )}`}
                  >
                    {STATUS_LABELS[
                      payment.status
                    ]}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-slate-400">
                      Amount
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatCurrency(
                        payment.amount,
                        payment.currency,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Method
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {payment.method.replaceAll(
                        "_",
                        " ",
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Paid
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {formatDate(payment.paidAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Receipt
                    </p>

                    <p className="mt-1 font-medium text-slate-700">
                      {payment.receipt
                        ?.receiptNumber ?? "Not issued"}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">
              No payments found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Recorded client payments will appear here.
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