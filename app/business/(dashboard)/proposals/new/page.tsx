import Link from "next/link";

import { getProposalFormOptions } from "@/lib/proposals";

import CreateProposalForm from "./CreateProposalForm";

export default async function NewProposalPage() {
  const opportunities = await getProposalFormOptions();

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/business/proposals"
            className="text-sm text-slate-500 hover:text-slate-900"
          >
            Proposals
          </Link>

          <span className="text-slate-300">/</span>

          <span className="text-sm text-slate-500">
            New proposal
          </span>
        </div>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
          Create Proposal
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a commercial proposal for an identified business
          opportunity.
        </p>
      </div>

      <CreateProposalForm opportunities={opportunities} />
    </div>
  );
}