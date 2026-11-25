"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useRef, useSyncExternalStore } from "react";
import {
  getAnalyticsConsentSnapshot,
  saveAnalyticsConsent,
  subscribeAnalyticsConsent,
  trackAnalyticsEvent,
  type AnalyticsConsent,
} from "@/lib/analytics";
import styles from "./analytics.module.css";

const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

function clarityScript(projectId: string): string {
  return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(projectId)});`;
}

function metaPixelScript(pixelId: string): string {
  return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init",${JSON.stringify(pixelId)});fbq("track","PageView");`;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const consent = useSyncExternalStore(
    subscribeAnalyticsConsent,
    getAnalyticsConsentSnapshot,
    () => null,
  );
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (consent !== "accepted") return;
    if (lastPath.current === pathname) return;
    if (lastPath.current === null) {
      lastPath.current = pathname;
      return;
    }

    lastPath.current = pathname;
    trackAnalyticsEvent("PageView", { content_name: pathname });
  }, [consent, pathname]);

  function choose(next: AnalyticsConsent): void {
    saveAnalyticsConsent(next);
  }

  return (
    <>
      <div key={pathname} className="page-transition">
        {children}
      </div>
      {consent === "accepted" && (
        <>
          {CLARITY_PROJECT_ID && (
            <Script
              id="sma-clarity"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: clarityScript(CLARITY_PROJECT_ID) }}
            />
          )}
          {META_PIXEL_ID && (
            <Script
              id="sma-meta-pixel"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{ __html: metaPixelScript(META_PIXEL_ID) }}
            />
          )}
        </>
      )}
      {consent === null && (
        <aside
          className={styles.banner}
          role="dialog"
          aria-label="Analytics consent"
          style={{ pointerEvents: "none" }}
        >
          <p className={styles.title}>Help us improve this site</p>
          <p className={styles.copy}>
            We use anonymous analytics to understand visits. No personal details are sent.
          </p>
          <div className={styles.actions} style={{ pointerEvents: "auto" }}>
            <button type="button" className={styles.accept} onClick={() => choose("accepted")}>
              Accept
            </button>
            <button type="button" className={styles.decline} onClick={() => choose("rejected")}>
              Decline
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
