"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends Omit<ImageProps, "onError"> {
  fallbackLabel?: string;
}

export function SmartImage({ className, alt, fallbackLabel, ...props }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-ivory-200 via-ivory-300 to-charcoal/[0.06] text-stone",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="h-6 w-6 opacity-60" />
        {fallbackLabel !== "" && (
          <span className="max-w-[80%] truncate px-3 text-eyebrow opacity-60">{fallbackLabel ?? alt}</span>
        )}
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
