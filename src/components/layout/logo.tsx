import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden>
      <rect width="32" height="32" rx="9" fill="#123F2B" />
      <path
        d="M8 17.2 16 10l8 7.2"
        stroke="#C6A052"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.5 16.4V23h11v-6.6"
        stroke="#C6A052"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <Link href="/" className={cn("group inline-flex min-w-0 items-center gap-2.5", className)} aria-label={site.name}>
      <Image
        src="/brand/sma-logo.png"
        alt=""
        width={1024}
        height={1024}
        priority
        className="h-9 w-auto shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transform-none lg:h-10"
      />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "whitespace-nowrap font-display text-nav font-extrabold tracking-tight",
            light ? "text-white" : "text-foreground",
          )}
        >
          SMA Real Estate
        </span>
        <span
          className={cn(
            "mt-1 whitespace-nowrap text-eyebrow font-semibold uppercase tracking-[0.24em]",
            light ? "text-line" : "text-muted",
          )}
        >
          &amp; Builders
        </span>
      </span>
    </Link>
  );
}
