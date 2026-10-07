"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ManagedServiceStatus =
| "DRAFT"
| "ACTIVE"
| "PAUSED"
| "ENDED"
| "CANCELLED";

type ManagedServiceType =
| "MANAGED_IT"
| "CLOUD"
| "SOFTWARE_SUPPORT"
| "AI_SUPPORT"
| "WEBSITE"
| "NETWORK"
| "INFRASTRUCTURE"
| "CUSTOM";

type ManagedService = {
id: string;
serviceNumber: string;
name: string;
description: string | null;
type: ManagedServiceType;
status: ManagedServiceStatus;
sla: "BASIC" | "STANDARD" | "PRIORITY" | "PREMIUM";
recurringFee: string | number | null;
currency: string;
billingFrequency:
| "MONTHLY"
| "QUARTERLY"
| "ANNUALLY";
startDate: string | null;
endDate: string | null;
serviceManager: {
id: string;
name: string | null;
email: string;
} | null;
organization: {
id: string;
name: string;
website: string | null;
industry: string | null;
};
project: {
id: string;
projectNumber: string;
name: string;
status: string;
} | null;
contract: {
id: string;
contractNumber: string;
title: string;
status: string;
} | null;
};

const statusOptions: {
value: "" | ManagedServiceStatus;
label: string;
}[] = [
{ value: "", label: "All statuses" },
{ value: "DRAFT", label: "Draft" },
{ value: "ACTIVE", label: "Active" },
{ value: "PAUSED", label: "Paused" },
{ value: "ENDED", label: "Ended" },
{ value: "CANCELLED", label: "Cancelled" },
];

const typeOptions: {
value: "" | ManagedServiceType;
label: string;
}[] = [
{ value: "", label: "All service types" },
{ value: "MANAGED_IT", label: "Managed IT" },
{ value: "CLOUD", label: "Cloud" },
{
value: "SOFTWARE_SUPPORT",
label: "Software Support",
},
{ value: "AI_SUPPORT", label: "AI Support" },
{ value: "WEBSITE", label: "Website" },
{ value: "NETWORK", label: "Network" },
{
value: "INFRASTRUCTURE",
label: "Infrastructure",
},
{ value: "CUSTOM", label: "Custom" },
];

function formatServiceType(
type: ManagedServiceType,
): string {
const labels: Record<ManagedServiceType, string> = {
MANAGED_IT: "Managed IT",
CLOUD: "Cloud",
SOFTWARE_SUPPORT: "Software Support",
AI_SUPPORT: "AI Support",
WEBSITE: "Website",
NETWORK: "Network",
INFRASTRUCTURE: "Infrastructure",
CUSTOM: "Custom",
};

return labels[type];
}

function formatStatus(
status: ManagedServiceStatus,
): string {
return (
status.charAt(0) +
status.slice(1).toLowerCase()
);
}

function formatBillingFrequency(
frequency:
| "MONTHLY"
| "QUARTERLY"
| "ANNUALLY",
): string {
const labels = {
MONTHLY: "Monthly",
QUARTERLY: "Quarterly",
ANNUALLY: "Annually",
};

return labels[frequency];
}

function formatAmount(
amount: string | number | null,
currency: string,
): string {
if (
amount === null ||
amount === undefined ||
amount === ""
) {
return "—";
}

const numericAmount =
typeof amount === "number"
? amount
: Number(amount);

if (Number.isNaN(numericAmount)) {
return `${currency} ${amount}`;
}

return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 2,
}).format(numericAmount);
}

function getStatusClasses(
status: ManagedServiceStatus,
): string {
switch (status) {
case "ACTIVE":
return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

case "PAUSED":
  return "bg-amber-50 text-amber-700 ring-amber-600/20";

case "ENDED":
  return "bg-slate-100 text-slate-700 ring-slate-600/20";

case "CANCELLED":
  return "bg-red-50 text-red-700 ring-red-600/20";

case "DRAFT":
default:
  return "bg-blue-50 text-blue-700 ring-blue-600/20";

}
}

function formatDate(
value: string | null,
): string {
if (!value) {
return "—";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return "—";
}

return new Intl.DateTimeFormat("en-GB", {
day: "2-digit",
month: "short",
year: "numeric",
}).format(date);
}

