"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserOption = {
  id: string;
  name: string | null;
  email: string;
  active: boolean;
};

type Props = {
  project: {
    id: string;
    projectNumber: string;
    name: string;
    description: string | null;
    status: string;
    priority: string;
    contractValue: unknown;
    currency: string;
    startDate: string | null;
    targetEndDate: string | null;
    projectManagerId: string | null;
  };
  projectManagers: UserOption[];
};

export default function ProjectManagement({
  project,
  projectManagers,
}: Props) {
  const router = useRouter();

  const [projectNumber, setProjectNumber] =
    useState(project.projectNumber);

  const [name, setName] =
    useState(project.name);

  const [description, setDescription] =
    useState(project.description ?? "");

  const [status, setStatus] =
    useState(project.status);

  const [priority, setPriority] =
    useState(project.priority);

  const [contractValue, setContractValue] =
    useState(
      project.contractValue === null ||
        project.contractValue === undefined
        ? ""
        : String(project.contractValue),
    );

  const [currency, setCurrency] =
    useState(project.currency);

  const [startDate, setStartDate] =
    useState(
      project.startDate
        ? project.startDate.slice(0, 10)
        : "",
    );

  const [targetEndDate, setTargetEndDate] =
    useState(
      project.targetEndDate
        ? project.targetEndDate.slice(0, 10)
        : "",
    );

  const [projectManagerId, setProjectManagerId] =
    useState(project.projectManagerId ?? "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!projectNumber.trim()) {
      setError("Project number is required.");
      return;
    }

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (contractValue.trim()) {
      const numericValue = Number(contractValue);

      if (
        !Number.isFinite(numericValue) ||
        numericValue < 0
      ) {
        setError(
          "Contract value must be a valid non-negative number.",
        );
        return;
      }
    }

    if (startDate && targetEndDate) {
      const start = new Date(
        `${startDate}T00:00:00`,
      );

      const end = new Date(
        `${targetEndDate}T00:00:00`,
      );

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
      ) {
        setError("Please enter valid project dates.");
        return;
      }

      if (end < start) {
        setError(
          "Target end date cannot be earlier than the start date.",
        );
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/projects/${project.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectNumber:
              projectNumber.trim(),
            name: name.trim(),
            description:
              description.trim() || null,
            status,
            priority,
            contractValue:
              contractValue.trim() || null,
            currency:
              currency.trim().toUpperCase(),
            startDate:
              startDate || null,
            targetEndDate:
              targetEndDate || null,
            projectManagerId:
              projectManagerId || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update project.",
        );
        return;
      }

      setSuccess(
        "Project updated successfully.",
      );

      router.refresh();
    } catch {
      setError(
        "Unable to update project. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Manage Project
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Update the project details, delivery status,
          commercial terms and project manager.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="project-number"
              className="block text-sm font-medium text-slate-700"
            >
              Project Number
            </label>

            <input
              id="project-number"
              type="text"
              value={projectNumber}
              onChange={(event) =>
                setProjectNumber(
                  event.target.value,
                )
              }
              maxLength={100}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="project-name"
              className="block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="project-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={200}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="project-description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            rows={5}
            className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="project-status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="project-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="PLANNING">
                Planning
              </option>
              <option value="IN_PROGRESS">
                In Progress
              </option>
              <option value="ON_HOLD">
                On Hold
              </option>
              <option value="COMPLETED">
                Completed
              </option>
              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="project-priority"
              className="block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="project-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="LOW">
                Low
              </option>
              <option value="MEDIUM">
                Medium
              </option>
              <option value="HIGH">
                High
              </option>
              <option value="CRITICAL">
                Critical
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="project-contract-value"
              className="block text-sm font-medium text-slate-700"
            >
              Contract Value
            </label>

            <input
              id="project-contract-value"
              type="number"
              min="0"
              step="0.01"
              value={contractValue}
              onChange={(event) =>
                setContractValue(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="project-currency"
              className="block text-sm font-medium text-slate-700"
            >
              Currency
            </label>

            <input
              id="project-currency"
              type="text"
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value)
              }
              maxLength={3}
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="project-start-date"
              className="block text-sm font-medium text-slate-700"
            >
              Start Date
            </label>

            <input
              id="project-start-date"
              type="date"
              value={startDate}
              onChange={(event) =>
                setStartDate(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="project-target-end-date"
              className="block text-sm font-medium text-slate-700"
            >
              Target End Date
            </label>

            <input
              id="project-target-end-date"
              type="date"
              value={targetEndDate}
              onChange={(event) =>
                setTargetEndDate(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="project-manager"
              className="block text-sm font-medium text-slate-700"
            >
              Project Manager
            </label>

            <select
              id="project-manager"
              value={projectManagerId}
              onChange={(event) =>
                setProjectManagerId(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            >
              <option value="">
                Unassigned
              </option>

              {projectManagers.map((manager) => (
                <option
                  key={manager.id}
                  value={manager.id}
                >
                  {manager.name} — {manager.email}
                </option>
              ))}
            </select>
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