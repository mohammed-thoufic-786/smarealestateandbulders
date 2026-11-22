import type {
  PropertyQuery,
  PropertyCategory,
  ListingType,
  Facing,
  Furnishing,
  ConstructionStatus,
} from "./types";

export type RawSearchParams = Record<string, string | string[] | undefined>;

const one = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

const num = (v: string | string[] | undefined): number | undefined => {
  const s = one(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

export function parseSearchParams(sp: RawSearchParams): PropertyQuery {
  return {
    q: one(sp.q),
    listingType: one(sp.listingType) as ListingType | undefined,
    category: one(sp.category) as PropertyCategory | undefined,
    city: one(sp.city),
    district: one(sp.district),
    area: one(sp.area),
    pincode: one(sp.pincode),
    minPrice: num(sp.minPrice),
    maxPrice: num(sp.maxPrice),
    minArea: num(sp.minArea),
    maxArea: num(sp.maxArea),
    bedrooms: num(sp.bedrooms),
    bathrooms: num(sp.bathrooms),
    facing: one(sp.facing) as Facing | undefined,
    furnishing: one(sp.furnishing) as Furnishing | undefined,
    constructionStatus: one(sp.constructionStatus) as ConstructionStatus | undefined,
    verified: one(sp.verified) === "true" ? true : undefined,
    amenities: (Array.isArray(sp.amenity) ? sp.amenity : sp.amenity ? [sp.amenity] : undefined) ?? [],
    sort: (one(sp.sort) as PropertyQuery["sort"]) ?? "recent",
    page: num(sp.page) ?? 1,
    limit: num(sp.limit) ?? 9,
  };
}

export function queryToSearchParams(q: PropertyQuery, overrides: Record<string, string | undefined> = {}): string {
  const p = new URLSearchParams();
  const set = (k: string, v: string | number | boolean | undefined) => {
    if (v !== undefined && v !== "" && v !== false) p.set(k, String(v));
  };
  set("q", q.q);
  set("category", q.category);
  set("city", q.city);
  set("area", q.area);
  set("minPrice", q.minPrice);
  set("maxPrice", q.maxPrice);
  set("minArea", q.minArea);
  set("maxArea", q.maxArea);
  set("bedrooms", q.bedrooms);
  set("facing", q.facing);
  set("verified", q.verified ? "true" : undefined);
  set("sort", q.sort && q.sort !== "recent" ? q.sort : undefined);
  set("page", q.page && q.page > 1 ? q.page : undefined);
  q.amenities?.forEach((a) => p.append("amenity", a));
  Object.entries(overrides).forEach(([k, v]) => {
    if (v === undefined) p.delete(k);
    else p.set(k, v);
  });
  return p.toString();
}

export function activeFilterCount(q: PropertyQuery): number {
  let n = 0;
  if (q.q) n++;
  if (q.category) n++;
  if (q.city) n++;
  if (q.area) n++;
  if (q.minPrice != null || q.maxPrice != null) n++;
  if (q.minArea != null || q.maxArea != null) n++;
  if (q.bedrooms != null) n++;
  if (q.facing) n++;
  if (q.verified) n++;
  if (q.amenities?.length) n += q.amenities.length;
  return n;
}
