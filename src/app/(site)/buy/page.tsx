import type { Metadata } from "next";
import { ListingView } from "@/components/property/listing-view";
import type { RawSearchParams } from "@/lib/search-params";

export const metadata: Metadata = {
  title: "Buy Properties in Tamil Nadu",
  description:
    "Browse verified plots, villas, apartments, houses and commercial properties for sale across Tamil Nadu.",
  alternates: { canonical: "/buy" },
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <ListingView
      basePath="/buy"
      eyebrow="For sale"
      title="Properties for sale"
      description="Explore homes, plots and commercial spaces listed for sale across Tamil Nadu. Filter by location, budget and type to find your fit."
      searchParams={sp}
      preset={{ listingType: "buy" }}
    />
  );
}
