"use client";
import Link from "next/link";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ContractOption = {
  id: string;
  contractNumber: string;
  title: string;
  amount: string;
  currency: string;
  organizationId: string;
  organizationName: string;
};

type Props = {
  contracts: ContractOption[];
};

function formatCurrency(amount: string, currency: string) {
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

export default function NewInvoiceForm({ contracts }: Props) {
  const router = useRouter();

  const [contractId, setContractId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedContract = useMemo(
    () => contracts.find((contract) => contract.id === contractId) ?? null,
    [contracts, contractId],
  );

  function handleContractChange(value: string) {
    setContractId(value);
    setError("");

    const contract = contracts.find(
      (item) => item.id === value,
    );

    if (contract) {
      setAmount(contract.amount);
    } else {
      setAmount("");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!contractId) {
      setError("Please select a contract.");
      return;
    }

    if (!amount) {
      setError("Please enter an invoice amount.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          contractId,
          amount,
          dueDate: dueDate || undefined,
          description: description.trim() || undefined,
          notes: notes.trim() || undefined,
          title: selectedContract
            ? `Invoice - ${selectedContract.contractNumber}`
            : "Invoice",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Unable to create invoice.",
        );
        return;
      }

      const invoiceId = data?.invoice?.id;

      if (!invoiceId) {
        setError(
          "Invoice was created, but the invoice ID was not returned.",
        );
        return;
      }

      router.push(`/business/invoices/${invoiceId}`);
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create invoice.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Contract
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Select the active contract this invoice belongs to.
          </p>
        </div>

        <div className="mt-5">
          <label
            htmlFor="contractId"
            className="block text-sm font-medium text-gray-700"
          >
            Active contract
          </label>

          <select
            id="contractId"
            value={contractId}
            onChange={(event) =>
              handleContractChange(event.target.value)
            }
            disabled={submitting}
            className="mt-2 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20 disabled:bg-gray-100"
          >
            <option value="">Select a contract</option>

            {contracts.map((contract) => (
              <option
                key={contract.id}
                value={contract.id}
              >
                {contract.contractNumber} — {contract.organizationName} —{" "}
                {contract.title}
              </option>
            ))}
          </select>
        </div>

        {selectedContract && (
          <div className="mt-5 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contract
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedContract.contractNumber}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Client
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedContract.organizationName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contract value
                </p>

                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {selectedContract.amount
                    ? formatCurrency(
                        selectedContract.amount,
                        selectedContract.currency,
                      )
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </p>

                <p className="mt-1 text-sm font-semibold text-green-700">
                  Active
                </p>
              </div>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Contract title
              </p>

              <p className="mt-1 text-sm text-gray-900">
                {selectedContract.title}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            Invoice details
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Enter the amount and billing information for this invoice.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Invoice amount
            </label>

            <div className="relative mt-2">
              <input
                id="amount"
                name="amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                disabled={submitting}
                placeholder="0.00"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20 disabled:bg-gray-100"
              />
            </div>

            {selectedContract && (
              <p className="mt-1.5 text-xs text-gray-500">
                Defaults to the contract value. You can change this for a
                deposit, milestone, or balance invoice.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block text-sm font-medium text-gray-700"
            >
              Due date
            </label>

            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={dueDate}
              onChange={(event) =>
                setDueDate(event.target.value)
              }
              disabled={submitting}
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20 disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              disabled={submitting}
              placeholder="Describe what this invoice covers..."
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20 disabled:bg-gray-100"
            />
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-gray-700"
            >
              Internal notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={4}
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              disabled={submitting}
              placeholder="Optional internal notes..."
              className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 shadow-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20 disabled:bg-gray-100"
            />
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/business/invoices"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Creating Invoice..." : "Create Invoice"}
        </button>
      </div>
    </form>
  );
}