"use client";

import { useEffect } from "react";
import { getGa4PageContext, trackGa4Event } from "@/lib/ga4";

export function PropertyViewTracker({
  propertyId,
  propertyName,
  propertyLocation,
  propertyCategory,
}: {
  propertyId: string;
  propertyName: string;
  propertyLocation?: string;
  propertyCategory?: string;
}) {
  useEffect(() => {
    trackGa4Event(
      "view_property",
      {
        ...getGa4PageContext(),
        property_id: propertyId,
        property_name: propertyName,
        property_location: propertyLocation,
        property_category: propertyCategory,
      },
      { dedupeKey: `view_property:${propertyId}:${window.location.pathname}` },
    );
  }, [propertyId, propertyName, propertyLocation, propertyCategory]);

  return null;
}
