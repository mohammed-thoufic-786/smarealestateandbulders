import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  title,
  subtitle,
  description,
  action,
  align = "left",
  className,
  inverted = false,
}: {
  title: React.ReactNode;
  subtitle?: string;
  description?: string;
  action?: { href: string; label: string };
  align?: "left" | "center";
  className?: string;
  inverted?: boolean;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-5",
        align === "center" && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        <h2
          data-motion-heading
          className={
            `text-balance font-display text-heading font-bold ` +
            (inverted ? "text-white" : "text-foreground")
          }
        >
          <span data-motion-heading-line className="block overflow-hidden">
            <span data-motion-heading-inner className="block">
              {title}
            </span>
          </span>
        </h2>
        {subtitle && (
          <p
            className={
              `mt-2 text-pretty text-subtitle font-medium ` +
              (inverted ? "text-gold" : "text-gold-600")
            }
          >
            {subtitle}
          </p>
        )}
        {description && (
          <p
            className={cn(
              "mt-3 text-pretty text-body leading-relaxed",
              inverted ? "text-white/70" : "text-foreground/75",
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-nav font-semibold",
            inverted ? "text-white hover:text-gold" : "text-foreground hover:text-gold-600",
          )}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </Reveal>
  );
}
