"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type OrganizationOption = {
id: string;
name: string;
};

type CreateGlobalContactFormProps = {
organizations: OrganizationOption[];
};

export default function CreateGlobalContactForm({
organizations,
}: CreateGlobalContactFormProps) {
const router = useRouter();

const [organizationId, setOrganizationId] = useState("");
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [role, setRole] = useState("");

const [error, setError] = useState("");
const [submitting, setSubmitting] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError("");
setSubmitting(true);

try {
  const response = await fetch("/api/contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      organizationId,
      name,
      email,
      phone,
      role,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    setError(
      data?.message ||
        "Unable to create contact. Please try again.",
    );
    return;
  }

  router.push(`/business/contacts/${data.contact.id}`);
  router.refresh();
} catch {
  setError(
    "A network error occurred. Please try again.",
  );
} finally {
  setSubmitting(false);
}

}

return (
<form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" >
<div className="space-y-5">
{error && (
<div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" >
{error}
</div>
)}

    <div>
      <label
        htmlFor="organizationId"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Organization
      </label>

      <select
        id="organizationId"
        name="organizationId"
        value={organizationId}
        onChange={(event) =>
          setOrganizationId(event.target.value)
        }
        required
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      >
        <option value="">
          Select organization
        </option>

        {organizations.map((organization) => (
          <option
            key={organization.id}
            value={organization.id}
          >
            {organization.name}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label
        htmlFor="name"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Full name
      </label>

      <input
        id="name"
        name="name"
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
        maxLength={200}
        placeholder="e.g. Jane Doe"
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div>
      <label
        htmlFor="email"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Email
      </label>

      <input
        id="email"
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        maxLength={320}
        placeholder="jane@example.com"
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <label
          htmlFor="phone"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Phone
        </label>

        <input
          id="phone"
          name="phone"
          type="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          maxLength={50}
          placeholder="+234..."
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="mb-1.5 block text-sm font-medium text-slate-700"
        >
          Role
        </label>

        <input
          id="role"
          name="role"
          type="text"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          maxLength={150}
          placeholder="e.g. CEO"
          className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
      </div>
    </div>

    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={() => router.push("/business/contacts")}
        disabled={submitting}
        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Cancel
      </button>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "Creating..." : "Create contact"}
      </button>
    </div>
  </div>
</form>
);
}