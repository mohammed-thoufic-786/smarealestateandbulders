import Link from "next/link";
import { MessageCircle, PhoneCall, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/business-config";

export function FinalCta() {
  return (
    <section className="container-x bg-cream py-12 sm:py-28">
      <Reveal className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-deep via-foreground to-foreground px-6 py-10 text-center shadow-luxe sm:px-12 sm:py-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-80 rounded-full bg-gold/10 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-gold/[0.05] blur-[110px]" />
        <div className="relative mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 text-eyebrow font-semibold uppercase tracking-[0.22em] text-gold">
            Let&apos;s begin
          </p>
          <h2 className="mt-4 text-balance font-display text-display-2 font-extrabold text-white">
            Your Next Chapter Starts With the Right Property.
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-body leading-relaxed text-white/70">
            Tell us what you need and we&apos;ll shortlist options that genuinely fit — no pressure, no spam.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 sm:mt-9">
            <a
              href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ size: "lg" })}
            >
              Find Your Property <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "border-gold bg-gold text-foreground hover:bg-gold-400",
              })}
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
            <Link
              href="/contact"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className: "text-gold hover:bg-gold/10",
              })}
            >
              <PhoneCall className="h-4 w-4" /> Book a call
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
