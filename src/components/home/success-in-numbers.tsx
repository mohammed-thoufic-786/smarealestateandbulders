import { Building2, Layers, MapPinned, Building, CalendarCheck2, MapPin } from "lucide-react";
import { Counter } from "@/components/ui/counter";
import { SectionHeading } from "./section-heading";

const METRICS = [
  { icon: Building2, value: 100, suffix: "+", label: "Delivered projects" },
  { icon: Layers, value: 1000, suffix: "+", label: "Units handed over" },
  { icon: MapPin, value: 7, suffix: "+", label: "Operating districts" },
  { icon: Building, value: 500, suffix: "+", label: "Properties listed" },
  { icon: MapPinned, value: 10, suffix: "+", label: "Cities & towns covered" },
  { icon: CalendarCheck2, value: 40, suffix: "+", label: "Years of experience" },
];

export function SuccessInNumbers() {
  return (
    <section className="border-y border-gold/25 bg-foreground">
      <div className="container-x py-12 sm:py-24">
        <SectionHeading
          title="Our success in numbers"
          description="Four decades of building across Tamil Nadu — delivered projects, homes handed over and the ground we cover today."
          align="center"
          inverted
        />

        <div className="mt-8 grid grid-cols-2 gap-6 sm:mt-12 sm:gap-8 lg:grid-cols-3">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="flex flex-col items-center gap-3 rounded-2xl border border-gold/25 bg-deep p-6 text-center"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold">
                <m.icon className="h-5 w-5" />
              </span>
              <p className="font-display text-4xl font-bold text-gold">
                <Counter value={m.value} suffix={m.suffix} />
              </p>
              <p className="text-sm text-white/70">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
