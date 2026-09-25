"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ContactData = {
id: string;
organizationId: string;
name: string;
email: string;
phone: string | null;
role: string | null;
};

type EditContactFormProps = {
contact: ContactData;
};

export default function EditContactForm({
contact,
}: EditContactFormProps) {
const router = useRouter();

const [name, setName] = useState(contact.name);
const [email, setEmail] = useState(contact.email);
const [phone, setPhone] = useState(contact.phone ?? "");
const [role, setRole] = useState(contact.role ?? "");

const [error, setError] = useState("");
const [success, setSuccess] = useState("");
const [saving, setSaving] = useState(false);

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();

setError("");
setSuccess("");
setSaving(true);

try {
  const response = await fetch(
    `/api/contacts/${contact.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        organizationId: contact.organizationId,
        name,
        email,
        phone,
        role,
      }),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    setError(
      data?.message ||
        "Unable to update contact. Please try again.",
    );
    return;
  }

  setSuccess("Contact updated successfully.");

  router.refresh();
} catch {
  setError(
    "A network error occurred. Please try again.",
  );
} finally {
  setSaving(false);
}

}

return ( <section className="rounded-xl border border-slate-200 bg-white shadow-sm"> <div className="border-b border-slate-200 px-5 py-4 sm:px-6"> <h2 className="text-base font-semibold text-slate-900">
Edit contact </h2>

    <p className="mt-0.5 text-xs text-slate-500">
      Update the contact's information.
    </p>
  </div>

  <form
    onSubmit={handleSubmit}
    className="space-y-5 p-5 sm:p-6"
  >
    {error && (
      <div
        role="alert"
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
      >
        {error}
      </div>
    )}

    {success && (
      <div
        role="status"
        className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
      >
        {success}
      </div>
    )}

    <div>
      <label
        htmlFor="contact-name"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Full name
      </label>

      <input
        id="contact-name"
        type="text"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        maxLength={200}
        required
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div>
      <label
        htmlFor="contact-email"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Email
      </label>

      <input
        id="contact-email"
        type="email"
        value={email}
        onChange={(event) =>
          setEmail(event.target.value)
        }
        maxLength={320}
        required
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div>
      <label
        htmlFor="contact-phone"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Phone
      </label>

      <input
        id="contact-phone"
        type="tel"
        value={phone}
        onChange={(event) =>
          setPhone(event.target.value)
        }
        maxLength={50}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div>
      <label
        htmlFor="contact-role"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Role
      </label>

      <input
        id="contact-role"
        type="text"
        value={role}
        onChange={(event) =>
          setRole(event.target.value)
        }
        maxLength={150}
        placeholder="e.g. CEO"
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
      />
    </div>

    <div className="border-t border-slate-100 pt-5">
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </div>
  </form>
</section>

);
}