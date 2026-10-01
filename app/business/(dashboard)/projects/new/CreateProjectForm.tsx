"use client";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { FormEvent, useEffect, useState } from "react";

type Proposal = {
  id: string;
  proposalNumber: string;
  title: string;
  amount: string | null;
  currency: string;
  status: string;
};

type User = {
  id: string;
  name: string | null;
  email: string;
};

type FormState = {
  proposalId: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  contractValue: string;
  currency: string;
  startDate: string;
  targetEndDate: string;
  projectManagerId: string;
};

const initialForm: FormState = {
  proposalId: "",
  name: "",
  description: "",
  status: "PLANNING",
  priority: "MEDIUM",
  contractValue: "",
  currency: "NGN",
  startDate: "",
  targetEndDate: "",
  projectManagerId: "",
};

export function CreateProjectForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const proposalIdFromUrl =
    searchParams.get("proposalId") || "";
  

  const [form, setForm] =
    useState<FormState>(initialForm);

  const [proposals, setProposals] = useState<Proposal[]>(
    [],
  );

  const [users, setUsers] = useState<User[]>([]);

  const [loadingProposals, setLoadingProposals] =
    useState(true);

  const [loadingUsers, setLoadingUsers] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [loadingError, setLoadingError] =
    useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingError("");

        const [proposalsResponse, usersResponse] =
          await Promise.all([
            fetch("/api/proposals?status=ACCEPTED", {
              credentials: "include",
            }),
            fetch("/api/users", {
              credentials: "include",
            }),
          ]);

        const proposalsData =
          await proposalsResponse.json();

        const usersData =
          await usersResponse.json();

        if (!proposalsResponse.ok) {
          throw new Error(
            proposalsData.message ||
              "Unable to load accepted proposals.",
          );
        }

        if (!usersResponse.ok) {
          throw new Error(
            usersData.message ||
              "Unable to load users.",
          );
        }

        setProposals(
          Array.isArray(proposalsData.proposals)
            ? proposalsData.proposals
            : [],
        );

        setUsers(
          Array.isArray(usersData.users)
            ? usersData.users
            : [],
        );
        const acceptedProposals =
  Array.isArray(proposalsData.proposals)
    ? proposalsData.proposals
    : [];

if (proposalIdFromUrl) {
  const selectedProposal =
    acceptedProposals.find(
      (proposal: Proposal) =>
        proposal.id === proposalIdFromUrl,
    );

  if (selectedProposal) {
    setForm((current) => ({
      ...current,
      proposalId: selectedProposal.id,
      name:
        current.name || selectedProposal.title,
      contractValue:
        current.contractValue ||
        selectedProposal.amount ||
        "",
      currency:
        selectedProposal.currency ||
        current.currency,
    }));
  }
}
      } catch (err) {
        setLoadingError(
          err instanceof Error
            ? err.message
            : "Unable to load project creation data.",
        );
      } finally {
        setLoadingProposals(false);
        setLoadingUsers(false);
      }
    }

    void loadData();
  }, [proposalIdFromUrl]);

  function updateField(
    field: keyof FormState,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleProposalChange(
    proposalId: string,
  ) {
    const proposal = proposals.find(
      (item) => item.id === proposalId,
    );

    setForm((current) => ({
      ...current,
      proposalId,
      name:
        proposal && !current.name
          ? proposal.title
          : current.name,
      contractValue:
        proposal &&
        !current.contractValue &&
        proposal.amount !== null
          ? proposal.amount
          : current.contractValue,
      currency:
        proposal?.currency || current.currency,
    }));

    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          proposalId: form.proposalId,
          name: form.name.trim(),
          description:
            form.description.trim() || null,
          status: form.status,
          priority: form.priority,
          contractValue:
            form.contractValue.trim() || null,
          currency: form.currency
            .trim()
            .toUpperCase(),
          startDate:
            form.startDate || null,
          targetEndDate:
            form.targetEndDate || null,
          projectManagerId:
            form.projectManagerId || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to create the project.",
        );
      }

      if (!data.project?.id) {
        throw new Error(
          "Project was created but no project ID was returned.",
        );
      }

      router.push(
        `/business/projects/${data.project.id}`,
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create the project.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingProposals || loadingUsers) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm text-slate-600">
          Loading project creation options...
        </p>
      </div>
    );
  }

  if (loadingError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-sm font-semibold text-red-900">
          Unable to load project creation options
        </h2>

        <p className="mt-2 text-sm text-red-700">
          {loadingError}
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-4 rounded-lg bg-red-900 px-4 py-2 text-sm font-medium text-white hover:bg-red-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Project Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select the accepted proposal that this project
            will be created from.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="proposalId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Accepted Proposal
            </label>

            <select
              id="proposalId"
              value={form.proposalId}
              onChange={(event) =>
                handleProposalChange(
                  event.target.value,
                )
              }
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            >
              <option value="">
                Select an accepted proposal
              </option>

              {proposals.map((proposal) => (
                <option
                  key={proposal.id}
                  value={proposal.id}
                >
                  {proposal.proposalNumber} —{" "}
                  {proposal.title}
                </option>
              ))}
            </select>

            {proposals.length === 0 && (
              <p className="mt-2 text-sm text-amber-700">
                There are currently no accepted proposals
                available for project creation.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project Name
            </label>

            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value,
                )
              }
              required
              maxLength={200}
              placeholder="e.g. School Management System Implementation"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Description
            </label>

            <textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Describe the project scope or expected outcome."
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Project Configuration
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set the initial status, priority and commercial
            details.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Status
            </label>

            <select
              id="status"
              value={form.status}
              onChange={(event) =>
                updateField(
                  "status",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
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
              htmlFor="priority"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="priority"
              value={form.priority}
              onChange={(event) =>
                updateField(
                  "priority",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
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
              htmlFor="contractValue"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Contract Value
            </label>

            <input
              id="contractValue"
              type="number"
              min="0"
              step="0.01"
              value={form.contractValue}
              onChange={(event) =>
                updateField(
                  "contractValue",
                  event.target.value,
                )
              }
              placeholder="Inherited from proposal"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>

          <div>
            <label
              htmlFor="currency"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Currency
            </label>

            <input
              id="currency"
              type="text"
              value={form.currency}
              onChange={(event) =>
                updateField(
                  "currency",
                  event.target.value,
                )
              }
              maxLength={3}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Timeline & Ownership
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            These fields can be updated later from project
            management.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="startDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Start Date
            </label>

            <input
              id="startDate"
              type="date"
              value={form.startDate}
              onChange={(event) =>
                updateField(
                  "startDate",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>

          <div>
            <label
              htmlFor="targetEndDate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Target End Date
            </label>

            <input
              id="targetEndDate"
              type="date"
              value={form.targetEndDate}
              onChange={(event) =>
                updateField(
                  "targetEndDate",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="projectManagerId"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Project Manager
            </label>

            <select
              id="projectManagerId"
              value={form.projectManagerId}
              onChange={(event) =>
                updateField(
                  "projectManagerId",
                  event.target.value,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/20"
            >
              <option value="">
                Select a project manager
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/business/projects")
          }
          disabled={submitting}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            submitting || proposals.length === 0
          }
          className="rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2f2b73] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Creating Project..."
            : "Create Project"}
        </button>
      </div>
    </form>
  );
}