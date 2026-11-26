"use client";

import { useEffect } from "react";
import {
  getGa4PageContext,
  safeLinkText,
  safeWhatsappUrl,
  trackGa4Event,
} from "@/lib/ga4";

type PropertyContext = {
  property_id?: string;
  property_name?: string;
  property_location?: string;
  property_category?: string;
};

function readData(element: Element, key: string): string | undefined {
  return element.getAttribute(`data-analytics-${key}`) || undefined;
}

function closestData(element: Element, key: string): string | undefined {
  const match = element.closest(`[data-analytics-${key}]`);
  return match ? readData(match, key) : undefined;
}

function inferLocation(element: Element): string {
  const explicit = closestData(element, "location");
  if (explicit) return explicit;
  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";
  if (element.closest('[role="dialog"]')) return "dialog";
  return "page";
}

function getPropertyContext(element: Element): PropertyContext {
  return {
    property_id: closestData(element, "property-id"),
    property_name: closestData(element, "property-name"),
    property_location: closestData(element, "property-location"),
    property_category: closestData(element, "property-category"),
  };
}

function isWhatsappUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  return (
    host === "wa.me" ||
    host === "whatsapp.com" ||
    host === "web.whatsapp.com" ||
    host === "api.whatsapp.com"
  );
}

export function AnalyticsClickTracker() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (!(event.target instanceof Element)) return;

      const element = event.target;
      const anchor = element.closest("a");
      const linkHref = anchor?.getAttribute("href") ?? "";
      const location = inferLocation(element);
      const page = getGa4PageContext();
      const property = getPropertyContext(element);

      if (anchor && linkHref) {
        const url = new URL(anchor.href, window.location.href);

        if (isWhatsappUrl(url)) {
          const linkText = safeLinkText(
            anchor.getAttribute("aria-label") || anchor.textContent,
            "WhatsApp",
          );
          trackGa4Event(
            "whatsapp_click",
            {
              ...page,
              ...property,
              link_url: safeWhatsappUrl(linkHref),
              link_text: linkText,
              button_location: location,
              transport_type: "beacon",
            },
            {
              dedupeKey: `whatsapp:${safeWhatsappUrl(linkHref)}:${location}:${linkText}:${page.page_path}`,
            },
          );
          return;
        }

        if (linkHref.startsWith("tel:")) {
          trackGa4Event(
            "phone_call_click",
            {
              ...page,
              link_url: "tel:",
              link_text: safeLinkText(anchor.textContent, "Call"),
              button_location: location,
              transport_type: "beacon",
            },
            { dedupeKey: `tel:${location}:${page.page_path}` },
          );
          return;
        }

        if (linkHref.startsWith("mailto:")) {
          trackGa4Event(
            "email_click",
            {
              ...page,
              link_url: "mailto:",
              link_text: safeLinkText(anchor.textContent, "Email"),
              button_location: location,
              transport_type: "beacon",
            },
            { dedupeKey: `mailto:${location}:${page.page_path}` },
          );
          return;
        }
      }

      const tracked = element.closest('[data-analytics-event="select_content"]');
      if (!tracked) return;
      const contentId = readData(tracked, "content-id");
      if (!contentId) return;

      trackGa4Event(
        "select_content",
        {
          ...page,
          ...property,
          content_id: contentId,
          content_name: closestData(tracked, "content-name"),
          content_category: closestData(tracked, "content-category"),
          content_type: readData(tracked, "content-type"),
          button_location: location,
          transport_type: "beacon",
        },
        { dedupeKey: `select:${contentId}:${location}:${page.page_path}` },
      );
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
