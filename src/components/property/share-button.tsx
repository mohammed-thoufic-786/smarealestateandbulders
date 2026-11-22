"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { useToast } from "@/components/providers/app-providers";
import { cn } from "@/lib/utils";

export function ShareButton({ title, className, label }: { title: string; className?: string; label?: boolean }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast("Link copied to clipboard.", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Could not share. Copy the URL from your browser.", "info");
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-white transition-colors hover:border-gold hover:text-gold",
        label && "h-auto w-auto gap-2 px-3 py-2",
        className,
      )}
      aria-label="Share property"
    >
      {copied ? <Check className="h-4 w-4 text-success" /> : <Share2 className="h-4 w-4" />}
      {label && <span className="text-nav font-semibold">Share</span>}
    </button>
  );
}
