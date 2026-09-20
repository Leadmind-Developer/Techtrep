"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Organization = {
  id: string;
  name: string;
};

type Contact = {
  id: string;
  name: string;
  email: string;
  organizationId: string;
};

type CreateLeadFormProps = {
  organizations: Organization[];
  contacts: Contact[];
};

const SOURCE_OPTIONS = [
  { value: "WEBSITE", label: "Website" },
  { value: "AUDIT", label: "Audit" },
  { value: "REFERRAL", label: "Referral" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "SOCIAL_MEDIA", label: "Social media" },
  { value: "DIRECT", label: "Direct" },
  { value: "OTHER", label: "Other" },
] as const;

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

export default function CreateLeadForm({
  organizations,
  contacts,
}: CreateLeadFormProps) {
  const router = useRouter();

  const [organizationId, setOrganizationId] = useState("");
  const [contactId, setContactId] = useState("");
  const [source, setSource] = useState("WEBSITE");
  const [status, setStatus] = useState("NEW");
  const [estimatedValue, setEstimatedValue] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredContacts = useMemo(() => {
    if (!organizationId) {
      return [];
    }

    return contacts.filter(
      (contact) => contact.organizationId === organizationId,
    );
  }, [contacts, organizationId]);

  function handleOrganizationChange(value: string) {
    setOrganizationId(value);
    setContactId("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!organizationId) {
      setError("Please select an organization.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          organizationId,
          contactId: contactId || null,
          source,
          status,
          estimatedValue: estimatedValue.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ?? "Unable to create the lead.",
        );
        return;
      }

      router.push(`/business/leads/${data.lead.id}`);
      router.refresh();
    } catch {
      setError(
        "Unable to create the lead. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
        >
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="organization"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Organization <span className="text-rose-500">*</span>
          </label>

          <select
            id="organization"
            value={organizationId}
            onChange={(event) =>
              handleOrganizationChange(event.target.value)
            }
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          >
            <option value="">Select organization</option>

            {organizations.map((organization) => (
              <option
                key={organization.id}
                value={organization.id}
              >
                {organization.name}
              </option>
            ))}
          </select>

          {organizations.length === 0 && (
            <p className="mt-2 text-xs text-amber-600">
              No organizations are available yet.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Contact
          </label>

          <select
            id="contact"
            value={contactId}
            onChange={(event) =>
              setContactId(event.target.value)
            }
            disabled={!organizationId || isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
          >
            <option value="">
              {organizationId
                ? "No contact"
                : "Select organization first"}
            </option>

            {filteredContacts.map((contact) => (
              <option key={contact.id} value={contact.id}>
                {contact.name} — {contact.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="source"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Lead source <span className="text-rose-500">*</span>
          </label>

          <select
            id="source"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          >
            {SOURCE_OPTIONS.map((option) => (
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
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Status <span className="text-rose-500">*</span>
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            required
            disabled={isSubmitting}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          >
            {STATUS_OPTIONS.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="estimatedValue"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Estimated value
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
              ₦
            </span>

            <input
              id="estimatedValue"
              type="text"
              inputMode="decimal"
              value={estimatedValue}
              onChange={(event) =>
                setEstimatedValue(event.target.value)
              }
              placeholder="0.00"
              disabled={isSubmitting}
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-8 pr-3 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
            />
          </div>

          <p className="mt-1.5 text-xs text-slate-400">
            Enter the expected value of this lead in Nigerian naira.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="notes"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>

          <textarea
            id="notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            maxLength={5000}
            rows={6}
            placeholder="Add relevant information about this lead..."
            disabled={isSubmitting}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50"
          />

          <p className="mt-1.5 text-right text-xs text-slate-400">
            {notes.length}/5000
          </p>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/business/leads")}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={
            isSubmitting ||
            !organizationId ||
            organizations.length === 0
          }
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating lead..." : "Create lead"}
        </button>
      </div>
    </form>
  );
}