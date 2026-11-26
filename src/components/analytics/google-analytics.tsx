"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getAnalyticsConsentSnapshot,
  subscribeAnalyticsConsent,
} from "@/lib/analytics";
import {
  GA4_MEASUREMENT_ID,
  ga4BootstrapScript,
  getGa4PageContext,
  getSafePagePath,
  trackGa4Event,
} from "@/lib/ga4";

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
    const safePath = getSafePagePath(url);
    trackGa4Event(
      "page_view",
      { ...getGa4PageContext(url), page_path: safePath },
      { dedupeKey: `page_view:${safePath}` },
    );
  }, [enabled, url]);

  return (
    <>
      {enabled && (
        <>
          <Script
            id="sma-ga4-loader"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="sma-ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: ga4BootstrapScript() }}
          />
        </>
      )}
    </>
  );
}
