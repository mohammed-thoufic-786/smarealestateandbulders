"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2, Move, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const STEP = 0.5;

export function LayoutViewer({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [scale, setScale] = useState(MIN_SCALE);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const zoomIn = useCallback(() => {
    setScale((s) => Math.min(MAX_SCALE, Math.round((s + STEP) * 10) / 10));
  }, []);
  const zoomOut = useCallback(() => {
    const next = Math.max(MIN_SCALE, Math.round((scale - STEP) * 10) / 10);
    setScale(next);
    if (next === MIN_SCALE) setOffset({ x: 0, y: 0 });
  }, [scale]);
  const reset = useCallback(() => {
    setScale(MIN_SCALE);
    setOffset({ x: 0, y: 0 });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await el.requestFullscreen();
    } catch {
      /* fullscreen can be blocked by the browser; zoom controls still work */
    }
  }, []);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === containerRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      setScale((s) =>
        Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round((s + (event.deltaY < 0 ? STEP : -STEP)) * 10) / 10)),
      );
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "+" || event.key === "=") zoomIn();
      else if (event.key === "-") zoomOut();
      else if (event.key === "0") reset();
      else if (event.key.toLowerCase() === "f") void toggleFullscreen();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomIn, zoomOut, reset, toggleFullscreen]);

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (scale === MIN_SCALE) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX - offset.x, y: event.clientY - offset.y };
    setDragging(true);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;
    setOffset({
      x: event.clientX - dragRef.current.x,
      y: event.clientY - dragRef.current.y,
    });
  }

  function endDrag() {
    dragRef.current = null;
    setDragging(false);
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-gold/25 bg-espresso",
        fullscreen ? "h-full w-full rounded-none" : "aspect-[16/10]",
      )}
    >
      <div className="absolute inset-0 grid place-items-center">
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={cn(
            "relative h-full w-full touch-none select-none",
            scale > MIN_SCALE ? "cursor-grab" : "cursor-zoom-in",
            dragging && "cursor-grabbing",
            !dragging && "transition-transform duration-200 ease-smooth",
          )}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` }}
        >
          <SmartImage
            src={src}
            alt={alt}
            fill
            unoptimized
            priority
            sizes="100vw"
            className="pointer-events-none object-contain"
          />
        </div>
      </div>

      <div className="absolute right-3 top-3 z-10 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-espresso/85 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
          aria-label="Zoom in on the layout"
          title="Zoom in (+)"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-espresso/85 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold disabled:opacity-40"
          aria-label="Zoom out of the layout"
          title="Zoom out (-)"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={reset}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-espresso/85 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
          aria-label="Fit the whole layout"
          title="Fit to screen (0)"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => void toggleFullscreen()}
          className="grid h-10 w-10 place-items-center rounded-full border border-gold/25 bg-espresso/85 text-white backdrop-blur-md transition-colors hover:border-gold hover:text-gold"
          aria-label={fullscreen ? "Exit full-screen layout view" : "View layout full screen"}
          title="Full screen (F)"
        >
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full bg-espresso/80 px-3 py-1.5 text-eyebrow text-white backdrop-blur-md">
          {title} · Original layout drawing
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-espresso/80 px-3 py-1.5 text-eyebrow text-white/80 backdrop-blur-md">
          <Move className="h-3 w-3" /> Scroll to zoom · Drag to pan · {Math.round(scale * 100)}%
        </span>
      </div>
    </div>
  );
}
