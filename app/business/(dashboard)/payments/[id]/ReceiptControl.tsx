"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ReceiptControlProps = {
  paymentId: string;
  receipt?: {
    id: string;
    receiptNumber: string;
    issuedAt: string;
    notes: string | null;
  } | null;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ReceiptControl({
  paymentId,
  receipt,
}: ReceiptControlProps) {
  const router = useRouter();

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [error, setError] = useState<string | null>(
    null,
  );

  async function handleGenerateReceipt() {
    const confirmed = window.confirm(
      "Generate a receipt for this payment?",
    );

    if (!confirmed) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/receipts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to generate receipt.",
        );
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to generate receipt.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  if (receipt) {
    return (
      <div className="mt-4">
        <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-900">
            {receipt.receiptNumber}
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            Issued {formatDate(receipt.issuedAt)}
          </p>

          {receipt.notes && (
            <p className="mt-3 whitespace-pre-wrap text-sm text-emerald-800">
              {receipt.notes}
            </p>
          )}
        </div>

        <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs text-gray-500">
          Receipt PDF actions will be available here
          once receipt PDF generation is added.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500">
        No receipt has been generated for this
        payment.
      </p>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleGenerateReceipt}
        disabled={isGenerating}
        className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#302d78] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isGenerating
          ? "Generating..."
          : "Generate Receipt"}
      </button>
    </div>
  );
}