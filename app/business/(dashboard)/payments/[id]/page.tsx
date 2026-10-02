import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import ReceiptControl from "./ReceiptControl";

const PAYMENT_STATUSES = ["COMPLETED", "VOID", "REFUNDED"] as const;

const STATUS_LABELS: Record<
  (typeof PAYMENT_STATUSES)[number],
  string
> = {
  COMPLETED: "Completed",
  VOID: "Void",
  REFUNDED: "Refunded",
};

const STATUS_CLASSES: Record<
  (typeof PAYMENT_STATUSES)[number],
  string
> = {
  COMPLETED:
    "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  VOID:
    "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-500/20",
  REFUNDED:
    "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
};

function formatDate(value: Date | null) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function formatCurrency(
  amount: number | string,
  currency: string,
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

function getStatusLabel(
  status: string,
) {
  if (
    PAYMENT_STATUSES.includes(
      status as (typeof PAYMENT_STATUSES)[number],
    )
  ) {
    return STATUS_LABELS[
      status as (typeof PAYMENT_STATUSES)[number]
    ];
  }

  return status;
}

function getStatusClass(status: string) {
  if (
    PAYMENT_STATUSES.includes(
      status as (typeof PAYMENT_STATUSES)[number],
    )
  ) {
    return STATUS_CLASSES[
      status as (typeof PAYMENT_STATUSES)[number]
    ];
  }

  return "bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-500/20";
}

export default async function PaymentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      paymentNumber: true,
      amount: true,
      currency: true,
      method: true,
      status: true,
      paidAt: true,
      reference: true,
      notes: true,
      createdAt: true,
      updatedAt: true,

      invoice: {
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
                  id: true,
                  proposalNumber: true,
                  title: true,

                  opportunity: {
                    select: {
                      auditRequest: {
                        select: {
                          organization: {
                            select: {
                              id: true,
                              name: true,
                              website: true,
                              industry: true,
                              companySize: true,
                            },
                          },

                          contact: {
                            select: {
                              id: true,
                              name: true,
                              email: true,
                              phone: true,
                              role: true,
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

          payments: {
            where: {
              status: "COMPLETED",
            },
            select: {
              amount: true,
            },
          },
        },
      },

      createdByUser: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      receipt: {
        select: {
          id: true,
          receiptNumber: true,
          issuedAt: true,
          notes: true,
        },
      },
    },
  });

  if (!payment) {
    notFound();
  }

  const invoiceTotal = Number(payment.invoice.amount);

  const totalPaid = payment.invoice.payments.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  const balanceDue = Math.max(
    invoiceTotal - totalPaid,
    0,
  );

  const organization =
    payment.invoice.contract.proposal.opportunity
      .auditRequest.organization;

  const contact =
    payment.invoice.contract.proposal.opportunity
      .auditRequest.contact;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2">
            <Link
              href="/business/payments"
              className="text-sm font-medium text-gray-500 hover:text-[#39358c]"
            >
              ← Back to Payments
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
              {payment.paymentNumber}
            </h1>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                payment.status,
              )}`}
            >
              {getStatusLabel(payment.status)}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-500">
            Payment recorded against{" "}
            <Link
              href={`/business/invoices/${payment.invoice.id}`}
              className="font-medium text-[#39358c] hover:underline"
            >
              {payment.invoice.invoiceNumber}
            </Link>
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-sm text-gray-500">
            Amount paid
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {formatCurrency(
              payment.amount.toString(),
              payment.currency,
            )}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Payment Details
            </h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">
                  Payment number
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {payment.paymentNumber}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Payment method
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {payment.method.replaceAll("_", " ")}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Payment date
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(payment.paidAt)}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Reference
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {payment.reference || "—"}
                </dd>
              </div>
            </dl>

            {payment.notes && (
              <div className="mt-6 border-t border-gray-100 pt-5">
                <dt className="text-sm text-gray-500">
                  Notes
                </dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                  {payment.notes}
                </dd>
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Invoice
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {payment.invoice.title}
                </p>
              </div>

              <Link
                href={`/business/invoices/${payment.invoice.id}`}
                className="text-sm font-medium text-[#39358c] hover:underline"
              >
                View invoice
              </Link>
            </div>

            <dl className="mt-5 grid gap-5 sm:grid-cols-3">
              <div>
                <dt className="text-sm text-gray-500">
                  Invoice total
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(
                    payment.invoice.amount.toString(),
                    payment.invoice.currency,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Total paid
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(
                    totalPaid,
                    payment.invoice.currency,
                  )}
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Balance due
                </dt>
                <dd className="mt-1 text-sm font-semibold text-gray-900">
                  {formatCurrency(
                    balanceDue,
                    payment.invoice.currency,
                  )}
                </dd>
              </div>
            </dl>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <dl className="grid gap-5 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-gray-500">
                    Invoice status
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">
                    {payment.invoice.status.replaceAll(
                      "_",
                      " ",
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-gray-500">
                    Issued
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(payment.invoice.issuedAt)}
                  </dd>
                </div>

                <div>
                  <dt className="text-sm text-gray-500">
                    Due
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(payment.invoice.dueDate)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Contract & Proposal
            </h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-gray-500">
                  Contract
                </dt>
                <dd className="mt-1">
                  <Link
                    href={`/business/contracts/${payment.invoice.contract.id}`}
                    className="text-sm font-medium text-[#39358c] hover:underline"
                  >
                    {payment.invoice.contract.contractNumber}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">
                    {payment.invoice.contract.title}
                  </p>
                </dd>
              </div>

              <div>
                <dt className="text-sm text-gray-500">
                  Proposal
                </dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {payment.invoice.contract.proposal
                    .proposalNumber}
                  <p className="mt-1 text-xs font-normal text-gray-500">
                    {payment.invoice.contract.proposal.title}
                  </p>
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Client
            </h2>

            <div className="mt-5">
              <Link
                href={`/business/organizations/${organization.id}`}
                className="text-base font-semibold text-[#39358c] hover:underline"
              >
                {organization.name}
              </Link>

              {organization.industry && (
                <p className="mt-1 text-sm text-gray-500">
                  {organization.industry}
                </p>
              )}

              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-sm font-medium text-gray-900">
                  {contact.name}
                </p>

                {contact.role && (
                  <p className="mt-1 text-sm text-gray-500">
                    {contact.role}
                  </p>
                )}

                <a
                  href={`mailto:${contact.email}`}
                  className="mt-2 block text-sm text-[#39358c] hover:underline"
                >
                  {contact.email}
                </a>

                {contact.phone && (
                  <a
                    href={`tel:${contact.phone}`}
                    className="mt-1 block text-sm text-[#39358c] hover:underline"
                  >
                    {contact.phone}
                  </a>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Receipt
            </h2>

            <ReceiptControl
              paymentId={payment.id}
              receipt={
                payment.receipt
                 ? {
                    id: payment.receipt.id,
                    receiptNumber:
                        payment.receipt.receiptNumber,
                        issuedAt:
                         payment.receipt.issuedAt.toISOString(),
                        notes: payment.receipt.notes,
                      }
                    : null
                   }
                />
            </section>               

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Record Information
            </h2>

            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-xs text-gray-500">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(payment.createdAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500">
                  Last updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(payment.updatedAt)}
                </dd>
              </div>

              {payment.createdByUser && (
                <div>
                  <dt className="text-xs text-gray-500">
                    Recorded by
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {payment.createdByUser.name}
                  </dd>
                  <dd className="text-xs text-gray-500">
                    {payment.createdByUser.email}
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}