import { UserRound, Headphones, Clock4 } from "lucide-react";
import { SectionHeading } from "./section-heading";
import { Reveal } from "@/components/ui/reveal";

const ITEMS = [
  {
    icon: UserRound,
    title: "Personalised assistance",
    body: "Advisors who understand your budget and priorities — not pushy sales calls.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    body: "A single point of contact from first enquiry to site visit and beyond.",
  },
  {
    icon: Clock4,
    title: "Responsive follow-through",
    body: "Enquiries answered quickly, appointments confirmed and reminders sent on time.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="border-y border-gold/25 bg-foreground">
      <div className="container-x py-12 sm:py-24">
        <SectionHeading
          title="Why SMA"
          subtitle="Why choose SMA"
          description="We focus on the things that actually matter when you're making one of life's biggest decisions."
          align="center"
          inverted
        />
        <Reveal className="mt-8 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3" data-motion-tilt-group>
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="group rounded-2xl border border-gold/25 bg-deep p-6 transition-colors hover:border-gold/50"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-foreground">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-subheading font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-body leading-relaxed text-white/70">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
