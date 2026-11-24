import Link from "next/link";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  breadcrumb,
  children,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { href: string; label: string }[];
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <header className="border-b border-gold/20 bg-primary-deep pt-20 sm:pt-28">
      <div className="container-x py-8 sm:py-16">
        {breadcrumb && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-line sm:mb-5">
            <Link href="/" className="hover:text-gold">
              Home
            </Link>
            {breadcrumb.map((b) => (
              <span key={b.href} className="flex items-center gap-2">
                <span>/</span>
                <Link href={b.href} className="hover:text-gold">
                  {b.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className={cn(align === "center" && "mx-auto max-w-2xl text-center")}>
          {eyebrow && <p className="eyebrow text-gold">{eyebrow}</p>}
          <h1 className="mt-3 text-balance font-display text-display-2 font-bold text-white">{title}</h1>
          {description && (
            <p
              className={cn(
                "mt-3 text-pretty text-body leading-relaxed text-line sm:mt-4",
                align === "center" ? "mx-auto max-w-xl" : "max-w-2xl",
              )}
            >
              {description}
            </p>
          )}
          {children && <div className="mt-6 sm:mt-8">{children}</div>}
        </div>
      </div>
    </header>
  );
}
