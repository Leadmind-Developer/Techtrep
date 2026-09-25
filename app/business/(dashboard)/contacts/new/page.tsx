import Link from "next/link";

import { getContactFormOptions } from "@/lib/contacts";

import CreateGlobalContactForm from "./CreateGlobalContactForm";

export default async function NewContactPage() {
  const organizations = await getContactFormOptions();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/business/contacts"
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Back to contacts
        </Link>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Add contact
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a contact and associate them with an organization.
        </p>
      </div>

      {organizations.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">
            Create an organization first
          </h2>

          <p className="mt-1 text-sm text-amber-800">
            A contact must belong to an organization before it
            can be created.
          </p>

          <Link
            href="/business/organizations/new"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Add organization
          </Link>
        </div>
      ) : (
        <CreateGlobalContactForm organizations={organizations} />
      )}
    </div>
  );
}