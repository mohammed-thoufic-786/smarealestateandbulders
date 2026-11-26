import type { PropertyCategory } from "@/lib/types";

export interface PropertyTypePage {
  slug: string;
  category: PropertyCategory;
  label: string;
  image: string;
  imageAlt: string;
  objectPosition: string;
  intro: string;
}

export const PROPERTY_TYPE_PAGES: PropertyTypePage[] = [
  {
    slug: "residential-plot",
    category: "residential_plot",
    label: "Residential Plot",
    image: "/property-types/residential-plot.png",
    imageAlt: "Residential plots with a map pin on green land",
    objectPosition: "center 60%",
    intro:
      "SMA Real Estate & Builders publishes official residential plotted developments with original layout drawings available to inspect. Our current listings are in Villupuram and Salem districts.",
  },
  {
    slug: "agricultural-land",
    category: "agricultural_land",
    label: "Agricultural Land",
    image: "/property-types/agricultural-land.jpg",
    imageAlt: "Aerial view of agricultural fields",
    objectPosition: "center 55%",
    intro:
      "SMA Real Estate & Builders currently does not publish an official agricultural land listing on this website. Our team can help you enquire about agricultural land options in Tamil Nadu.",
  },
  {
    slug: "villa",
    category: "villa",
    label: "Villa",
    image: "/property-types/villa.jpg",
    imageAlt: "Modern villa exterior",
    objectPosition: "center 40%",
    intro:
      "SMA Real Estate & Builders currently does not publish an official villa listing on this website. Our team can help you enquire about villa options in Tamil Nadu.",
  },
  {
    slug: "apartment",
    category: "apartment",
    label: "Apartment",
    image: "/property-types/apartment.jpg",
    imageAlt: "Apartment building exterior",
    objectPosition: "center 35%",
    intro:
      "SMA Real Estate & Builders currently does not publish an official apartment listing on this website. Our team can help you enquire about apartment options in Tamil Nadu.",
  },
  {
    slug: "independent-house",
    category: "independent_house",
    label: "Independent House",
    image: "/property-types/independent-house.jpg",
    imageAlt: "Independent house exterior",
    objectPosition: "center 45%",
    intro:
      "SMA Real Estate & Builders currently does not publish an official independent house listing on this website. Our team can help you enquire about independent house options in Tamil Nadu.",
  },
  {
    slug: "commercial-space",
    category: "commercial",
    label: "Commercial Space",
    image: "/property-types/commercial-space.jpg",
    imageAlt: "Commercial building interior",
    objectPosition: "center 40%",
    intro:
      "SMA Real Estate & Builders currently does not publish an official commercial space listing on this website. Our team can help you enquire about commercial options in Tamil Nadu.",
  },
];

export function getPropertyTypePage(slug: string): PropertyTypePage | undefined {
  return PROPERTY_TYPE_PAGES.find((type) => type.slug === slug);
}
