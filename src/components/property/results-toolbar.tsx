"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List, X } from "lucide-react";
import { SORT_OPTIONS, CATEGORY_LABELS } from "@/lib/constants";
import { cn, formatINR } from "@/lib/utils";
import { Popover } from "@/components/ui/popover";

export function ResultsToolbar({
  basePath,
  total,
  view,
}: {
  basePath: string;
  total: number;
  view: "grid" | "list";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(overrides: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(overrides).forEach(([k, v]) => {
      if (v === null) params.delete(k);
      else params.set(k, v);
    });
    params.delete("page");
    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  }

  const chips: { key: string; label: string }[] = [];
  const add = (k: string, label: string) => chips.push({ key: k, label });

  if (searchParams.get("q")) add("q", `“${searchParams.get("q")}”`);
  const cat = searchParams.get("category");
  if (cat && CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]) add("category", CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]);
  const minP = searchParams.get("minPrice");
  const maxP = searchParams.get("maxPrice");
  if (minP || maxP) {
    add("__price", `${minP ? formatINR(Number(minP), { compact: true }) : "₹0"} – ${maxP ? formatINR(Number(maxP), { compact: true }) : "∞"}`);
  }
  if (searchParams.get("bedrooms")) add("bedrooms", `${searchParams.get("bedrooms")}+ beds`);
  if (searchParams.get("facing")) add("facing", searchParams.get("facing")!.replace("_", " "));
  if (searchParams.get("verified") === "true") add("verified", "Verified only");
  searchParams.getAll("amenity").forEach((a, i) => add(`amenity:${i}`, a));

  function removeChip(key: string) {
    if (key === "__price") {
      update({ minPrice: null, maxPrice: null });
      return;
    }
    if (key.startsWith("amenity:")) {
      const idx = Number(key.split(":")[1]);
      const all = searchParams.getAll("amenity");
      all.splice(idx, 1);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("amenity");
      all.forEach((a) => params.append("amenity", a));
      params.delete("page");
      router.push(`${basePath}?${params.toString()}`, { scroll: false });
      return;
    }
    update({ [key]: null });
  }

  const sort = searchParams.get("sort") ?? "recent";
  const sortLabel = SORT_OPTIONS.find((s) => s.value === sort)?.label ?? "Recently added";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body text-muted">
          <span className="font-semibold text-foreground">{total}</span> {total === 1 ? "property" : "properties"} found
        </p>

        <div className="flex items-center gap-2">
          <Popover
            align="right"
            trigger={({ toggle }) => (
              <button
                onClick={toggle}
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-nav text-foreground transition-colors hover:border-gold"
              >
                Sort: {sortLabel}
              </button>
            )}
          >
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ sort: opt.value })}
                className={cn(
                  "block w-full rounded-lg px-3 py-2 text-left text-nav transition-colors hover:bg-gold/10",
                  sort === opt.value ? "text-gold" : "text-line",
                )}
              >
                {opt.label}
              </button>
            ))}
          </Popover>

          <div className="flex items-center rounded-full border border-line p-1">
            {(["grid", "list"] as const).map((v) => (
              <button
                key={v}
                onClick={() => update({ view: v === "grid" ? null : v })}
                className={cn(
                  "grid h-8 w-8 place-items-center rounded-full transition-colors",
                  view === v ? "bg-gold text-ink" : "text-muted hover:text-gold",
                )}
                aria-label={`${v} view`}
                aria-pressed={view === v}
              >
                {v === "grid" ? <LayoutGrid className="h-4 w-4" /> : <List className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={() => removeChip(chip.key)}
              className="group flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-sm capitalize text-foreground transition-colors hover:border-gold/60"
            >
              {chip.label}
              <X className="h-3 w-3 text-muted group-hover:text-danger" />
            </button>
          ))}
          <button
            onClick={() => router.push(basePath, { scroll: false })}
            className="text-nav font-semibold text-gold hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
