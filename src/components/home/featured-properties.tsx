import { getFeaturedProperties } from "@/lib/data/repository";
import { PropertyCard } from "@/components/property/property-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "./section-heading";

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties(4);

  return (
    <section data-motion-featured-section className="container-x bg-cream py-12 sm:py-24">
      <SectionHeading
        title="Plots for sale in Villupuram & Salem"
        subtitle="Our official projects"
        description="Browse plots for sale and ask our team about official options in Villupuram and Salem. Explore genuine SMA properties, each with its original layout drawing and a direct enquiry line to our team."
        action={{ href: "/buy", label: "View all properties" }}
      />
      <Reveal
        data-motion-featured
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 sm:mt-10 [&>*]:w-[85vw] [&>*]:shrink-0 [&>*]:snap-start sm:[&>*]:w-[calc(50%-0.75rem)] lg:snap-none lg:overflow-visible lg:[&>*]:w-[26rem]"
      >
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            showLocation={false}
            compactTypography
            priceLabel="Call for price"
          />
        ))}
      </Reveal>
    </section>
  );
}
