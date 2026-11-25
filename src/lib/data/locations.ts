export interface ServiceLocation {
  slug: string;
  name: string;
  district: string;
  image?: string;
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
      "SMA Real Estate & Builders helps buyers enquire about plots in and around Salem, Tamil Nadu. Our official Salem listings are PRESTIGE GARDEN in Karipatti and K.M.B GARDEN in Omalur, with original layout drawings available to inspect.",
    nearbyAreas: [],
    propertySlugs: ["prestige-garden", "kmb-garden"],
  },
  {
    slug: "ulundurpet",
    name: "Ulundurpet",
    district: "Villupuram",
    image: "/locations/ulundurpet.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Ulundurpet, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across Villupuram district.",
    nearbyAreas: ["villupuram", "vikravandi"],
    propertySlugs: [],
  },
  {
    slug: "villupuram",
    name: "Villupuram",
    district: "Villupuram",
    intro:
      "SMA Real Estate & Builders publishes official plotted developments around Villupuram, Tamil Nadu. KURUNJI GARDEN in Narasinganur and S.M.A GARDEN near Orathur Koot Road have original layout drawings available to inspect.",
    nearbyAreas: ["vikravandi", "ulundurpet"],
    propertySlugs: ["kurunji-garden", "sma-garden"],
  },
  {
    slug: "vikravandi",
    name: "Vikravandi",
    district: "Villupuram",
    image: "/locations/vikravandi.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Vikravandi, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across Villupuram district.",
    nearbyAreas: ["villupuram", "ulundurpet"],
    propertySlugs: [],
  },
  {
    slug: "acharapakam",
    name: "Acharapakam",
    district: "Tamil Nadu",
    image: "/locations/acharapakam.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Acharapakam, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across nearby Tamil Nadu locations.",
    nearbyAreas: ["madurantakam", "melmaruvathur"],
    propertySlugs: [],
  },
  {
    slug: "melmaruvathur",
    name: "Melmaruvathur",
    district: "Tamil Nadu",
    image: "/locations/melmaruvathur.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Melmaruvathur, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across nearby Tamil Nadu locations.",
    nearbyAreas: ["acharapakam", "madurantakam"],
    propertySlugs: [],
  },
  {
    slug: "madurantakam",
    name: "Madurantakam",
    district: "Tamil Nadu",
    image: "/locations/madurantakam.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Madurantakam, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across nearby Tamil Nadu locations.",
    nearbyAreas: ["melmaruvathur", "acharapakam"],
    propertySlugs: [],
  },
  {
    slug: "kanchipuram",
    name: "Kanchipuram",
    district: "Kanchipuram",
    image: "/locations/kanchipuram.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Kanchipuram, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across Kanchipuram district.",
    nearbyAreas: ["vandavasi", "madurantakam"],
    propertySlugs: [],
  },
  {
    slug: "vandavasi",
    name: "Vandavasi",
    district: "Tamil Nadu",
    image: "/locations/vandavasi.jpg",
    intro:
      "SMA Real Estate & Builders helps buyers enquire about property options in Vandavasi, Tamil Nadu. We do not currently publish an official property here, but our team can share available options across nearby Tamil Nadu locations.",
    nearbyAreas: ["kanchipuram", "melmaruvathur"],
    propertySlugs: [],
  },
];

export function getServiceLocation(slug: string): ServiceLocation | undefined {
  return SERVICE_LOCATIONS.find((location) => location.slug === slug);
}
