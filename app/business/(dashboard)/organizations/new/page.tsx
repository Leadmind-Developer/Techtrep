import Link from "next/link";

import CreateOrganizationForm from "./CreateOrganizationForm";

export default function NewOrganizationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/business/organizations"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to organizations
        </Link>

        <p className="mt-6 text-sm font-medium text-indigo-600">
          CRM
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Add organization
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a company or organization record in your CRM.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <CreateOrganizationForm />
      </section>
    </div>
  );
}