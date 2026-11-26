import { Quote, MapPin, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { founder } from "@/lib/site";
import { SmartImage } from "@/components/ui/smart-image";

export function Founder() {
  return (
    <section className="container-x bg-cream py-12 sm:py-24">
      <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        <div className="relative mx-auto w-full max-w-md">
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] border border-gold/40" />
          <div className="pointer-events-none absolute -bottom-8 right-0 h-40 w-40 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-line">
            <SmartImage
              src={founder.image}
              alt={founder.name}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-5 left-5 rounded-2xl border border-gold/30 bg-surface px-5 py-3 shadow-lift">
            <p className="font-display text-body font-semibold text-foreground">{founder.name}</p>
            <p className="text-body text-muted">{founder.role}</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">Meet the founder</p>
          <h2 className="mt-3 text-balance font-display text-display-3 font-bold text-foreground">
            Real Estate Is Our Business. Your Trust Is Our Responsibility.
          </h2>

          <figure className="mt-6 rounded-2xl border border-line bg-surface p-6">
            <Quote className="h-6 w-6 text-gold-600" />
            <blockquote className="mt-3 text-pretty text-body leading-relaxed text-foreground/90">
              &ldquo;{founder.quote}&rdquo;
            </blockquote>
          </figure>

          <p className="mt-6 text-pretty text-body leading-relaxed text-foreground/75">{founder.bio}</p>

          <div className="mt-6 rounded-2xl border border-gold/30 bg-surface p-5">
            <p className="text-eyebrow font-semibold uppercase tracking-[0.18em] text-gold-600">Our Promise</p>
            <p className="mt-2 text-pretty text-body leading-relaxed text-foreground/85">{founder.promise}</p>
          </div>

          <ul className="mt-6 space-y-3">
            {founder.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3 text-body text-foreground/80">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                <span>{h}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-body text-muted">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold-600" /> {founder.location}
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-gold-600" /> {founder.experience}
            </span>
          </div>

          <div className="mt-7 border-t border-line pt-5">
            <p className="font-display text-subheading font-bold text-foreground">{founder.name}</p>
            <p className="text-body text-muted">{founder.role}</p>
          </div>

          <Link
            href="/about"
            className="group mt-7 inline-flex items-center gap-2 text-nav font-semibold text-foreground hover:text-gold-600"
          >
            More about our story
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
