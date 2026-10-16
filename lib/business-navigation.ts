export type BusinessNavigationItem = {
  label: string;
  href: string;
};

export type BusinessNavigationGroup = {
  label: string;
  items: BusinessNavigationItem[];
};

export const businessNavigation: BusinessNavigationGroup[] = [
  {
    label: "Workspace",
    items: [
      { label: "Dashboard", href: "/business" },
    ],
  },
  {
    label: "Sales & CRM",
    items: [
      { label: "Leads", href: "/business/leads" },
      { label: "Organizations", href: "/business/organizations" },
      { label: "Contacts", href: "/business/contacts" },
      { label: "Audit Requests", href: "/business/audit-requests" },
      { label: "Opportunities", href: "/business/opportunities" },
    ],
  },
  {
    label: "Commercial",
    items: [
      { label: "Proposals", href: "/business/proposals" },
      { label: "Contracts", href: "/business/contracts" },
      { label: "Invoices", href: "/business/invoices" },
      { label: "Payments", href: "/business/payments" },
    ],
  },
  {
    label: "Delivery & Support",
    items: [
      { label: "Projects", href: "/business/projects" },
      { label: "Managed Services", href: "/business/managed-services" },
      { label: "Service Requests", href: "/business/service-requests" },
    ],
  },
  {
    label: "Insights & Security",
    items: [
      { label: "Activities", href: "/business/activities" },
      { label: "Performance", href: "/business/performance" },
      { label: "Security", href: "/business/security" },
    ],
  },
];

export const adminNavigation: BusinessNavigationGroup = {
  label: "Administration",
  items: [
    { label: "Admin", href: "/business/admin" },
    { label: "Security Audit Log", href: "/business/admin/audit-log" },
    { label: "Team Performance", href: "/business/performance/team" },
    { label: "Staff Performance", href: "/business/admin/performance" },
  ],
};

export function isBusinessNavigationActive(
  pathname: string,
  href: string,
): boolean {
  if (href === "/business") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}