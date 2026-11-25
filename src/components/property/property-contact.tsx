"use client";

import { Phone, MessageCircle, CalendarCheck, FileDown } from "lucide-react";
import { formatINR } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SiteVisitModal } from "./site-visit-modal";
import { ShareButton } from "./share-button";
import { site, whatsappLink } from "@/lib/site";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { propertyWhatsappMessage } from "@/lib/business-config";

interface Summary {
  id: string;
  title: string;
  location: string;
  slug: string;
  price: number;
  listingType: string;
  verified: boolean;
}

export function EnquiryPanel({ property }: { property: Summary }) {
  const priceText = property.price > 0 ? formatINR(property.price, { compact: true }) : "Price on request";
  const waMsg = propertyWhatsappMessage(property.title, property.slug);
  const trackLead = () =>
    trackAnalyticsEvent("Lead", { content_name: "Property enquiry", content_category: property.slug });

  return (
    <div className="space-y-4 sm:sticky sm:top-24">
      <div className="rounded-2xl border border-gold/30 bg-espresso p-6">
        <p className="text-eyebrow font-semibold uppercase tracking-wide text-white/60">Price</p>
        <p className="mt-1 font-display text-price font-bold text-white">{priceText}</p>

        <div className="mt-5 space-y-2.5">
          <a
            href={whatsappLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackLead}
            className={buttonVariants({ size: "lg", className: "w-full" })}
          >
            <MessageCircle className="h-4 w-4" /> Enquire now
          </a>
          <SiteVisitModal
            propertyTitle={property.title}
            triggerLabel={
              <>
                <CalendarCheck className="h-4 w-4" /> Schedule Site Visit
              </>
            }
            triggerSize="lg"
            triggerClassName="w-full"
          />
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="flex items-center justify-center gap-2 rounded-full border border-gold/30 py-2.5 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              <Phone className="h-4 w-4" /> Call
            </a>
          <a
            href={whatsappLink(waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackLead}
            className="flex items-center justify-center gap-2 rounded-full border border-gold/30 py-2.5 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
          </div>
          <a
            href="#brochure"
            className="flex items-center justify-center gap-2 rounded-full border border-gold/30 py-2.5 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
          >
            <FileDown className="h-4 w-4" /> Download brochure
          </a>
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-gold/30 pt-5">
          <ShareButton title={property.title} label />
        </div>
      </div>

      <p className="px-1 text-sm leading-relaxed text-white/60">
        Prices are available on request. Confirm current pricing and documents with our team before committing.
      </p>
    </div>
  );
}

export function MobileActionBar({ property }: { property: Summary }) {
  const waMsg = propertyWhatsappMessage(property.title, property.slug);
  const trackLead = () =>
    trackAnalyticsEvent("Lead", { content_name: "Property enquiry", content_category: property.slug });

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/30 bg-espresso/95 px-3 py-2.5 backdrop-blur-lg lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href={`tel:${site.phone.replace(/\s/g, "")}`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 text-white transition-colors hover:border-gold hover:text-gold"
          aria-label={`Call ${site.displayPhone}`}
        >
          <Phone className="h-4 w-4" />
        </a>
        <a
          href={whatsappLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackLead}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 text-white transition-colors hover:border-gold hover:text-gold"
          aria-label="Chat with SMA Real Estate & Builders on WhatsApp"
        >
          <MessageCircle className="h-4 w-4" />
        </a>
        <a
          href={whatsappLink(waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackLead}
          className={buttonVariants({ size: "lg", className: "flex-1" })}
        >
          <MessageCircle className="h-4 w-4" /> Enquire
        </a>
      </div>
    </div>
  );
}
