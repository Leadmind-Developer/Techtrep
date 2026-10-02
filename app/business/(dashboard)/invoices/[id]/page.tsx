import Link from "next/link";
import { notFound } from "next/navigation";
import InvoiceStatusControl from "./InvoiceStatusControl";

import { prisma } from "@/lib/prisma";
import type { InvoiceStatus } from "../../../../../generated/prisma/client";

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
      return "bg-gray-100 text-gray-700";
    case "SENT":
      return "bg-blue-100 text-blue-700";
    case "PARTIALLY_PAID":
      return "bg-yellow-100 text-yellow-700";
    case "PAID":
      return "bg-green-100 text-green-700";
    case "OVERDUE":
      return "bg-red-100 text-red-700";
    case "VOID":
      return "bg-gray-200 text-gray-600";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function formatDate(date: Date | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatCurrency(
  amount: string,
  currency: string,
) {
  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    return `${currency} ${amount}`;
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(numericAmount);
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function InvoiceDetailPage({
  params,
}: Props) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      invoiceNumber: true,
      title: true,
      description: true,
      amount: true,
      currency: true,
      status: true,
      issuedAt: true,
      dueDate: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      contract: {
        select: {
          id: true,
          contractNumber: true,
          title: true,
          status: true,
          amount: true,
          currency: true,
          proposal: {
            select: {
              id: true,
              proposalNumber: true,
              title: true,
              opportunity: {
                select: {
                  id: true,
                  name: true,
                  auditRequest: {
                    select: {
                      id: true,
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
    },
  });

  if (!invoice) {
    notFound();
  }

  const organization =
    invoice.contract.proposal.opportunity.auditRequest.organization;

  const contact =
    invoice.contract.proposal.opportunity.auditRequest.contact;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#39358c]">
            Business / Invoices / {invoice.invoiceNumber}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              {invoice.invoiceNumber}
            </h1>

            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                invoice.status,
              )}`}
            >
              {STATUS_LABELS[invoice.status]}
            </span>
          </div>

          <p className="mt-1 text-sm text-gray-600">
            {invoice.title}
          </p>
        </div>

        <Link
          href="/business/invoices"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Back to Invoices
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Invoice amount
                </p>

                <p className="mt-1 text-3xl font-semibold text-gray-900">
                  {formatCurrency(
                    invoice.amount.toString(),
                    invoice.currency,
                  )}
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Issued
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(invoice.issuedAt)}
                </p>

                <p className="mt-4 text-xs font-medium uppercase tracking-wide text-gray-500">
                  Due
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {formatDate(invoice.dueDate)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Invoice details
            </h2>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Title
                </dt>

                <dd className="mt-1 text-sm text-gray-900">
                  {invoice.title}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Description
                </dt>

                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {invoice.description || "—"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Notes
                </dt>

                <dd className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
                  {invoice.notes || "—"}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Contract
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  The contract this invoice was created from.
                </p>
              </div>

              <Link
                href={`/business/contracts/${invoice.contract.id}`}
                className="text-sm font-medium text-[#39358c] hover:underline"
              >
                View contract
              </Link>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contract number
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {invoice.contract.contractNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contract status
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {invoice.contract.status}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contract title
                </p>

                <p className="mt-1 text-sm text-gray-900">
                  {invoice.contract.title}
                </p>
              </div>
            </div>

            <div className="mt-5 border-t border-gray-200 pt-5">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Source proposal
              </p>

              <Link
                href={`/business/proposals/${invoice.contract.proposal.id}`}
                className="mt-1 inline-block text-sm font-medium text-[#39358c] hover:underline"
              >
                {invoice.contract.proposal.proposalNumber} —{" "}
                {invoice.contract.proposal.title}
              </Link>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Client
            </h2>

            <InvoiceStatusControl
                invoiceId={invoice.id}
                status={invoice.status}
            />

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
            </div>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contact
                </dt>

                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {contact.name}
                </dd>

                {contact.role && (
                  <dd className="text-sm text-gray-500">
                    {contact.role}
                  </dd>
                )}
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Email
                </dt>

                <dd className="mt-1">
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm text-[#39358c] hover:underline"
                  >
                    {contact.email}
                  </a>
                </dd>
              </div>

              {contact.phone && (
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Phone
                  </dt>

                  <dd className="mt-1 text-sm text-gray-700">
                    {contact.phone}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Record information
            </h2>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Created
                </dt>

                <dd className="mt-1 text-sm text-gray-700">
                  {formatDateTime(invoice.createdAt)}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Last updated
                </dt>

                <dd className="mt-1 text-sm text-gray-700">
                  {formatDateTime(invoice.updatedAt)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold text-gray-900">
              Next step
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              This invoice is currently a{" "}
              <span className="font-medium text-gray-900">
                {STATUS_LABELS[invoice.status].toLowerCase()}
              </span>
              . Invoice sending and payment recording will be handled in
              the next billing milestones.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}