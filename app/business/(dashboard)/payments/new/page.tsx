import Link from "next/link";

import { prisma } from "@/lib/prisma";
import NewPaymentForm from "./NewPaymentForm";

export default async function NewPaymentPage() {
  const invoices = await prisma.invoice.findMany({
    where: {
      status: {
        in: [
          "SENT",
          "PARTIALLY_PAID",
          "OVERDUE",
        ],
      },
    },
    select: {
      id: true,
      invoiceNumber: true,
      title: true,
      amount: true,
      currency: true,
      status: true,
      dueDate: true,
      contract: {
        select: {
          proposal: {
            select: {
              opportunity: {
                select: {
                  auditRequest: {
                    select: {
                      organization: {
                        select: {
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
      payments: {
        where: {
          status: "COMPLETED",
        },
        select: {
          amount: true,
        },
      },
    },
    orderBy: {
      issuedAt: "desc",
    },
  });

  const invoiceOptions = invoices.map(
    (invoice) => {
      const paid = invoice.payments.reduce(
        (total, payment) =>
          total + Number(payment.amount),
        0,
      );

      const balance =
        Number(invoice.amount) - paid;

      return {
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        title: invoice.title,
        amount: Number(invoice.amount),
        currency: invoice.currency,
        status: invoice.status,
        dueDate: invoice.dueDate
          ? invoice.dueDate.toISOString()
          : null,
        organization:
          invoice.contract.proposal.opportunity
            .auditRequest.organization.name,
        balance: Math.max(balance, 0),
      };
    },
  );

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#39358c]">
            Business / Payments / New
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            Record Payment
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Record a client payment against an outstanding
            invoice.
          </p>
        </div>

        <Link
          href="/business/payments"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Back to Payments
        </Link>
      </div>

      <NewPaymentForm
        invoices={invoiceOptions}
      />
    </div>
  );
}