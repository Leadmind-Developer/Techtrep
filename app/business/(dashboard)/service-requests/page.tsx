"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type ServiceRequest = {
  id: string;
  requestNumber: string;
  title: string;
  description: string | null;
  status:
    | "OPEN"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "WAITING"
    | "RESOLVED"
    | "CLOSED"
    | "CANCELLED";
  priority:
    | "LOW"
    | "NORMAL"
    | "HIGH"
    | "URGENT";
  openedAt: string;
  managedService: {
    id: string;
    serviceNumber: string;
    name: string;
    type: string;
  };
  organization: {
    id: string;
    name: string;
  };
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
  } | null;
};

type ApiResponse = {
  success?: boolean;
  requests?: ServiceRequest[];
  message?: string;
};

const statusLabels: Record<
  ServiceRequest["status"],
  string
> = {
  OPEN: "Open",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  WAITING: "Waiting",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
  CANCELLED: "Cancelled",
};

const priorityLabels: Record<
  ServiceRequest["priority"],
  string
> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function statusClass(
  status: ServiceRequest["status"],
) {
  switch (status) {
    case "OPEN":
      return "bg-blue-50 text-blue-700";
    case "ASSIGNED":
      return "bg-violet-50 text-violet-700";
    case "IN_PROGRESS":
      return "bg-amber-50 text-amber-700";
    case "WAITING":
      return "bg-slate-100 text-slate-700";
    case "RESOLVED":
      return "bg-emerald-50 text-emerald-700";
    case "CLOSED":
      return "bg-green-50 text-green-700";
    case "CANCELLED":
      return "bg-red-50 text-red-700";
  }
}

function priorityClass(
  priority: ServiceRequest["priority"],
) {
  switch (priority) {
    case "LOW":
      return "text-slate-500";
    case "NORMAL":
      return "text-slate-700";
    case "HIGH":
      return "text-amber-700";
    case "URGENT":
      return "font-semibold text-red-700";
  }
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<
    ServiceRequest[]
  >([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = useCallback(async () => {
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

      if (priority) {
        params.set("priority", priority);
      }

      const query = params.toString();

      const response = await fetch(
        `/api/service-requests${
          query ? `?${query}` : ""
        }`,
      );

      const payload: ApiResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Unable to load service requests.",
        );
      }

      setRequests(payload.requests ?? []);
    } catch (requestError) {
      console.error(
        "Failed to load service requests",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to load service requests.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, status, priority]);

  useEffect(() => {
    void loadRequests();
  }, [loadRequests]);

  const total = requests.length;
  const open = requests.filter(
    (request) =>
      request.status === "OPEN",
  ).length;
  const inProgress = requests.filter(
    (request) =>
      request.status === "IN_PROGRESS",
  ).length;
  const urgent = requests.filter(
    (request) =>
      request.priority === "URGENT" &&
      !["CLOSED", "CANCELLED"].includes(
        request.status,
      ),
  ).length;

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Service Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and manage operational support requests
            across managed services.
          </p>
        </div>

        <Link
          href="/business/service-requests/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#39358c] px-4 py-2.5 text-sm font-medium text-white hover:opacity-90"
        >
          New Service Request
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Total", total],
          ["Open", open],
          ["In Progress", inProgress],
          ["Urgent", urgent],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-slate-200 bg-white p-5"
          >
            <p className="text-sm text-slate-500">
              {label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-3">
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search request number, title or organization..."
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#39358c]"
          />

          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#39358c]"
          >
            <option value="">All statuses</option>
            {Object.entries(statusLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#39358c]"
          >
            <option value="">All priorities</option>
            {Object.entries(priorityLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {loading ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Loading service requests...
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-medium text-slate-900">
              No service requests found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create a service request to begin tracking
              support work.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  {[
                    "Request",
                    "Organization",
                    "Managed Service",
                    "Priority",
                    "Status",
                    "Assigned To",
                    "Opened",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/business/service-requests/${request.id}`}
                        className="font-medium text-[#39358c] hover:underline"
                      >
                        {request.requestNumber}
                      </Link>
                      <p className="mt-1 max-w-xs text-sm text-slate-700">
                        {request.title}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.organization.name}
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        {request.managedService.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {request.managedService.serviceNumber}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={priorityClass(
                          request.priority,
                        )}
                      >
                        {
                          priorityLabels[
                            request.priority
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(
                          request.status,
                        )}`}
                      >
                        {
                          statusLabels[
                            request.status
                          ]
                        }
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-700">
                      {request.assignedTo?.name ||
                        request.assignedTo?.email ||
                        "Unassigned"}
                    </td>

                    <td className="px-4 py-4 text-sm text-slate-500">
                      {formatDate(request.openedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}