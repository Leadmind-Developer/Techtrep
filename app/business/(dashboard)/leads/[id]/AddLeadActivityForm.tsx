"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AddLeadActivityFormProps = {
  leadId: string;
};

const ACTIVITY_OPTIONS = [
  { value: "NOTE", label: "Note" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE_CALL", label: "Phone call" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "MEETING", label: "Meeting" },
  { value: "AUDIT", label: "Audit" },
  { value: "PROPOSAL", label: "Proposal" },
  { value: "FOLLOW_UP", label: "Follow-up" },
  { value: "OTHER", label: "Other" },
] as const;

export default function AddLeadActivityForm({
  leadId,
}: AddLeadActivityFormProps) {
  const router = useRouter();

  const [type, setType] = useState("NOTE");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    const trimmedDescription = description.trim();

    if (!trimmedDescription) {
      setError("Please enter an activity description.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `/api/leads/${leadId}/activities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type,
            description: trimmedDescription,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to create the activity.",
        );
        return;
      }

      setDescription("");
      setType("NOTE");

      router.replace(`/business/leads/${leadId}`);
      router.refresh();
    } catch {
      setError(
        "Unable to create the activity. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-indigo-100 bg-indigo-50/50 p-5"
    >
      <div>
        <h3 className="text-sm font-semibold text-slate-900">
          Add activity
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Record an interaction, note, follow-up, or other
          activity.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="activity-type"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Activity type
        </label>

        <select
          id="activity-type"
          value={type}
          onChange={(event) => setType(event.target.value)}
          disabled={isSubmitting}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
        >
          {ACTIVITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="activity-description"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Description
        </label>

        <textarea
          id="activity-description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          maxLength={5000}
          rows={4}
          placeholder="Describe what happened..."
          disabled={isSubmitting}
          className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
        />

        <p className="mt-1.5 text-right text-xs text-slate-400">
          {description.length}/5000
        </p>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={
            isSubmitting || !description.trim()
          }
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Adding activity..."
            : "Add activity"}
        </button>
      </div>
    </form>
  );
}