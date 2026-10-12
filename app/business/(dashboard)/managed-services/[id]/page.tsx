"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type ManagedService = {
id: string;
serviceNumber: string;
name: string;
description: string | null;
type: string;
status: string;
sla: string;
recurringFee: string | number | null;
currency: string;
billingFrequency: string;
billingEnabled: boolean;
nextBillingDate: string | null;
startDate: string | null;
endDate: string | null;
notes: string | null;
createdAt: string;
updatedAt: string;
organization: {
id: string;
name: string;
website?: string | null;
} | null;
project: {
id: string;
projectNumber?: string | null;
name: string;
} | null;
contract: {
id: string;
contractNumber?: string | null;
title: string;
status?: string | null;
} | null;
serviceManager: {
id: string;
name: string | null;
email: string;
role?: string | null;
} | null;
};

type UserOption = {
id: string;
name: string | null;
email: string;
role?: string | null;
active?: boolean;
};

type UsersApiResponse = {
users?: UserOption[];
};

type ApiResponse = {
    success?: boolean;
    service?: ManagedService;
    error?: string;
    message?: string;
};


type ServiceReport = {
  id: string;
  reportNumber: string;
  status: string;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  reportDate: string;
  executiveSummary: string | null;
  totalRequests: number;
  resolvedRequests: number;
  openRequests: number;
  urgentRequests: number;
  slaEligibleRequests: number;
  slaMetRequests: number;
  slaBreachedRequests: number;
  slaComplianceRate: string | number | null;
  billingCurrency: string;
  totalInvoiced: string | number;
  totalPaid: string | number;
  totalOutstanding: string | number;
};

type ServiceReportApiResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  report?: ServiceReport | {
    id: string;
    reportNumber: string;
    status: string;
  };
};

