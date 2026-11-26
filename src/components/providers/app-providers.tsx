"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { MotionProvider } from "@/components/motion/motion-provider";
import { cn } from "@/lib/utils";

/* ------------------------------- Toasts ---------------------------------- */

type ToastTone = "success" | "error" | "info";
interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}
interface ToastCtx {
  toast: (message: string, tone?: ToastTone) => void;
}
const ToastContext = createContext<ToastCtx | null>(null);

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const toast = useCallback((message: string, tone: ToastTone = "success") => {
    counter.current += 1;
    const id = counter.current;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const toastValue = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={toastValue}>
      <MotionProvider>{children}</MotionProvider>
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 text-body shadow-lift animate-fade-up",
              t.tone === "success" && "border-gold/30 bg-deep text-white",
              t.tone === "error" && "border-danger/40 bg-deep text-white",
              t.tone === "info" && "border-gold/20 bg-deep text-white",
            )}
            role="status"
          >
            {t.tone === "success" && <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />}
            {t.tone === "error" && <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />}
            {t.tone === "info" && <Info className="mt-0.5 h-4 w-4 shrink-0 text-line" />}
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))}
              className="text-line transition-colors hover:text-white"
              aria-label="Dismiss"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within AppProviders");
  return ctx;
}
