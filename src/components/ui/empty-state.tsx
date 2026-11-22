import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/25 bg-deep/70 px-6 py-12 text-center sm:py-16",
        className,
      )}
    >
      {Icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h3 className="text-subheading font-semibold text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-body text-line">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
