import Link from "next/link";

import type { CurrentUser } from "@/lib/auth/authorization";

import LogoutButton from "../LogoutButton";

type SidebarProps = {
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
  label: "Security",
  href: "/business/security",
},
];


export default function Sidebar({ user }: SidebarProps) {
return ( <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col"> <div className="flex h-16 items-center border-b border-slate-200 px-6"> <Link
       href="/business"
       className="text-xl font-bold tracking-tight text-slate-900"
     >
Techtrep </Link> </div>

  <nav className="flex-1 space-y-1 overflow-y-auto p-4">
    {navigation.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
      >
        {item.label}
      </Link>
      
    ))}

    {user.role === "ADMIN" && (
      <div className="pt-6">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Administration
        </p>

        <Link
          href="/business/admin"
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Admin
        </Link>
<Link
  href="/business/admin/audit-log"
  className="mt-1 block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
>
  Security Audit Log
</Link>

      </div>
    )}
  </nav>

  <div className="border-t border-slate-200 p-4">
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
