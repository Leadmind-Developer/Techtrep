
import Link from "next/link";

import {
  getActivityFormOptions,
} from "@/lib/activities";

import CreateActivityForm from "./CreateActivityForm";

export default async function NewActivityPage() {
  const {
    organizations,
    leads,
    auditRequests,
  } = await getActivityFormOptions();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Link
          href="/business/activities"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Activities
        </Link>

        <h1 className="mt-3 text-2xl font-semibold text-slate-900">
          New Activity
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Record a note, call, meeting, audit, proposal,
          follow-up, or other CRM activity.
        </p>
      </div>

      <CreateActivityForm
        organizations={organizations}
        leads={leads}
        auditRequests={auditRequests}
      />
    </div>
  );
}