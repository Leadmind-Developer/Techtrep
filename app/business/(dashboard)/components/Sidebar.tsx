"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CurrentUser } from "@/lib/auth/authorization";
import {
  adminNavigation,
  businessNavigation,
  isBusinessNavigationActive,
} from "@/lib/business-navigation";

import LogoutButton from "../LogoutButton";

type SidebarProps = {
  user: CurrentUser;
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const renderGroup = (
    group: (typeof businessNavigation)[number],
  ) => (
    <div key={group.label} className="space-y-1">
      <h2 className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
        {group.label}
      </h2>

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
                ? "bg-[#39358c] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-6">
        <Link
          href="/business"
          className="text-xl font-bold tracking-tight text-slate-900"
        >
          Techtrep
        </Link>
      </div>

      <nav
        aria-label="Main navigation"
        className="flex-1 space-y-2 overflow-y-auto p-4"
      >
        {businessNavigation.map(renderGroup)}

        {user.role === "ADMIN" && (
          <div className="space-y-1 border-t border-slate-200 pt-2">
            <h2 className="px-3 pb-1 pt-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {adminNavigation.label}
            </h2>

            {adminNavigation.items.map((item) => {
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
                      ? "bg-[#39358c] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <div className="shrink-0 border-t border-slate-200 p-4">
        <div className="mb-3 px-3">
          <p className="truncate text-sm font-semibold text-slate-900">
            {user.name || "User"}
          </p>

          <p className="truncate text-xs text-slate-500">
            {user.email}
          </p>

          <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
            {user.role}
          </span>
        </div>

        <LogoutButton />
      </div>
    </aside>
  );
}