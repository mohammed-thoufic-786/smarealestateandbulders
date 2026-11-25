// TODO: Owner must replace each placeholder intro and confirm the nearby-area relationships.
export interface ServiceLocation {
  slug: string;
  name: string;
  district: string;
  intro: string;
  nearbyAreas: string[];
  propertySlugs: string[];
}

export const SERVICE_LOCATIONS: ServiceLocation[] = [
  {
    slug: "salem",
    name: "Salem",
    district: "Salem",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about plots in and around Salem, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: [],
    propertySlugs: ["prestige-garden", "kmb-garden"],
  },
  {
    slug: "ulundurpet",
    name: "Ulundurpet",
    district: "Villupuram",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Ulundurpet, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["villupuram", "vikravandi"],
    propertySlugs: [],
  },
  {
    slug: "villupuram",
    name: "Villupuram",
    district: "Villupuram",
    intro:
      "SMA Real Estate & Builders publishes official plotted developments around Villupuram, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["vikravandi", "ulundurpet"],
    propertySlugs: ["kurunji-garden", "sma-garden"],
  },
  {
    slug: "vikravandi",
    name: "Vikravandi",
    district: "Villupuram",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Vikravandi, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["villupuram", "ulundurpet"],
    propertySlugs: [],
  },
  {
    slug: "acharapakam",
    name: "Acharapakam",
    district: "Tamil Nadu",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Acharapakam, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["madurantakam", "melmaruvathur"],
    propertySlugs: [],
  },
  {
    slug: "melmaruvathur",
    name: "Melmaruvathur",
    district: "Tamil Nadu",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Melmaruvathur, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["acharapakam", "madurantakam"],
    propertySlugs: [],
  },
  {
    slug: "madurantakam",
    name: "Madurantakam",
    district: "Tamil Nadu",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Madurantakam, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["melmaruvathur", "acharapakam"],
    propertySlugs: [],
  },
  {
    slug: "kanchipuram",
    name: "Kanchipuram",
    district: "Kanchipuram",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Kanchipuram, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["vandavasi", "madurantakam"],
    propertySlugs: [],
  },
  {
    slug: "vandavasi",
    name: "Vandavasi",
    district: "Tamil Nadu",
    intro:
      "SMA Real Estate & Builders assists buyers looking for plots and homes in Vandavasi, Tamil Nadu. TODO: add verified local copy.",
    nearbyAreas: ["kanchipuram", "melmaruvathur"],
    propertySlugs: [],
  },
];

export function getServiceLocation(slug: string): ServiceLocation | undefined {
  return SERVICE_LOCATIONS.find((location) => location.slug === slug);
}
