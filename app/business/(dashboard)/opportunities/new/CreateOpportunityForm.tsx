"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type AuditRequestOption = {
  id: string;
  status: string;
  createdAt: Date;
  organization: {
    id: string;
    name: string;
  };
  contact: {
    id: string;
    name: string;
    email: string;
  };
};

type Props = {
  auditRequests: AuditRequestOption[];
};

export default function CreateOpportunityForm({
  auditRequests,
}: Props) {
  const router = useRouter();

  const [auditRequestId, setAuditRequestId] =
    useState("");

  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("MEDIUM");

  const [status, setStatus] =
    useState("IDENTIFIED");

  const [estimatedValue, setEstimatedValue] =
    useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedAudit = useMemo(
    () =>
      auditRequests.find(
        (item) => item.id === auditRequestId,
      ),
    [auditRequests, auditRequestId],
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!auditRequestId) {
      setError("Please select an audit request.");
      return;
    }

    if (!name.trim()) {
      setError("Opportunity name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/opportunities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            auditRequestId,
            name: name.trim(),
            description: description.trim(),
            priority,
            status,
            estimatedValue:
              estimatedValue.trim() || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to create opportunity.",
        );
        return;
      }

      router.push(
        `/business/opportunities/${result.opportunity.id}`,
      );

      router.refresh();
    } catch {
      setError(
        "Unable to create opportunity. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="auditRequestId"
              className="block text-sm font-medium text-slate-700"
            >
              Audit Request
            </label>

            <select
              id="auditRequestId"
              value={auditRequestId}
              onChange={(event) =>
                setAuditRequestId(event.target.value)
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            >
              <option value="">
                Select an audit request
              </option>

              {auditRequests.map((audit) => (
                <option
                  key={audit.id}
                  value={audit.id}
                >
                  {audit.organization.name} —{" "}
                  {audit.contact.name} —{" "}
                  {audit.status}
                </option>
              ))}
            </select>

            {selectedAudit && (
              <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="font-medium">
                  Contact:
                </span>{" "}
                {selectedAudit.contact.name} (
                {selectedAudit.contact.email})
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700"
            >
              Opportunity Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={200}
              placeholder="e.g. Website redesign and automation"
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              rows={5}
              placeholder="Describe the business opportunity..."
              className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-slate-700"
              >
                Priority
              </label>

              <select
                id="priority"
                value={priority}
                onChange={(event) =>
                  setPriority(event.target.value)
                }
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">
                  Critical
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-slate-700"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="IDENTIFIED">
                  Identified
                </option>
                <option value="DISCUSSED">
                  Discussed
                </option>
                <option value="PROPOSED">
                  Proposed
                </option>
                <option value="APPROVED">
                  Approved
                </option>
                <option value="IN_PROGRESS">
                  In Progress
                </option>
                <option value="COMPLETED">
                  Completed
                </option>
                <option value="DECLINED">
                  Declined
                </option>
                <option value="WON">
                  Won
                </option>
                <option value="LOST">
                  Lost
                </option>
              </select>
            </div>              

            <div>
              <label
                htmlFor="estimatedValue"
                className="block text-sm font-medium text-slate-700"
              >
                Estimated Value (₦)
              </label>

              <input
                id="estimatedValue"
                type="number"
                min="0"
                step="0.01"
                value={estimatedValue}
                onChange={(event) =>
                  setEstimatedValue(
                    event.target.value,
                  )
                }
                placeholder="0.00"
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/business/opportunities")
          }
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Creating..."
            : "Create Opportunity"}
        </button>
      </div>
    </form>
  );
}
