"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type ServiceRequestStatus =
  | "OPEN"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "WAITING"
  | "RESOLVED"
  | "CLOSED"
  | "CANCELLED";

type ServiceRequestPriority =
  | "LOW"
  | "NORMAL"
  | "HIGH"
  | "URGENT";

type ServiceRequest = {
  id: string;
  requestNumber: string;
  title: string;
  description: string | null;
  status: ServiceRequestStatus;
  priority: ServiceRequestPriority;
  openedAt: string;
  firstResponseDueAt: string | null;
  resolutionDueAt: string | null;
  assignedAt: string | null;
  startedAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  resolution: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  managedService: {
    id: string;
    serviceNumber: string;
    name: string;
    type: string;
    status: string;
    sla: string;
    recurringFee: string | number | null;
    currency: string;
  };
  organization: {
    id: string;
    name: string;
    website: string | null;
    industry: string | null;
    companySize: string | null;
  };
  assignedToId: string | null;
  assignedTo: {
    id: string;
    name: string | null;
    email: string;
    role?: string | null;
    active?: boolean;
  } | null;
};

type UserOption = {
  id: string;
  name: string | null;
  email: string;
  role?: string | null;
  active?: boolean;
};

type ServiceRequestResponse = {
  success?: boolean;
  serviceRequest?: ServiceRequest;
  message?: string;
};

type UsersResponse = {
  users?: UserOption[];
  message?: string;
};

const statusLabels: Record<
  ServiceRequestStatus,
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
  ServiceRequestPriority,
  string
> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
  URGENT: "Urgent",
};

const statusTransitions: Record<
  ServiceRequestStatus,
  ServiceRequestStatus[]
> = {
  OPEN: [
    "ASSIGNED",
    "IN_PROGRESS",
    "WAITING",
    "CANCELLED",
  ],
  ASSIGNED: [
    "IN_PROGRESS",
    "WAITING",
    "CANCELLED",
  ],
  IN_PROGRESS: [
    "WAITING",
    "RESOLVED",
    "CANCELLED",
  ],
  WAITING: [
    "IN_PROGRESS",
    "RESOLVED",
    "CANCELLED",
  ],
  RESOLVED: [
    "CLOSED",
    "IN_PROGRESS",
  ],
  CLOSED: [],
  CANCELLED: [],
};

const inputClassName =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#39358c] focus:ring-1 focus:ring-[#39358c] disabled:bg-slate-50 disabled:text-slate-500";

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function statusClass(
  status: ServiceRequestStatus,
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
  priority: ServiceRequestPriority,
) {
  switch (priority) {
    case "LOW":
      return "bg-slate-100 text-slate-700";
    case "NORMAL":
      return "bg-blue-50 text-blue-700";
    case "HIGH":
      return "bg-amber-50 text-amber-700";
    case "URGENT":
      return "bg-red-50 text-red-700";
  }
}

function getSlaStatus(
  serviceRequest: ServiceRequest,
) {
  if (
    serviceRequest.status === "RESOLVED" ||
    serviceRequest.status === "CLOSED"
  ) {
    if (!serviceRequest.resolutionDueAt) {
      return {
        label: "No SLA Deadline",
        className:
          "bg-slate-100 text-slate-700",
      };
    }

    const resolvedAt = serviceRequest.resolvedAt
      ? new Date(serviceRequest.resolvedAt)
      : null;

    const resolutionDueAt = new Date(
      serviceRequest.resolutionDueAt,
    );

    if (
      resolvedAt &&
      resolvedAt.getTime() <=
        resolutionDueAt.getTime()
    ) {
      return {
        label: "Resolved Within SLA",
        className:
          "bg-emerald-50 text-emerald-700",
      };
    }

    return {
      label: "Resolution SLA Breached",
      className: "bg-red-50 text-red-700",
    };
  }

  if (!serviceRequest.resolutionDueAt) {
    return {
      label: "No SLA Deadline",
      className:
        "bg-slate-100 text-slate-700",
    };
  }

  const now = Date.now();
  const deadline = new Date(
    serviceRequest.resolutionDueAt,
  ).getTime();

  if (now >= deadline) {
    return {
      label: "SLA Breached",
      className: "bg-red-50 text-red-700",
    };
  }

  const remaining =
    deadline - now;

  const totalHours =
    remaining / (1000 * 60 * 60);

  if (totalHours <= 4) {
    return {
      label: "Approaching SLA",
      className:
        "bg-amber-50 text-amber-700",
    };
  }

  return {
    label: "Within SLA",
    className:
      "bg-emerald-50 text-emerald-700",
  };
}

