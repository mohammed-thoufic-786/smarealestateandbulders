import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { buttonVariants } from "@/components/ui/button";
import { SmartImage } from "@/components/ui/smart-image";
import { getSiteStats } from "@/lib/data/repository";
import { LOCATIONS_SERVED, YEARS_EXPERIENCE } from "@/lib/data/site-metrics";
import { founder } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "About SMA Real Estate",
    description:
      "Meet SMA Real Estate & Builders of Villupuram, led by Haji S.M. Abdul Hakkim. 40+ years of document-first property guidance in Tamil Nadu.",
    path: "/about",
  });
}

const VALUES = [
  { icon: Compass, title: "Clarity over noise", body: "Every page is designed to help you to understand and decide." },
  { icon: Sparkles, title: "On the ground", body: "Four decades of buying, building and selling across Tamil Nadu — experience you can walk into." },
];

export default async function AboutPage() {
  const stats = await getSiteStats();

  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="About SMA"
        title="A real estate company built on trust"
        description="SMA Real Estate & Builders helps families and investors buy property in Tamil Nadu with clear paperwork, fair pricing and honest advice."
        breadcrumb={[{ href: "/about", label: "About" }]}
      />

      <div className="container-x py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="font-display text-display-3 font-bold text-foreground">Our mission</h2>
            <p className="mt-4 text-pretty text-body leading-relaxed text-muted">
              Our SMA real-estate company is built around one idea: the buyer should never be the last to
              know. We list real properties, check real documents and keep our advice honest.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-6 sm:mt-8">
              {[
                { label: "Listings", value: stats.properties },
                { label: "Locations", value: LOCATIONS_SERVED },
                { label: "Years", value: YEARS_EXPERIENCE },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-foreground">{s.value}+</p>
                  <p className="text-body text-muted">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-gold/30 bg-espresso p-6">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">
                  <v.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-subheading font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-body leading-relaxed text-white/60">{v.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-8 sm:mt-20 sm:gap-10 lg:grid-cols-[0.8fr_1fr] lg:items-center">
          <div className="relative mx-auto w-full max-w-sm">
            <div className="pointer-events-none absolute -inset-3 rounded-[1.75rem] border border-line" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] border border-line">
              <SmartImage
                src={founder.image}
                alt={founder.name}
                fill
                sizes="(max-width: 1024px) 100vw, 34vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-transparent to-transparent" />
            </div>
          </div>
          <div>
            <p className="eyebrow">Meet the founder</p>
            <h2 className="mt-3 font-display text-display-3 font-bold text-foreground">
              Real Estate Is Our Business. Your Trust Is Our Responsibility.
            </h2>
            <p className="mt-5 text-pretty text-body leading-relaxed text-muted">
              {founder.bio}
            </p>
            <div className="mt-6 rounded-2xl border border-gold/30 bg-espresso p-5">
              <p className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-white">Our Promise</p>
              <p className="mt-2 text-pretty text-body leading-relaxed text-white/60">{founder.promise}</p>
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <p className="font-display text-subheading font-bold text-foreground">{founder.name}</p>
              <p className="text-body text-muted">{founder.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-3xl border border-gold/30 bg-espresso p-8 sm:mt-20 sm:p-12">
          <h2 className="font-display text-display-3 font-bold text-white">How we work</h2>
          <div className="mt-6 grid gap-6 sm:mt-8 sm:grid-cols-3 sm:gap-8">
            {[
              { step: "01", title: "List & review", body: "Owners share their property. We review each one and verify documents where we genuinely can." },
              { step: "02", title: "Connect & close", body: "We coordinate visits, guide the paperwork and support you through to registration." },
            ].map((s) => (
              <div key={s.step}>
                <p className="font-display text-3xl font-bold text-white/40">{s.step}</p>
                <h3 className="mt-3 font-display text-subheading font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-body leading-relaxed text-white/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center sm:mt-16">
          <h2 className="font-display text-display-3 font-bold text-foreground">Ready to find your place?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/buy" className={buttonVariants({ size: "lg" })}>
              Browse properties <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "text-foreground hover:text-gold-600",
              })}
            >
              Talk to our team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
