"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OrganizationOption = {
  id: string;
  name: string;
};

type LeadOption = {
  id: string;
  organizationId: string;
  status: string;
  source: string;
  organization: {
    name: string;
  };
  contact: {
    name: string;
  } | null;
};

type AuditRequestOption = {
  id: string;
  organizationId: string;
  status: string;
  createdAt: Date;
  organization: {
    name: string;
  };
  contact: {
    name: string;
  };
};

type Props = {
  organizations: OrganizationOption[];
  leads: LeadOption[];
  auditRequests: AuditRequestOption[];
};

const ACTIVITY_TYPES = [
  ["NOTE", "Note"],
  ["EMAIL", "Email"],
  ["PHONE_CALL", "Phone Call"],
  ["WHATSAPP", "WhatsApp"],
  ["MEETING", "Meeting"],
  ["AUDIT", "Audit"],
  ["PROPOSAL", "Proposal"],
  ["FOLLOW_UP", "Follow-up"],
  ["STATUS_CHANGE", "Status Change"],
  ["OTHER", "Other"],
] as const;

export default function CreateActivityForm({
  organizations,
  leads,
  auditRequests,
}: Props) {
  const router = useRouter();

  const [organizationId, setOrganizationId] =
    useState("");

  const [type, setType] =
    useState("NOTE");

  const [leadId, setLeadId] =
    useState("");

  const [auditRequestId, setAuditRequestId] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [error, setError] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const filteredLeads = useMemo(
    () =>
      organizationId
        ? leads.filter(
            (lead) =>
              lead.organizationId ===
              organizationId,
          )
        : [],
    [leads, organizationId],
  );

  const filteredAudits = useMemo(
    () =>
      organizationId
        ? auditRequests.filter(
            (audit) =>
              audit.organizationId ===
              organizationId,
          )
        : [],
    [auditRequests, organizationId],
  );

  function handleOrganizationChange(
    value: string,
  ) {
    setOrganizationId(value);
    setLeadId("");
    setAuditRequestId("");
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

    if (!description.trim()) {
      setError("Please enter an activity description.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/activities",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            organizationId,
            leadId: leadId || null,
            auditRequestId:
              auditRequestId || null,
            type,
            description:
              description.trim(),
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ??
            "Unable to create activity.",
        );
        return;
      }

      router.push(
        `/business/activities/${result.activity.id}`,
      );

      router.refresh();
    } catch {
      setError(
        "Unable to create activity. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="organizationId"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Organization
        </label>

        <select
          id="organizationId"
          value={organizationId}
          onChange={(event) =>
            handleOrganizationChange(
              event.target.value,
            )
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          required
        >
          <option value="">
            Select organization
          </option>

          {organizations.map((organization) => (
            <option
              key={organization.id}
              value={organization.id}
            >
              {organization.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="type"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Activity Type
        </label>

        <select
          id="type"
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          {ACTIVITY_TYPES.map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            ),
          )}
        </select>
      </div>

      <div>
        <label
          htmlFor="leadId"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Related Lead
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        </label>

        <select
          id="leadId"
          value={leadId}
          onChange={(event) =>
            setLeadId(event.target.value)
          }
          disabled={!organizationId}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">
            No related lead
          </option>

          {filteredLeads.map((lead) => (
            <option
              key={lead.id}
              value={lead.id}
            >
              {lead.contact?.name ??
                "Lead"}{" "}
              — {lead.organization.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="auditRequestId"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Related Audit Request
          <span className="ml-1 font-normal text-slate-400">
            (optional)
          </span>
        </label>

        <select
          id="auditRequestId"
          value={auditRequestId}
          onChange={(event) =>
            setAuditRequestId(
              event.target.value,
            )
          }
          disabled={!organizationId}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none disabled:bg-slate-100 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        >
          <option value="">
            No related audit
          </option>

          {filteredAudits.map((audit) => (
            <option
              key={audit.id}
              value={audit.id}
            >
              {audit.contact.name} —{" "}
              {audit.organization.name} —{" "}
              {audit.status}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-sm font-medium text-slate-700"
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
          rows={7}
          maxLength={5000}
          placeholder="Describe what happened, what was discussed, or what needs to happen next..."
          className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          required
        />

        <p className="mt-1 text-right text-xs text-slate-400">
          {description.length}/5000
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push(
              "/business/activities",
            )
          }
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Creating..."
            : "Create Activity"}
        </button>
      </div>
    </form>
  );
}