import Link from "next/link";

import { requireRole } from "@/lib/auth/authorization";
import CreateUserForm from "./CreateUserForm";

export default async function NewUserPage() {
  await requireRole("ADMIN");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Create User
          </h1>

          <p className="mt-1 text-sm text-slate-600">
            Create an internal user account and assign its access role.
          </p>
        </div>

        <Link
          href="/business/admin"
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Users
        </Link>
      </div>

      <CreateUserForm />
    </div>
  );
}