function getDefaultReportPeriod(): string {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - 1);

  return `${date.getUTCFullYear()}-${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

const typeLabels: Record<string, string> = {
MANAGED_IT: "Managed IT",
CLOUD: "Cloud",
SOFTWARE_SUPPORT: "Software Support",
AI_SUPPORT: "AI Support",
WEBSITE: "Website",
NETWORK: "Network",
INFRASTRUCTURE: "Infrastructure",
CUSTOM: "Custom",
};

const statusLabels: Record<string, string> = {
DRAFT: "Draft",
ACTIVE: "Active",
PAUSED: "Paused",
ENDED: "Ended",
CANCELLED: "Cancelled",
};

const slaLabels: Record<string, string> = {
BASIC: "Basic",
STANDARD: "Standard",
PRIORITY: "Priority",
PREMIUM: "Premium",
};

const billingFrequencyLabels: Record<string, string> = {
MONTHLY: "Monthly",
QUARTERLY: "Quarterly",
ANNUALLY: "Annually",
};

const statusClasses: Record<string, string> = {
DRAFT: "bg-slate-100 text-slate-700",
ACTIVE: "bg-green-100 text-green-700",
PAUSED: "bg-amber-100 text-amber-700",
ENDED: "bg-slate-200 text-slate-700",
CANCELLED: "bg-red-100 text-red-700",
};

const inputClassName =
"w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#39358c] focus:ring-2 focus:ring-[#39358c]/10";

function formatDate(value: string | null): string {
if (!value) {
return "—";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return "—";
}

return new Intl.DateTimeFormat("en-NG", {
day: "2-digit",
month: "short",
year: "numeric",
}).format(date);
}

function formatDateTime(value: string | null): string {
if (!value) {
return "—";
}

const date = new Date(value);

if (Number.isNaN(date.getTime())) {
return "—";
}

return new Intl.DateTimeFormat("en-NG", {
day: "2-digit",
month: "short",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
}).format(date);
}

function formatMoney(
amount: string | number | null,
currency: string,
): string {
if (amount === null || amount === undefined || amount === "") {
return "—";
}

const numericAmount =
typeof amount === "number" ? amount : Number(amount);

if (!Number.isFinite(numericAmount)) {
return `${currency} ${amount}`;
}

try {
return new Intl.NumberFormat("en-NG", {
style: "currency",
currency,
maximumFractionDigits: 2,
}).format(numericAmount);
} catch {
return `${currency} ${numericAmount.toLocaleString("en-NG")}`;
}
}

function getStatusActions(status: string) {
switch (status) {
case "DRAFT":
return [
{
status: "ACTIVE",
label: "Activate",
className:
"bg-[#39358c] text-white hover:bg-[#2f2b76]",
},
{
status: "CANCELLED",
label: "Cancel",
className:
"border border-red-300 bg-white text-red-700 hover:bg-red-50",
},
];

case "ACTIVE":
  return [
    {
      status: "PAUSED",
      label: "Pause",
      className:
        "border border-amber-300 bg-white text-amber-700 hover:bg-amber-50",
    },
    {
      status: "ENDED",
      label: "End Service",
      className:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    },
    {
      status: "CANCELLED",
      label: "Cancel",
      className:
        "border border-red-300 bg-white text-red-700 hover:bg-red-50",
    },
  ];

case "PAUSED":
  return [
    {
      status: "ACTIVE",
      label: "Resume",
      className:
        "bg-[#39358c] text-white hover:bg-[#2f2b76]",
    },
    {
      status: "ENDED",
      label: "End Service",
      className:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
    },
    {
      status: "CANCELLED",
      label: "Cancel",
      className:
        "border border-red-300 bg-white text-red-700 hover:bg-red-50",
    },
  ];

default:
  return [];
}
}

function DetailItem({
label,
value,
}: {
label: string;
value: React.ReactNode;
}) {
return ( <div> <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
{label} </dt> <dd className="mt-1 text-sm text-slate-900">{value}</dd> </div>
);
}

export default function ManagedServiceDetailPage() {
const params = useParams<{ id: string }>();
const router = useRouter();

const id = params?.id;

const [service, setService] = useState<ManagedService | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [saving, setSaving] = useState(false);
const [editing, setEditing] = useState(false);
const [users, setUsers] = useState<UserOption[]>([]);
const [usersLoading, setUsersLoading] = useState(false);

const [reportPeriod, setReportPeriod] = useState(
  getDefaultReportPeriod,
);
const [reportGenerating, setReportGenerating] = useState(false);
const [reportError, setReportError] = useState("");
const [reportMessage, setReportMessage] = useState("");
const [generatedReport, setGeneratedReport] =
  useState<ServiceReport | null>(null);


const [form, setForm] = useState({
name: "",
description: "",
type: "MANAGED_IT",
sla: "STANDARD",
recurringFee: "",
currency: "NGN",
billingFrequency: "MONTHLY",
billingEnabled: false,
nextBillingDate: "",
startDate: "",
endDate: "",
serviceManagerId: "",
notes: "",
});

const loadUsers = useCallback(async () => {
try {
setUsersLoading(true);

const response = await fetch("/api/users");

const payload: UsersApiResponse = await response.json();

if (!response.ok) {
  throw new Error("Unable to load users.");
}

setUsers(payload.users ?? []);

} catch (requestError) {
console.error("Failed to load service managers", requestError);
} finally {
setUsersLoading(false);
}
}, []);

useEffect(() => {
void loadUsers();
}, [loadUsers]);

const loadService = useCallback(async () => {
if (!id) {
return;
}

try {
  setLoading(true);
  setError("");

  const response = await fetch(`/api/managed-services/${id}`);

  const payload: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.error ||
        payload.message ||
        "Unable to load managed service.",
    );
  }

  if (!payload.service) {
    throw new Error(
    payload.message || "Managed service was not found.",
    );
  }

  const data = payload.service;

  setService(data);

  setForm({
    name: data.name ?? "",
    description: data.description ?? "",
    type: data.type ?? "MANAGED_IT",
    sla: data.sla ?? "STANDARD",
    recurringFee:
      data.recurringFee === null ||
      data.recurringFee === undefined
        ? ""
        : String(data.recurringFee),
    currency: data.currency ?? "NGN",
    billingFrequency:
      data.billingFrequency ?? "MONTHLY",
    billingEnabled: data.billingEnabled ?? false,
      nextBillingDate: data.nextBillingDate
        ? data.nextBillingDate.slice(0, 10)
        : "",
    startDate: data.startDate
      ? data.startDate.slice(0, 10)
      : "",
    endDate: data.endDate ? data.endDate.slice(0, 10) : "",
    serviceManagerId: data.serviceManager?.id ?? "",
    notes: data.notes ?? "",
  });
} catch (requestError) {
  setError(
    requestError instanceof Error
      ? requestError.message
      : "Unable to load managed service.",
  );
} finally {
  setLoading(false);
}

}, [id]);

useEffect(() => {
void loadService();
}, [loadService]);

const statusActions = useMemo(
() => getStatusActions(service?.status ?? ""),
[service?.status],
);

async function saveChanges() {
if (!service) {
return;
}

if (!form.name.trim()) {
  setError("Service name is required.");
  return;
}

try {
  setSaving(true);
  setError("");

  const response = await fetch(
    `/api/managed-services/${service.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim() || null,
        type: form.type,
        sla: form.sla,
        recurringFee:
          form.recurringFee.trim() || null,
        currency: form.currency.trim() || "NGN",
        billingFrequency: form.billingFrequency,
        billingEnabled: form.billingEnabled,
        nextBillingDate:
          form.billingEnabled && form.nextBillingDate          
            ? form.nextBillingDate
            : null,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        serviceManagerId:
          form.serviceManagerId || null,
        notes: form.notes.trim() || null,
      }),
    },
  );

  const payload: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.error ||
        payload.message ||
        "Unable to update managed service.",
    );
  }

  if (!payload.service) {
    throw new Error(
        payload.message ||
        "The updated managed service was not returned.",
    );
  }

  setService(payload.service);
  setEditing(false);
} catch (requestError) {
  setError(
    requestError instanceof Error
      ? requestError.message
      : "Unable to update managed service.",
  );
} finally {
  setSaving(false);
}

}

