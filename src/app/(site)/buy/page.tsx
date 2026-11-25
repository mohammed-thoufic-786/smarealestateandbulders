import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ListingView } from "@/components/property/listing-view";
import { pageMetadata } from "@/lib/seo";
import type { RawSearchParams } from "@/lib/search-params";
import styles from "./buy.module.css";

export function generateMetadata(): Metadata {
  return pageMetadata({
    title: "Plots, Villas & Land for Sale in Tamil Nadu",
    description:
      "Browse DTCP-approved residential plots, villas, agricultural land and homes for sale across Villupuram, Salem and Tamil Nadu. Price on request.",
    path: "/buy",
  });
}

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  return (
    <div className="bg-cream">
      <PageHeader
        eyebrow="For sale"
        title="Properties for sale"
        description="Explore homes, plots and commercial spaces listed for sale across Tamil Nadu. Filter by location, budget and type to find your fit."
        breadcrumb={[{ href: "/buy", label: "Buy" }]}
      />
      <div className={styles.buyPage}>
        <ListingView
          basePath="/buy"
          searchParams={sp}
          preset={{ listingType: "buy" }}
        />
      </div>
    </div>
  );
}
