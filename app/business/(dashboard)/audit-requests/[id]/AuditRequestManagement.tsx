"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AuditStatus =
  | "REQUESTED"
  | "CONTACTED"
  | "SCHEDULED"
  | "COMPLETED"
  | "REPORT_SENT"
  | "PROPOSAL_SENT"
  | "WON"
  | "LOST";

type AuditRequestManagementProps = {
  auditRequestId: string;
  status: AuditStatus;
  scheduledAt: string | null;
  completedAt: string | null;
  reportSentAt: string | null;
};

const statusOptions: {
  value: AuditStatus;
  label: string;
}[] = [
  {
    value: "REQUESTED",
    label: "Requested",
  },
  {
    value: "CONTACTED",
    label: "Contacted",
  },
  {
    value: "SCHEDULED",
    label: "Scheduled",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "REPORT_SENT",
    label: "Report Sent",
  },
  {
    value: "PROPOSAL_SENT",
    label: "Proposal Sent",
  },
  {
    value: "WON",
    label: "Won",
  },
  {
    value: "LOST",
    label: "Lost",
  },
];

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  );

  return localDate.toISOString().slice(0, 16);
}

function fromDateTimeLocal(value: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export default function AuditRequestManagement({
  auditRequestId,
  status: initialStatus,
  scheduledAt: initialScheduledAt,
  completedAt: initialCompletedAt,
  reportSentAt: initialReportSentAt,
}: AuditRequestManagementProps) {
  const router = useRouter();

  const [status, setStatus] =
    useState<AuditStatus>(initialStatus);

  const [scheduledAt, setScheduledAt] = useState(
    toDateTimeLocal(initialScheduledAt),
  );

  const [completedAt, setCompletedAt] = useState(
    toDateTimeLocal(initialCompletedAt),
  );

  const [reportSentAt, setReportSentAt] = useState(
    toDateTimeLocal(initialReportSentAt),
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `/api/audit-requests/${auditRequestId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
            scheduledAt: fromDateTimeLocal(scheduledAt),
            completedAt: fromDateTimeLocal(completedAt),
            reportSentAt: fromDateTimeLocal(reportSentAt),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Unable to update audit request.",
        );
        return;
      }

      setMessage("Audit request updated successfully.");

      router.refresh();
    } catch {
      setError(
        "A network error occurred. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Manage Audit Request
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Update the audit workflow and important operational dates.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <label
            htmlFor="audit-status"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Status
          </label>

          <select
            id="audit-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as AuditStatus)
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="audit-scheduled-at"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Scheduled date &amp; time
          </label>

          <input
            id="audit-scheduled-at"
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) =>
              setScheduledAt(event.target.value)
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        <div>
          <label
            htmlFor="audit-completed-at"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Completed date &amp; time
          </label>

          <input
            id="audit-completed-at"
            type="datetime-local"
            value={completedAt}
            onChange={(event) =>
              setCompletedAt(event.target.value)
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        <div>
          <label
            htmlFor="audit-report-sent-at"
            className="mb-1.5 block text-xs font-medium text-slate-700"
          >
            Report sent date &amp; time
          </label>

          <input
            id="audit-report-sent-at"
            type="datetime-local"
            value={reportSentAt}
            onChange={(event) =>
              setReportSentAt(event.target.value)
            }
            disabled={saving}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:bg-slate-50"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {message && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700"
          >
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  );
}
