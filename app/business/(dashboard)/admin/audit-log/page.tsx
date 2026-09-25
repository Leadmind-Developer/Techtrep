import Link from "next/link";

import { requireRole } from "@/lib/auth/authorization";
import { getAdminAuditLogs } from "@/lib/admin/audit-logs";
import type { AuditAction } from "@/generated/prisma/client";
import SecurityAuditLog from "./SecurityAuditLog";

type SearchParams = Promise<{
  search?: string;
  action?: string;
  page?: string;
}>;

const VALID_ACTIONS: AuditAction[] = [
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

export default async function SecurityAuditLogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireRole("ADMIN");

  const params = await searchParams;

  const search = params.search?.trim() ?? "";

  const action = VALID_ACTIONS.includes(
    params.action as AuditAction,
  )
    ? (params.action as AuditAction)
    : undefined;

  const parsedPage = Number(params.page ?? "1");

  const page =
    Number.isInteger(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const data = await getAdminAuditLogs({
    search,
    action,
    page,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Security Audit Log
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Review authentication, account, and administrative
            security events.
          </p>
        </div>

        <Link
          href="/business/admin"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Administration
        </Link>
      </div>

      <SecurityAuditLog
        initialData={{
            ...data,
            logs: data.logs.map((log) => ({
                ...log,
                createdAt: log.createdAt.toISOString(),
            })),
        }}
        initialSearch={search}
        initialAction={action ?? ""}
      />
    </div>
  );
}