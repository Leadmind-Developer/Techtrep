"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type InvoiceStatus =
  | "DRAFT"
  | "SENT"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "VOID";

type Props = {
  invoiceId: string;
  status: InvoiceStatus;
};

const ACTIONS: Record<
  InvoiceStatus,
  Array<{
    status: InvoiceStatus;
    label: string;
    className: string;
  }>
> = {
  DRAFT: [
    {
      status: "SENT",
      label: "Mark as Sent",
      className:
        "bg-[#39358c] text-white hover:opacity-90",
    },
    {
      status: "VOID",
      label: "Void Invoice",
      className:
        "border border-red-300 bg-white text-red-700 hover:bg-red-50",
    },
  ],
  SENT: [
    {
      status: "OVERDUE",
      label: "Mark as Overdue",
      className:
        "border border-orange-300 bg-white text-orange-700 hover:bg-orange-50",
    },
    {
      status: "VOID",
      label: "Void Invoice",
      className:
        "border border-red-300 bg-white text-red-700 hover:bg-red-50",
    },
  ],
  PARTIALLY_PAID: [],
  PAID: [],
  OVERDUE: [],
  VOID: [],
};

export default function InvoiceStatusControl({
  invoiceId,
  status,
}: Props) {
  const router = useRouter();

  const [loadingStatus, setLoadingStatus] =
    useState<InvoiceStatus | null>(null);

  const [error, setError] = useState("");

  const actions = ACTIONS[status];

  if (actions.length === 0) {
    return null;
  }

  async function updateStatus(
    nextStatus: InvoiceStatus,
  ) {
    if (
      nextStatus === "VOID" &&
      !window.confirm(
        "Are you sure you want to void this invoice?",
      )
    ) {
      return;
    }

    setError("");
    setLoadingStatus(nextStatus);

    try {
      const response = await fetch(
        `/api/invoices/${invoiceId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Unable to update invoice status.",
        );
        return;
      }

      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update invoice status.",
      );
    } finally {
      setLoadingStatus(null);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">
        Invoice actions
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Update the current invoice status.
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {actions.map((action) => (
          <button
            key={action.status}
            type="button"
            onClick={() => updateStatus(action.status)}
            disabled={loadingStatus !== null}
            className={`inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${action.className}`}
          >
            {loadingStatus === action.status
              ? "Updating..."
              : action.label}
          </button>
        ))}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-3 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}