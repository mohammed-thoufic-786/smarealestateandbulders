import { SERVICE_LOCATIONS } from "./locations";

// TODO: Owner must confirm every number below before publication.
export const SITE_METRICS = [
  { key: "projects", value: 100, suffix: "+", label: "Delivered projects" },
  { key: "families", value: 1000, suffix: "+", label: "Happy Families" },
  { key: "districts", value: 7, suffix: "+", label: "Operating districts" },
  { key: "listed", value: 500, suffix: "+", label: "Properties listed" },
  { key: "towns", value: 10, suffix: "+", label: "Cities & towns covered" },
  { key: "experience", value: 40, suffix: "+", label: "Years of experience" },
] as const;

export const LOCATIONS_SERVED = SERVICE_LOCATIONS.length;
export const YEARS_EXPERIENCE = 40;
