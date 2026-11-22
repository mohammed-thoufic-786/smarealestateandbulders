import { getFeaturedProperties } from "@/lib/data/repository";
import { PropertyCard } from "@/components/property/property-card";
import { SectionHeading } from "./section-heading";

export async function FeaturedProperties() {
  const properties = await getFeaturedProperties(3);

  return (
    <section className="container-x bg-cream py-12 sm:py-24">
      <SectionHeading
        title="Our official projects"
        subtitle="Featured properties"
        description="Three genuine SMA properties, each with its original layout drawing and a direct enquiry line to our team."
        action={{ href: "/buy", label: "View all properties" }}
      />
      <div className="mt-6 grid gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property, i) => (
          <PropertyCard
            key={property._id}
            property={property}
            priority={i < 3}
            showLocation={false}
            compactTypography
          />
        ))}
      </div>
    </section>
  );
}
