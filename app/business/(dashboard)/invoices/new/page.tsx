import Link from "next/link";

import { prisma } from "@/lib/prisma";

import NewInvoiceForm from "./NewInvoiceForm";

export default async function NewInvoicePage() {
  const contracts = await prisma.contract.findMany({
    where: {
      status: "ACTIVE",
    },
    orderBy: [
      {
        createdAt: "desc",
      },
      {
        contractNumber: "desc",
      },
    ],
    select: {
      id: true,
      contractNumber: true,
      title: true,
      amount: true,
      currency: true,
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
  });

  const contractOptions = contracts.map((contract) => ({
    id: contract.id,
    contractNumber: contract.contractNumber,
    title: contract.title,
    amount: contract.amount?.toString() ?? "",
    currency: contract.currency,
    organizationId:
      contract.proposal.opportunity.auditRequest.organization.id,
    organizationName:
      contract.proposal.opportunity.auditRequest.organization.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#39358c]">
            Business / Invoices / New
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-gray-900">
            New Invoice
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Create an invoice from an active client contract.
          </p>
        </div>

        <Link
          href="/business/invoices"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Back to Invoices
        </Link>
      </div>

      {contractOptions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">
            No active contracts
          </h2>

          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Invoices can only be created from active contracts. Create or
            activate a contract before creating an invoice.
          </p>

          <div className="mt-5">
            <Link
              href="/business/contracts"
              className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
            >
              View Contracts
            </Link>
          </div>
        </div>
      ) : (
        <NewInvoiceForm contracts={contractOptions} />
      )}
    </div>
  );
}