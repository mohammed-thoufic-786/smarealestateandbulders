import type {
  PropertyCategory,
  ListingType,
  Facing,
  Furnishing,
  ConstructionStatus,
  LeadStatus,
  LeadSource,
  LeadPriority,
  SiteVisitStatus,
} from "./types";

export const CATEGORY_LABELS: Record<PropertyCategory, string> = {
  residential_plot: "Residential Plot",
  agricultural_land: "Agricultural Land",
  villa: "Villa",
  apartment: "Apartment",
  independent_house: "Independent House",
  commercial: "Commercial Space",
  office_space: "Office Space",
  shop: "Shop",
  industrial: "Industrial Property",
  rental: "Rental Property",
  investment: "Investment Property",
};

export const CATEGORY_SLUGS: Record<PropertyCategory, string> = {
  residential_plot: "residential-plots",
  agricultural_land: "agricultural-lands",
  villa: "villas",
  apartment: "apartments",
  independent_house: "independent-houses",
  commercial: "commercial-spaces",
  office_space: "office-spaces",
  shop: "shops",
  industrial: "industrial-properties",
  rental: "rental-properties",
  investment: "investment-properties",
};

export const CATEGORY_BY_SLUG: Record<string, PropertyCategory> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([k, v]) => [v, k as PropertyCategory]),
) as Record<string, PropertyCategory>;

export const LISTING_TYPE_LABELS: Record<ListingType, string> = {
  buy: "For Sale",
  rent: "For Rent",
  commercial: "Commercial",
  lease: "For Lease",
};

export const FACING_LABELS: Record<Facing, string> = {
  east: "East",
  west: "West",
  north: "North",
  south: "South",
  north_east: "North East",
  north_west: "North West",
  south_east: "South East",
  south_west: "South West",
};

export const FURNISHING_LABELS: Record<Furnishing, string> = {
  unfurnished: "Unfurnished",
  semi_furnished: "Semi Furnished",
  fully_furnished: "Fully Furnished",
};

export const CONSTRUCTION_STATUS_LABELS: Record<ConstructionStatus, string> = {
  ready_to_move: "Ready to Move",
  under_construction: "Under Construction",
  new_launch: "New Launch",
  resale: "Resale",
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  site_visit: "Site Visit",
  negotiation: "Negotiation",
  converted: "Converted",
  lost: "Lost",
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "site_visit",
  "negotiation",
  "converted",
  "lost",
];

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website_enquiry: "Website Enquiry",
  whatsapp: "WhatsApp",
  phone_call: "Phone Call",
  property_listing: "Property Listing",
  callback_request: "Callback Request",
  site_visit_request: "Site Visit Request",
  ai_assistant: "AI Assistant",
};

export const LEAD_PRIORITY_LABELS: Record<LeadPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const SITE_VISIT_STATUS_LABELS: Record<SiteVisitStatus, string> = {
  requested: "Requested",
  confirmed: "Confirmed",
  rescheduled: "Rescheduled",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const SITE_VISIT_STATUS_ORDER: SiteVisitStatus[] = [
  "requested",
  "confirmed",
  "rescheduled",
  "completed",
  "cancelled",
];

export const PROPERTY_AMENITIES = [
  "24x7 Security",
  "CCTV Surveillance",
  "Power Backup",
  "Lift",
  "Covered Parking",
  "Gymnasium",
  "Swimming Pool",
  "Children's Play Area",
  "Clubhouse",
  "Landscaped Garden",
  "Rain Water Harvesting",
  "Borewell",
  "Compound Wall",
  "Gated Community",
  "Paved Roads",
  "Street Lighting",
  "Vaastu Compliant",
  "Servant Room",
  "Modular Kitchen",
  "Solar Water Heater",
] as const;

export const NEARBY_LABELS: Record<string, string> = {
  school: "Schools",
  college: "Colleges",
  hospital: "Hospitals",
  bus_stand: "Bus Stands",
  railway_station: "Railway Stations",
  metro_station: "Metro Stations",
  shopping: "Shopping Centres",
  highway: "Highways",
  landmark: "Landmarks",
  airport: "Airport",
};

export const TN_CITIES = [
  "Chennai",
  "Chengalpattu",
  "Coimbatore",
  "Madurai",
  "Trichy",
  "Salem",
  "Tirunelveli",
  "Vellore",
  "Erode",
  "Thanjavur",
  "Pondicherry",
] as const;

export const TN_DISTRICTS = [
  "Chennai",
  "Chengalpattu",
  "Kancheepuram",
  "Tiruvallur",
  "Villupuram",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Vellore",
  "Erode",
  "Thanjavur",
] as const;

export const POPULAR_LOCALITIES: Record<string, string[]> = {
  Chennai: [
    "Tambaram",
    "OMR",
    "ECR",
    "Velachery",
    "Adyar",
    "Anna Nagar",
    "Porur",
    "Perungudi",
    "Sholinganallur",
  ],
  Chengalpattu: ["Guduvanchery", "Maraimalai Nagar", "Singaperumal Koil", "Urapakkam"],
  Coimbatore: ["Saravanampatti", "Peelamedu", "Saibaba Colony", "Vadavalli"],
  Madurai: ["Anna Nagar", "K K Nagar", "Villapuram", "Thirunagar"],
  Trichy: ["Thillai Nagar", "Srirangam", "K K Nagar", "Cantonment"],
  Villupuram: ["Villupuram Town", "Tindivanam", "Marakkanam"],
  Pondicherry: ["White Town", "Lawspet", "Reddiarpalayam", "Auroville"],
};

export const SORT_OPTIONS = [
  { value: "recent", label: "Recently added" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "relevant", label: "Most relevant" },
] as const;
