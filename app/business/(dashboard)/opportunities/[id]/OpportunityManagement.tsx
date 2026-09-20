"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  opportunity: {
    id: string;
    name: string;
    description: string | null;
    priority: string;
    status: string;
    estimatedValue: unknown;
  };
};

export default function OpportunityManagement({
  opportunity,
}: Props) {
  const router = useRouter();

  const [name, setName] =
    useState(opportunity.name);

  const [description, setDescription] =
    useState(opportunity.description ?? "");

  const [priority, setPriority] =
    useState(opportunity.priority);

  const [status, setStatus] =
    useState(opportunity.status);

  const [estimatedValue, setEstimatedValue] =
    useState(
      opportunity.estimatedValue === null ||
        opportunity.estimatedValue === undefined
        ? ""
        : String(opportunity.estimatedValue),
    );

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Opportunity name is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/opportunities/${opportunity.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
            "Unable to update opportunity.",
        );
        return;
      }

      setSuccess(
        "Opportunity updated successfully.",
      );

      router.refresh();
    } catch {
      setError(
        "Unable to update opportunity. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Manage Opportunity
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Update the opportunity details, status, priority and value.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5"
      >
        <div>
          <label
            htmlFor="opportunity-name"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>

          <input
            id="opportunity-name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={200}
            className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div>
          <label
            htmlFor="opportunity-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="opportunity-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="opportunity-priority"
              className="block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="opportunity-priority"
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
              htmlFor="opportunity-status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="opportunity-status"
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
            </select>
          </div>

          <div>
            <label
              htmlFor="opportunity-value"
              className="block text-sm font-medium text-slate-700"
            >
              Estimated Value (₦)
            </label>

            <input
              id="opportunity-value"
              type="number"
              min="0"
              step="0.01"
              value={estimatedValue}
              onChange={(event) =>
                setEstimatedValue(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}