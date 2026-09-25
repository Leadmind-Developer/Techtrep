import Link from "next/link";
import { notFound } from "next/navigation";

import { getOrganizationById } from "@/lib/organizations";

import CreateContactForm from "./CreateContactForm";

type NewContactPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewContactPage({
  params,
}: NewContactPageProps) {
  const { id } = await params;

  const organization = await getOrganizationById(id);

  if (!organization) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link
          href={`/business/organizations/${organization.id}`}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to {organization.name}
        </Link>

        <p className="mt-6 text-sm font-medium text-indigo-600">
          CRM
        </p>

        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Add contact
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Add a person associated with this organization.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <CreateContactForm
          organizationId={organization.id}
          organizationName={organization.name}
        />
      </section>
    </div>
  );
}