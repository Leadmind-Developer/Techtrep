import { requireUser } from "@/lib/auth/authorization";
import LogoutButton from "./LogoutButton";

export default async function BusinessDashboardPage() {
  const user = await requireUser();

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Techtrep Business
            </p>

            <h1 className="text-xl font-semibold text-slate-900">
              Business Dashboard
            </h1>
          </div>

            <LogoutButton />
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">
            Signed in as
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            {user.name ?? user.email}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 text-sm text-slate-900">
                {user.email}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Role
              </p>

              <p className="mt-2 text-sm font-medium text-slate-900">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}