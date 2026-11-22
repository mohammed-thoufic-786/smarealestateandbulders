export type Role = "super_admin" | "admin" | "agent" | "owner" | "customer";

export type PropertyCategory =
  | "residential_plot"
  | "agricultural_land"
  | "villa"
  | "apartment"
  | "independent_house"
  | "commercial"
  | "office_space"
  | "shop"
  | "industrial"
  | "rental"
  | "investment";

export type ListingType = "buy" | "rent" | "commercial" | "lease";

export type ApprovalStatus = "pending" | "approved" | "rejected";
export type AvailabilityStatus = "available" | "sold" | "rented" | "reserved" | "draft";

export type Facing =
  | "east"
  | "west"
  | "north"
  | "south"
  | "north_east"
  | "north_west"
  | "south_east"
  | "south_west";

export type Furnishing = "unfurnished" | "semi_furnished" | "fully_furnished";

export type ConstructionStatus =
  | "ready_to_move"
  | "under_construction"
  | "new_launch"
  | "resale";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PropertyLocation {
  address: string;
  shortLocation?: string;
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  coordinates?: Coordinates;
}

export interface PropertySpecifications {
  plotArea?: number; // sq.ft.
  builtUpArea?: number; // sq.ft.
  carpetArea?: number; // sq.ft.
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  facing?: Facing;
  roadWidth?: number; // feet
  floors?: number;
  floorNumber?: number;
  totalFloors?: number;
  parking?: number;
  age?: number; // years
  waterSource?: string;
  powerBackup?: boolean;
}

export interface NearbyFacility {
  type:
    | "school"
    | "college"
    | "hospital"
    | "bus_stand"
    | "railway_station"
    | "metro_station"
    | "shopping"
    | "highway"
    | "landmark"
    | "airport";
  name: string;
  distanceKm: number;
}

export interface PropertyImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  isCover?: boolean;
}

export interface PropertyDocument {
  label: string;
  url?: string;
  verified: boolean;
}

export interface Property {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: PropertyCategory;
  listingType: ListingType;
  price: number;
  priceUnit?: "total" | "per_sqft" | "per_month";
  maintenancePerMonth?: number;
  location: PropertyLocation;
  specifications: PropertySpecifications;
  amenities: string[];
  nearby: NearbyFacility[];
  images: PropertyImage[];
  videoUrl?: string;
  tourUrl?: string;
  floorPlanUrl?: string;
  documents: PropertyDocument[];
  approvalNotes?: string;
  owner: { _id: string; name: string; phone?: string };
  assignedAgent?: { _id: string; name: string; phone?: string; avatar?: string };
  approvalStatus: ApprovalStatus;
  availabilityStatus: AvailabilityStatus;
  verified: boolean;
  featured: boolean;
  isDemo?: boolean;
  views: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "site_visit"
  | "negotiation"
  | "converted"
  | "lost";

export type LeadSource =
  | "website_enquiry"
  | "whatsapp"
  | "phone_call"
  | "property_listing"
  | "callback_request"
  | "site_visit_request"
  | "ai_assistant";

export type LeadPriority = "low" | "medium" | "high" | "urgent";

export interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  property?: { _id: string; title: string; slug: string } | null;
  budget?: number;
  locationPreference?: string;
  requirements?: string;
  source: LeadSource;
  assignedAgent?: { _id: string; name: string } | null;
  status: LeadStatus;
  priority: LeadPriority;
  followUpDate?: string;
  notes: { author: string; text: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export type SiteVisitStatus =
  | "requested"
  | "confirmed"
  | "rescheduled"
  | "completed"
  | "cancelled";

export interface SiteVisit {
  _id: string;
  customerName: string;
  phone: string;
  email?: string;
  property: { _id: string; title: string; slug: string } | null;
  agent?: { _id: string; name: string } | null;
  preferredDate: string;
  preferredTime: string;
  contactPreference: "call" | "whatsapp" | "email";
  notes?: string;
  status: SiteVisitStatus;
  createdAt: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  avatar?: string;
  preferences?: {
    locations?: string[];
    categories?: PropertyCategory[];
    budgetMin?: number;
    budgetMax?: number;
  };
  emailVerified?: boolean;
  phoneVerified?: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  customerName: string;
  propertySlug?: string;
  rating: number;
  review: string;
  approvalStatus: ApprovalStatus;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  role: string;
  location: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  readMinutes: number;
  publishedAt: string;
  tags: string[];
}

export interface Agent {
  _id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  avatar: string;
  areas: string[];
  languages: string[];
  experienceYears: number;
  dealsClosed: number;
  bio: string;
}

export interface PropertyQuery {
  q?: string;
  listingType?: ListingType;
  category?: PropertyCategory;
  categories?: PropertyCategory[];
  city?: string;
  district?: string;
  area?: string;
  pincode?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  facing?: Facing;
  furnishing?: Furnishing;
  constructionStatus?: ConstructionStatus;
  amenities?: string[];
  verified?: boolean;
  sort?: "recent" | "price_asc" | "price_desc" | "relevant";
  page?: number;
  limit?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}
