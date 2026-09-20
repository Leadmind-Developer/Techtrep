"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateOrganizationForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/organizations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          website,
          industry,
          companySize,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data.error === "string"
            ? data.error
            : "Unable to create organization.",
        );
        return;
      }

      router.push(`/business/organizations/${data.organization.id}`);
      router.refresh();
    } catch {
      setError(
        "Something went wrong while creating the organization.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="organization-name"
            className="block text-sm font-medium text-slate-700"
          >
            Organization name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="organization-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={200}
            required
            autoComplete="organization"
            placeholder="e.g. Acme Technologies"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="organization-website"
            className="block text-sm font-medium text-slate-700"
          >
            Website
          </label>

          <input
            id="organization-website"
            name="website"
            type="text"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            maxLength={500}
            autoComplete="url"
            placeholder="https://example.com"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />

          <p className="mt-1.5 text-xs text-slate-500">
            You can enter example.com or the full https:// address.
          </p>
        </div>

        <div>
          <label
            htmlFor="organization-industry"
            className="block text-sm font-medium text-slate-700"
          >
            Industry
          </label>

          <input
            id="organization-industry"
            name="industry"
            type="text"
            value={industry}
            onChange={(event) => setIndustry(event.target.value)}
            maxLength={100}
            placeholder="e.g. Technology"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="organization-company-size"
            className="block text-sm font-medium text-slate-700"
          >
            Company size
          </label>

          <input
            id="organization-company-size"
            name="companySize"
            type="text"
            value={companySize}
            onChange={(event) => setCompanySize(event.target.value)}
            maxLength={100}
            placeholder="e.g. 50–100 employees"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.push("/business/organizations")}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creating..." : "Create organization"}
        </button>
      </div>
    </form>
  );
}