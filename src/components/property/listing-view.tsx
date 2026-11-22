import { Suspense } from "react";
import { SearchX } from "lucide-react";
import { listProperties } from "@/lib/data/repository";
import { parseSearchParams, queryToSearchParams, type RawSearchParams } from "@/lib/search-params";
import type { PropertyQuery } from "@/lib/types";
import { PropertyCard } from "./property-card";
import { ResultsToolbar } from "./results-toolbar";
import { Pagination } from "./pagination";
import { PropertyGridSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { DEFAULT_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/business-config";
import { cn } from "@/lib/utils";

export interface ListingViewProps {
  basePath: string;
  eyebrow?: string;
  title: string;
  description?: string;
  searchParams: RawSearchParams;
  preset?: Partial<PropertyQuery>;
}

export async function ListingView({
  basePath,
  eyebrow,
  title,
  description,
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
      <div className="border-b border-line bg-surface/40 pt-20 sm:pt-28">
        <div className="container-x py-6 sm:py-12">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1 className="mt-3 text-balance font-display text-display-3 font-bold text-foreground">{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-pretty text-body leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="container-x mt-6 sm:mt-8">
        <div className="min-w-0">
          <Suspense fallback={null}>
            <ResultsToolbar basePath={basePath} total={result.total} view={view} />
          </Suspense>

          <div className="mt-6">
            {result.items.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="No properties match your filters"
                description="Try widening your budget, removing a filter, or exploring a nearby area."
                  action={
                    <a
                      href={whatsappLink(DEFAULT_WHATSAPP_MESSAGE)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={buttonVariants({ size: "lg" })}
                    >
                      Tell us what you need
                    </a>
                  }

              />
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
                    priority={i < 3}
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
