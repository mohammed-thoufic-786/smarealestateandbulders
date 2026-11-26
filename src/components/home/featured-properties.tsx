import { getFeaturedProperties } from "@/lib/data/repository";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading } from "./section-heading";

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties(4);

  return (
    <section className="container-x bg-cream py-12 sm:py-24">
      <SectionHeading
        title="Plots for sale in Villupuram & Salem"
        subtitle="Our official projects"
        description="Browse plots for sale and ask our team about official options in Villupuram and Salem. Explore genuine SMA properties, each with its original layout drawing and a direct enquiry line to our team."
        action={{ href: "/buy", label: "View all properties" }}
      />
      <div className="mt-6 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4">
        {properties.map((property) => (
          <PropertyCard
            key={property._id}
            property={property}
            showLocation={false}
            compactTypography
            priceLabel="Call for price"
          />
        ))}
      </div>
    </section>
  );
}
