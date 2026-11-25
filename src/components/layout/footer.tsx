import Link from "next/link";
import { Mail, MapPin, Phone, Instagram, Facebook, MessageCircle } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "./newsletter-form";
import { FOOTER_LINKS, formatAddress, site } from "@/lib/site";

const columns = [
  { title: "Quick Links", links: FOOTER_LINKS.explore },
  { title: "Tools", links: FOOTER_LINKS.tools },
  { title: "Company", links: FOOTER_LINKS.company },
];

const SOCIALS = [
  { href: site.social.instagram, label: "Instagram", Icon: Instagram },
  { href: site.social.facebook, label: "Facebook", Icon: Facebook },
  { href: site.social.whatsapp, label: "WhatsApp", Icon: MessageCircle },
];

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-gold/25 bg-primary-deep text-white sm:mt-24">
      <div className="container-x py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-body leading-relaxed text-cream/80">
              {site.description}
            </p>
            <div className="mt-6 space-y-3 text-body text-cream/80">
              <p className="font-semibold text-white">{site.name}</p>
              <p className="flex items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-gold/80" /> {formatAddress()}
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold/80" />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {site.displayPhone}
                </a>
              </p>
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold/80" />
                <a href={`mailto:${site.email}`} className="hover:text-white">
                  {site.email}
                </a>
              </p>
            </div>
            <div className="mt-6 max-w-sm sm:mt-8">
              <p className="mb-2 text-eyebrow font-semibold uppercase tracking-[0.2em] text-white">
                New listings & updates, monthly
              </p>
              <NewsletterForm />
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title}>
                <h4 className="text-eyebrow font-bold uppercase tracking-[0.2em] text-white">{col.title}</h4>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-body text-cream/80 transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-gold/20 pt-6 sm:mt-12 sm:gap-6 sm:pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-primary-deep"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-cream/70">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
            <span className="hidden sm:inline">·</span>
            <span>RERA-aware listings · Prices set by owners</span>
          </div>
        </div>

        <p className="mt-6 text-sm text-cream/60 sm:mt-8">
          © {new Date().getFullYear()} {site.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
