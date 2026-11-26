import type { Metadata } from "next";
import { Mail, MapPin, Phone, Clock } from "lucide-react";
import { LazyContactMap } from "@/components/contact/lazy-contact-map";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "./contact-form";
import { formatAddress, SITE } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Contact Us | Villupuram",
    description: `Contact SMA Real Estate & Builders in Villupuram, Tamil Nadu. Call ${SITE.displayPhone}, email ${SITE.email} or send an enquiry.`,
    path: "/contact",
  });
}

export default function ContactPage() {
  const address = formatAddress();
  const mapQuery = encodeURIComponent(address);
  const items = [
    { icon: Phone, label: "Phone", value: SITE.displayPhone, href: `tel:${SITE.phone}` },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    {
      icon: MapPin,
      label: "Office",
      value: address,
      href: `https://maps.google.com/?q=${mapQuery}`,
    },
  ];

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="Contact"
        title="Let's talk property"
        description="Whether you're buying, selling or just exploring, we're here to help. Send an enquiry and it opens directly in WhatsApp."
        breadcrumb={[{ href: "/contact", label: "Contact" }]}
      />

      <div className="container-x py-8 sm:py-14">
        <div data-testid="contact-grid" className="grid items-start gap-6 sm:gap-9 lg:grid-cols-[45fr_55fr] lg:gap-10">
          <div data-testid="contact-details" className="min-w-0 space-y-6">
            <h2 className="font-display text-subheading font-semibold text-foreground">
              {SITE.name}
            </h2>
            <div className="space-y-3">
              {items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-analytics-location="contact_page"
                  data-analytics-event={item.label === "Office" ? "select_content" : undefined}
                  data-analytics-content-id={item.label === "Office" ? "get_directions" : undefined}
                  data-analytics-content-name={item.label === "Office" ? "Office directions" : undefined}
                  className="flex items-start gap-4 rounded-2xl border border-gold/25 bg-espresso p-5 transition-colors hover:border-gold/60"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/10 text-gold">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-eyebrow font-semibold uppercase tracking-wide text-white/60">{item.label}</span>
                    <span className="mt-1 block break-words text-body font-semibold text-white">{item.value}</span>
                  </span>
                </a>
              ))}
            </div>

            <div className="rounded-2xl border border-gold/25 bg-espresso p-5">
              <p className="flex items-center gap-2 text-body font-semibold text-white">
                <Clock className="h-4 w-4 text-gold" /> Office hours
              </p>
              <p className="mt-2 text-body text-white/60">Monday – Saturday · 9:00 am – 8:00 pm IST</p>
              <p className="text-body text-white/60">Sunday · By appointment</p>
            </div>

            <LazyContactMap
              src={`https://www.google.com/maps?q=${mapQuery}&z=14&output=embed`}
              title={`${SITE.name} office location`}
            />
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
