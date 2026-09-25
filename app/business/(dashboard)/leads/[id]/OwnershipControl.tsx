"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OwnershipUser = {
  id: string;
  name: string | null;
  email: string;
};

type OwnershipControlProps = {
  leadId: string;
  createdByUser: OwnershipUser | null;
  assignedToUser: OwnershipUser | null;
  activeUsers: OwnershipUser[];
  canManage: boolean;
};

function getUserLabel(user: OwnershipUser | null): string {
  if (!user) {
    return "Not assigned";
  }

  return user.name?.trim() || user.email;
}

export default function OwnershipControl({
  leadId,
  createdByUser,
  assignedToUser,
  activeUsers,
  canManage,
}: OwnershipControlProps) {
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState(
    assignedToUser?.id ?? "",
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const hasChanged =
    selectedUserId !== (assignedToUser?.id ?? "");

  async function handleSave() {
    if (!canManage || !hasChanged || isSaving) {
      return;
    }

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/admin/leads/${leadId}/assignment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            assignedToUserId: selectedUserId || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
            "Unable to update lead ownership.",
        );

        return;
      }

      setSuccess("Lead ownership updated.");

      router.refresh();
    } catch {
      setError(
        "Unable to update lead ownership. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Ownership
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Track who created and who currently owns this
          lead.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Created by
          </p>

          <div className="mt-2">
            <p className="text-sm font-medium text-slate-900">
              {getUserLabel(createdByUser)}
            </p>

            {createdByUser?.name && (
              <p className="mt-0.5 text-xs text-slate-500">
                {createdByUser.email}
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-4">
          <label
            htmlFor="lead-owner"
            className="block text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            Assigned to
          </label>

          {canManage ? (
            <>
              <select
                id="lead-owner"
                value={selectedUserId}
                onChange={(event) => {
                  setSelectedUserId(event.target.value);
                  setError("");
                  setSuccess("");
                }}
                disabled={isSaving}
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-400"
              >
                <option value="" disabled>
                  Select a staff member
                </option>

                {activeUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name?.trim() || user.email}
                  </option>
                ))}
              </select>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Only active staff members can be assigned.
                </p>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!hasChanged || isSaving}
                  className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2">
              <p className="text-sm font-medium text-slate-900">
                {getUserLabel(assignedToUser)}
              </p>

              {assignedToUser?.name && (
                <p className="mt-0.5 text-xs text-slate-500">
                  {assignedToUser.email}
                </p>
              )}

              <p className="mt-2 text-xs text-slate-400">
                Ownership can only be changed by an administrator.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2.5 text-xs text-rose-700"
          >
            {error}
          </div>
        )}

        {success && (
          <div
            role="status"
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700"
          >
            {success}
          </div>
        )}
      </div>
    </section>
  );
}