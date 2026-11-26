import type {
  Property,
  PropertyQuery,
  Paginated,
  Lead,
  SiteVisit,
  Testimonial,
} from "../types";
import { OFFICIAL_PROPERTIES, getOfficialProperty, isPublishedProperty } from "./properties";
import { TESTIMONIALS } from "./site-content";
import { readStored, writeStored } from "./lead-store";
import { connectDB, isDatabaseEnabled } from "../db/connect";
import { PropertyModel, LeadModel, SiteVisitModel } from "../db/models";
import { safeJson } from "../utils";

/* -------------------------------------------------------------------------- */
/*  Runtime store: the official properties plus persisted enquiries           */
/* -------------------------------------------------------------------------- */

interface Store {
  leads: Lead[];
  siteVisits: SiteVisit[];
}
declare global {
  var _estateStore: Store | undefined;
}
const store: Store = global._estateStore ?? {
  leads: readStored<Lead>("enquiries"),
  siteVisits: readStored<SiteVisit>("site-visits"),
};
global._estateStore = store;

const uid = () => `enq-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/** The published catalogue contains only the official SMA properties. */
function allProperties(): Property[] {
  return OFFICIAL_PROPERTIES;
}

const PUBLIC_PROPERTY_FILTER: Record<string, unknown> = {
  approvalStatus: "approved",
  availabilityStatus: { $nin: ["draft", "sold", "rented", "reserved"] },
  isDemo: { $ne: true },
  $or: [
    { publishedAt: { $exists: false } },
    { publishedAt: null },
    { publishedAt: { $lte: new Date() } },
  ],
};

/** Resolve a submitted property ID from the official catalogue, never from client text. */
function propertyRef(propertyId?: string | null): { _id: string; title: string; slug: string } | null {
  if (!propertyId) return null;
  const property = getOfficialProperty(propertyId);
  if (!property) return null;
  return { _id: property._id, title: property.title, slug: property.slug };
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 70);
}

/* -------------------------------------------------------------------------- */
/*  Query engine                                                               */
/* -------------------------------------------------------------------------- */

function matchesQuery(p: Property, q: PropertyQuery): boolean {
  if (q.listingType && p.listingType !== q.listingType) return false;
  if (q.category && p.category !== q.category) return false;
  if (q.categories?.length && !q.categories.includes(p.category)) return false;
  if (q.city && p.location.city.toLowerCase() !== q.city.toLowerCase()) return false;
  if (q.district && p.location.district.toLowerCase() !== q.district.toLowerCase()) return false;
  if (q.area && !p.location.area.toLowerCase().includes(q.area.toLowerCase())) return false;
  if (q.pincode && p.location.pincode !== q.pincode) return false;
  if (q.minPrice != null && p.price < q.minPrice) return false;
  if (q.maxPrice != null && p.price > q.maxPrice) return false;

  const area = p.specifications.builtUpArea ?? p.specifications.plotArea ?? 0;
  if (q.minArea != null && area < q.minArea) return false;
  if (q.maxArea != null && area > q.maxArea) return false;

  if (q.bedrooms != null && (p.specifications.bedrooms ?? 0) < q.bedrooms) return false;
  if (q.bathrooms != null && (p.specifications.bathrooms ?? 0) < q.bathrooms) return false;
  if (q.facing && p.specifications.facing !== q.facing) return false;
  if (q.verified && !p.verified) return false;

  if (q.amenities?.length) {
    const set = new Set(p.amenities.map((a) => a.toLowerCase()));
    if (!q.amenities.every((a) => set.has(a.toLowerCase()))) return false;
  }

  if (q.q) {
    const needle = q.q.toLowerCase();
    const hay = [
      p.title,
      p.description,
      p.location.shortLocation ?? "",
      p.location.area,
      p.location.city,
      p.location.district,
      p.location.address,
      p.category,
    ]
      .join(" ")
      .toLowerCase();
    if (!hay.includes(needle)) return false;
  }
  return true;
}

function relevanceScore(p: Property, q: PropertyQuery): number {
  let score = 0;
  if (q.city && p.location.city.toLowerCase() === q.city.toLowerCase()) score += 40;
  if (q.area && p.location.area.toLowerCase().includes(q.area.toLowerCase())) score += 25;
  if (q.category && p.category === q.category) score += 20;
  if (p.verified) score += 8;
  if (p.featured) score += 6;
  if (q.maxPrice && p.price <= q.maxPrice) score += 10;
  score += Math.min(p.views / 200, 6);
  return score;
}

function sortProperties(items: Property[], sort: PropertyQuery["sort"]): Property[] {
  const copy = [...items];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "recent":
      return copy.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    case "relevant":
    default:
      return copy.sort((a, b) => b.views - a.views);
  }
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

export async function listProperties(q: PropertyQuery = {}): Promise<Paginated<Property>> {
  const page = Math.max(1, q.page ?? 1);
  const limit = Math.min(48, Math.max(1, q.limit ?? 9));

  let items: Property[];
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      const filter: Record<string, unknown> = { ...PUBLIC_PROPERTY_FILTER };
      if (q.listingType) filter.listingType = q.listingType;
      if (q.category) filter.category = q.category;
      else if (q.categories?.length) filter.category = { $in: q.categories };
      if (q.city) filter["location.city"] = new RegExp(`^${q.city}$`, "i");
      if (q.verified) filter.verified = true;
      if (q.minPrice != null || q.maxPrice != null) {
        filter.price = {
          ...(q.minPrice != null ? { $gte: q.minPrice } : {}),
          ...(q.maxPrice != null ? { $lte: q.maxPrice } : {}),
        };
      }
      if (q.q) filter.$text = { $search: q.q };
      const sortMap: Record<string, Record<string, 1 | -1>> = {
        price_asc: { price: 1 },
        price_desc: { price: -1 },
        recent: { createdAt: -1 },
        relevant: { views: -1 },
      };
      const docs = await PropertyModel.find(filter)
        .sort(sortMap[q.sort ?? "recent"] ?? { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();
      const total = await PropertyModel.countDocuments(filter);
      return {
        items: safeJson(docs, []) as Property[],
        total,
        page,
        limit,
        pages: Math.max(1, Math.ceil(total / limit)),
      };
    } catch {
      // fall back to the published official catalogue
    }
  }

  items = allProperties().filter((p) => isPublishedProperty(p) && matchesQuery(p, q));
  if (q.sort === "relevant") {
    items = items.sort((a, b) => relevanceScore(b, q) - relevanceScore(a, q));
  } else {
    items = sortProperties(items, q.sort);
  }
  const total = items.length;
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    total,
    page,
    limit,
    pages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      const doc = await PropertyModel.findOne({ slug, ...PUBLIC_PROPERTY_FILTER }).lean();
      if (doc) return safeJson<Property | null>(doc, null);
    } catch {
      /* fall through */
    }
  }
  return allProperties().find((p) => p.slug === slug && isPublishedProperty(p)) ?? null;
}

export async function getPropertyById(id: string): Promise<Property | null> {
  return allProperties().find((p) => p._id === id) ?? null;
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  return ids
    .map((id) => allProperties().find((p) => (p._id === id || p.slug === id) && isPublishedProperty(p)))
    .filter((p): p is Property => Boolean(p));
}

export async function listPublishedProperties(): Promise<Property[]> {
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      const docs = await PropertyModel.find(PUBLIC_PROPERTY_FILTER).lean();
      return safeJson(docs, []) as Property[];
    } catch {
      // fall back to the published official catalogue
    }
  }

  return allProperties().filter(isPublishedProperty);
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const properties = allProperties();
  const featured = properties.filter((p) => p.featured);
  const others = properties.filter((p) => !p.featured);
  return [...featured, ...others].slice(0, limit);
}

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  return allProperties()
    .filter(
      (p) => p._id !== property._id && (p.category === property.category || p.location.city === property.location.city),
    )
    .slice(0, limit);
}

export interface LocationStat {
  city: string;
  district: string;
  count: number;
  fromPrice: number;
  image: string;
}

export async function getLocationStats(): Promise<LocationStat[]> {
  const map = new Map<string, LocationStat>();
  for (const p of allProperties()) {
    const existing = map.get(p.location.city);
    if (!existing) {
      map.set(p.location.city, {
        city: p.location.city,
        district: p.location.district,
        count: 1,
        fromPrice: p.price,
        image: p.images[0]?.url ?? "",
      });
    } else {
      existing.count += 1;
      existing.fromPrice = Math.min(existing.fromPrice, p.price);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const p of allProperties()) counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}

export async function getSiteStats() {
  const properties = allProperties();
  const cities = new Set(properties.map((p) => p.location.city));
  return {
    properties: properties.length,
    cities: cities.size,
    verified: properties.filter((p) => p.verified).length,
  };
}

export function getTestimonials(): Testimonial[] {
  return TESTIMONIALS;
}

/* -------------------------------------------------------------------------- */
/*  Writes (leads, site visits)                                                */
/* -------------------------------------------------------------------------- */

export interface NewLeadInput {
  name: string;
  phone: string;
  email?: string;
  propertyId?: string | null;
  propertyTitle?: string;
  propertySlug?: string;
  budget?: number;
  locationPreference?: string;
  requirements?: string;
  source: Lead["source"];
  notes?: string;
}

export async function createLead(input: NewLeadInput): Promise<Lead> {
  const now = new Date().toISOString();
  const property = propertyRef(input.propertyId);
  const dbInput = {
    ...input,
    propertyId: property?._id ?? null,
    propertyTitle: property?.title,
    propertySlug: property?.slug,
  };
  const dedupeKey = `${now}:${input.phone.replace(/\D/g, "")}:${property?._id ?? "general"}` as const;
  const lead: Lead = {
    _id: uid(),
    name: input.name,
    phone: input.phone,
    email: input.email,
    property,
    budget: input.budget,
    locationPreference: input.locationPreference,
    requirements: input.requirements,
    source: input.source,
    assignedAgent: null,
    status: "new",
    priority: input.budget && input.budget > 10000000 ? "high" : "medium",
    notes: input.notes ? [{ author: "System", text: input.notes, createdAt: now }] : [],
    createdAt: now,
    updatedAt: now,
  };
  store.leads.unshift(lead);

  let savedToDatabase = false;
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      await LeadModel.create({ ...dbInput, dedupeKey, status: "new" });
      savedToDatabase = true;
    } catch { /* fall back to the durable local store */ }
  }
  if (!savedToDatabase) writeStored("enquiries", store.leads);

  return lead;
}

export async function listLeads(filter?: { status?: string; agentId?: string }): Promise<Lead[]> {
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      const f: Record<string, unknown> = {};
      if (filter?.status) f.status = filter.status;
      if (filter?.agentId) f.assignedAgent = filter.agentId;
      const docs = await LeadModel.find(f).sort({ createdAt: -1 }).lean();
      if (docs.length) return safeJson(docs, []) as Lead[];
    } catch { /* fall through */ }
  }
  let items = [...store.leads];
  if (filter?.status) items = items.filter((l) => l.status === filter.status);
  if (filter?.agentId) items = items.filter((l) => l.assignedAgent?._id === filter.agentId);
  return items;
}

export async function updateLeadStatus(id: string, status: Lead["status"]): Promise<Lead | null> {
  const lead = store.leads.find((l) => l._id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();

  let savedToDatabase = false;
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      await LeadModel.updateOne({ _id: id }, { status });
      savedToDatabase = true;
    } catch { /* fall back to the durable local store */ }
  }
  if (!savedToDatabase) writeStored("enquiries", store.leads);
  return lead;
}

export interface NewSiteVisitInput {
  customerName: string;
  phone: string;
  email?: string;
  propertyId?: string | null;
  propertyTitle?: string;
  propertySlug?: string;
  preferredDate: string;
  preferredTime: string;
  contactPreference: "call" | "whatsapp" | "email";
  notes?: string;
}

export async function createSiteVisit(input: NewSiteVisitInput): Promise<SiteVisit> {
  const property = propertyRef(input.propertyId);
  const dbInput = {
    ...input,
    propertyId: property?._id ?? null,
    propertyTitle: property?.title,
    propertySlug: property?.slug,
  };
  const visit: SiteVisit = {
    _id: uid(),
    customerName: input.customerName,
    phone: input.phone,
    email: input.email,
    property,
    agent: null,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    contactPreference: input.contactPreference,
    notes: input.notes,
    status: "requested",
    createdAt: new Date().toISOString(),
  };
  store.siteVisits.unshift(visit);

  let savedToDatabase = false;
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      await SiteVisitModel.create(dbInput);
      savedToDatabase = true;
    } catch { /* fall back to the durable local store */ }
  }
  if (!savedToDatabase) writeStored("site-visits", store.siteVisits);
  return visit;
}

export async function listSiteVisits(): Promise<SiteVisit[]> {
  if (isDatabaseEnabled()) {
    try {
      await connectDB();
      const docs = await SiteVisitModel.find().sort({ createdAt: -1 }).lean();
      if (docs.length) return safeJson(docs, []) as SiteVisit[];
    } catch { /* fall through */ }
  }
  return [...store.siteVisits];
}

/* -------------------------------------------------------------------------- */
/*  Smart matching                                                             */
/* -------------------------------------------------------------------------- */

export interface MatchPreferences {
  budgetMin?: number;
  budgetMax?: number;
  cities?: string[];
  areas?: string[];
  categories?: string[];
  bedrooms?: number;
  purpose?: "living" | "investment";
  amenities?: string[];
}

export interface MatchResult {
  property: Property;
  score: number;
  reasons: string[];
}

export function matchScore(property: Property, prefs: MatchPreferences): MatchResult {
  const reasons: string[] = [];
  let score = 0;
  let weight = 0;

  weight += 30;
  if (prefs.budgetMax) {
    if (property.price <= prefs.budgetMax) {
      score += 30;
      reasons.push("Within your budget");
    } else {
      const over = (property.price - prefs.budgetMax) / prefs.budgetMax;
      score += Math.max(0, 30 - over * 60);
    }
  } else {
    score += 18;
  }

  weight += 25;
  if (prefs.cities?.length) {
    if (prefs.cities.some((c) => c.toLowerCase() === property.location.city.toLowerCase())) {
      score += 25;
      reasons.push(`Located in ${property.location.city}`);
    }
  } else {
    score += 15;
  }

  weight += 20;
  if (prefs.categories?.length) {
    if (prefs.categories.includes(property.category)) {
      score += 20;
      reasons.push("Matches your property type");
    }
  } else {
    score += 12;
  }

  weight += 15;
  if (prefs.bedrooms) {
    if ((property.specifications.bedrooms ?? 0) >= prefs.bedrooms) {
      score += 15;
      reasons.push(`${property.specifications.bedrooms} bedrooms`);
    }
  } else {
    score += 9;
  }

  weight += 10;
  if (prefs.purpose === "investment") {
    if (property.category === "investment" || property.category === "rental") {
      score += 10;
      reasons.push("Suited to investment");
    } else score += 4;
  } else if (prefs.purpose === "living") {
    if (["apartment", "villa", "independent_house"].includes(property.category)) {
      score += 10;
      reasons.push("Great for living");
    } else score += 4;
  } else {
    score += 6;
  }

  const pct = Math.round((score / weight) * 100);
  return { property, score: Math.min(99, Math.max(35, pct)), reasons };
}

export async function findMatches(prefs: MatchPreferences, limit = 6): Promise<MatchResult[]> {
  const results = allProperties().map((p) => matchScore(p, prefs)).sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/* -------------------------------------------------------------------------- */
/*  Dashboard aggregates                                                       */
/* -------------------------------------------------------------------------- */

export async function getLeadsForUser(email?: string, phone?: string): Promise<Lead[]> {
  if (!email && !phone) return [];
  const leads = await listLeads();
  return leads.filter(
    (l) =>
      (email && l.email?.toLowerCase() === email.toLowerCase()) ||
      (phone && l.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")),
  );
}

export async function getSiteVisitsForUser(email?: string, phone?: string): Promise<SiteVisit[]> {
  if (!email && !phone) return [];
  const visits = await listSiteVisits();
  return visits.filter(
    (v) =>
      (email && v.email?.toLowerCase() === email.toLowerCase()) ||
      (phone && v.phone.replace(/\D/g, "") === phone.replace(/\D/g, "")),
  );
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  converted: number;
  conversionRate: number;
  siteVisits: number;
  byStatus: Record<string, number>;
  bySource: Record<string, number>;
  pipelineValue: number;
}

export async function getDashboardStats(agentId?: string): Promise<DashboardStats> {
  const leads = await listLeads(agentId ? { agentId } : undefined);
  const visits = await listSiteVisits();

  const byStatus: Record<string, number> = {};
  const bySource: Record<string, number> = {};
  let pipelineValue = 0;

  for (const l of leads) {
    byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;
    bySource[l.source] = (bySource[l.source] ?? 0) + 1;
    if (!["converted", "lost"].includes(l.status) && l.budget) pipelineValue += l.budget;
  }

  const converted = byStatus["converted"] ?? 0;
  return {
    totalLeads: leads.length,
    newLeads: byStatus["new"] ?? 0,
    converted,
    conversionRate: leads.length ? Math.round((converted / leads.length) * 100) : 0,
    siteVisits: visits.length,
    byStatus,
    bySource,
    pipelineValue,
  };
}

export async function getPortfolioStats() {
  const stats = await getSiteStats();
  const properties = allProperties();
  return {
    ...stats,
    totalValue: properties.reduce((sum, p) => sum + p.price, 0),
    forSale: properties.filter((p) => p.listingType === "buy").length,
    forRent: properties.filter((p) => p.listingType === "rent").length,
    pendingReview: properties.filter((p) => !p.verified).length,
  };
}
