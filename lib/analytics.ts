export type AnalyticsEvent =
  | "free_audit_view"
  | "free_audit_start"
  | "free_audit_submit"
  | "contact_click"
  | "phone_click"
  | "whatsapp_click"
  | "email_click"
  | "proposal_view"
  | "proposal_accept";

declare global {
  interface Window {
    gtag?: (
      command: "event" | "config",
      eventNameOrId: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEvent,
  parameters?: Record<string, unknown>
) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", eventName, parameters);
}