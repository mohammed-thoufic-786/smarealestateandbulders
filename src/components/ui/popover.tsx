"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Popover({
  trigger,
  children,
  align = "left",
  className,
}: {
  trigger: (args: { toggle: () => void; open: boolean }) => React.ReactNode;
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ toggle: () => setOpen((o) => !o), open })}
      {open && (
        <div
          className={cn(
            "absolute z-40 mt-2 min-w-48 rounded-xl border border-gold/25 bg-deep p-1.5 shadow-lift animate-scale-in",
            align === "right" ? "right-0" : "left-0",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
