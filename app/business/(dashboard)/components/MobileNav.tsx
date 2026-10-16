"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import type { CurrentUser } from "@/lib/auth/authorization";
import {
  adminNavigation,
  businessNavigation,
  isBusinessNavigationActive,
} from "@/lib/business-navigation";

import LogoutButton from "../LogoutButton";

type MobileNavProps = {
  user: CurrentUser;
};

export default function MobileNav({ user }: MobileNavProps) {
  const pathname = usePathname();

  const allGroups =
    user.role === "ADMIN"
      ? [...businessNavigation, adminNavigation]
      : businessNavigation;

  const activeGroup =
    allGroups.find((group) =>
      group.items.some((item) =>
        isBusinessNavigationActive(pathname, item.href),
      ),
    )?.label ?? "Workspace";

  const [expandedGroup, setExpandedGroup] = useState(activeGroup);

  useEffect(() => {
    setExpandedGroup(activeGroup);
  }, [activeGroup]);

  return (
    <div className="border-b border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <Link
          href="/business"
          className="shrink-0 text-lg font-bold tracking-tight text-slate-900"
        >
          Techtrep
        </Link>

        <div className="flex min-w-0 items-center gap-3">
          <div className="hidden min-w-0 text-right sm:block">
            <p className="truncate text-sm font-medium text-slate-900">
              {user.name || "User"}
            </p>

            <p className="text-xs text-slate-500">{user.role}</p>
          </div>

          <LogoutButton />
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="space-y-2 px-4 pb-4"
      >
        {allGroups.map((group) => {
          const expanded = expandedGroup === group.label;
          const groupHasActiveItem = group.items.some((item) =>
            isBusinessNavigationActive(pathname, item.href),
          );

          return (
            <section
              key={group.label}
              className="overflow-hidden rounded-xl border border-slate-200"
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  setExpandedGroup(expanded ? "" : group.label)
                }
                className={[
                  "flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm font-semibold transition",
                  groupHasActiveItem
                    ? "bg-violet-50 text-[#39358c]"
                    : "bg-white text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <span>{group.label}</span>

                <span className="flex items-center gap-2">
                  {groupHasActiveItem && (
                    <span className="size-2 rounded-full bg-[#39358c]" />
                  )}

                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className={[
                      "size-4 transition-transform",
                      expanded ? "rotate-180" : "",
                    ].join(" ")}
                  >
                    <path
                      d="m5 7.5 5 5 5-5"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>

              {expanded && (
                <div className="space-y-1 border-t border-slate-200 p-2">
                  {group.items.map((item) => {
                    const active = isBusinessNavigationActive(
                      pathname,
                      item.href,
                    );

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "block rounded-lg px-3 py-2.5 text-sm font-medium transition",
                          active
                            ? "bg-[#39358c] text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                        ].join(" ")}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </nav>
    </div>
  );
}