function statusButtonClass(
  status: ServiceRequestStatus,
) {
  switch (status) {
    case "CANCELLED":
      return "border-red-200 text-red-700 hover:bg-red-50";
    case "RESOLVED":
      return "border-emerald-200 text-emerald-700 hover:bg-emerald-50";
    case "CLOSED":
      return "border-green-200 text-green-700 hover:bg-green-50";
    case "IN_PROGRESS":
      return "border-amber-200 text-amber-700 hover:bg-amber-50";
    default:
      return "border-slate-300 text-slate-700 hover:bg-slate-50";
  }
}

export default function ServiceRequestDetailPage() {
  const params = useParams<{
    id: string;
  }>();

  const id = params.id;

  const [serviceRequest, setServiceRequest] =
    useState<ServiceRequest | null>(null);

  const [users, setUsers] = useState<UserOption[]>(
    [],
  );

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] =
    useState(true);
  const [saving, setSaving] = useState(false);
  const [statusSaving, setStatusSaving] =
    useState<ServiceRequestStatus | null>(null);

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "NORMAL" as ServiceRequestPriority,
    assignedToId: "",
    resolution: "",
    notes: "",
  });

  const loadServiceRequest =
    useCallback(async () => {
      if (!id) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/service-requests/${id}`,
        );

        const payload: ServiceRequestResponse =
          await response.json();

        if (!response.ok) {
          throw new Error(
            payload.message ||
              "Unable to load service request.",
          );
        }

        if (!payload.serviceRequest) {
          throw new Error(
            "Service request was not returned by the API.",
          );
        }

        const request =
          payload.serviceRequest;

        setServiceRequest(request);

        setForm({
          title: request.title,
          description:
            request.description ?? "",
          priority: request.priority,
          assignedToId:
            request.assignedToId ??
            request.assignedTo?.id ??
            "",
          resolution:
            request.resolution ?? "",
          notes: request.notes ?? "",
        });
      } catch (requestError) {
        console.error(
          "Failed to load service request",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load service request.",
        );
      } finally {
        setLoading(false);
      }
    }, [id]);

  const loadUsers = useCallback(async () => {
    try {
      setUsersLoading(true);

      const response = await fetch(
        "/api/users",
      );

      const payload: UsersResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Unable to load staff.",
        );
      }

      setUsers(payload.users ?? []);
    } catch (requestError) {
      console.error(
        "Failed to load staff",
        requestError,
      );
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServiceRequest();
  }, [loadServiceRequest]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const availableTransitions =
    useMemo(() => {
      if (!serviceRequest) {
        return [];
      }

      return statusTransitions[
        serviceRequest.status
      ];
    }, [serviceRequest]);

    const slaStatus = serviceRequest
       ? getSlaStatus(serviceRequest)
       : null;

  async function saveChanges() {
    if (!serviceRequest) {
      return;
    }

    if (!form.title.trim()) {
      setError(
        "Service request title cannot be empty.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/service-requests/${serviceRequest.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: form.title.trim(),
            description:
              form.description.trim() || null,
            priority: form.priority,
            assignedToId:
              form.assignedToId || null,
            resolution:
              form.resolution.trim() || null,
            notes:
              form.notes.trim() || null,
          }),
        },
      );

      const payload: ServiceRequestResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Unable to update service request.",
        );
      }

      if (!payload.serviceRequest) {
        throw new Error(
          "Updated service request was not returned.",
        );
      }

      setServiceRequest(
        payload.serviceRequest,
      );

      setForm({
        title: payload.serviceRequest.title,
        description:
          payload.serviceRequest.description ??
          "",
        priority:
          payload.serviceRequest.priority,
        assignedToId:
          payload.serviceRequest.assignedToId ??
          payload.serviceRequest.assignedTo?.id ??
          "",
        resolution:
          payload.serviceRequest.resolution ??
          "",
        notes:
          payload.serviceRequest.notes ?? "",
      });

      setEditing(false);
      setSuccess(
        "Service request updated successfully.",
      );
    } catch (requestError) {
      console.error(
        "Failed to update service request",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to update service request.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(
    nextStatus: ServiceRequestStatus,
  ) {
    if (!serviceRequest) {
      return;
    }

    try {
      setStatusSaving(nextStatus);
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/service-requests/${serviceRequest.id}`,
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

      const payload: ServiceRequestResponse =
        await response.json();

      if (!response.ok) {
        throw new Error(
          payload.message ||
            "Unable to change service request status.",
        );
      }

      if (!payload.serviceRequest) {
        throw new Error(
          "Updated service request was not returned.",
        );
      }

      setServiceRequest(
        payload.serviceRequest,
      );

      setForm((current) => ({
        ...current,
        resolution:
          payload.serviceRequest
            ?.resolution ?? current.resolution,
      }));

      setSuccess(
        `Service request moved to ${statusLabels[nextStatus]}.`,
      );
    } catch (requestError) {
      console.error(
        "Failed to change service request status",
        requestError,
      );

      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to change service request status.",
      );
    } finally {
      setStatusSaving(null);
    }
  }

  if (loading) {
    return (
      <main className="p-6">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading service request...
        </div>
      </main>
    );
  }

  if (!serviceRequest) {
    return (
      <main className="space-y-4 p-6">
        <Link
          href="/business/service-requests"
          className="text-sm font-medium text-[#39358c] hover:underline"
        >
          ← Back to Service Requests
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error ||
            "The service request could not be found."}
        </div>
      </main>
    );
  }

  const isTerminal =
    serviceRequest.status === "CLOSED" ||
    serviceRequest.status === "CANCELLED";

  return (
    <main className="space-y-6 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            href="/business/service-requests"
            className="text-sm font-medium text-[#39358c] hover:underline"
          >
            ← Back to Service Requests
          </Link>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-slate-900">
              {serviceRequest.requestNumber}
            </h1>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusClass(
                serviceRequest.status,
              )}`}
            >
              {statusLabels[
                serviceRequest.status
              ]}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityClass(
                serviceRequest.priority,
              )}`}
            >
              {priorityLabels[
                serviceRequest.priority
              ]}{" "}
              Priority
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Manage the support request, assignment,
            priority and operational status.
          </p>
        </div>

        {!isTerminal && (
          <button
            type="button"
            onClick={() => {
              setEditing((current) => !current);
              setError("");
              setSuccess("");
            }}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {editing ? "Cancel Edit" : "Edit Request"}
          </button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">
                Request Details
              </h2>

              <span className="text-xs text-slate-500">
                Opened {formatDate(
                  serviceRequest.openedAt,
                )}
              </span>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="request-title"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Title
                </label>

                {editing ? (
                  <input
                    id="request-title"
                    value={form.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        title:
                          event.target.value,
                      }))
                    }
                    className={inputClassName}
                    maxLength={200}
                  />
                ) : (
                  <p className="text-sm text-slate-900">
                    {serviceRequest.title}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="request-description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                {editing ? (
                  <textarea
                    id="request-description"
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description:
                          event.target.value,
                      }))
                    }
                    rows={7}
                    className={inputClassName}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {serviceRequest.description ||
                      "No description provided."}
                  </div>
                )}
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="request-priority"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Priority
                  </label>

                  {editing ? (
                    <select
                      id="request-priority"
                      value={form.priority}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          priority:
                            event.target
                              .value as ServiceRequestPriority,
                        }))
                      }
                      className={inputClassName}
                    >
                      {Object.entries(
                        priorityLabels,
                      ).map(
                        ([value, label]) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ),
                      )}
                    </select>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${priorityClass(
                        serviceRequest.priority,
                      )}`}
                    >
                      {
                        priorityLabels[
                          serviceRequest.priority
                        ]
                      }
                    </span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="request-assignee"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Assigned To
                  </label>

                  {editing ? (
                    <select
                      id="request-assignee"
                      value={form.assignedToId}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          assignedToId:
                            event.target.value,
                        }))
                      }
                      disabled={usersLoading}
                      className={inputClassName}
                    >
                      <option value="">
                        {usersLoading
                          ? "Loading staff..."
                          : "Unassigned"}
                      </option>

                      {users
                        .filter(
                          (user) =>
                            user.active !== false,
                        )
                        .map((user) => (
                          <option
                            key={user.id}
                            value={user.id}
                          >
                            {user.name ||
                              user.email}
                            {user.name
                              ? ` — ${user.email}`
                              : ""}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <p className="text-sm text-slate-700">
                      {serviceRequest
                        .assignedTo?.name ||
                        serviceRequest
                          .assignedTo?.email ||
                        "Unassigned"}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="request-resolution"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Resolution
                </label>

                {editing ? (
                  <textarea
                    id="request-resolution"
                    value={form.resolution}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        resolution:
                          event.target.value,
                      }))
                    }
                    rows={5}
                    className={inputClassName}
                    placeholder="Describe how the issue was resolved..."
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {serviceRequest.resolution ||
                      "No resolution recorded yet."}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="request-notes"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Internal Notes
                </label>

                {editing ? (
                  <textarea
                    id="request-notes"
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        notes:
                          event.target.value,
                      }))
                    }
                    rows={5}
                    className={inputClassName}
                  />
                ) : (
                  <div className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {serviceRequest.notes ||
                      "No internal notes."}
                  </div>
                )}
              </div>

              {editing && (
                <div className="flex justify-end border-t border-slate-200 pt-5">
                  <button
                    type="button"
                    onClick={() =>
                      void saveChanges()
                    }
                    disabled={saving}
                    className="rounded-lg bg-[#39358c] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Status Timeline
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                [
                  "Opened",
                  serviceRequest.openedAt,
                ],
                [
                  "Assigned",
                  serviceRequest.assignedAt,
                ],
                [
                  "Started",
                  serviceRequest.startedAt,
                ],
                [
                  "Resolved",
                  serviceRequest.resolvedAt,
                ],
                [
                  "Closed",
                  serviceRequest.closedAt,
                ],
                [
                  "Last Updated",
                  serviceRequest.updatedAt,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg bg-slate-50 p-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm text-slate-800">
                    {formatDate(
                      value as string | null,
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Status
            </h2>

            <div className="mt-4">
              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-sm font-medium ${statusClass(
                  serviceRequest.status,
                )}`}
              >
                {
                  statusLabels[
                    serviceRequest.status
                  ]
                }
              </span>
            </div>

            {!isTerminal &&
              availableTransitions.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Move To
                  </p>

                  {availableTransitions.map(
                    (nextStatus) => (
                      <button
                        key={nextStatus}
                        type="button"
                        onClick={() =>
                          void changeStatus(
                            nextStatus,
                          )
                        }
                        disabled={
                          statusSaving !== null
                        }
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 ${statusButtonClass(
                          nextStatus,
                        )}`}
                      >
                        <span>
                          {
                            statusLabels[
                              nextStatus
                            ]
                          }
                        </span>

                        {statusSaving ===
                          nextStatus && (
                          <span className="text-xs">
                            Updating...
                          </span>
                        )}
                      </button>
                    ),
                  )}
                </div>
              )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Managed Service
            </h2>

            <div className="mt-4 space-y-3">
              <div>
                <p className="text-xs text-slate-500">
                  Service
                </p>

                <Link
                  href={`/business/managed-services/${serviceRequest.managedService.id}`}
                  className="mt-1 block text-sm font-medium text-[#39358c] hover:underline"
                >
                  {
                    serviceRequest.managedService
                      .serviceNumber
                  }{" "}
                  —{" "}
                  {
                    serviceRequest.managedService
                      .name
                  }
                </Link>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Type
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {
                    serviceRequest.managedService
                      .type
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  SLA
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {
                    serviceRequest.managedService
                      .sla
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Service Status
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {
                    serviceRequest.managedService
                      .status
                  }
                </p>
              </div>
            </div>
          </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-slate-900">
                SLA
              </h2>

              {slaStatus && (
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${slaStatus.className}`}
                >
                  {slaStatus.label}
                </span>
              )}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-slate-500">
                  SLA Level
                </p>

                <p className="mt-1 text-sm font-medium text-slate-700">
                  {
                    serviceRequest.managedService
                      .sla
                  }
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  First Response Due
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    serviceRequest.firstResponseDueAt,
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Resolution Due
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {formatDate(
                    serviceRequest.resolutionDueAt,
                  )}
                </p>
              </div>

              {serviceRequest.resolvedAt && (
                <div>
                  <p className="text-xs text-slate-500">
                    Resolved
                  </p>

                  <p className="mt-1 text-sm text-slate-700">
                    {formatDate(
                      serviceRequest.resolvedAt,
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Organization
            </h2>

            <div className="mt-4 space-y-3">
              <Link
                href={`/business/organizations/${serviceRequest.organization.id}`}
                className="block text-sm font-medium text-[#39358c] hover:underline"
              >
                {serviceRequest.organization.name}
              </Link>

              {serviceRequest.organization
                .industry && (
                <div>
                  <p className="text-xs text-slate-500">
                    Industry
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {
                      serviceRequest
                        .organization.industry
                    }
                  </p>
                </div>
              )}

              {serviceRequest.organization
                .companySize && (
                <div>
                  <p className="text-xs text-slate-500">
                    Company Size
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {
                      serviceRequest
                        .organization.companySize
                    }
                  </p>
                </div>
              )}

              {serviceRequest.organization
                .website && (
                <div>
                  <p className="text-xs text-slate-500">
                    Website
                  </p>
                  <p className="mt-1 break-all text-sm text-slate-700">
                    {
                      serviceRequest.organization
                        .website
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold text-slate-900">
              Request Information
            </h2>

            <dl className="mt-4 space-y-3">
              <div className="flex justify-between gap-4">
                <dt className="text-xs text-slate-500">
                  Request Number
                </dt>
                <dd className="text-right text-sm font-medium text-slate-700">
                  {serviceRequest.requestNumber}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-xs text-slate-500">
                  Created
                </dt>
                <dd className="text-right text-sm text-slate-700">
                  {formatDate(
                    serviceRequest.createdAt,
                  )}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-xs text-slate-500">
                  Updated
                </dt>
                <dd className="text-right text-sm text-slate-700">
                  {formatDate(
                    serviceRequest.updatedAt,
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </main>
  );
}