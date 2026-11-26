import Link from "next/link";
import { Landmark, Home, Check, ArrowRight } from "lucide-react";
import { SectionHeading } from "./section-heading";

const LOANS = [
  {
    icon: Landmark,
    title: "Plot loans",
    body: "Finance guidance for residential plots and commercial land, through lenders who understand land purchases.",
    points: ["Residential plot financing", "Commercial land loan", "Guidance on documents & approval checks"],
  },
  {
    icon: Home,
    title: "Home loans",
    body: "Home-loan support for villas, apartments and independent houses, with help on eligibility, EMIs and paperwork.",
    points: ["Villas, flats & independent homes", "Eligibility & EMI guidance", "Support from enquiry to sanction"],
  },
];

export function AvailabilityOfLoans() {
  return (
    <section className="container-x bg-cream py-12 sm:py-24">
      <SectionHeading
        title="Finance support"
        subtitle="Availability of Loans"
        description="Buying land or a home is easier with the right funding. We help you connect with lending partners for plot loans and home loans across Tamil Nadu."
        action={{ href: "/contact", label: "Talk to our team" }}
      />
      <div className="mt-6 grid gap-5 sm:mt-10 lg:grid-cols-2">
        {LOANS.map((loan) => (
          <div
            key={loan.title}
            className="group flex flex-col rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-gold/50"
          >
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold/10 text-gold-600 transition-colors group-hover:bg-gold group-hover:text-foreground">
              <loan.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-subheading font-semibold text-foreground">{loan.title}</h3>
            <p className="mt-2 text-body leading-relaxed text-foreground/75">{loan.body}</p>
            <ul className="mt-5 space-y-2.5">
              {loan.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-body text-foreground/85">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              data-analytics-event="select_content"
              data-analytics-content-id="contact_us"
              data-analytics-content-name={loan.title}
              data-analytics-location="home_finance"
              className="mt-6 inline-flex items-center gap-1.5 text-nav font-semibold text-foreground hover:text-gold-600"
            >
              Enquire about {loan.title.toLowerCase()}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
