"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type LeadStatusControlProps = {
  leadId: string;
  currentStatus: string;
};

const STATUS_OPTIONS = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "DISCOVERY", label: "Discovery" },
  { value: "PROPOSAL_SENT", label: "Proposal sent" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
] as const;

export default function LeadStatusControl({
  leadId,
  currentStatus,
}: LeadStatusControlProps) {
  const router = useRouter();

  const [status, setStatus] = useState(currentStatus);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ) {
    const nextStatus = event.target.value;

    if (nextStatus === status) {
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to change lead status.",
        );

        setStatus(status);
        return;
      }

      setStatus(nextStatus);

      router.refresh();
    } catch {
      setError(
        "Unable to change lead status. Please try again.",
      );

      setStatus(status);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="lead-status"
        className="block text-xs font-medium uppercase tracking-wide text-slate-400"
      >
        Status
      </label>

      <select
        id="lead-status"
        value={status}
        onChange={handleChange}
        disabled={isSaving}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
      >
        {STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {isSaving && (
        <p className="text-xs text-slate-400">
          Updating status...
        </p>
      )}

      {error && (
        <p role="alert" className="text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}