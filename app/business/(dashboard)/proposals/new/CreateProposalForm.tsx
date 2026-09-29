"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OpportunityOption = {
  id: string;
  name: string;
  status: string;
  auditRequest: {
    organization: {
      id: string;
      name: string;
    };
  };
};

type Props = {
  opportunities: OpportunityOption[];
};

export default function CreateProposalForm({
  opportunities,
}: Props) {
  const router = useRouter();

  const [opportunityId, setOpportunityId] =
    useState("");

  const [proposalNumber, setProposalNumber] =
    useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [amount, setAmount] = useState("");

  const [currency, setCurrency] =
    useState("NGN");

  const [status, setStatus] =
    useState("DRAFT");

  const [validUntil, setValidUntil] =
    useState("");

  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const selectedOpportunity = useMemo(
    () =>
      opportunities.find(
        (item) => item.id === opportunityId,
      ),
    [opportunities, opportunityId],
  );

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!opportunityId) {
      setError("Please select an opportunity.");
      return;
    }

    if (!proposalNumber.trim()) {
      setError("Proposal number is required.");
      return;
    }

    if (!title.trim()) {
      setError("Proposal title is required.");
      return;
    }

    if (amount.trim()) {
      const numericAmount = Number(amount);

      if (
        !Number.isFinite(numericAmount) ||
        numericAmount < 0
      ) {
        setError(
          "Proposal amount must be a valid non-negative number.",
        );
        return;
      }
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/proposals",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            opportunityId,
            proposalNumber:
              proposalNumber.trim(),
            title: title.trim(),
            description:
              description.trim() || null,
            amount: amount.trim() || null,
            currency: currency.trim().toUpperCase(),
            status,
            validUntil:
              validUntil.trim() || null,
            notes: notes.trim() || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to create proposal.",
        );
        return;
      }

      router.push(
        `/business/proposals/${result.proposal.id}`,
      );

      router.refresh();
    } catch {
      setError(
        "Unable to create proposal. Please try again.",
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
              htmlFor="opportunityId"
              className="block text-sm font-medium text-slate-700"
            >
              Opportunity
            </label>

            <select
              id="opportunityId"
              value={opportunityId}
              onChange={(event) =>
                setOpportunityId(
                  event.target.value,
                )
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              required
            >
              <option value="">
                Select an opportunity
              </option>

              {opportunities.map((opportunity) => (
                <option
                  key={opportunity.id}
                  value={opportunity.id}
                >
                  {opportunity.name} —{" "}
                  {opportunity.auditRequest.organization.name}
                </option>
              ))}
            </select>

            {selectedOpportunity && (
              <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                <span className="font-medium">
                  Organization:
                </span>{" "}
                {
                  selectedOpportunity.auditRequest
                    .organization.name
                }

                <span className="mx-2 text-slate-300">
                  |
                </span>

                <span className="font-medium">
                  Opportunity status:
                </span>{" "}
                {selectedOpportunity.status}
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="proposalNumber"
                className="block text-sm font-medium text-slate-700"
              >
                Proposal Number
              </label>

              <input
                id="proposalNumber"
                type="text"
                value={proposalNumber}
                onChange={(event) =>
                  setProposalNumber(
                    event.target.value,
                  )
                }
                maxLength={100}
                placeholder="e.g. TBS-2026-001"
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-slate-700"
              >
                Proposal Title
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                maxLength={200}
                placeholder="e.g. Business Automation Implementation"
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                required
              />
            </div>
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
                setDescription(
                  event.target.value,
                )
              }
              rows={5}
              placeholder="Describe the proposed solution, scope, and expected business outcome..."
              className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-slate-700"
              >
                Amount
              </label>

              <input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(event) =>
                  setAmount(event.target.value)
                }
                placeholder="0.00"
                className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div>
              <label
                htmlFor="currency"
                className="block text-sm font-medium text-slate-700"
              >
                Currency
              </label>

              <select
                id="currency"
                value={currency}
                onChange={(event) =>
                  setCurrency(event.target.value)
                }
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="NGN">
                  NGN — Nigerian Naira
                </option>
                <option value="USD">
                  USD — US Dollar
                </option>
                <option value="GBP">
                  GBP — British Pound
                </option>
                <option value="EUR">
                  EUR — Euro
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="validUntil"
                className="block text-sm font-medium text-slate-700"
              >
                Valid Until
              </label>

              <input
                id="validUntil"
                type="date"
                value={validUntil}
                onChange={(event) =>
                  setValidUntil(
                    event.target.value,
                  )
                }
                className="mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>
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
              <option value="DRAFT">
                Draft
              </option>
              <option value="SENT">
                Sent
              </option>
              <option value="ACCEPTED">
                Accepted
              </option>
              <option value="REJECTED">
                Rejected
              </option>
              <option value="EXPIRED">
                Expired
              </option>
              <option value="WITHDRAWN">
                Withdrawn
              </option>
            </select>

            <p className="mt-1.5 text-xs text-slate-400">
              New proposals normally start as Draft.
            </p>
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-sm font-medium text-slate-700"
            >
              Internal Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={4}
              placeholder="Add internal notes about pricing, approval, follow-up, or other proposal details..."
              className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
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
            router.push("/business/proposals")
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
            : "Create Proposal"}
        </button>
      </div>
    </form>
  );
}