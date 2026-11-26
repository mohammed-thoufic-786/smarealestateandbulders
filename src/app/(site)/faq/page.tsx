import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion } from "@/components/ui/accordion";
import { FAQS } from "@/lib/data/site-content";
import { faqJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappLink } from "@/lib/site";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Property Buying FAQs | Tamil Nadu",
    description:
      "Answers about plots, layout drawings, site visits, pricing on request and buying property in Tamil Nadu with SMA Real Estate.",
    path: "/faq",
  });
}

export default function FaqPage() {
  return (
    <div className="bg-cream">
      <JsonLd data={faqJsonLd(FAQS)} />
      <PageHeader
        eyebrow="Support"
        title="Frequently asked questions"
        description="Everything you might want to know before you start. Still stuck? We're a message away."
        breadcrumb={[{ href: "/faq", label: "FAQ" }]}
      />

      <div className="container-x py-8 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <Accordion items={FAQS} />

          <div className="mt-8 rounded-2xl border border-gold/25 bg-foreground p-8 text-center sm:mt-12">
            <h2 className="font-display text-subheading font-semibold text-white">Still have questions?</h2>
            <p className="mx-auto mt-2 max-w-md text-body text-line">
              Our team is happy to help. Reach out and we&apos;ll respond quickly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="rounded-full bg-gold px-6 py-3 text-nav font-semibold text-ink transition-colors hover:bg-gold-400"
              >
                Contact us
              </Link>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gold/30 px-6 py-3 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${site.phone.replace(/\s/g, "")}`}
                className="rounded-full border border-gold/30 px-6 py-3 text-nav font-semibold text-white transition-colors hover:border-gold hover:text-gold"
              >
                {site.displayPhone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
