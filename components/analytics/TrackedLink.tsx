"use client";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  event: AnalyticsEvent;
  params?: Record<string, string>;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export default function TrackedLink({
  href,
  event,
  params,
  children,
  className,
  target,
  rel,
}: TrackedLinkProps) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={() => trackEvent(event, params)}
      className={className}
    >
      {children}
    </a>
  );
}