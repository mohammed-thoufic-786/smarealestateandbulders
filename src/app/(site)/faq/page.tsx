import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Accordion } from "@/components/ui/accordion";
import { FAQS } from "@/lib/data/site-content";
import { site, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers to common questions about buying, selling, renting and listing property with ${site.name}.`,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-cream">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
                {site.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
