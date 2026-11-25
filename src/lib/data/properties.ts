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
  "prestige-garden",
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
      "KURUNJI GARDEN is located in Narasinganur, near Junction Road, Villupuram, Tamil Nadu. The brochure displays DTCP Approval No. 223/2024. Please refer to the original layout plan below for plot numbers, property boundaries, and road details.",
    location: {
      address: "Narasinganur, near Kootteradu, Villupuram–Gingee National Highway, Tamil Nadu",
      shortLocation: "Narasinganur, Villupuram",
      area: "Narasinganur, near Kootteradu",
      city: "Villupuram",
      district: "Villupuram",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/kurunji-garden/property-site.jpg",
        alt: "Aerial view of KURUNJI GARDEN DTCP approved plots, Narasinganur, Villupuram",
        width: 1079,
        height: 581,
        isCover: true,
      },
      {
        url: "/properties/kurunji-garden/layout.png",
        alt: "Original DTCP-approved layout drawing of KURUNJI GARDEN, Narasinganur, Villupuram",
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
    dtcpNumber: "223/2024",
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
      district: "Salem",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/kmb-garden/layout.jpg",
        alt: "Original approved layout drawing of K.M.B GARDEN, Omalur, Salem",
        width: 3369,
        height: 2382,
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
      "S.M.A GARDEN is located in Orathur, along the Villupuram to Gingee National Highway, opposite Swami Vivekananda Arts and Science College,Villupuram, Tamil Nadu. The information shown here is taken from the first page of the original brochure. Please refer to the layout drawing below for plot numbers, property boundaries, and road details.",
    location: {
      address: "Near Orathur Koot Road, Villupuram–Gingee Road, Tamil Nadu",
      shortLocation: "Orathur, Villupuram",
      area: "Orathur Koot Road",
      city: "Villupuram",
      district: "Villupuram",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/sma-garden/property-site.jpg",
        alt: "Site view of S.M.A GARDEN plots, Orathur, Villupuram",
        width: 1445,
        height: 965,
        isCover: true,
      },
      {
        url: "/properties/sma-garden/layout.jpg",
        alt: "Original layout drawing of S.M.A GARDEN, Orathur, Villupuram",
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
  {
    ...common,
    _id: "prestige-garden",
    slug: "prestige-garden",
    title: "PRESTIGE GARDEN",
    description:
      "PRESTIGE GARDEN is a DTCP-approved plotted development located in Karipatti Village, Valappadi Taluk, Salem District, Tamil Nadu, along the Ayothiyapattinam–Salem Road. The information shown here is taken from the original brochure. Please refer to the original layout drawing below for further details.",
    location: {
      address:
        "Karipatti village, Valappadi taluk, Salem District, Tamil Nadu, on the Ayothiyapattinam–Salem 12 m road",
      shortLocation: "Karipatti, Salem",
      area: "Karipatti",
      city: "Salem",
      district: "Salem",
      state: "Tamil Nadu",
      pincode: "",
    },
    images: [
      {
        url: "/properties/prestige-garden/card.webp",
        alt: "PRESTIGE GARDEN DTCP-approved plotted development, Karipatti, Salem",
        width: 500,
        height: 375,
        isCover: true,
      },
      {
        url: "/properties/prestige-garden/layout.jpg",
        alt: "Original DTCP-approved layout plan of PRESTIGE GARDEN, Karipatti, Salem",
        width: 3369,
        height: 2382,
      },
    ],
    documents: [
      {
        label: "Original brochure (source PDF)",
        url: "/properties/prestige-garden/brochure.pdf",
        verified: false,
      },
    ],
    approvalNotes:
      "DTCP-approved plots as stated in the original brochure; Survey No. 92/2A7. No approval number is printed on the supplied pages.",
  },
];

export function getOfficialProperty(id?: string | null): Property | undefined {
  return OFFICIAL_PROPERTIES.find((p) => p._id === id);
}
