import { SERVICE_LOCATIONS } from "./locations";
import { OFFICIAL_PROPERTIES } from "./properties";

export const LOCATIONS_SERVED = SERVICE_LOCATIONS.length;

const officialDistricts = new Set(OFFICIAL_PROPERTIES.map((property) => property.location.district)).size;

export const SITE_METRICS = [
  {
    key: "projects",
    value: OFFICIAL_PROPERTIES.length,
    suffix: "",
    label: "Official SMA properties",
  },
  {
    key: "districts",
    value: officialDistricts,
    suffix: "",
    label: "Districts with official listings",
  },
  {
    key: "towns",
    value: LOCATIONS_SERVED,
    suffix: "",
    label: "Service locations listed",
  },
] as const;
