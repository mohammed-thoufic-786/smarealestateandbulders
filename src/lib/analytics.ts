const CONSENT_KEY = "sma-analytics-consent";
const ALLOWED_EVENT_PARAMS = new Set([
  "content_name",
  "content_category",
  "content_ids",
  "value",
  "currency",
]);

type AnalyticsWindow = Window & {
  clarity?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[];
    push?: (...args: unknown[]) => number;
    loaded?: boolean;
    version?: string;
  };
};

export type AnalyticsConsent = "accepted" | "rejected";
export type AnalyticsEventName = "PageView" | "Contact" | "Lead";
export type AnalyticsEventParams = Record<string, string | number | boolean>;

export function readAnalyticsConsent(): AnalyticsConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function saveAnalyticsConsent(consent: AnalyticsConsent): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, consent);
  window.dispatchEvent(new Event("analytics-consent-change"));
}

export function subscribeAnalyticsConsent(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener("analytics-consent-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("analytics-consent-change", callback);
  };
}

export function getAnalyticsConsentSnapshot(): AnalyticsConsent | null {
  return readAnalyticsConsent();
}

export function trackAnalyticsEvent(
  name: AnalyticsEventName,
  params: AnalyticsEventParams = {},
): void {
  if (typeof window === "undefined") return;
  if (readAnalyticsConsent() !== "accepted") return;

  const safeParams = Object.fromEntries(
    Object.entries(params).filter(([key]) => ALLOWED_EVENT_PARAMS.has(key)),
  );
  const analyticsWindow = window as AnalyticsWindow;

  analyticsWindow.clarity?.("track", name, safeParams);
  analyticsWindow.fbq?.("track", name, safeParams);
}
