"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const REVEAL_SELECTOR = "[data-motion-reveal]";
const VISIBLE_ATTRIBUTE = "data-motion-visible";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    let observer: IntersectionObserver | null = null;

    const clear = () => {
      observer?.disconnect();
      observer = null;
      document.documentElement.removeAttribute("data-motion");
    };

    const showAll = () => {
      clear();
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        element.setAttribute(VISIBLE_ATTRIBUTE, "true");
      });
    };

    const sync = () => {
      clear();
      if (media.matches) {
        showAll();
        return;
      }

      const targets = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      if (targets.length === 0) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      targets.forEach((element) => {
        if (element.getBoundingClientRect().top < viewportHeight * 0.95) {
          element.setAttribute(VISIBLE_ATTRIBUTE, "true");
        }
      });

      document.documentElement.setAttribute("data-motion", "ready");
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.setAttribute(VISIBLE_ATTRIBUTE, "true");
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );

      targets.forEach((element) => {
        if (element.getAttribute(VISIBLE_ATTRIBUTE) === "true") return;
        observer?.observe(element);
      });
    };

    sync();
    media.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      clear();
    };
  }, [pathname]);

  return children;
}
