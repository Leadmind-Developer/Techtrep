"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const contractStatuses = [
  "DRAFT",
  "SENT",
  "SIGNED",
  "ACTIVE",
  "EXPIRED",
  "TERMINATED",
] as const;

type ContractStatus =
  (typeof contractStatuses)[number];

const allowedTransitions: Record<
  ContractStatus,
  ContractStatus[]
> = {
  DRAFT: ["SENT", "TERMINATED"],
  SENT: ["SIGNED", "TERMINATED"],
  SIGNED: ["ACTIVE", "TERMINATED"],
  ACTIVE: ["EXPIRED", "TERMINATED"],
  EXPIRED: [],
  TERMINATED: [],
};

type Props = {
  contractId: string;
  status: ContractStatus;
  signedAt: string | null;
};

function getStatusClasses(status: ContractStatus) {
  switch (status) {
    case "DRAFT":
      return "bg-gray-100 text-gray-700";
    case "SENT":
      return "bg-blue-100 text-blue-700";
    case "SIGNED":
      return "bg-purple-100 text-purple-700";
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "EXPIRED":
      return "bg-amber-100 text-amber-700";
    case "TERMINATED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function ContractStatusControl({
  contractId,
  status,
  signedAt,
}: Props) {
  const router = useRouter();

  const [selectedStatus, setSelectedStatus] =
    useState<ContractStatus>(status);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const nextStatuses = allowedTransitions[status];

  async function handleStatusUpdate() {
    if (selectedStatus === status) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/contracts/${contractId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: selectedStatus,
            ...(selectedStatus === "SIGNED" &&
            !signedAt
              ? {
                  signedAt: new Date().toISOString(),
                }
              : {}),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ??
            "Unable to update contract status.",
        );

        setSelectedStatus(status);
        return;
      }

      router.refresh();
    } catch {
      setError(
        "Unable to update contract status.",
      );
      setSelectedStatus(status);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">
            Contract Status
          </p>

          <div className="mt-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(
                status,
              )}`}
            >
              {status}
            </span>
          </div>
        </div>

        {nextStatuses.length > 0 ? (
          <div className="flex flex-col gap-2 sm:min-w-64">
            <label
              htmlFor="contract-status"
              className="text-sm font-medium text-gray-700"
            >
              Change status
            </label>

            <div className="flex gap-2">
              <select
                id="contract-status"
                value={selectedStatus}
                disabled={isSaving}
                onChange={(event) =>
                  setSelectedStatus(
                    event.target
                      .value as ContractStatus,
                  )
                }
                className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-gray-100"
              >
                <option value={status}>
                  Keep {status}
                </option>

                {nextStatuses.map(
                  (nextStatus) => (
                    <option
                      key={nextStatus}
                      value={nextStatus}
                    >
                      {nextStatus}
                    </option>
                  ),
                )}
              </select>

              <button
                type="button"
                disabled={
                  isSaving ||
                  selectedStatus === status
                }
                onClick={handleStatusUpdate}
                className="rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#302d78] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSaving
                  ? "Saving..."
                  : "Update"}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {status === "SIGNED" && signedAt ? (
        <p className="mt-4 text-sm text-gray-600">
          Signed on{" "}
          {new Intl.DateTimeFormat("en-NG", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(signedAt))}
          .
        </p>
      ) : null}
    </div>
  );
}