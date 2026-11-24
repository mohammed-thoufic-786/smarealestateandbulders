"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { SmartImage } from "@/components/ui/smart-image";

export function LayoutViewer({
  src,
  alt,
  title,
}: {
  src: string;
  alt: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const previewButton = previewButtonRef.current;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previewButton?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={previewButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Open full-screen view of ${title} layout`}
        className="relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-gold/25 bg-espresso transition-colors hover:border-gold/60"
      >
        <SmartImage
          src={src}
          alt={alt}
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-contain"
        />
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} original layout drawing`}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-50 grid place-items-center bg-espresso/95 p-3 sm:p-8"
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setOpen(false);
            }}
            aria-label="Close full-screen layout view"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-gold/30 bg-espresso/90 text-white transition-colors hover:border-gold hover:text-gold sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="relative h-full w-full">
            <SmartImage
              src={src}
              alt={alt}
              fill
              unoptimized
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
