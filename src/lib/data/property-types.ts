import type { PropertyCategory } from "@/lib/types";

// TODO: Owner must replace each placeholder intro before publishing these pages.
export interface PropertyTypePage {
  slug: string;
  category: PropertyCategory;
  label: string;
  image: string;
  intro: string;
}

export const PROPERTY_TYPE_PAGES: PropertyTypePage[] = [
  {
    slug: "residential-plot",
    category: "residential_plot",
    label: "Residential Plot",
    image: "/property-types/residential-plot.png",
    intro:
      "SMA Real Estate & Builders publishes official residential plotted developments with original layout drawings. TODO: add verified local copy.",
  },
  {
    slug: "agricultural-land",
    category: "agricultural_land",
    label: "Agricultural Land",
    image: "/property-types/agricultural-land.jpg",
    intro:
      "Enquire about agricultural land handled by SMA Real Estate & Builders in Tamil Nadu. TODO: add verified local copy.",
  },
  {
    slug: "villa",
    category: "villa",
    label: "Villa",
    image: "/property-types/villa.jpg",
    intro:
      "Enquire about villas handled by SMA Real Estate & Builders in Tamil Nadu. TODO: add verified local copy.",
  },
  {
    slug: "apartment",
    category: "apartment",
    label: "Apartment",
    image: "/property-types/apartment.jpg",
    intro:
      "Enquire about apartments handled by SMA Real Estate & Builders in Tamil Nadu. TODO: add verified local copy.",
  },
  {
    slug: "independent-house",
    category: "independent_house",
    label: "Independent House",
    image: "/property-types/independent-house.jpg",
    intro:
      "Enquire about independent houses handled by SMA Real Estate & Builders in Tamil Nadu. TODO: add verified local copy.",
  },
  {
    slug: "commercial-space",
    category: "commercial",
    label: "Commercial Space",
    image: "/property-types/commercial-space.jpg",
    intro:
      "Enquire about commercial spaces handled by SMA Real Estate & Builders in Tamil Nadu. TODO: add verified local copy.",
  },
];

export function getPropertyTypePage(slug: string): PropertyTypePage | undefined {
  return PROPERTY_TYPE_PAGES.find((type) => type.slug === slug);
}
