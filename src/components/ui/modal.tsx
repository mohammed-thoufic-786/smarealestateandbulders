"use client";

import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./modal.module.css";

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => element.tabIndex >= 0);
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const titleId = useId();

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const opener = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const focusFrame = window.requestAnimationFrame(() => {
      const target = panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ?? panelRef.current;
      target?.focus();
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusable(panelRef.current);
      if (!focusable.length) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (!panelRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
        return;
      }

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      opener?.focus();
    };
  }, [open, returnFocusRef]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={() => onCloseRef.current()}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        tabIndex={-1}
        className={cn(
          "relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-gold/30 bg-deep shadow-lift animate-fade-up",
          styles.panel,
          className,
        )}
      >
        <div className="shrink-0 border-b border-gold/15 bg-deep p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 id={titleId} className="text-subheading font-semibold text-white">
                  {title}
                </h2>
              )}
              {description && <p className="mt-1 text-body text-line">{description}</p>}
            </div>
            <button
              type="button"
              onClick={() => onCloseRef.current()}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-line transition-colors hover:bg-gold/10 hover:text-gold"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div
          className={cn("min-h-0 flex-1 overflow-y-auto overscroll-contain bg-deep p-4 sm:p-5", styles.scrollArea)}
        >
          {children}
        </div>
        {footer && <div className="shrink-0 border-t border-gold/15 bg-deep p-4 sm:p-5">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
