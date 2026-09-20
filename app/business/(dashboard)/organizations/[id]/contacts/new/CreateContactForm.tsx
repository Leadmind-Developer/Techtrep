"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type CreateContactFormProps = {
  organizationId: string;
  organizationName: string;
};

export default function CreateContactForm({
  organizationId,
  organizationName,
}: CreateContactFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

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
          typeof data.error === "string"
            ? data.error
            : "Unable to create contact.",
        );
        return;
      }

      router.push(
        `/business/organizations/${organizationId}`,
      );

      router.refresh();
    } catch {
      setError(
        "Something went wrong while creating the contact.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-lg bg-slate-50 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Organization
        </p>

        <p className="mt-1 text-sm font-medium text-slate-900">
          {organizationName}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label
            htmlFor="contact-name"
            className="block text-sm font-medium text-slate-700"
          >
            Full name
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={200}
            required
            autoComplete="name"
            placeholder="e.g. John Doe"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="contact-email"
            className="block text-sm font-medium text-slate-700"
          >
            Email address
            <span className="ml-1 text-red-500">*</span>
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            maxLength={320}
            required
            autoComplete="email"
            placeholder="john@example.com"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="block text-sm font-medium text-slate-700"
          >
            Phone
          </label>

          <input
            id="contact-phone"
            name="phone"
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            maxLength={50}
            autoComplete="tel"
            placeholder="+234 800 000 0000"
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="contact-role"
            className="block text-sm font-medium text-slate-700"
          >
            Role / position
          </label>

          <input
            id="contact-role"
            name="role"
            type="text"
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            maxLength={150}
            placeholder="e.g. CTO"
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
          onClick={() =>
            router.push(
              `/business/organizations/${organizationId}`,
            )
          }
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
          {isSubmitting
            ? "Creating..."
            : "Create contact"}
        </button>
      </div>
    </form>
  );
}