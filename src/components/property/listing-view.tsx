import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { listProperties } from "@/lib/data/repository";
import { parseSearchParams, queryToSearchParams, type RawSearchParams } from "@/lib/search-params";
import type { PropertyQuery } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { ResultsToolbar } from "./results-toolbar";
import { Pagination } from "./pagination";
import { PropertyGridSkeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/business-config";
import { cn } from "@/lib/utils";

export interface ListingViewProps {
  basePath: string;
  searchParams: RawSearchParams;
  preset?: Partial<PropertyQuery>;
}

function BuyEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/40 bg-surface px-6 py-12 text-center shadow-soft sm:py-16">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-gold/10 text-gold">
        <SearchX className="h-5 w-5" />
      </span>
      <h3 className="text-subheading font-semibold text-primary">No properties match your filters</h3>
      <p className="mt-1.5 max-w-sm text-body text-muted">
        Try widening your budget, removing a filter, or exploring a nearby area.
      </p>
      <a
        href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "lg" }), "mt-6")}
      >
        Tell us what you need
      </a>
    </div>
  );
}

export async function ListingView({
  basePath,
  searchParams,
  preset = {},
}: ListingViewProps) {
  const query: PropertyQuery = { ...parseSearchParams(searchParams), ...preset };
  const view = searchParams.view === "list" ? "list" : "grid";
  const result = await listProperties(query);

  const qs = queryToSearchParams(
    { ...query, listingType: undefined },
    { view: view === "list" ? "list" : undefined },
  );

  return (
    <div className="bg-cream pb-12 sm:pb-20">
      <div className="container-x py-8 sm:py-12">
        <div className="min-w-0">
          <Suspense fallback={null}>
            <ResultsToolbar basePath={basePath} total={result.total} view={view} />
          </Suspense>

          <div className="mt-6">
            {result.items.length === 0 ? (
              <BuyEmptyState />
            ) : (
              <div
                className={cn(
                  view === "grid"
                    ? "grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
                    : "flex flex-col gap-6",
                )}
              >
                {result.items.map((property, i) => (
                  <PropertyCard
                    key={property._id}
                    property={property}
                    variant={view}
                    priority={i === 0}
                    priceClassName="text-[13px]"
                  />
                ))}
              </div>
            )}
          </div>

          <Pagination basePath={basePath} queryString={qs} page={result.page} pages={result.pages} />
        </div>
      </div>
    </div>
  );
}

export function ListingFallback() {
  return (
    <div className="container-x py-8 sm:py-10">
      <PropertyGridSkeleton />
    </div>
  );
}
