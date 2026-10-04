"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ContractEditFormProps = {
  contractId: string;
  title: string;
  description: string | null;
  startDate: string | null;
  endDate: string | null;
  signedAt: string | null;
  notes: string | null;
};

function toDateInputValue(value: string | null): string {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export default function ContractEditForm({
  contractId,
  title: initialTitle,
  description: initialDescription,
  startDate: initialStartDate,
  endDate: initialEndDate,
  signedAt: initialSignedAt,
  notes: initialNotes,
}: ContractEditFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(
    initialDescription ?? "",
  );
  const [startDate, setStartDate] = useState(
    toDateInputValue(initialStartDate),
  );
  const [endDate, setEndDate] = useState(
    toDateInputValue(initialEndDate),
  );
  const [signedAt, setSignedAt] = useState(
    toDateInputValue(initialSignedAt),
  );
  const [notes, setNotes] = useState(initialNotes ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `/api/contracts/${contractId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: title.trim(),
            description: description.trim() || null,
            startDate: startDate
              ? `${startDate}T00:00:00.000Z`
              : null,
            endDate: endDate
              ? `${endDate}T23:59:59.999Z`
              : null,
            signedAt: signedAt
              ? `${signedAt}T00:00:00.000Z`
              : null,
            notes: notes.trim() || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to update contract.",
        );
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update contract.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Edit Contract
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Update the contract details without changing the
          proposal, contract number, amount, or currency.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Contract updated successfully.
        </div>
      )}

      <div>
        <label
          htmlFor="contract-title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>

        <input
          id="contract-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          maxLength={200}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
        />
      </div>

      <div>
        <label
          htmlFor="contract-description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>

        <textarea
          id="contract-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="contract-start-date"
            className="block text-sm font-medium text-gray-700"
          >
            Start date
          </label>

          <input
            id="contract-start-date"
            type="date"
            value={startDate}
            onChange={(event) =>
              setStartDate(event.target.value)
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
          />
        </div>

        <div>
          <label
            htmlFor="contract-end-date"
            className="block text-sm font-medium text-gray-700"
          >
            End date
          </label>

          <input
            id="contract-end-date"
            type="date"
            value={endDate}
            onChange={(event) =>
              setEndDate(event.target.value)
            }
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="contract-signed-date"
          className="block text-sm font-medium text-gray-700"
        >
          Signed date
        </label>

        <input
          id="contract-signed-date"
          type="date"
          value={signedAt}
          onChange={(event) =>
            setSignedAt(event.target.value)
          }
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
        />

        <p className="mt-1 text-xs text-gray-500">
          The API will also automatically set this when a
          contract transitions to SIGNED without a date.
        </p>
      </div>

      <div>
        <label
          htmlFor="contract-notes"
          className="block text-sm font-medium text-gray-700"
        >
          Notes
        </label>

        <textarea
          id="contract-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}