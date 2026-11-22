import { FileCheck2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "./section-heading";

const COMMITMENTS = [
  {
    icon: FileCheck2,
    title: "Documentation First",
    body: "Every property is reviewed with care. We verify ownership records, approval documents, layout plans and essential property details before presenting it to buyers. If something needs clarification, we communicate it transparently.",
  },
];

export function StoryCommitment() {
  return (
    <section className="container-x bg-cream py-10 sm:py-20">
      <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <SectionHeading
            title="Our story"
            subtitle="Our story & our commitment"
            description="We began with a simple frustration: buying land in Tamil Nadu too often meant unclear paperwork and prices that changed with the conversation."
          />
          <p className="mt-5 text-pretty text-body leading-relaxed text-foreground/75">
            What began as a small team helping families in Villupuram has grown into a
            document-first practice across Tamil Nadu. One rule has never changed — the buyer
            comes first, and the paperwork has to be real.
          </p>
          <p className="mt-3 text-pretty text-body leading-relaxed text-foreground/75">
            We are still a close-knit team, and we say so. What we promise is not scale or flash —
            it is consistency: clear information, checked documents and advice you can act on.
          </p>
          <Link
            href="/about"
            className="group mt-6 inline-flex items-center gap-2 text-nav font-semibold text-foreground hover:text-gold-600"
          >
            Learn more about us
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-5 self-start">
          {COMMITMENTS.map((c) => (
            <div
              key={c.title}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold/50 sm:p-7"
            >
              <span
                className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent sm:inset-x-7"
                aria-hidden="true"
              />
              <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold-600">
                <c.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-subheading font-semibold tracking-[-0.01em] text-foreground">
                {c.title}
              </h3>
              <p className="mt-3 max-w-prose text-body leading-7 text-foreground/75">
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
