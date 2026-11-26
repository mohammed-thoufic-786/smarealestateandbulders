"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

const callbacks = new WeakMap<Element, () => void>();
let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver | null {
  if (typeof IntersectionObserver === "undefined") return null;
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );
  }
  return observer;
}

export function Reveal({
  className,
  delay = 0,
  children,
  ...props
}: {
  className?: string;
  delay?: number;
  children: ReactNode;
} & Record<string, unknown>) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (
      window
        .matchMedia("(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)")
        .matches &&
      node.closest("[data-motion-gsap]")
    ) {
      return;
    }

    const io = getObserver();
    if (!io) return;

    node.style.setProperty("--reveal-delay", `${delay}ms`);
    const reveal = () => {
      node.classList.add("is-revealing");
      node.addEventListener(
        "animationend",
        () => {
          node.classList.remove("is-revealing");
          node.style.removeProperty("--reveal-delay");
        },
        { once: true },
      );
    };

    callbacks.set(node, reveal);
    io.observe(node);
    return () => {
      io.unobserve(node);
      callbacks.delete(node);
    };
  }, [delay]);

  return (
    <div ref={ref} className={cn("motion-reveal", className)} {...props}>
      {children}
    </div>
  );
}