async function changeStatus(nextStatus: string) {
if (!service || service.status === nextStatus) {
return;
}

const action = statusActions.find(
  (item) => item.status === nextStatus,
);

const confirmed = window.confirm(
  `Are you sure you want to ${action?.label.toLowerCase() ?? "change the status of this service"}?`,
);

if (!confirmed) {
  return;
}

try {
  setSaving(true);
  setError("");

  const response = await fetch(
    `/api/managed-services/${service.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    },
  );

  const payload: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.error ||
        payload.message ||
        "Unable to change service status.",
    );
  }

  if (!payload.service) {
    throw new Error(
      payload.message ||
        "The updated managed service was not returned.",
    );
  }

  setService(payload.service);
} catch (requestError) {
  setError(
    requestError instanceof Error
      ? requestError.message
      : "Unable to change service status.",
  );
} finally {
  setSaving(false);
}

}


async function generateServiceReport() {
  if (!service || reportGenerating) {
    return;
  }

  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(reportPeriod)) {
    setReportError("Select a valid reporting month.");
    return;
  }

  try {
    setReportGenerating(true);
    setReportError("");
    setReportMessage("");
    setGeneratedReport(null);

    const response = await fetch(
      `/api/managed-services/${service.id}/reports?period=${encodeURIComponent(reportPeriod)}`,
      { method: "POST" },
    );

    const payload: ServiceReportApiResponse =
      await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        setReportMessage(
          payload.message ??
            "A report already exists for this service and period.",
        );
        return;
      }

      throw new Error(
        payload.error ||
          payload.message ||
          "Unable to generate the service report.",
      );
    }

    if (!payload.report || !("totalRequests" in payload.report)) {
      throw new Error(
        "The API did not return the generated report details.",
      );
    }

    setGeneratedReport(payload.report);
    setReportMessage(
      "Draft report generated successfully. It has not been finalized or sent to the client.",
    );
  } catch (requestError) {
    setReportError(
      requestError instanceof Error
        ? requestError.message
        : "Unable to generate the service report.",
    );
  } finally {
    setReportGenerating(false);
  }
}

function cancelEditing() {
if (!service) {
return;
}

setForm({
  name: service.name ?? "",
  description: service.description ?? "",
  type: service.type ?? "MANAGED_IT",
  sla: service.sla ?? "STANDARD",
  recurringFee:
    service.recurringFee === null ||
    service.recurringFee === undefined
      ? ""
      : String(service.recurringFee),
  currency: service.currency ?? "NGN",
  billingFrequency: service.billingFrequency ?? "MONTHLY",
  billingEnabled: service.billingEnabled ?? false,
  nextBillingDate: service.nextBillingDate
    ? service.nextBillingDate.slice(0, 10)
    : "",
  startDate: service.startDate
    ? service.startDate.slice(0, 10)
    : "",
  endDate: service.endDate
    ? service.endDate.slice(0, 10)
    : "",
  serviceManagerId:
    service.serviceManager?.id ?? "",
  notes: service.notes ?? "",
});

setEditing(false);
setError("");

}

if (loading) {
return ( <div className="space-y-6"> <div> <Link
         href="/business/managed-services"
         className="text-sm font-medium text-[#39358c] hover:underline"
       >
← Back to Managed Services </Link> </div>

    <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
      Loading managed service...
    </div>
  </div>
);

}

if (!service) {
return ( <div className="space-y-6"> <div> <Link
         href="/business/managed-services"
         className="text-sm font-medium text-[#39358c] hover:underline"
       >
← Back to Managed Services </Link> </div>

    <div className="rounded-xl border border-red-200 bg-red-50 p-6">
      <h1 className="text-lg font-semibold text-red-800">
        Managed service not found
      </h1>
      <p className="mt-2 text-sm text-red-700">
        {error ||
          "The requested managed service could not be found."}
      </p>
    </div>
  </div>
);

}

const statusClass =
statusClasses[service.status] ??
"bg-slate-100 text-slate-700";

return ( <div className="space-y-6"> <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"> <div> <Link
         href="/business/managed-services"
         className="text-sm font-medium text-[#39358c] hover:underline"
       >
← Back to Managed Services </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {service.name}
        </h1>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          {statusLabels[service.status] ??
            service.status}
        </span>
      </div>

      <p className="mt-1 text-sm text-slate-500">
        {service.serviceNumber}
      </p>
    </div>

    <div className="flex flex-wrap gap-2">
      {!editing && (
        <button
          type="button"
          onClick={() => {
            setError("");
            setEditing(true);
          }}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Edit Service
        </button>
      )}

      {editing && (
        <>
          <button
            type="button"
            onClick={cancelEditing}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => void saveChanges()}
            disabled={saving}
            className="rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2f2b76] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  </div>

  {error && (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {error}
    </div>
  )}

  {statusActions.length > 0 && !editing && (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-semibold text-slate-900">
            Service Status
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage the current lifecycle state of this
            managed service.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {statusActions.map((action) => (
            <button
              key={action.status}
              type="button"
              disabled={saving}
              onClick={() =>
                void changeStatus(action.status)
              }
              className={`rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${action.className}`}
            >
              {saving ? "Updating..." : action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )}

  
<section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div>
      <h2 className="text-lg font-semibold text-slate-900">
        Service Reports
      </h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
        Generate an internal monthly report covering service requests,
        resolution SLA performance, invoices and payments. Reports
        remain drafts until finalized.
      </p>
    </div>

    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
      Internal
    </span>
  </div>

  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
    <div className="w-full sm:max-w-xs">
      <label
        htmlFor="service-report-period"
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        Reporting Month
      </label>
      <input
        id="service-report-period"
        type="month"
        value={reportPeriod}
        max={getDefaultReportPeriod()}
        onChange={(event) => {
          setReportPeriod(event.target.value);
          setReportError("");
          setReportMessage("");
          setGeneratedReport(null);
        }}
        disabled={reportGenerating}
        className={inputClassName}
      />
      <p className="mt-1 text-xs text-slate-500">
        Defaults to the previous completed month.
      </p>
    </div>

    <button
      type="button"
      onClick={() => void generateServiceReport()}
      disabled={reportGenerating || !reportPeriod}
      className="rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2f2b76] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {reportGenerating ? "Generating Draft..." : "Generate Draft Report"}
    </button>
  </div>

  {reportError && (
    <div
      role="alert"
      className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {reportError}
    </div>
  )}

  {reportMessage && (
    <div
      role="status"
      className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
        generatedReport
          ? "border-green-200 bg-green-50 text-green-800"
          : "border-amber-200 bg-amber-50 text-amber-800"
      }`}
    >
      {reportMessage}
    </div>
  )}

  {generatedReport && (
    <div className="mt-6 border-t border-slate-200 pt-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Report Number
          </p>
          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {generatedReport.reportNumber}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {formatDate(generatedReport.reportingPeriodStart)} –{" "}
            {formatDate(
              new Date(
                new Date(
                  generatedReport.reportingPeriodEnd,
                ).getTime() -
                  24 * 60 * 60 * 1000,
              ).toISOString(),
            )}
          </p>
        </div>

        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Draft
        </span>
      </div>

      {generatedReport.executiveSummary && (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          {generatedReport.executiveSummary}
        </p>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Requests Opened",
            value: generatedReport.totalRequests,
          },
          {
            label: "Resolved / Closed",
            value: generatedReport.resolvedRequests,
          },
          {
            label: "Currently Open",
            value: generatedReport.openRequests,
          },
          {
            label: "Urgent Requests",
            value: generatedReport.urgentRequests,
          },
        ].map((metric) => (
          <div
            key={metric.label}
            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
          >
            <p className="text-xs font-medium text-slate-500">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Resolution SLA Performance
        </h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <DetailItem
            label="Evaluated Requests"
            value={generatedReport.slaEligibleRequests}
          />
          <DetailItem
            label="Met SLA"
            value={generatedReport.slaMetRequests}
          />
          <DetailItem
            label="Breached SLA"
            value={generatedReport.slaBreachedRequests}
          />
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Compliance:{" "}
          <strong className="text-slate-900">
            {generatedReport.slaComplianceRate === null
              ? "Not available"
              : `${Number(
                  generatedReport.slaComplianceRate,
                ).toFixed(2)}%`}
          </strong>
        </p>
      </div>

      <div className="mt-5 rounded-lg border border-slate-200 p-4">
        <h4 className="font-semibold text-slate-900">
          Financial Summary
        </h4>

        <dl className="mt-4 grid gap-5 sm:grid-cols-3">
          <DetailItem
            label="Invoiced"
            value={formatMoney(
              generatedReport.totalInvoiced,
              generatedReport.billingCurrency,
            )}
          />
          <DetailItem
            label="Payments Received"
            value={formatMoney(
              generatedReport.totalPaid,
              generatedReport.billingCurrency,
            )}
          />
          <DetailItem
            label="Outstanding"
            value={formatMoney(
              generatedReport.totalOutstanding,
              generatedReport.billingCurrency,
            )}
          />
        </dl>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-500">
        This is a saved snapshot of the report metrics at generation
        time. Later changes to service requests, invoices or payments
        do not automatically refresh this draft.
      </p>
    </div>
  )}
</section>

  {editing ? (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">
        Edit Managed Service
      </h2>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label
            htmlFor="service-name"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Service Name
          </label>
          <input
            id="service-name"
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="service-description"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Description
          </label>
          <textarea
            id="service-description"
            rows={4}
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="service-type"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Service Type
          </label>
          <select
            id="service-type"
            value={form.type}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                type: event.target.value,
              }))
            }
            className={inputClassName}
          >
            {Object.entries(typeLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="service-sla"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            SLA
          </label>
          <select
            id="service-sla"
            value={form.sla}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                sla: event.target.value,
              }))
            }
            className={inputClassName}
          >
            {Object.entries(slaLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>

        <div>
          <label
            htmlFor="recurring-fee"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Recurring Fee
          </label>
          <input
            id="recurring-fee"
            type="number"
            min="0"
            step="0.01"
            value={form.recurringFee}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                recurringFee: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="currency"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Currency
          </label>
          <input
            id="currency"
            value={form.currency}
            maxLength={3}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currency: event.target.value
                  .toUpperCase()
                  .slice(0, 3),
              }))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="billing-frequency"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Billing Frequency
          </label>
          <select
            id="billing-frequency"
            value={form.billingFrequency}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                billingFrequency: event.target.value,
              }))
            }
            className={inputClassName}
          >
            {Object.entries(
              billingFrequencyLabels,
            ).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
    <label className="flex cursor-pointer items-start gap-3">
      <input
        id="billing-enabled"
        type="checkbox"
        checked={form.billingEnabled}
        onChange={(event) =>
          setForm((current) => ({
            ...current,
            billingEnabled: event.target.checked,
          }))
        }
        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#39358c] focus:ring-[#39358c]"
      />

      <span>
        <span className="block text-sm font-medium text-slate-800">
          Enable recurring billing
        </span>
        <span className="mt-1 block text-xs text-slate-500">
          Enable this service for recurring billing according to its billing frequency.
        </span>
      </span>
    </label>
  </div>
</div>

<div>
  <label
    htmlFor="next-billing-date"
    className="mb-1.5 block text-sm font-medium text-slate-700"
  >
    Next Billing Date
  </label>

  <input
    id="next-billing-date"
    type="date"
    value={form.nextBillingDate}
    disabled={!form.billingEnabled}
    onChange={(event) =>
      setForm((current) => ({
        ...current,
        nextBillingDate: event.target.value,
      }))
    }
    className={`${inputClassName} disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400`}
  />

  <p className="mt-1 text-xs text-slate-500">
    The next date scheduled for recurring billing.
  </p>
</div>

        <div>
          <label
            htmlFor="start-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Start Date
          </label>
          <input
            id="start-date"
            type="date"
            value={form.startDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                startDate: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            End Date
          </label>
          <input
            id="end-date"
            type="date"
            value={form.endDate}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                endDate: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>

        <div className="md:col-span-2"> <label htmlFor="service-manager" className="mb-1.5 block text-
          sm font-medium text-slate-700" > Service Manager </label>
          <select
          id="service-manager"
          value={form.serviceManagerId}
          onChange={(event) =>
          setForm((current) => ({
          ...current,
          serviceManagerId: event.target.value,
        }))
       }

          disabled={usersLoading}
          className={inputClassName}
        >
          <option value="">
            {usersLoading
              ? "Loading service managers..."
              : "Unassigned"}
          </option>

        {users
            .filter((user) => user.active !== false)
            .map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
                {user.name ? ` — ${user.email}` : ""}
                </option>
            ))}

            </select>
            <p 
            className="mt-1 text-xs text-slate-500"> Select the staff member responsible for this managed
                service. 
            </p> 
            </div>            
        

        <div className="md:col-span-2">
          <label
            htmlFor="service-notes"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>
          <textarea
            id="service-notes"
            rows={4}
            value={form.notes}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                notes: event.target.value,
              }))
            }
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  ) : (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">
            Service Details
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <DetailItem
              label="Service Type"
              value={
                typeLabels[service.type] ??
                service.type
              }
            />

            <DetailItem
              label="SLA"
              value={
                slaLabels[service.sla] ??
                service.sla
              }
            />

            <DetailItem
              label="Recurring Fee"
              value={formatMoney(
                service.recurringFee,
                service.currency,
              )}
            />

            <DetailItem
              label="Billing Frequency"
              value={
                billingFrequencyLabels[
                  service.billingFrequency
                ] ?? service.billingFrequency
              }
            />

            <DetailItem
  label="Recurring Billing"
  value={
    service.billingEnabled ? (
      <span className="font-medium text-green-700">
        Enabled
      </span>
    ) : (
      <span className="text-slate-500">
        Disabled
      </span>
    )
  }
/>

<DetailItem
  label="Next Billing Date"
  value={formatDate(service.nextBillingDate)}
/>

            <DetailItem
              label="Start Date"
              value={formatDate(service.startDate)}
            />

            <DetailItem
              label="End Date"
              value={formatDate(service.endDate)}
            />

            <DetailItem
              label="Service Manager"
              value={
                service.serviceManager ? (
                  <span>
                    {service.serviceManager.name ||
                      service.serviceManager.email}
                  </span>
                ) : (
                  "Unassigned"
                )
              }
            />

            <DetailItem
              label="Currency"
              value={service.currency}
            />
          </dl>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Client
          </h2>

          <div className="mt-5">
            {service.organization ? (
              <>
                <Link
                  href={`/business/organizations/${service.organization.id}`}
                  className="text-base font-semibold text-[#39358c] hover:underline"
                >
                  {service.organization.name}
                </Link>

                {service.organization.website && (
                  <p className="mt-2 break-all text-sm text-slate-500">
                    {service.organization.website}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">
                No organization linked.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Project
          </h2>

          {service.project ? (
            <div className="mt-5">
              <Link
                href={`/business/projects/${service.project.id}`}
                className="text-base font-semibold text-[#39358c] hover:underline"
              >
                {service.project.name}
              </Link>

              {service.project.projectNumber && (
                <p className="mt-1 text-sm text-slate-500">
                  {service.project.projectNumber}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No project linked.
            </p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Contract
          </h2>

          {service.contract ? (
            <div className="mt-5">
              <Link
                href={`/business/contracts/${service.contract.id}`}
                className="text-base font-semibold text-[#39358c] hover:underline"
              >
                {service.contract.title}
              </Link>

              {service.contract.contractNumber && (
                <p className="mt-1 text-sm text-slate-500">
                  {service.contract.contractNumber}
                </p>
              )}

              {service.contract.status && (
                <p className="mt-2 text-xs text-slate-500">
                  Status:{" "}
                  <span className="font-medium text-slate-700">
                    {service.contract.status}
                  </span>
                </p>
              )}
            </div>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              No contract linked.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Description
        </h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {service.description || "No description provided."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Notes
        </h2>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
          {service.notes || "No notes recorded."}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Record Information
        </h2>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <DetailItem
            label="Created"
            value={formatDateTime(service.createdAt)}
          />

          <DetailItem
            label="Last Updated"
            value={formatDateTime(service.updatedAt)}
          />

          <DetailItem
            label="Service ID"
            value={
              <span className="break-all font-mono text-xs">
                {service.id}
              </span>
            }
          />
        </dl>
      </div>
    </>
  )}
</div>

);
}
