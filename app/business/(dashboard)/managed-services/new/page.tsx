"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Option = {
id: string;
label: string;
secondary?: string;
};

type FormState = {
organizationId: string;
projectId: string;
contractId: string;
name: string;
description: string;
type: string;
sla: string;
recurringFee: string;
currency: string;
billingFrequency: string;
startDate: string;
endDate: string;
serviceManagerId: string;
notes: string;
};

const initialForm: FormState = {
organizationId: "",
projectId: "",
contractId: "",
name: "",
description: "",
type: "MANAGED_IT",
sla: "STANDARD",
recurringFee: "",
currency: "NGN",
billingFrequency: "MONTHLY",
startDate: "",
endDate: "",
serviceManagerId: "",
notes: "",
};

const serviceTypes = [
{ value: "MANAGED_IT", label: "Managed IT" },
{ value: "CLOUD", label: "Cloud" },
{ value: "SOFTWARE_SUPPORT", label: "Software Support" },
{ value: "AI_SUPPORT", label: "AI Support" },
{ value: "WEBSITE", label: "Website" },
{ value: "NETWORK", label: "Network" },
{ value: "INFRASTRUCTURE", label: "Infrastructure" },
{ value: "CUSTOM", label: "Custom" },
];

const slaOptions = [
{ value: "BASIC", label: "Basic" },
{ value: "STANDARD", label: "Standard" },
{ value: "PRIORITY", label: "Priority" },
{ value: "PREMIUM", label: "Premium" },
];

const billingOptions = [
{ value: "MONTHLY", label: "Monthly" },
{ value: "QUARTERLY", label: "Quarterly" },
{ value: "ANNUALLY", label: "Annually" },
];

function getArrayPayload(
  payload: unknown,
  preferredKeys: string[] = [],
): unknown[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;

  for (const key of preferredKeys) {
    if (Array.isArray(record[key])) {
      return record[key];
    }
  }

  if (Array.isArray(record.data)) {
    return record.data;
  }

  return [];
}

function getString(
value: unknown,
fallback = "",
): string {
return typeof value === "string" ? value : fallback;
}

function toOption(
item: unknown,
labelFields: string[],
secondaryFields: string[] = [],
): Option | null {
if (!item || typeof item !== "object") {
return null;
}

const record = item as Record<string, unknown>;

const id = getString(record.id);

if (!id) {
return null;
}

let label = "";

for (const field of labelFields) {
const value = getString(record[field]);

if (value) {
  label = value;
  break;
}

}

if (!label) {
label = id;
}

let secondary = "";

for (const field of secondaryFields) {
const value = getString(record[field]);

if (value) {
  secondary = value;
  break;
}

}

return {
id,
label,
secondary: secondary || undefined,
};
}

function formatOptionLabel(option: Option): string {
return option.secondary
? `${option.label} — ${option.secondary}`
: option.label;
}

