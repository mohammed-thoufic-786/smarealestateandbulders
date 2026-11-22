import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function Rating({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`${value} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          width={size}
          height={size}
          className={i < Math.round(value) ? "fill-gold text-gold" : "text-line/40"}
        />
      ))}
    </div>
  );
}
