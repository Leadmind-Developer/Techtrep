"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "STAFF";

export default function CreateUserForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("STAFF");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (temporaryPassword !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    if (temporaryPassword.length < 12) {
      setError("Temporary password must be at least 12 characters.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          role,
          temporaryPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          typeof result.message === "string"
            ? result.message
            : "Unable to create user.",
        );
        return;
      }

      setSuccess("User created successfully.");

      setName("");
      setEmail("");
      setRole("STAFF");
      setTemporaryPassword("");
      setConfirmPassword("");

      router.refresh();

      setTimeout(() => {
        router.push("/business/admin");
      }, 700);
    } catch {
      setError("Unable to create user. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={120}
            required
            autoComplete="name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Email address
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            maxLength={320}
            required
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="jane@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Role
          </label>

          <select
            id="role"
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
          >
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Admin</option>
          </select>

          <p className="mt-2 text-xs text-slate-500">
            Admin users have access to user administration and other
            administrative functions.
          </p>
        </div>

        <div>
          <label
            htmlFor="temporaryPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Temporary password
          </label>

          <input
            id="temporaryPassword"
            name="temporaryPassword"
            type="password"
            value={temporaryPassword}
            onChange={(event) =>
              setTemporaryPassword(event.target.value)
            }
            minLength={12}
            maxLength={128}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="At least 12 characters"
          />

          <p className="mt-2 text-xs text-slate-500">
            Give the user this temporary password securely. It is never
            stored or returned in plaintext.
          </p>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Confirm temporary password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) =>
              setConfirmPassword(event.target.value)
            }
            minLength={12}
            maxLength={128}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
            placeholder="Re-enter the password"
          />
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.push("/business/admin")}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Creating user..." : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
}