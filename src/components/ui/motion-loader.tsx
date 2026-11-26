"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

export function MotionLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const noPreference = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const idleWindow = window as IdleWindow;
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let idleHandle: number | undefined;
    let timeoutHandle: number | undefined;

    const cancelScheduled = () => {
      if (idleHandle != null && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle);
      }
      if (timeoutHandle != null) window.clearTimeout(timeoutHandle);
      idleHandle = undefined;
      timeoutHandle = undefined;
    };

    const unmountMotion = () => {
      cleanup?.();
      cleanup = undefined;
    };

    const start = () => {
      if (cancelled || !desktop.matches || !noPreference.matches || cleanup) return;
      void import("@/lib/motion")
        .then(({ initHomeMotion }) => {
          if (cancelled || !desktop.matches || !noPreference.matches) return;
          cleanup = initHomeMotion();
        })
        .catch(() => {});
    };

    const schedule = () => {
      cancelScheduled();
      if (!desktop.matches || !noPreference.matches || cleanup) return;
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(start, { timeout: 2000 });
      } else {
        timeoutHandle = window.setTimeout(start, 200);
      }
    };

    const onChange = () => {
      if (!desktop.matches || !noPreference.matches) {
        cancelScheduled();
        unmountMotion();
        return;
      }
      schedule();
    };

    schedule();
    desktop.addEventListener("change", onChange);
    noPreference.addEventListener("change", onChange);

    return () => {
      cancelled = true;
      cancelScheduled();
      unmountMotion();
      desktop.removeEventListener("change", onChange);
      noPreference.removeEventListener("change", onChange);
    };
  }, [pathname]);

  return null;
}
