"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CurrentUser } from "@/lib/auth/authorization";

import LogoutButton from "../LogoutButton";

type MobileNavProps = {
  user: CurrentUser;
};

const navigation = [
  {
    label: "Dashboard",
    href: "/business",
  },
  {
    label: "Leads",
    href: "/business/leads",
  },
  {
    label: "Organizations",
    href: "/business/organizations",
  },
  {
    label: "Contacts",
    href: "/business/contacts",
  },
  {
    label: "Audit Requests",
    href: "/business/audit-requests",
  },
  {
    label: "Opportunities",
    href: "/business/opportunities",
  },
  {
    label: "Activities",
    href: "/business/activities",
  },
  {
    label: "Performance",
    href: "/business/performance",
  },
  {
    label: "Security",
    href: "/business/security",
  },
];

const adminNavigation = [
  {
    label: "Admin",
    href: "/business/admin",
  },
  {
    label: "Staff Performance",
    href: "/business/admin/performance",
  },
  {
    label: "Team Performance",
    href: "/business/performance/team",
  },
];

export default function MobileNav({
  user,
}: MobileNavProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/business") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  const linkClasses = (active: boolean) =>
    [
      "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
      active
        ? "bg-slate-900 text-white"
        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
    ].join(" ");

  return (
    <div className="border-b border-slate-200 bg-white lg:hidden">
      <div className="flex items-center justify-between px-4 py-4">
        <Link
          href="/business"
          className="text-lg font-bold tracking-tight text-slate-900"
        >
          Techtrep
        </Link>

        <div className="flex items-center gap-2">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-900">
              {user.name || "User"}
            </p>

            <p className="text-xs text-slate-500">
              {user.role}
            </p>
          </div>

          <LogoutButton />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClasses(isActive(item.href))}
          >
            {item.label}
          </Link>
        ))}

        {user.role === "ADMIN" &&
          adminNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={linkClasses(isActive(item.href))}
            >
              {item.label}
            </Link>
          ))}
      </nav>
    </div>
  );
}