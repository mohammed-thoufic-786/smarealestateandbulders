"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
} from "@/lib/analytics";

const MEASUREMENT_ID = "G-8653TRZ6EN";

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  __smaGa4Initialized?: boolean;
};

const bootstrapScript = `
if (!window.__smaGa4Initialized) {
  window.__smaGa4Initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", ${JSON.stringify(MEASUREMENT_ID)}, { send_page_view: false });
}
`;

function initializeGa4(): void {
  if (typeof window === "undefined") return;
  const analyticsWindow = window as GtagWindow;
  if (analyticsWindow.__smaGa4Initialized) return;

  analyticsWindow.__smaGa4Initialized = true;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.gtag ??= function (...args: unknown[]) {
    analyticsWindow.dataLayer?.push(args);
  };
  analyticsWindow.gtag("js", new Date());
  analyticsWindow.gtag("config", MEASUREMENT_ID, { send_page_view: false });
}

function pushGtag(command: string, ...args: unknown[]): void {
  if (typeof window === "undefined") return;
  initializeGa4();
  const analyticsWindow = window as GtagWindow;
  analyticsWindow.gtag?.(command, ...args);
}

export function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    () => null,
  );
  const lastUrl = useRef<string | null>(null);
  const query = searchParams.toString();
  const url = query ? `${pathname}?${query}` : pathname;
  const enabled = consent === "accepted";

  useEffect(() => {
    if (!enabled) lastUrl.current = null;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || lastUrl.current === url) return;
    lastUrl.current = url;
    pushGtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [enabled, url]);

  return (
    <>
      {enabled && (
        <>
          <Script
            id="sma-ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="sma-ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: bootstrapScript }}
          />
        </>
      )}
    </>
  );
}
