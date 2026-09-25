"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserSummary = {
  id: string;
  name: string | null;
  email: string;
  active?: boolean;
};

type Props = {
  opportunityId: string;
  createdByUser: UserSummary | null;
  assignedToUser: UserSummary | null;
  activeUsers: UserSummary[];
  canManage: boolean;
};

function getUserLabel(user: UserSummary | null) {
  if (!user) {
    return "Not assigned";
  }

  return user.name
    ? `${user.name} (${user.email})`
    : user.email;
}

export default function OwnershipControl({
  opportunityId,
  createdByUser,
  assignedToUser,
  activeUsers,
  canManage,
}: Props) {
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] =
    useState(assignedToUser?.id ?? "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSave() {
    setError("");
    setSuccess("");

    if (!selectedUserId) {
      setError("Please select a staff member.");
      return;
    }

    if (selectedUserId === assignedToUser?.id) {
      setSuccess("No ownership change was required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `/api/admin/opportunities/${opportunityId}/assignment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            assignedToUserId: selectedUserId,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setError(
          result.message ||
            "Unable to update opportunity ownership.",
        );
        return;
      }

      setSuccess("Opportunity ownership updated.");

      router.refresh();
    } catch {
      setError(
        "Unable to update opportunity ownership. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Ownership
        </h2>

        <p className="mt-0.5 text-xs text-slate-500">
          Track who created and currently owns this opportunity.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Created by
          </p>

          <p className="mt-1 text-sm font-medium text-slate-700">
            {getUserLabel(createdByUser)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Assigned to
          </p>

          {canManage ? (
            <div className="mt-2 space-y-3">
              <select
                value={selectedUserId}
                onChange={(event) =>
                  setSelectedUserId(event.target.value)
                }
                disabled={saving}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="" disabled>
                  Select a staff member
                </option>

                {activeUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name
                      ? `${user.name} — ${user.email}`
                      : user.email}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleSave}
                disabled={
                  saving ||
                  !selectedUserId ||
                  selectedUserId === assignedToUser?.id
                }
                className="w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Update Ownership"}
              </button>
            </div>
          ) : (
            <p className="mt-1 text-sm font-medium text-slate-700">
              {getUserLabel(assignedToUser)}
            </p>
          )}
        </div>

        {!canManage && (
          <p className="text-xs leading-5 text-slate-500">
            Ownership can only be changed by an administrator.
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
            {success}
          </div>
        )}
      </div>
    </section>
  );
}