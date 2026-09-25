"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STAFF";
  active: boolean;
  lastLoginAt: Date | string | null;
  createdAt: Date | string;
};

type Props = {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
  search: string;
  role: string;
  active: string;
};

function formatDate(value: Date | string | null) {
  if (!value) {
    return "Never";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function AdminUserManagement({
  users,
  total,
  page,
  totalPages,
  search,
  role,
  active,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loadingId, setLoadingId] = useState<string | null>(
    null,
  );

  const [resetUserId, setResetUserId] = useState<
    string | null
  >(null);

  const [resetUserName, setResetUserName] =
    useState("");

  const [temporaryPassword, setTemporaryPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [resetLoading, setResetLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [resetError, setResetError] = useState("");

  const [resetSuccess, setResetSuccess] =
    useState("");

  function updateFilters(
    key: string,
    value: string,
  ) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(
      `/business/admin?${params.toString()}`,
    );
  }

  function changePage(nextPage: number) {
    const params = new URLSearchParams(
      searchParams.toString(),
    );

    if (nextPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nextPage));
    }

    router.push(
      `/business/admin?${params.toString()}`,
    );
  }

  async function updateUser(
    userId: string,
    data: {
      role?: "ADMIN" | "STAFF";
      active?: boolean;
    },
  ) {
    setLoadingId(userId);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/users/${userId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update user.",
        );
      }

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update user.",
      );
    } finally {
      setLoadingId(null);
    }
  }

  function openResetPassword(user: AdminUser) {
    setResetUserId(user.id);
    setResetUserName(
      user.name || user.email,
    );
    setTemporaryPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetSuccess("");
  }

  function closeResetPassword() {
    if (resetLoading) {
      return;
    }

    setResetUserId(null);
    setResetUserName("");
    setTemporaryPassword("");
    setConfirmPassword("");
    setResetError("");
    setResetSuccess("");
  }

  async function resetPassword() {
    setResetError("");
    setResetSuccess("");

    if (!resetUserId) {
      return;
    }

    if (temporaryPassword.length < 12) {
      setResetError(
        "Temporary password must be at least 12 characters.",
      );
      return;
    }

    if (temporaryPassword.length > 128) {
      setResetError(
        "Temporary password cannot exceed 128 characters.",
      );
      return;
    }

    if (temporaryPassword !== confirmPassword) {
      setResetError(
        "Temporary passwords do not match.",
      );
      return;
    }

    setResetLoading(true);

    try {
      const response = await fetch(
        `/api/admin/users/${resetUserId}/password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            temporaryPassword,
            confirmPassword,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to reset password.",
        );
      }

      setTemporaryPassword("");
      setConfirmPassword("");

      setResetSuccess(
        "Password reset successfully. The user must sign in again.",
      );
    } catch (err) {
      setResetError(
        err instanceof Error
          ? err.message
          : "Unable to reset password.",
      );
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            type="search"
            defaultValue={search}
            placeholder="Search name or email..."
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateFilters(
                  "search",
                  event.currentTarget.value.trim(),
                );
              }
            }}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          />

          <select
            value={role}
            onChange={(event) =>
              updateFilters(
                "role",
                event.target.value,
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
          </select>

          <select
            value={active}
            onChange={(event) =>
              updateFilters(
                "active",
                event.target.value,
              )
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="flex items-center justify-end text-sm text-slate-500">
            {total}{" "}
            {total === 1 ? "user" : "users"}
          </div>
        </div>
      </div>

      <Link
        href="/business/admin/users/new"
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
      >
        Create User
      </Link>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-700">
                  User
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-700">
                  Role
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-5 py-3 text-left font-semibold text-slate-700">
                  Last login
                </th>

                <th className="px-5 py-3 text-right font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">
                      {user.name || "Unnamed user"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {user.email}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <select
                      value={user.role}
                      disabled={
                        loadingId === user.id ||
                        resetLoading
                      }
                      onChange={(event) =>
                        updateUser(user.id, {
                          role: event.target
                            .value as
                            | "ADMIN"
                            | "STAFF",
                        })
                      }
                      className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs"
                    >
                      <option value="ADMIN">
                        ADMIN
                      </option>

                      <option value="STAFF">
                        STAFF
                      </option>
                    </select>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        user.active
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {user.active
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {formatDate(
                      user.lastLoginAt,
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-4">
                      {user.active && (
                        <button
                          type="button"
                          disabled={
                            loadingId === user.id ||
                            resetLoading
                          }
                          onClick={() =>
                            openResetPassword(user)
                          }
                          className="text-sm font-medium text-slate-700 hover:text-slate-950 disabled:opacity-50"
                        >
                          Reset password
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={
                          loadingId === user.id ||
                          resetLoading
                        }
                        onClick={() =>
                          updateUser(user.id, {
                            active: !user.active,
                          })
                        }
                        className="text-sm font-medium text-slate-700 hover:text-slate-950 disabled:opacity-50"
                      >
                        {loadingId === user.id
                          ? "Saving..."
                          : user.active
                            ? "Disable"
                            : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-200 md:hidden">
          {users.map((user) => (
            <div
              key={user.id}
              className="space-y-4 p-4"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {user.name || "Unnamed user"}
                </p>

                <p className="text-sm text-slate-500">
                  {user.email}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-medium text-slate-500">
                  Role

                  <select
                    value={user.role}
                    disabled={
                      loadingId === user.id ||
                      resetLoading
                    }
                    onChange={(event) =>
                      updateUser(user.id, {
                        role: event.target
                          .value as
                          | "ADMIN"
                          | "STAFF",
                      })
                    }
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-2 py-2 text-sm text-slate-900"
                  >
                    <option value="ADMIN">
                      ADMIN
                    </option>

                    <option value="STAFF">
                      STAFF
                    </option>
                  </select>
                </label>

                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Status
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      user.active
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {user.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Last login:{" "}
                {formatDate(user.lastLoginAt)}
              </p>

              <div className="flex items-center justify-end gap-4">
                {user.active && (
                  <button
                    type="button"
                    disabled={resetLoading}
                    onClick={() =>
                      openResetPassword(user)
                    }
                    className="text-sm font-medium text-slate-700 disabled:opacity-50"
                  >
                    Reset password
                  </button>
                )}

                <button
                  type="button"
                  disabled={
                    loadingId === user.id ||
                    resetLoading
                  }
                  onClick={() =>
                    updateUser(user.id, {
                      active: !user.active,
                    })
                  }
                  className="text-sm font-medium text-slate-700 disabled:opacity-50"
                >
                  {loadingId === user.id
                    ? "Saving..."
                    : user.active
                      ? "Disable"
                      : "Enable"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="px-6 py-12 text-center">
            <p className="font-medium text-slate-900">
              No users found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try adjusting your filters.
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() =>
                changePage(page - 1)
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() =>
                changePage(page + 1)
              }
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {resetUserId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-password-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-6">
              <h2
                id="reset-password-title"
                className="text-lg font-semibold text-slate-900"
              >
                Reset user password
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Set a temporary password for{" "}
                <span className="font-medium text-slate-700">
                  {resetUserName}
                </span>
                .
              </p>
            </div>

            {resetSuccess && (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {resetSuccess}
              </div>
            )}

            {resetError && (
              <div
                role="alert"
                className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              >
                {resetError}
              </div>
            )}

            {!resetSuccess && (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="temporaryPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Temporary password
                  </label>

                  <input
                    id="temporaryPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    value={temporaryPassword}
                    onChange={(event) =>
                      setTemporaryPassword(
                        event.target.value,
                      )
                    }
                    disabled={resetLoading}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmTemporaryPassword"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Confirm temporary password
                  </label>

                  <input
                    id="confirmTemporaryPassword"
                    type="password"
                    autoComplete="new-password"
                    minLength={12}
                    maxLength={128}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    disabled={resetLoading}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
                  />
                </div>

                <p className="text-xs leading-5 text-slate-500">
                  The user's existing sessions will be
                  invalidated. They will need to sign in
                  again using this temporary password.
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeResetPassword}
                disabled={resetLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resetSuccess ? "Close" : "Cancel"}
              </button>

              {!resetSuccess && (
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={resetLoading}
                  className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {resetLoading
                    ? "Resetting..."
                    : "Reset password"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}