import { z } from "zod";

export function isValidMobile(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return /^(?:91)?[6-9]\d{9}$/.test(digits);
}

export const phoneSchema = z
  .string()
  .trim()
  .refine(isValidMobile, "Enter a valid 10-digit mobile number");

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: phoneSchema,
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  message: z.string().trim().max(2000).optional(),
  source: z.enum([
    "website_enquiry",
    "whatsapp",
    "phone_call",
    "property_listing",
    "callback_request",
    "site_visit_request",
    "ai_assistant",
  ]),
  propertyId: z.string().trim().max(120).optional().nullable(),
  propertyTitle: z.string().trim().max(240).optional(),
  propertySlug: z.string().trim().max(240).optional(),
  propertyLocation: z.string().trim().max(160).optional(),
  budget: z.coerce.number().nonnegative().optional(),
  locationPreference: z.string().trim().max(120).optional(),
  website: z.string().trim().max(200).optional(),
  submissionToken: z.string().trim().min(10).max(120),
});

export const siteVisitSchema = z.object({
  customerName: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  email: z.string().trim().min(1, "Email is required").email("Invalid email"),
  propertyId: z.string().trim().max(120).optional().nullable(),
  propertyTitle: z.string().trim().max(240).optional(),
  propertySlug: z.string().trim().max(240).optional(),
  propertyLocation: z.string().trim().max(160).optional(),
  preferredDate: z.string().trim().min(4),
  preferredTime: z.string().trim().min(1),
  contactPreference: z.enum(["call", "whatsapp", "email"]),
  notes: z.string().trim().max(1000).optional(),
  website: z.string().trim().max(200).optional(),
  submissionToken: z.string().trim().min(10).max(120),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Invalid email"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().email("Invalid email"),
  phone: phoneSchema.optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72)
    .regex(/[A-Za-z]/, "Include a letter")
    .regex(/[0-9]/, "Include a number"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const sellRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: phoneSchema,
  email: z.string().trim().email("Invalid email").optional().or(z.literal("")),
  intent: z.enum(["sell", "rent_out"]),
  category: z.string().trim().min(1),
  city: z.string().trim().min(1),
  area: z.string().trim().max(120).optional(),
  bedrooms: z.coerce.number().int().min(0).max(20).optional(),
  builtUpArea: z.coerce.number().nonnegative().optional(),
  expectedPrice: z.coerce.number().nonnegative().optional(),
  notes: z.string().trim().max(2000).optional(),
});

export type SellRequestInput = z.infer<typeof sellRequestSchema>;

export const PROPERTY_CATEGORIES = [
  "residential_plot",
  "agricultural_land",
  "villa",
  "apartment",
  "independent_house",
  "commercial",
  "office_space",
  "shop",
  "industrial",
  "rental",
  "investment",
] as const;

export const FACINGS = [
  "east",
  "west",
  "north",
  "south",
  "north_east",
  "north_west",
  "south_east",
  "south_west",
] as const;

export const propertyInputSchema = z.object({
  title: z.string().trim().min(6, "Give the listing a clear title").max(140),
  description: z.string().trim().min(20, "Add at least a short description").max(4000),
  category: z.enum(PROPERTY_CATEGORIES),
  listingType: z.enum(["buy", "rent", "commercial", "lease"]),
  price: z.coerce.number().positive("Enter a price").max(1_000_000_000),
  priceUnit: z.enum(["total", "per_sqft", "per_month"]).optional(),
  address: z.string().trim().min(4).max(200),
  area: z.string().trim().min(2, "Area is required").max(120),
  city: z.string().trim().min(2).max(80),
  district: z.string().trim().min(2).max(80),
  pincode: z.string().trim().regex(/^\d{6}$/, "Enter a 6-digit pincode"),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional(),
  builtUpArea: z.coerce.number().nonnegative().optional(),
  plotArea: z.coerce.number().nonnegative().optional(),
  facing: z.enum(FACINGS).optional(),
  amenities: z.array(z.string().trim().min(1).max(60)).max(40).default([]),
  images: z
    .array(z.object({ url: z.string().trim().url().max(600), alt: z.string().trim().max(160).optional() }))
    .max(20)
    .default([]),
});

export type PropertyInput = z.infer<typeof propertyInputSchema>;

export type LeadInput = z.infer<typeof leadSchema>;