export default function NewManagedServicePage() {
const router = useRouter();

const [form, setForm] = useState<FormState>(initialForm);

const [organizations, setOrganizations] = useState<Option[]>([]);
const [projects, setProjects] = useState<Option[]>([]);
const [contracts, setContracts] = useState<Option[]>([]);
const [users, setUsers] = useState<Option[]>([]);

const [loadingOptions, setLoadingOptions] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");
const [optionsError, setOptionsError] = useState("");

useEffect(() => {
let cancelled = false;

async function loadOptions() {
  try {
    setLoadingOptions(true);
    setOptionsError("");

    const [
      organizationsResponse,
      projectsResponse,
      contractsResponse,
      usersResponse,
    ] = await Promise.all([
      fetch("/api/organizations", {
        cache: "no-store",
      }),
      fetch("/api/projects", {
        cache: "no-store",
      }),
      fetch("/api/contracts", {
        cache: "no-store",
      }),
      fetch("/api/users", {
        cache: "no-store",
      }),
    ]);

    const responses = [
      organizationsResponse,
      projectsResponse,
      contractsResponse,
      usersResponse,
    ];

    const failedResponse = responses.find(
      (response) => !response.ok,
    );

    if (failedResponse) {
      throw new Error(
        `Unable to load form options (${failedResponse.status}).`,
      );
    }

    const [
      organizationsPayload,
      projectsPayload,
      contractsPayload,
      usersPayload,
    ] = await Promise.all(
      responses.map((response) => response.json()),
    );

    if (cancelled) {
      return;
    }

    const organizationOptions = getArrayPayload(
      organizationsPayload,
      ["organizations"],
    )
      .map((item) =>
        toOption(
          item,
          ["name", "businessName", "organizationName"],
          ["email", "industry"],
        ),
      )
      .filter((item): item is Option => item !== null);

    const projectOptions = getArrayPayload(
      projectsPayload,
      ["projects"],
    )
      .map((item) =>
        toOption(
          item,
          ["name", "projectNumber"],
          ["projectNumber", "status"],
        ),
      )
      .filter((item): item is Option => item !== null);

    const contractOptions = getArrayPayload(
      contractsPayload,
      ["contracts"],
    )
      .map((item) =>
        toOption(
          item,
          ["title", "contractNumber"],
          ["contractNumber", "status"],
        ),
      )
      .filter((item): item is Option => item !== null);

    const userOptions = getArrayPayload(
        usersPayload,
        ["users"],
    )
      .map((item) =>
        toOption(
          item,
          ["name", "email"],
          ["email", "role"],
        ),
      )
      .filter((item): item is Option => item !== null);

    setOrganizations(organizationOptions);
    setProjects(projectOptions);
    setContracts(contractOptions);
    setUsers(userOptions);
  } catch (loadError) {
    if (cancelled) {
      return;
    }

    setOptionsError(
      loadError instanceof Error
        ? loadError.message
        : "Unable to load form options.",
    );
  } finally {
    if (!cancelled) {
      setLoadingOptions(false);
    }
  }
}

void loadOptions();

return () => {
  cancelled = true;
};

}, []);

const selectedOrganizationProjects = useMemo(() => {
if (!form.organizationId) {
return projects;
}

return projects;

}, [form.organizationId, projects]);

const selectedOrganizationContracts = useMemo(() => {
if (!form.organizationId) {
return contracts;
}

return contracts;

}, [form.organizationId, contracts]);

function updateField(
field: keyof FormState,
value: string,
) {
setForm((current) => ({
...current,
[field]: value,
}));

if (error) {
  setError("");
}

}

async function handleSubmit(
event: FormEvent<HTMLFormElement>,
) {
event.preventDefault();

setError("");

if (!form.organizationId) {
  setError("Please select an organization.");
  return;
}

if (!form.name.trim()) {
  setError("Please enter a service name.");
  return;
}

if (
  form.startDate &&
  form.endDate &&
  form.endDate < form.startDate
) {
  setError("End date cannot be earlier than the start date.");
  return;
}

if (
  form.recurringFee &&
  Number.isNaN(Number(form.recurringFee))
) {
  setError("Please enter a valid recurring fee.");
  return;
}

try {
  setSubmitting(true);

  const payload: Record<string, unknown> = {
    organizationId: form.organizationId,
    name: form.name.trim(),
    type: form.type,
    sla: form.sla,
    currency: form.currency,
    billingFrequency: form.billingFrequency,
  };

  if (form.projectId) {
    payload.projectId = form.projectId;
  }

  if (form.contractId) {
    payload.contractId = form.contractId;
  }

  if (form.description.trim()) {
    payload.description = form.description.trim();
  }

  if (form.recurringFee) {
    payload.recurringFee = Number(form.recurringFee);
  }

  if (form.startDate) {
    payload.startDate = form.startDate;
  }

  if (form.endDate) {
    payload.endDate = form.endDate;
  }

  if (form.serviceManagerId) {
    payload.serviceManagerId =
      form.serviceManagerId;
  }

  if (form.notes.trim()) {
    payload.notes = form.notes.trim();
  }

  const response = await fetch(
    "/api/managed-services",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      getString(
        result?.message,
        "Unable to create managed service.",
      ),
    );
  }

  const createdId =
    result?.managedService?.id ??
    result?.service?.id ??
    result?.data?.id ??
    result?.id;

  if (!createdId) {
    router.push("/business/managed-services");
    router.refresh();
    return;
  }

  router.push(
    `/business/managed-services/${createdId}`,
  );
  router.refresh();
} catch (submitError) {
  setError(
    submitError instanceof Error
      ? submitError.message
      : "Unable to create managed service.",
  );
} finally {
  setSubmitting(false);
}

}

