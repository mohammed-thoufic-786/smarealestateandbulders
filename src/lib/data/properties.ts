import type { Property } from "../types";

const publishedAt = "2026-11-19T00:00:00.000Z";

const common = {
  description: "",
  category: "residential_plot" as const,
  listingType: "buy" as const,
  price: 0,
  priceUnit: "total" as const,
  specifications: {},
  amenities: [],
  nearby: [],
  owner: { _id: "sma", name: "SMA Real Estate & Builders" },
  approvalStatus: "approved" as const,
  availabilityStatus: "available" as const,
  verified: false,
  featured: true,
  isDemo: false,
  views: 0,
  publishedAt,
  createdAt: publishedAt,
  updatedAt: publishedAt,
};

export const OFFICIAL_PROPERTY_IDS = [
  "kurunji-garden",
  "kmb-garden",
  "sma-garden",
] as const;

export type OfficialPropertyId = (typeof OFFICIAL_PROPERTY_IDS)[number];

export function isOfficialPropertyId(id?: string | null): id is OfficialPropertyId {
  return OFFICIAL_PROPERTY_IDS.includes(id as OfficialPropertyId);
}

export const OFFICIAL_PROPERTIES: Property[] = [
  {
    ...common,
    _id: "kurunji-garden",
    slug: "kurunji-garden",
    title: "KURUNJI GARDEN",
    description:
      "KURUNJI GARDEN is located in Narasinganur, near Kootteradu, on the Villupuram–Gingee National Highway, Tamil Nadu. The brochure prints DTCP No. 223/2024. Inspect the original layout drawing below to see plot numbers, boundaries and roads.",
    location: {
      address: "Narasinganur, near Kootteradu, Villupuram–Gingee National Highway, Tamil Nadu",
      shortLocation: "Narasinganur, Villupuram",
      area: "Narasinganur, near Kootteradu",
      city: "Villupuram",
      district: "",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/kurunji-garden/property-site.jpg",
        alt: "Aerial site image of KURUNJI GARDEN from the original brochure",
        width: 1079,
        height: 581,
        isCover: true,
      },
      {
        url: "/properties/kurunji-garden/layout.png",
        alt: "Original DTCP-approved layout drawing of KURUNJI GARDEN",
        width: 2776,
        height: 1570,
      },
    ],
    documents: [
      {
        label: "DTCP No. 223/2024 (as printed in the brochure)",
        url: "/properties/kurunji-garden/brochure.pdf",
        verified: false,
      },
    ],
    approvalNotes: "DTCP No. 223/2024, as printed in the original brochure.",
  },
  {
    ...common,
    _id: "kmb-garden",
    slug: "kmb-garden",
    title: "K.M.B GARDEN",
    description:
      "K.M.B GARDEN is located in Omalur, Tamil Nadu. The original approved layout drawing from the source brochure is available below for inspection. No further address details are published because they are not provided in the source document.",
    location: {
      address: "Omalur, Tamil Nadu",
      shortLocation: "Omalur, Salem",
      area: "Omalur",
      city: "Omalur",
      district: "",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/kmb-garden/layout.jpg",
        alt: "Original approved layout drawing of K.M.B GARDEN",
        width: 1744,
        height: 1240,
        isCover: true,
      },
    ],
    documents: [
      {
        label: "Original brochure (source PDF)",
        url: "/properties/kmb-garden/brochure.pdf",
        verified: false,
      },
    ],
    approvalNotes: "Details are limited to the approved layout drawing printed in the source brochure.",
  },
  {
    ...common,
    _id: "sma-garden",
    slug: "sma-garden",
    title: "S.M.A GARDEN",
    description:
      "S.M.A GARDEN is located near Orathur Koot Road, Villupuram–Gingee Road, Tamil Nadu. The information shown here is taken from page one of the original brochure. Inspect the layout drawing below for plot numbers, boundaries and roads.",
    location: {
      address: "Near Orathur Koot Road, Villupuram–Gingee Road, Tamil Nadu",
      shortLocation: "Orathur, Villupuram",
      area: "Orathur Koot Road",
      city: "Villupuram",
      district: "",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/sma-garden/property-site.jpg",
        alt: "Site image of S.M.A GARDEN from the original brochure",
        width: 1445,
        height: 965,
        isCover: true,
      },
      {
        url: "/properties/sma-garden/layout.jpg",
        alt: "Original layout drawing of S.M.A GARDEN",
        width: 1600,
        height: 1131,
      },
    ],
    documents: [
      {
        label: "Original brochure (source PDF)",
        url: "/properties/sma-garden/brochure.pdf",
        verified: false,
      },
    ],
    approvalNotes: "Details are limited to those visible in the original brochure.",
  },
];

export function getOfficialProperty(id?: string | null): Property | undefined {
  return OFFICIAL_PROPERTIES.find((p) => p._id === id);
}
