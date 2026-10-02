"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type InvoiceOption = {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: string | null;
  organization: string;
  balance: number;
};

type Props = {
  invoices: InvoiceOption[];
};

const PAYMENT_METHODS = [
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
  },
  {
    value: "CASH",
    label: "Cash",
  },
  {
    value: "CARD",
    label: "Card",
  },
  {
    value: "POS",
    label: "POS",
  },
  {
    value: "USSD",
    label: "USSD",
  },
  {
    value: "MOBILE_MONEY",
    label: "Mobile Money",
  },
  {
    value: "CHEQUE",
    label: "Cheque",
  },
  {
    value: "OTHER",
    label: "Other",
  },
] as const;

function formatCurrency(
  value: number,
  currency: string,
) {
  if (!Number.isFinite(value)) {
    return "—";
  }

  if (currency === "NGN") {
    return `₦${value.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `${currency} ${value.toLocaleString(
    "en-NG",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  )}`;
}

function formatDate(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function NewPaymentForm({
  invoices,
}: Props) {
  const router = useRouter();

  const [invoiceId, setInvoiceId] =
    useState("");

  const [amount, setAmount] = useState("");

  const [method, setMethod] =
    useState("BANK_TRANSFER");

  const [paidAt, setPaidAt] = useState("");

  const [reference, setReference] =
    useState("");

  const [notes, setNotes] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const selectedInvoice = useMemo(
    () =>
      invoices.find(
        (invoice) =>
          invoice.id === invoiceId,
      ) ?? null,
    [invoices, invoiceId],
  );

  function handleInvoiceChange(
    nextInvoiceId: string,
  ) {
    setInvoiceId(nextInvoiceId);
    setError("");

    const invoice = invoices.find(
      (item) => item.id === nextInvoiceId,
    );

    if (invoice) {
      setAmount(
        invoice.balance > 0
          ? invoice.balance.toFixed(2)
          : "",
      );
    } else {
      setAmount("");
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!invoiceId) {
      setError("Please select an invoice.");
      return;
    }

    if (!amount.trim()) {
      setError("Please enter a payment amount.");
      return;
    }

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError(
        "Payment amount must be greater than zero.",
      );
      return;
    }

    if (
      selectedInvoice &&
      numericAmount >
        selectedInvoice.balance + 0.000001
    ) {
      setError(
        "Payment amount cannot exceed the outstanding balance.",
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            invoiceId,
            amount: amount.trim(),
            method,
            ...(paidAt
              ? {
                  paidAt: new Date(
                    paidAt,
                  ).toISOString(),
                }
              : {}),
            ...(reference.trim()
              ? {
                  reference:
                    reference.trim(),
                }
              : {}),
            ...(notes.trim()
              ? {
                  notes: notes.trim(),
                }
              : {}),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Unable to record payment.",
        );
        return;
      }

      router.push(
        `/business/payments/${data.payment.id}`,
      );
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to record payment.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">
          Payment details
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Select the invoice and enter the payment
          received.
        </p>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="payment-invoice"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Invoice
            </label>

            <select
              id="payment-invoice"
              value={invoiceId}
              onChange={(event) =>
                handleInvoiceChange(
                  event.target.value,
                )
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            >
              <option value="">
                Select an invoice
              </option>

              {invoices.map((invoice) => (
                <option
                  key={invoice.id}
                  value={invoice.id}
                >
                  {invoice.invoiceNumber} —{" "}
                  {invoice.organization} —{" "}
                  {formatCurrency(
                    invoice.balance,
                    invoice.currency,
                  )}{" "}
                  outstanding
                </option>
              ))}
            </select>
          </div>

          {selectedInvoice && (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Invoice
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {selectedInvoice.invoiceNumber}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Invoice total
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(
                      selectedInvoice.amount,
                      selectedInvoice.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Outstanding
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#39358c]">
                    {formatCurrency(
                      selectedInvoice.balance,
                      selectedInvoice.currency,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <p className="text-xs text-gray-500">
                  Client
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {selectedInvoice.organization}
                </p>

                {selectedInvoice.dueDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    Due{" "}
                    {formatDate(
                      selectedInvoice.dueDate,
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="payment-amount"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Amount
            </label>

            <input
              id="payment-amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              disabled={loading}
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            />

            {selectedInvoice && (
              <p className="mt-1.5 text-xs text-gray-500">
                Maximum payment:{" "}
                {formatCurrency(
                  selectedInvoice.balance,
                  selectedInvoice.currency,
                )}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="payment-method"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Payment method
            </label>

            <select
              id="payment-method"
              value={method}
              onChange={(event) =>
                setMethod(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            >
              {PAYMENT_METHODS.map(
                (paymentMethod) => (
                  <option
                    key={paymentMethod.value}
                    value={paymentMethod.value}
                  >
                    {paymentMethod.label}
                  </option>
                ),
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="payment-paid-at"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Payment date
            </label>

            <input
              id="payment-paid-at"
              type="datetime-local"
              value={paidAt}
              onChange={(event) =>
                setPaidAt(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            />

            <p className="mt-1.5 text-xs text-gray-500">
              Leave blank to use the current date and
              time.
            </p>
          </div>

          <div>
            <label
              htmlFor="payment-reference"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Payment reference
            </label>

            <input
              id="payment-reference"
              type="text"
              value={reference}
              onChange={(event) =>
                setReference(event.target.value)
              }
              disabled={loading}
              placeholder="Bank transaction ID, transfer reference, etc."
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label
              htmlFor="payment-notes"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="payment-notes"
              rows={4}
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              disabled={loading}
              placeholder="Optional payment notes..."
              className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-50"
            />
          </div>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/business/payments")
          }
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            loading ||
            !invoiceId ||
            !amount
          }
          className="rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Recording Payment..."
            : "Record Payment"}
        </button>
      </div>
    </form>
  );
}