return ( <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"> <div className="mx-auto max-w-5xl"> <div className="mb-8"> <Link
         href="/business/managed-services"
         className="text-sm font-medium text-[#39358c] hover:underline"
       >
← Back to Managed Services </Link>

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          New Managed Service
        </h1>

        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Create a recurring technology or support
          service for a client.
        </p>
      </div>
    </div>

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {optionsError && (
        <div
          role="alert"
          className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {optionsError}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Client &amp; commercial links
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Link this service to the client and, where
            applicable, the originating project or contract.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Organization" required>
            <select
              value={form.organizationId}
              onChange={(event) =>
                updateField(
                  "organizationId",
                  event.target.value,
                )
              }
              disabled={loadingOptions || submitting}
              required
              className={inputClassName}
            >
              <option value="">
                {loadingOptions
                  ? "Loading organizations..."
                  : "Select organization"}
              </option>

              {organizations.map((organization) => (
                <option
                  key={organization.id}
                  value={organization.id}
                >
                  {formatOptionLabel(organization)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Project">
            <select
              value={form.projectId}
              onChange={(event) =>
                updateField(
                  "projectId",
                  event.target.value,
                )
              }
              disabled={loadingOptions || submitting}
              className={inputClassName}
            >
              <option value="">
                No project
              </option>

              {selectedOrganizationProjects.map(
                (project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {formatOptionLabel(project)}
                  </option>
                ),
              )}
            </select>
          </Field>

          <Field label="Contract">
            <select
              value={form.contractId}
              onChange={(event) =>
                updateField(
                  "contractId",
                  event.target.value,
                )
              }
              disabled={loadingOptions || submitting}
              className={inputClassName}
            >
              <option value="">
                No contract
              </option>

              {selectedOrganizationContracts.map(
                (contract) => (
                  <option
                    key={contract.id}
                    value={contract.id}
                  >
                    {formatOptionLabel(contract)}
                  </option>
                ),
              )}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Service details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Define what Techtrep will provide and the
            expected service level.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Service name" required>
              <input
                type="text"
                value={form.name}
                onChange={(event) =>
                  updateField(
                    "name",
                    event.target.value,
                  )
                }
                disabled={submitting}
                required
                placeholder="e.g. Managed IT Support"
                className={inputClassName}
              />
            </Field>
          </div>

          <Field label="Service type" required>
            <select
              value={form.type}
              onChange={(event) =>
                updateField(
                  "type",
                  event.target.value,
                )
              }
              disabled={submitting}
              required
              className={inputClassName}
            >
              {serviceTypes.map((type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="SLA" required>
            <select
              value={form.sla}
              onChange={(event) =>
                updateField(
                  "sla",
                  event.target.value,
                )
              }
              disabled={submitting}
              required
              className={inputClassName}
            >
              {slaOptions.map((sla) => (
                <option
                  key={sla.value}
                  value={sla.value}
                >
                  {sla.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value,
                  )
                }
                disabled={submitting}
                rows={4}
                placeholder="Describe the recurring service, responsibilities and scope."
                className={textareaClassName}
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Billing
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Set the recurring commercial terms for this
            service.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Recurring fee">
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.recurringFee}
              onChange={(event) =>
                updateField(
                  "recurringFee",
                  event.target.value,
                )
              }
              disabled={submitting}
              placeholder="0.00"
              className={inputClassName}
            />
          </Field>

          <Field label="Currency" required>
            <select
              value={form.currency}
              onChange={(event) =>
                updateField(
                  "currency",
                  event.target.value,
                )
              }
              disabled={submitting}
              required
              className={inputClassName}
            >
              <option value="NGN">
                NGN — Nigerian Naira
              </option>
              <option value="USD">
                USD — US Dollar
              </option>
              <option value="GBP">
                GBP — British Pound
              </option>
              <option value="EUR">
                EUR — Euro
              </option>
            </select>
          </Field>

          <Field label="Billing frequency" required>
            <select
              value={form.billingFrequency}
              onChange={(event) =>
                updateField(
                  "billingFrequency",
                  event.target.value,
                )
              }
              disabled={submitting}
              required
              className={inputClassName}
            >
              {billingOptions.map((frequency) => (
                <option
                  key={frequency.value}
                  value={frequency.value}
                >
                  {frequency.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-slate-900">
            Service period &amp; management
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Start date">
            <input
              type="date"
              value={form.startDate}
              onChange={(event) =>
                updateField(
                  "startDate",
                  event.target.value,
                )
              }
              disabled={submitting}
              className={inputClassName}
            />
          </Field>

          <Field label="End date">
            <input
              type="date"
              value={form.endDate}
              onChange={(event) =>
                updateField(
                  "endDate",
                  event.target.value,
                )
              }
              disabled={submitting}
              className={inputClassName}
            />
          </Field>

          <Field label="Service manager">
            <select
              value={form.serviceManagerId}
              onChange={(event) =>
                updateField(
                  "serviceManagerId",
                  event.target.value,
                )
              }
              disabled={loadingOptions || submitting}
              className={inputClassName}
            >
              <option value="">
                Unassigned
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {formatOptionLabel(user)}
                </option>
              ))}
            </select>
          </Field>

          <div className="md:col-span-2">
            <Field label="Internal notes">
              <textarea
                value={form.notes}
                onChange={(event) =>
                  updateField(
                    "notes",
                    event.target.value,
                  )
                }
                disabled={submitting}
                rows={4}
                placeholder="Add internal notes about the service."
                className={textareaClassName}
              />
            </Field>
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/business/managed-services"
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={
            submitting ||
            loadingOptions ||
            !form.organizationId ||
            !form.name.trim()
          }
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#39358c] px-5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Creating..."
            : "Create Managed Service"}
        </button>
      </div>
    </form>
  </div>
</main>

);
}

const inputClassName =
"mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-slate-100 disabled:text-slate-500";

const textareaClassName =
"mt-2 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10 disabled:bg-slate-100 disabled:text-slate-500";

function Field({
label,
required = false,
children,
}: {
label: string;
required?: boolean;
children: React.ReactNode;
}) {
return ( <label className="block text-sm font-medium text-slate-700"> <span>
{label}
{required && ( <span className="ml-1 text-red-500">*</span>
)} </span>
{children} </label>
);
}
