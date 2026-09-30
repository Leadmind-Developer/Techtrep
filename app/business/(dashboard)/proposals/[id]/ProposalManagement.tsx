"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  proposal: {
    id: string;
    proposalNumber: string;
    title: string;
    description: string | null;
    amount: unknown;
    currency: string;
    status: string;
    validUntil: string | null;
    notes: string | null;
  };
};

export default function ProposalManagement({
  proposal,
}: Props) {
  const router = useRouter();  

  const [title, setTitle] =
    useState(proposal.title);

  const [description, setDescription] =
    useState(proposal.description ?? "");

  const [amount, setAmount] = useState(
    proposal.amount === null ||
      proposal.amount === undefined
      ? ""
      : String(proposal.amount),
  );

  const [currency, setCurrency] =
    useState(proposal.currency);

  const status = proposal.status;

  const [validUntil, setValidUntil] =
    useState(
      proposal.validUntil
        ? proposal.validUntil.slice(0, 10)
        : "",
    );

  const [notes, setNotes] =
    useState(proposal.notes ?? "");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");    

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

    if (
      validUntil &&
      Number.isNaN(
        new Date(`${validUntil}T00:00:00`).getTime(),
      )
    ) {
      setError("Please enter a valid expiry date.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/proposals/${proposal.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({            
            title: title.trim(),
            description:
              description.trim() || null,
            amount:
              amount.trim() || null,
            currency:
              currency.trim().toUpperCase(),            
            validUntil:
              validUntil || null,
            notes:
              notes.trim() || null,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update proposal.",
        );
        return;
      }

      setSuccess(
        "Proposal updated successfully.",
      );

      router.refresh();
    } catch {
      setError(
        "Unable to update proposal. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Manage Proposal
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Update the proposal details, commercial terms,
          status and validity.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="proposal-number"
              className="block text-sm font-medium text-slate-700"
            >
              Proposal Number
            </label>

            <div
              id="proposal-number"
              className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
            >
                {proposal.proposalNumber}
            </div>
          </div>

          <div>
            <label
              htmlFor="proposal-title"
              className="block text-sm font-medium text-slate-700"
            >
              Title
            </label>

            <input
              id="proposal-title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              maxLength={200}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="proposal-description"
            className="block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="proposal-description"
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
              htmlFor="proposal-amount"
              className="block text-sm font-medium text-slate-700"
            >
              Amount
            </label>

            <input
              id="proposal-amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="proposal-currency"
              className="block text-sm font-medium text-slate-700"
            >
              Currency
            </label>

            <input
              id="proposal-currency"
              type="text"
              value={currency}
              onChange={(event) =>
                setCurrency(event.target.value)
              }
              maxLength={3}
              className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm uppercase text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div>
            <label
              htmlFor="proposal-status"
              className="block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <div
              id="proposal-status"
              className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700"
            >
                {status}
            </div>

            <p className="mt-1.5 text-xs text-slate-400">
                Proposal status is updated by the proposal workflow.
            </p>
            </div>

          <div>
            <label
              htmlFor="proposal-valid-until"
              className="block text-sm font-medium text-slate-700"
            >
              Valid Until
            </label>

            <input
              id="proposal-valid-until"
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
            htmlFor="proposal-notes"
            className="block text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="proposal-notes"
            value={notes}
            onChange={(event) =>
              setNotes(event.target.value)
            }
            rows={4}
            className="mt-2 block w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />
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