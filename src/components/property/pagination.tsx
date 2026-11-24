import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  basePath,
  queryString,
  page,
  pages,
}: {
  basePath: string;
  queryString: string;
  page: number;
  pages: number;
}) {
  if (pages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(queryString);
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const s = params.toString();
    return `${basePath}${s ? `?${s}` : ""}`;
  };

  const nums: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) nums.push(i);

  return (
    <nav className="mt-8 flex items-center justify-center gap-1.5 sm:mt-12" aria-label="Pagination">
      <Link
        href={href(Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-primary shadow-soft transition-colors",
          page === 1 ? "pointer-events-none opacity-40" : "hover:border-gold hover:bg-gold/10 hover:text-primary-deep",
        )}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {nums[0] > 1 && <span className="px-1 text-muted">…</span>}
      {nums.map((n) => (
        <Link
          key={n}
          href={href(n)}
          className={cn(
            "grid h-10 min-w-10 place-items-center rounded-full border px-3 text-nav shadow-soft transition-colors",
            n === page
              ? "border-gold bg-gold font-semibold text-primary-deep"
              : "border-line bg-surface text-primary hover:border-gold hover:bg-gold/10 hover:text-primary-deep",
          )}
        >
          {n}
        </Link>
      ))}
      {nums[nums.length - 1] < pages && <span className="px-1 text-muted">…</span>}
      <Link
        href={href(Math.min(pages, page + 1))}
        aria-disabled={page === pages}
        className={cn(
          "grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-primary shadow-soft transition-colors",
          page === pages ? "pointer-events-none opacity-40" : "hover:border-gold hover:bg-gold/10 hover:text-primary-deep",
        )}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
