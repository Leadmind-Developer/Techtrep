import Link from "next/link";

import { getOpportunityFormOptions } from "@/lib/opportunities";

import CreateOpportunityForm from "./CreateOpportunityForm";

export default async function NewOpportunityPage() {
  const auditRequests = await getOpportunityFormOptions();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/business/opportunities"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Opportunities
          </Link>

          <span className="text-slate-300">/</span>

          <span className="text-sm text-slate-500">
            New opportunity
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Create Opportunity
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Record a business opportunity identified from an audit request.
        </p>
      </div>

      <CreateOpportunityForm auditRequests={auditRequests} />
    </div>
  );
}