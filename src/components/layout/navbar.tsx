"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Menu, Phone, X } from "lucide-react";
import { Logo } from "./logo";
import { NAV_LINKS, site } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAVBAR_BG = "bg-background";
const NAVBAR_BORDER = "border-line";
const BRAND_SIZE =
  "shrink-0 [&_img]:mix-blend-darken [&_img]:h-[47px] md:[&_img]:h-9 lg:[&_img]:h-10 xl:[&_img]:h-[52px] [&_span>span:first-child]:text-[20px]/[1.4] md:[&_span>span:first-child]:text-nav xl:[&_span>span:first-child]:text-[22px]/[1.4] [&_span>span:last-child]:text-[17.5px]/[1.5] md:[&_span>span:last-child]:text-eyebrow xl:[&_span>span:last-child]:text-[18.5px]/[1.5]";

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
          "fixed inset-x-0 top-0 z-50 h-20 border-b sm:h-[88px]",
          NAVBAR_BG,
          NAVBAR_BORDER,
          scrolled && "shadow-[0_8px_24px_rgba(11,45,32,0.08)]",
        )}
      >
        <div className="container-x flex h-full items-center pl-8 sm:pl-[41px]">
          <Logo className={BRAND_SIZE} />

          <nav
            aria-label="Primary"
            className="hidden flex-1 items-center justify-center gap-5 md:flex lg:-translate-x-[27px] lg:gap-11"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                data-active={isActive(link.href)}
                className={cn(
                  "nav-link whitespace-nowrap text-sm font-medium transition-colors lg:text-[18px]",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-muted hover:text-primary",
                )}
              >
                {link.label === "Locations" ? "Location" : link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden shrink-0 items-center gap-5 md:flex lg:gap-[42px]">
            <Link
              href="/contact"
              className="whitespace-nowrap text-sm font-semibold text-primary transition-colors hover:text-primary-deep lg:text-[17px]"
            >
              Contact Us
            </Link>
            <Link
              href="/buy"
              className="inline-flex h-10 -translate-y-[2px] items-center justify-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-deep lg:h-11 lg:px-[25px] lg:text-[17px]"
            >
              Browse Properties
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-primary/5 md:hidden"
            aria-label="Open menu"
            aria-expanded={open}
          >
            <Menu className="h-5 w-5" />
          </button>
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
            <div className="absolute inset-0 bg-primary-deep/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site navigation"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "absolute inset-x-3 bottom-3 top-3 flex flex-col overflow-hidden rounded-[28px] border border-line bg-background shadow-lift",
              )}
            >
              <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
                <Logo className={BRAND_SIZE} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-primary/5"
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
                      "flex items-center justify-between rounded-2xl px-4 py-3.5 text-nav font-semibold transition-colors",
                      isActive(link.href)
                        ? "bg-primary text-white"
                        : "text-muted hover:bg-primary/5 hover:text-primary",
                    )}
                  >
                    {link.label === "Locations" ? "Location" : link.label}
                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                ))}
              </div>

              <div className="space-y-2.5 border-t border-line p-5" onClick={() => setOpen(false)}>
                <Link href="/contact" className={buttonVariants({ size: "lg", className: "w-full whitespace-nowrap" })}>
                  Contact Us
                </Link>
                <Link
                  href="/buy"
                  className={buttonVariants({
                    size: "lg",
                    className: "w-full whitespace-nowrap border-transparent text-white",
                    variant: "primary",
                  })}
                >
                  Browse Properties <ArrowRight className="h-4 w-4" />
                </Link>
                <a
                  href={`tel:${site.phone.replace(/\s/g, "")}`}
                  className="flex items-center justify-center gap-2 py-2 text-sm font-semibold text-muted"
                >
                  <Phone className="h-4 w-4 shrink-0 text-primary" /> {site.displayPhone}
                </a>
                <p className="pt-1 text-center text-sm text-muted">
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
