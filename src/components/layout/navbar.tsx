"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, ArrowRight, ChevronRight } from "lucide-react";
import { Logo } from "./logo";
import { NAV_LINKS, site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        data-testid="site-header"
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b border-gold/20 bg-espresso backdrop-blur-md transition-shadow duration-500 ease-smooth",
          scrolled ? "shadow-luxe" : "shadow-none",
        )}
      >
        <div className="container-x flex h-20 items-center gap-4 md:gap-5 lg:gap-8 xl:gap-12">
          <Logo light className="shrink-0" />

          <nav aria-label="Primary" className="hidden shrink-0 items-center gap-0.5 md:flex xl:gap-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "whitespace-nowrap rounded-md px-2 py-2 text-sm font-semibold transition-colors xl:px-3 xl:text-nav",
                  isActive(link.href) ? "text-gold" : "text-white/75 hover:text-white",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex shrink-0 items-center justify-end gap-3 lg:gap-4">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="hidden items-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold text-white/75 transition-colors hover:text-white md:inline-flex xl:text-nav"
            >
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              {site.phone}
            </a>

            <Link
              href="/buy"
              className={buttonVariants({ size: "sm", className: "hidden lg:inline-flex whitespace-nowrap" })}
            >
              Browse Properties <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-md text-white transition-colors hover:bg-white/10 md:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[90] md:hidden"
          >
            <div className="absolute inset-0 bg-espresso/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col overflow-x-hidden border-l border-gold/25 bg-espresso shadow-lift"
            >
              <div className="flex items-center justify-between gap-3 border-b border-gold/20 px-5 py-4">
                <Logo light />
                <button
                  onClick={() => setOpen(false)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-line hover:bg-gold/10 hover:text-gold"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4" onClick={() => setOpen(false)}>
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-between rounded-xl px-4 py-3.5 text-nav font-semibold transition-colors",
                      isActive(link.href)
                        ? "bg-gold/10 text-gold"
                        : "text-line hover:bg-gold/[0.06] hover:text-white",
                    )}
                  >
                    {link.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-gold/20 p-5" onClick={() => setOpen(false)}>
                <Link href="/buy" className={buttonVariants({ size: "lg", className: "w-full whitespace-nowrap" })}>
                  Browse Properties <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className={buttonVariants({ variant: "outline", size: "lg", className: "w-full whitespace-nowrap" })}
                >
                  <Phone className="h-4 w-4 shrink-0" /> {site.phone}
                </a>
                <p className="pt-1 text-center text-sm text-line">
                  Available 9am–8pm · Tamil Nadu
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
