"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const onPropertyPage = pathname.startsWith("/property/");

  return (
    <Link
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with SMA Real Estate & Builders on WhatsApp"
      className={cn(
        "fixed right-4 z-40 grid h-12 w-12 place-items-center rounded-full border border-gold/40 bg-cream text-primary shadow-luxe transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-surface hover:shadow-glow sm:right-6",
        onPropertyPage ? "bottom-24 lg:bottom-6" : "bottom-5 sm:bottom-6",
      )}
    >
      <MessageCircle className="h-5 w-5" fill="currentColor" />
    </Link>
  );
}
