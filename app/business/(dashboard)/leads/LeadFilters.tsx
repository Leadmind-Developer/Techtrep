"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "DISCOVERY", label: "Discovery" },
  { value: "PROPOSAL_SENT", label: "Proposal sent" },
  { value: "NEGOTIATION", label: "Negotiation" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
] as const;

const SOURCE_OPTIONS = [
  { value: "", label: "All sources" },
  { value: "WEBSITE", label: "Website" },
  { value: "AUDIT", label: "Audit" },
  { value: "REFERRAL", label: "Referral" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
  { value: "PHONE", label: "Phone" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "SOCIAL_MEDIA", label: "Social media" },
  { value: "DIRECT", label: "Direct" },
  { value: "OTHER", label: "Other" },
] as const;

export default function LeadFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const search = searchParams.get("search") ?? "";
  const status = searchParams.get("status") ?? "";
  const source = searchParams.get("source") ?? "";

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    params.delete("page");

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get("search") ?? "").trim();

    updateParams({
      search: value,
    });
  }

  function clearFilters() {
    startTransition(() => {
      router.push(pathname);
    });
  }

  const hasFilters = Boolean(search || status || source);

  return (
    <div className="space-y-4">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col gap-3 lg:flex-row"
      >
        <div className="flex-1">
          <label htmlFor="lead-search" className="sr-only">
            Search leads
          </label>

          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>

            <input
              id="lead-search"
              name="search"
              type="search"
              defaultValue={search}
              placeholder="Search organization, contact, email or notes..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <select
          value={status}
          onChange={(event) =>
            updateParams({
              status: event.target.value,
            })
          }
          disabled={isPending}
          aria-label="Filter by status"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={source}
          onChange={(event) =>
            updateParams({
              source: event.target.value,
            })
          }
          disabled={isPending}
          aria-label="Filter by source"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-60"
        >
          {SOURCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            disabled={isPending}
            className="text-left text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-60 sm:ml-1"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}