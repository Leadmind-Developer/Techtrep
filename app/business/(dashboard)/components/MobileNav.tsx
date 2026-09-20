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
label: "Audits",
href: "/business/audits",
},
{
label: "Opportunities",
href: "/business/opportunities",
},
{
label: "Activities",
href: "/business/activities",
},
];

export default function MobileNav({
user,
}: MobileNavProps) {
const pathname = usePathname();

return ( <div className="border-b border-slate-200 bg-white lg:hidden"> <div className="flex items-center justify-between px-4 py-4"> <Link
       href="/business"
       className="text-lg font-bold tracking-tight text-slate-900"
     >
Techtrep </Link>

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
    {navigation.map((item) => {
      const active =
        item.href === "/business"
          ? pathname === item.href
          : pathname.startsWith(item.href);

      return (
        <Link
          key={item.href}
          href={item.href}
          className={[
            "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
            active
              ? "bg-slate-900 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
          ].join(" ")}
        >
          {item.label}
        </Link>
      );
    })}

    {user.role === "ADMIN" && (
      <Link
        href="/business/admin"
        className={[
          "whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition",
          pathname.startsWith("/business/admin")
            ? "bg-slate-900 text-white"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900",
        ].join(" ")}
      >
        Admin
      </Link>
    )}
  </nav>
</div>

);
}
