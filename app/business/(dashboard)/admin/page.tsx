import Link from "next/link";

import { requireRole } from "@/lib/auth/authorization";
import { getAdminUsers } from "@/lib/admin/users";

import AdminUserManagement from "./AdminUserManagement";

type SearchParams = Promise<{
  search?: string;
  role?: string;
  active?: string;
  page?: string;
}>;

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireRole("ADMIN");

  const params = await searchParams;

  const role =
    params.role === "ADMIN" || params.role === "STAFF"
      ? params.role
      : undefined;

  const active =
    params.active === "true"
      ? true
      : params.active === "false"
        ? false
        : undefined;

  const page = Number(params.page ?? "1");

  const result = await getAdminUsers({
    search: params.search,
    role,
    active,
    page:
      Number.isInteger(page) && page > 0
        ? page
        : 1,
  });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/business"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Dashboard
        </Link>

        <div className="mt-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Administration
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage internal users, roles, and account access.
          </p>
        </div>
      </div>

      <AdminUserManagement
        users={result.users}
        total={result.total}
        page={result.page}
        totalPages={result.totalPages}
        search={params.search ?? ""}
        role={role ?? ""}
        active={
          typeof active === "boolean"
            ? String(active)
            : ""
        }
      />
    </div>
  );
}