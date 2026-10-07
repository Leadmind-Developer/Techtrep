"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ManagedService = {
  id: string;
  serviceNumber: string;
  name: string;
  status: string;
  type: string;
  organization: {
    id: string;
    name: string;
  };
};

type ManagedServicesResponse = {
  success?: boolean;
  services?: ManagedService[];
};

type UserOption = {
  id: string;
  name: string | null;
  email: string;
  active?: boolean;
};

type UsersResponse = {
  users?: UserOption[];
};

const priorities = [
  "LOW",
  "NORMAL",
  "HIGH",
  "URGENT",
] as const;

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c]";

export default function NewServiceRequestPage() {
  const router = useRouter();

  const [services, setServices] = useState<
    ManagedService[]
  >([]);
  const [users, setUsers] = useState<UserOption[]>(
    [],
  );

  const [loadingServices, setLoadingServices] =
    useState(true);
  const [loadingUsers, setLoadingUsers] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    managedServiceId: "",
    title: "",
    description: "",
    priority: "NORMAL",
    assignedToId: "",
    notes: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        setLoadingServices(true);
        setLoadingUsers(true);

        const [
          servicesResponse,
          usersResponse,
        ] = await Promise.all([
          fetch("/api/managed-services"),
          fetch("/api/users"),
        ]);

        const servicesPayload: ManagedServicesResponse =
          await servicesResponse.json();

        const usersPayload: UsersResponse =
          await usersResponse.json();

        if (!servicesResponse.ok) {
          throw new Error(
            "Unable to load managed services.",
          );
        }

        if (!usersResponse.ok) {
          throw new Error(
            "Unable to load service managers.",
          );
        }

        setServices(
          (servicesPayload.services ?? []).filter(
            (service) =>
              service.status === "ACTIVE",
          ),
        );

        setUsers(usersPayload.users ?? []);
      } catch (requestError) {
        console.error(
          "Failed to load service request form data",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load form data.",
        );
      } finally {
        setLoadingServices(false);
        setLoadingUsers(false);
      }
    }

    void loadData();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.managedServiceId) {
      setError(
        "Please select a managed service.",
      );
      return;
    }

    if (!form.title.trim()) {
      setError("Please enter a request title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        "/api/service-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            managedServiceId:
              form.managedServiceId,
            title: form.title.trim(),
            description:
              form.description.trim() || null,
            priority: form.priority,
            assignedToId:
              form.assignedToId || null,
            notes:
              form.notes.trim() || null,
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Unable to create service request.",
        );
      }

      router.push(
        `/business/service-requests/${payload.request.id}`,
      );
    } catch (requestError) {
      console.error(
        "Failed to create service request",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create service request.",
      );
    } finally {
      setSaving(false);
    }
  }

  const selectedService =
    services.find(
      (service) =>
        service.id === form.managedServiceId,
    );

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link
          href="/business/service-requests"
          className="text-sm font-medium text-[#39358c] hover:underline"
        >
          ← Back to Service Requests
        </Link>

        <h1 className="mt-4 text-2xl font-semibold text-slate-900">
          New Service Request
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Create a support request against an active
          managed service.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
      >
        <div>
          <label
            htmlFor="managed-service"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Managed Service
          </label>

          <select
            id="managed-service"
            value={form.managedServiceId}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                managedServiceId:
                  event.target.value,
              }))
            }
            disabled={loadingServices}
            className={inputClassName}
          >
            <option value="">
              {loadingServices
                ? "Loading managed services..."
                : "Select managed service"}
            </option>

            {services.map((service) => (
              <option
                key={service.id}
                value={service.id}
              >
                {service.serviceNumber} —{" "}
                {service.name} —{" "}
                {service.organization.name}
              </option>
            ))}
          </select>

          {selectedService && (
            <p className="mt-1.5 text-xs text-slate-500">
              Organization:{" "}
              {selectedService.organization.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="title"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Request Title
          </label>

          <input
            id="title"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            placeholder="e.g. Website contact form not sending emails"
            className={inputClassName}
            maxLength={200}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>

          <textarea
            id="description"
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description:
                  event.target.value,
              }))
            }
            rows={6}
            placeholder="Describe the issue, request or support needed..."
            className={inputClassName}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="priority"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Priority
            </label>

            <select
              id="priority"
              value={form.priority}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  priority: event.target.value,
                }))
              }
              className={inputClassName}
            >
              {priorities.map((priority) => (
                <option
                  key={priority}
                  value={priority}
                >
                  {priority.charAt(0) +
                    priority
                      .slice(1)
                      .toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="assigned-to"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Assign To
            </label>

            <select
              id="assigned-to"
              value={form.assignedToId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  assignedToId:
                    event.target.value,
                }))
              }
              disabled={loadingUsers}
              className={inputClassName}
            >
              <option value="">
                {loadingUsers
                  ? "Loading staff..."
                  : "Unassigned"}
              </option>

              {users
                .filter(
                  (user) => user.active !== false,
                )
                .map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name || user.email}
                    {user.name
                      ? ` — ${user.email}`
                      : ""}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Internal Notes
          </label>

          <textarea
            id="notes"
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            rows={4}
            placeholder="Optional internal notes..."
            className={inputClassName}
          />
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-5">
          <Link
            href="/business/service-requests"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={
              saving || loadingServices
            }
            className="rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Creating..."
              : "Create Service Request"}
          </button>
        </div>
      </form>
    </main>
  );
}