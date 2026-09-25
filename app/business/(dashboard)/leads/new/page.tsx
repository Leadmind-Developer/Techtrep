import Link from "next/link";

import { getLeadFormOptions } from "@/lib/leads";

import CreateLeadForm from "./CreateLeadForm";

export default async function NewLeadPage() {
  const { organizations, contacts } =
    await getLeadFormOptions();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href="/business/leads"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to leads
        </Link>

        <div className="mt-4">
          <p className="text-sm font-medium text-indigo-600">
            CRM
          </p>

          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Add lead
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Create a new prospect and add it to your sales pipeline.
          </p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <CreateLeadForm
          organizations={organizations}
          contacts={contacts}
        />
      </section>
    </div>
  );
}