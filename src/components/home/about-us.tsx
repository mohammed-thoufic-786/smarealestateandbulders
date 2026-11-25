import Link from "next/link";
import { MapPinned, KeyRound, Target, Eye, ArrowRight } from "lucide-react";
import { site } from "@/lib/site";

const STEPS = [
  {
    icon: MapPinned,
    title: "Visit",
    body: "Choose a time that suits you. We arrange the site visit, share clear directions and explain the layout, boundaries and available documents while you are there.",
  },
  {
    icon: KeyRound,
    title: "Handover",
    body: "From agreement to registration, we guide each document and payment step until the property is legally handed over to you.",
  },
];

const PRINCIPLES = [
  {
    icon: Target,
    title: "Our Mission",
    body: "We built SMA around one idea: the buyer should never be the last to know. We publish real properties, check the available documents and keep our advice direct and honest.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "A place where every plot and home changes hands with clear paperwork, fair pricing and no avoidable surprises.",
  },
];

export function AboutUs() {
  return (
    <section className="border-t border-gold/25 bg-foreground">
      <div className="container-x py-10 sm:py-20">
        <div className="grid items-start gap-6 sm:gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
          <div>
            <p className="eyebrow text-gold">About us</p>
            <h2 className="mt-3 text-balance font-display text-display-3 font-bold text-white">
              How we work — and what we stand for
            </h2>
            <p className="mt-4 text-pretty text-body leading-relaxed text-white/70">
              {site.name} brings local property knowledge and a document-first process across Tamil
              Nadu — done the honest way, with the buyer at the centre of every decision.
            </p>

            <Link
              href="/about"
              className="group mt-6 inline-flex items-center gap-2 text-nav font-semibold text-gold hover:text-gold-400"
            >
              Read the full story
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid items-start gap-5 self-start sm:grid-cols-2 sm:gap-6">
            {STEPS.map((step) => (
              <div
                key={step.title}
                className="rounded-2xl border border-gold/25 bg-deep p-6 transition-colors hover:border-gold/50 sm:p-7"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-subheading font-semibold tracking-[-0.01em] text-white">
                  {step.title}
                </h3>
                <p className="mt-3 text-body leading-7 text-white/70">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6">
          {PRINCIPLES.map((principle) => (
            <div
              key={principle.title}
              className="flex items-start gap-4 rounded-2xl border border-gold/25 bg-deep p-6 transition-colors hover:border-gold/50 sm:p-7"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                <principle.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-subheading font-semibold text-white">{principle.title}</p>
                <p className="mt-3 text-body leading-7 text-white/70">{principle.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
