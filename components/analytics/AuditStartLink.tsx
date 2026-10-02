"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type AuditStartLinkProps = {
  location: string;
  children: React.ReactNode;
  className?: string;
};

export default function AuditStartLink({
  location,
  children,
  className,
}: AuditStartLinkProps) {
  return (
    <Link
      href="/free-technology-audit"
      onClick={() =>
        trackEvent("free_audit_start", {
          location,
        })
      }
      className={className}
    >
      {children}
    </Link>
  );
}