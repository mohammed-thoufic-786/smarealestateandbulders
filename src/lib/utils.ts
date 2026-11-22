import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "body",
            "eyebrow",
            "nav",
            "heading",
            "subtitle",
            "subheading",
            "section",
            "property",
            "price",
            "display-1",
            "display-2",
            "display-3",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Indian numbering format for prices: ₹1,25,00,000 */
export function formatINR(value: number, opts?: { compact?: boolean }): string {
  if (!Number.isFinite(value)) return "—";
  if (opts?.compact) {
    if (value >= 1_00_00_000) return `₹${trim(value / 1_00_00_000)} Cr`;
    if (value >= 1_00_000) return `₹${trim(value / 1_00_000)} L`;
    if (value >= 1_000) return `₹${trim(value / 1_000)}K`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

function trim(n: number): string {
  return (Math.round(n * 100) / 100).toString();
}

export function formatArea(sqft?: number): string {
  if (!sqft || !Number.isFinite(sqft)) return "—";
  if (sqft >= 43560) {
    const acres = sqft / 43560;
    return `${trim(acres)} acre${acres >= 2 ? "s" : ""}`;
  }
  if (sqft >= 1000) return `${trim(sqft / 1000)}K sq.ft.`;
  return `${sqft.toLocaleString("en-IN")} sq.ft.`;
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

export function pricePerSqft(price: number, area?: number): number | null {
  if (!area || !Number.isFinite(area) || area <= 0) return null;
  return Math.round(price / area);
}

export function relativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function formatDate(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function safeJson<T>(value: unknown, fallback: T): T {
  try {
    return JSON.parse(JSON.stringify(value)) as T;
  } catch {
    return fallback;
  }
}
