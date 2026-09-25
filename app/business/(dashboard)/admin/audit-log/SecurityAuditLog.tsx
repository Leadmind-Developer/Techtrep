"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "SESSION_EXPIRED"
  | "DISABLED_ACCOUNT"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_DISABLED"
  | "USER_ENABLED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_RESET";

type AuditLogUser = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "STAFF";
};

type AuditLog = {
  id: string;
  action: AuditAction;
  requestId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: unknown;
  createdAt: string;
  user: AuditLogUser | null;
};

type AuditData = {
  logs: AuditLog[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
};

type Props = {
  initialData: AuditData;
  initialSearch: string;
  initialAction: string;
};

const ACTIONS: AuditAction[] = [
  "LOGIN_SUCCESS",
  "LOGIN_FAILED",
  "LOGOUT",
  "SESSION_EXPIRED",
  "DISABLED_ACCOUNT",
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DISABLED",
  "USER_ENABLED",
  "PASSWORD_CHANGED",
  "PASSWORD_RESET",
];

function formatAction(action: AuditAction): string {
  return action
    .split("_")
    .map(
      (word) =>
        word.charAt(0) + word.slice(1).toLowerCase(),
    )
    .join(" ");
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getMetadataSummary(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") {
    return "—";
  }

  const data = metadata as Record<string, unknown>;

  const parts: string[] = [];

  if (
    typeof data.targetUserId === "string"
  ) {
    parts.push(
      `Target: ${data.targetUserId}`,
    );
  }

  if (
    typeof data.targetEmail === "string"
  ) {
    parts.push(
      `Email: ${data.targetEmail}`,
    );
  }

  if (
    typeof data.role === "string"
  ) {
    parts.push(
      `Role: ${data.role}`,
    );
  }

  if (
    data.changes &&
    typeof data.changes === "object"
  ) {
    parts.push("Changes recorded");
  }

  return parts.length > 0
    ? parts.join(" • ")
    : "Security event";
}

export default function SecurityAuditLog({
  initialData,
  initialSearch,
  initialAction,
}: Props) {
  const router = useRouter();

  const [search, setSearch] =
    useState(initialSearch);

  const [action, setAction] =
    useState(initialAction);

  function applyFilters() {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (action) {
      params.set("action", action);
    }

    router.push(
      `/business/admin/audit-log${
        params.toString()
          ? `?${params.toString()}`
          : ""
      }`,
    );
  }

  function clearFilters() {
    setSearch("");
    setAction("");
    router.push("/business/admin/audit-log");
  }

  const previousPage =
    initialData.page > 1
      ? initialData.page - 1
      : null;

  const nextPage =
    initialData.page < initialData.totalPages
      ? initialData.page + 1
      : null;

  function pageHref(page: number): string {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (action) {
      params.set("action", action);
    }

    params.set("page", String(page));

    return `/business/admin/audit-log?${params.toString()}`;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                applyFilters();
              }
            }}
            placeholder="Search user, email, IP, or request ID"
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          />

          <select
            value={action}
            onChange={(event) =>
              setAction(event.target.value)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="">
              All security events
            </option>

            {ACTIONS.map((item) => (
              <option key={item} value={item}>
                {formatAction(item)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={applyFilters}
            className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Filter
          </button>

          {(search || action) && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {initialData.total} security event
          {initialData.total === 1 ? "" : "s"}
        </p>

        <p className="text-sm text-slate-500">
          Page {initialData.page} of{" "}
          {initialData.totalPages}
        </p>
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Event
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  User
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  IP
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Details
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {initialData.logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-4 py-4 align-top">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatAction(log.action)}
                    </p>

                    {log.requestId && (
                      <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                        Request: {log.requestId}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top">
                    {log.user ? (
                      <>
                        <p className="text-sm font-medium text-slate-900">
                          {log.user.name ||
                            "Unnamed user"}
                        </p>

                        <p className="text-xs text-slate-500">
                          {log.user.email}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">
                        System / unavailable
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 align-top">
                    <span className="font-mono text-xs text-slate-600">
                      {log.ipAddress || "—"}
                    </span>
                  </td>

                  <td className="max-w-sm px-4 py-4 align-top">
                    <p className="text-xs leading-5 text-slate-600">
                      {getMetadataSummary(
                        log.metadata,
                      )}
                    </p>

                    {log.userAgent && (
                      <p className="mt-1 truncate text-xs text-slate-400">
                        {log.userAgent}
                      </p>
                    )}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-600">
                    {formatDate(log.createdAt)}
                  </td>
                </tr>
              ))}

              {initialData.logs.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-sm text-slate-500"
                  >
                    No security events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {initialData.logs.map((log) => (
          <div
            key={log.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {formatAction(log.action)}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatDate(log.createdAt)}
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {log.user?.role ?? "System"}
              </span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="text-slate-500">
                  User:{" "}
                </span>

                <span className="font-medium text-slate-800">
                  {log.user?.email ??
                    "System / unavailable"}
                </span>
              </div>

              <div>
                <span className="text-slate-500">
                  IP:{" "}
                </span>

                <span className="font-mono text-xs text-slate-700">
                  {log.ipAddress || "—"}
                </span>
              </div>

              <div>
                <span className="text-slate-500">
                  Details:{" "}
                </span>

                <span className="text-slate-700">
                  {getMetadataSummary(
                    log.metadata,
                  )}
                </span>
              </div>

              {log.requestId && (
                <div>
                  <span className="text-slate-500">
                    Request:{" "}
                  </span>

                  <span className="font-mono text-xs text-slate-700">
                    {log.requestId}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {initialData.logs.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-12 text-center text-sm text-slate-500">
            No security events found.
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 pt-4">
        {previousPage ? (
          <Link
            href={pageHref(previousPage)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Previous
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">
            Previous
          </span>
        )}

        {nextPage ? (
          <Link
            href={pageHref(nextPage)}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Next
          </Link>
        ) : (
          <span className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-400">
            Next
          </span>
        )}
      </div>
    </div>
  );
}