export default function ManagedServicesPage() {
const [services, setServices] = useState<
ManagedService[]

> ([]);

const [search, setSearch] = useState("");
const [status, setStatus] = useState<
"" | ManagedServiceStatus

> ("");
 const [type, setType] = useState<
 "" | ManagedServiceType
> ("");

const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

async function loadServices() {
try {
setLoading(true);
setError("");

  const params = new URLSearchParams();

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (status) {
    params.set("status", status);
  }

  if (type) {
    params.set("type", type);
  }

  const query = params.toString();

  const response = await fetch(
    `/api/managed-services${
      query ? `?${query}` : ""
    }`,
    {
      method: "GET",
      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(
      data.message ||
        "Unable to load managed services.",
    );
  }

  setServices(data.services || []);
} catch (err) {
  console.error(
    "Failed to load managed services",
    err,
  );

  setError(
    err instanceof Error
      ? err.message
      : "Unable to load managed services.",
  );
} finally {
  setLoading(false);
}

}

useEffect(() => {
const timeout = window.setTimeout(
() => {
loadServices();
},
250,
);

return () => {
  window.clearTimeout(timeout);
};

}, [search, status, type]);

const summary = useMemo(() => {
return {
total: services.length,
active: services.filter(
(service) => service.status === "ACTIVE",
).length,
paused: services.filter(
(service) => service.status === "PAUSED",
).length,
draft: services.filter(
(service) => service.status === "DRAFT",
).length,
};
}, [services]);

return ( <main className="space-y-6"> <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"> <div> <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
Managed Services </h1>

      <p className="mt-1 max-w-2xl text-sm text-slate-500">
        Manage recurring technology, cloud, software,
        AI, website, network and infrastructure services
        for clients.
      </p>
    </div>

    <Link
      href="/business/managed-services/new"
      className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#302d78]"
    >
      New Managed Service
    </Link>
  </div>

  <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Total
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">
        {summary.total}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Active
      </p>
      <p className="mt-1 text-2xl font-semibold text-emerald-600">
        {summary.active}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Paused
      </p>
      <p className="mt-1 text-2xl font-semibold text-amber-600">
        {summary.paused}
      </p>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        Draft
      </p>
      <p className="mt-1 text-2xl font-semibold text-blue-600">
        {summary.draft}
      </p>
    </div>
  </div>

  <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-200 p-4">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_200px_220px]">
        <div>
          <label
            htmlFor="managed-service-search"
            className="sr-only"
          >
            Search managed services
          </label>

          <input
            id="managed-service-search"
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search service, number or organization..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
          />
        </div>

        <div>
          <label
            htmlFor="managed-service-status"
            className="sr-only"
          >
            Filter by status
          </label>

          <select
            id="managed-service-status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | ""
                  | ManagedServiceStatus,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
          >
            {statusOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="managed-service-type"
            className="sr-only"
          >
            Filter by service type
          </label>

          <select
            id="managed-service-type"
            value={type}
            onChange={(event) =>
              setType(
                event.target.value as
                  | ""
                  | ManagedServiceType,
              )
            }
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10"
          >
            {typeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>

    {error ? (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>

        <button
          type="button"
          onClick={loadServices}
          className="mt-3 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Try again
        </button>
      </div>
    ) : loading ? (
      <div className="p-8 text-center text-sm text-slate-500">
        Loading managed services...
      </div>
    ) : services.length === 0 ? (
      <div className="p-10 text-center">
        <h2 className="text-base font-semibold text-slate-900">
          No managed services found
        </h2>

        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
          {search || status || type
            ? "Try adjusting your search or filters."
            : "Create your first managed service to begin managing recurring client services."}
        </p>

        {!search && !status && !type ? (
          <Link
            href="/business/managed-services/new"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#302d78]"
          >
            Create Managed Service
          </Link>
        ) : null}
      </div>
    ) : (
      <>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Service
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Organization
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  SLA
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Recurring Fee
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Manager
                </th>

                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 bg-white">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-4 py-4">
                    <Link
                      href={`/business/managed-services/${service.id}`}
                      className="block"
                    >
                      <p className="text-xs font-medium text-[#39358c]">
                        {service.serviceNumber}
                      </p>

                      <p className="mt-1 font-medium text-slate-900 hover:text-[#39358c]">
                        {service.name}
                      </p>
                    </Link>
                  </td>

                  <td className="px-4 py-4">
                    <Link
                      href={`/business/organizations/${service.organization.id}`}
                      className="text-sm font-medium text-slate-800 hover:text-[#39358c]"
                    >
                      {service.organization.name}
                    </Link>
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {formatServiceType(
                      service.type,
                    )}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-600">
                    {service.sla}
                  </td>

                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-900">
                      {formatAmount(
                        service.recurringFee,
                        service.currency,
                      )}
                    </p>

                    {service.recurringFee !==
                    null ? (
                      <p className="mt-0.5 text-xs text-slate-500">
                        {formatBillingFrequency(
                          service.billingFrequency,
                        )}
                      </p>
                    ) : null}
                  </td>

                  <td className="px-4 py-4">
                    {service.serviceManager ? (
                      <>
                        <p className="text-sm text-slate-800">
                          {service.serviceManager
                            .name ||
                            service.serviceManager
                              .email}
                        </p>

                        {service.serviceManager
                          .name ? (
                          <p className="mt-0.5 text-xs text-slate-500">
                            {
                              service
                                .serviceManager
                                .email
                            }
                          </p>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">
                        Unassigned
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                        service.status,
                      )}`}
                    >
                      {formatStatus(
                        service.status,
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-200 md:hidden">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/business/managed-services/${service.id}`}
              className="block p-4 transition hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#39358c]">
                    {service.serviceNumber}
                  </p>

                  <h2 className="mt-1 truncate font-medium text-slate-900">
                    {service.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {service.organization.name}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(
                    service.status,
                  )}`}
                >
                  {formatStatus(
                    service.status,
                  )}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">
                    Type
                  </p>
                  <p className="mt-1 text-slate-700">
                    {formatServiceType(
                      service.type,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    SLA
                  </p>
                  <p className="mt-1 text-slate-700">
                    {service.sla}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Recurring fee
                  </p>
                  <p className="mt-1 font-medium text-slate-900">
                    {formatAmount(
                      service.recurringFee,
                      service.currency,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Billing
                  </p>
                  <p className="mt-1 text-slate-700">
                    {service.recurringFee !==
                    null
                      ? formatBillingFrequency(
                          service.billingFrequency,
                        )
                      : "—"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </>
    )}

    {!loading &&
    !error &&
    services.length > 0 ? (
      <div className="border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
        Showing {services.length} managed service
        {services.length === 1 ? "" : "s"}.
      </div>
    ) : null}
  </section>
</main>

);
}
