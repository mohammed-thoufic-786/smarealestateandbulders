"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X, Play } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";
import type { PropertyImage } from "@/lib/types";

export function Gallery({
  images,
  title,
  videoUrl,
}: {
  images: PropertyImage[];
  title: string;
  videoUrl?: string;
}) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const count = images.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (count === 0) {
    return <div className="aspect-[16/10] rounded-2xl bg-espresso" />;
  }

  const current = images[index];

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-[2.4fr_1fr]">
        <button
          onClick={() => setOpen(true)}
          className="group relative aspect-[16/11] overflow-hidden rounded-2xl"
          aria-label="Open gallery"
        >
          <SmartImage
            src={current.url}
            alt={current.alt || title}
            fill
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
          />
          <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-gold/30 bg-espresso/80 text-white backdrop-blur-md transition-colors group-hover:bg-gold group-hover:text-foreground">
            <Expand className="h-4 w-4" />
          </span>
          <span className="absolute bottom-3 left-3 rounded-full bg-espresso/80 px-3 py-1 text-sm text-white backdrop-blur-md">
            {index + 1} / {count}
          </span>
        </button>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-1">
          {images.slice(0, 3).map((img, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setOpen(true);
              }}
              className={cn(
                "group relative aspect-square overflow-hidden rounded-xl sm:aspect-auto",
                i === 0 && "sm:flex-1",
              )}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={img.url} alt={img.alt} fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              {i === 2 && count > 3 && (
                <span className="absolute inset-0 grid place-items-center bg-espresso/80 text-nav font-semibold text-white">
                  +{count - 3}
                </span>
              )}
              {i === 2 && videoUrl && count <= 3 && (
                <span className="absolute inset-0 grid place-items-center bg-espresso/80 text-white">
                  <Play className="h-5 w-5" />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div className="motion-fade-in fixed inset-0 z-[120] flex flex-col bg-espresso/95">
            <div className="flex items-center justify-between px-4 py-4 text-white">
              <span className="text-sm">
                {index + 1} / {count}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-gold/10 hover:text-gold"
                aria-label="Close gallery"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex-1">
              <SmartImage
                src={current.url}
                alt={current.alt || title}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {count > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-espresso/80 text-white backdrop-blur-md hover:bg-gold hover:text-foreground"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-espresso/80 text-white backdrop-blur-md hover:bg-gold hover:text-foreground"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto p-4 no-scrollbar">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`View image ${i + 1}: ${img.alt}`}
                  className={cn(
                    "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2",
                    i === index ? "border-gold" : "border-transparent opacity-60",
                  )}
                >
                  <SmartImage src={img.url} alt={img.alt} fill sizes="96px" className="object-cover" />
                </button>
              ))}
            </div>
        </div>
      )}
    </>
  );
}
