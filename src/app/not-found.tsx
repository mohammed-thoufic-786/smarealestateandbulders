import type { Metadata } from "next";
import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export const metadata: Metadata = {
  title: { absolute: "Page not found | SMA Real Estate" },
  description: "The page you requested is not available. Browse SMA properties, locations or contact our team.",
  alternates: { canonical: null },
  openGraph: null,
  twitter: null,
};

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-espresso px-6">
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo light />
        </div>
        <p className="mt-10 font-display text-7xl font-bold text-white">404</p>
        <h1 className="mt-4 font-display text-section font-semibold text-white">This page has moved on</h1>
        <p className="mt-3 text-body text-line">
          The page you&apos;re looking for doesn&apos;t exist or is no longer available. Let&apos;s get you back
          on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-nav font-semibold text-espresso transition-colors hover:bg-gold-400"
          >
            <Home className="h-4 w-4" /> Back home
          </Link>
          <Link
            href="/buy"
            className="flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
          >
            <Search className="h-4 w-4" /> Browse properties
          </Link>
          <Link
            href="/locations"
            className="flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
          >
            <Compass className="h-4 w-4" /> Explore locations
          </Link>
        </div>
      </div>
    </div>
  );
}
