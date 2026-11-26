import { Quote } from "lucide-react";
import { getTestimonials } from "@/lib/data/repository";
import { Rating } from "@/components/ui/rating";
import { SmartImage } from "@/components/ui/smart-image";
import { SectionHeading } from "./section-heading";

export function Testimonials() {
  const testimonials = getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="border-y border-gold/25 bg-foreground">
      <div className="container-x py-12 sm:py-24">
        <SectionHeading
          title="In their words"
          subtitle="What our customers say"
          description="Customer feedback shared with SMA Real Estate & Builders."
          inverted
        />
        <div className="mt-6 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((t) => (
            <figure
              key={t._id}
              className="relative flex flex-col rounded-2xl border border-gold/25 bg-deep p-6 sm:p-8"
            >
              <Quote className="h-7 w-7 text-gold/60" />
              <blockquote className="mt-4 flex-1 text-pretty text-body leading-relaxed text-white/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-gold/25 pt-5">
                {t.avatar ? (
                  <span className="relative h-11 w-11 overflow-hidden rounded-full">
                    <SmartImage src={t.avatar} alt={t.name} fill sizes="44px" className="object-cover" />
                  </span>
                ) : (
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gold/15 font-semibold text-gold">
                    {t.name[0]}
                  </span>
                )}
                <div className="flex-1">
                  <p className="text-body font-semibold text-white">{t.name}</p>
                  <p className="text-sm text-white/70">
                    {t.role} · {t.location}
                  </p>
                </div>
                <Rating value={t.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
