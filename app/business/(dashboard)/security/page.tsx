import { requireUser } from "@/lib/auth/authorization";

import PasswordSecurity from "./PasswordSecurity";

export default async function SecurityPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Password & Security
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Manage your account password and security settings.
        </p>
      </div>

      <PasswordSecurity userEmail={user.email} />
    </div>
  );
}