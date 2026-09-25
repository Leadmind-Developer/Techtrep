"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type {
  PerformanceDrilldownMetric,
  PerformanceDrilldownRecord,
  PerformanceDrilldownResult,
} from "@/lib/performance/staff-performance-drilldown";

type PerformanceDrilldownProps = {
  staffId: string;
  period: string;
  from: string;
  to: string;
};

type MetricOption = {
  value: PerformanceDrilldownMetric;
  label: string;
};

const metrics: MetricOption[] = [
  {
    value: "leads-generated",
    label: "Leads Generated",
  },
  {
    value: "qualified-leads",
    label: "Qualified Leads",
  },
  {
    value: "opportunities-created",
    label: "Opportunities Created",
  },
  {
    value: "opportunities-won",
    label: "Opportunities Won",
  },
  {
    value: "opportunities-lost",
    label: "Opportunities Lost",
  },
  {
    value: "open-opportunities",
    label: "Open Opportunities",
  },
  {
    value: "activities",
    label: "Activities",
  },
];

function formatCurrency(
  value: number | null,
): string {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatLabel(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

function getRecordHref(
  record: PerformanceDrilldownRecord,
): string | null {
  if (record.type === "lead") {
    return `/business/leads/${record.id}`;
  }

  if (record.type === "opportunity") {
    return `/business/opportunities/${record.id}`;
  }

  if (record.type === "activity") {
    return `/business/activities/${record.id}`;
  }

  return null;
}

export default function PerformanceDrilldown({
  staffId,
  period,
  from,
  to,
}: PerformanceDrilldownProps) {
  const [metric, setMetric] =
    useState<PerformanceDrilldownMetric>(
      "leads-generated",
    );

  const [result, setResult] =
    useState<PerformanceDrilldownResult | null>(
      null,
    );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [page, setPage] = useState(1);

  const pageSize = 25;

  useEffect(() => {
    setPage(1);
  }, [metric, staffId, period, from, to]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      params.set("metric", metric);
      params.set("staffId", staffId);
      params.set("period", period);
      params.set("page", String(page));
      params.set("pageSize", String(pageSize));

      if (from) {
        params.set("from", from);
      }

      if (to) {
        params.set("to", to);
      }

      try {
        const response = await fetch(
          `/api/performance/drilldown?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        const body = await response.json();

        if (!response.ok || !body.success) {
          throw new Error(
            body.message ||
              "Unable to load performance details.",
          );
        }

        if (!cancelled) {
          setResult(body.data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setResult(null);

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load performance details.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [
    metric,
    staffId,
    period,
    from,
    to,
    page,
  ]);

  const metricLabel = useMemo(
    () =>
      metrics.find(
        (item) => item.value === metric,
      )?.label ?? "Performance Details",
    [metric],
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-600">
              Drill-Down
            </p>

            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              {metricLabel}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View the records contributing to this
              performance metric.
            </p>
          </div>

          <div className="w-full lg:w-72">
            <label
              htmlFor="performance-drilldown-metric"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Metric
            </label>

            <select
              id="performance-drilldown-metric"
              value={metric}
              onChange={(event) =>
                setMetric(
                  event.target
                    .value as PerformanceDrilldownMetric,
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              {metrics.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading performance details…
        </div>
      ) : error ? (
        <div className="p-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">
              Unable to load performance details
            </p>

            <p className="mt-1 text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      ) : !result ||
        result.records.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No records found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            There are no records contributing to this
            metric for the selected reporting period.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Record
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Value
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Created
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Closed
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {result.records.map((record) => {
                  const href =
                    getRecordHref(record);

                  const content = (
                    <>
                      <div className="font-medium text-slate-900">
                        {record.title}
                      </div>

                      {record.subtitle && (
                        <div className="mt-1 text-xs text-slate-500">
                          {record.subtitle}
                        </div>
                      )}
                    </>
                  );

                  return (
                    <tr
                      key={`${record.type}-${record.id}`}
                      className="hover:bg-slate-50"
                    >
                      <td className="px-6 py-4">
                        {href ? (
                          <Link
                            href={href}
                            className="block hover:text-indigo-600"
                          >
                            {content}
                          </Link>
                        ) : (
                          content
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {record.status
                          ? formatLabel(
                              record.status,
                            )
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-700">
                        {formatCurrency(
                          record.value,
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(
                          record.createdAt.toString(),
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {record.closedAt
                          ? formatDate(
                              record.closedAt.toString(),
                            )
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              {(result.page - 1) *
                result.pageSize +
                1}{" "}
              –{" "}
              {Math.min(
                result.page * result.pageSize,
                result.total,
              )}{" "}
              of {result.total}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={result.page <= 1}
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.max(1, current - 1),
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="px-2 text-sm text-slate-500">
                Page {result.page} of{" "}
                {result.totalPages}
              </span>

              <button
                type="button"
                disabled={
                  result.page >=
                  result.totalPages
                }
                onClick={() =>
                  setPage(
                    (current) =>
                      Math.min(
                        result.totalPages,
                        current + 1,
                      ),
                  )
                }
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}