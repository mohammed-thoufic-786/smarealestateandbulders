import { readAnalyticsConsent } from "./analytics";

export const GA4_MEASUREMENT_ID = "G-8653TRZ6EN";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __smaGa4Initialized?: boolean;
  }
}

type Ga4Window = Window;

type PageParams = {
  page_path?: string;
  page_location?: string;
  page_title?: string;
};

type CommonParams = PageParams & {
  button_location?: string;
  transport_type?: "beacon";
};

type PropertyParams = {
  property_id?: string;
  property_name?: string;
  property_location?: string;
  property_category?: string;
};

type ContentParams = {
  content_id?: string;
  content_name?: string;
  content_category?: string;
};

export type Ga4EventMap = {
  page_view: PageParams & {
    page_path: string;
    page_location: string;
    page_title: string;
  };
  whatsapp_click: CommonParams &
    PropertyParams & {
      link_url: string;
      link_text?: string;
      form_id?: string;
    };
  phone_call_click: CommonParams & {
    link_url: "tel:";
    link_text?: string;
  };
  email_click: CommonParams & {
    link_url: "mailto:";
    link_text?: string;
  };
  generate_lead: CommonParams &
    ContentParams & {
      form_id: string;
      form_location?: string;
      lead_source?: string;
      submission_status?: "confirmed";
    };
  view_property: CommonParams &
    PropertyParams & {
      property_id: string;
    };
  select_content: CommonParams & PropertyParams & ContentParams & {
    content_type?: string;
  };
};

export type Ga4PageContext = {
  page_path: string;
  page_location: string;
  page_title: string;
};

const ALLOWED_QUERY_KEYS = new Set([
  "listingType",
  "category",
  "city",
  "district",
  "area",
  "pincode",
  "minPrice",
  "maxPrice",
  "minArea",
  "maxArea",
  "bedrooms",
  "bathrooms",
  "facing",
  "furnishing",
  "constructionStatus",
  "verified",
  "amenity",
  "sort",
  "page",
  "limit",
  "view",
]);

const recentEvents = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000;
const MAX_RECENT_EVENTS = 200;

function hasConsent(): boolean {
  try {
    return readAnalyticsConsent() === "accepted";
  } catch {
    return false;
  }
}

function shouldSend(dedupeKey?: string): boolean {
  if (!dedupeKey) return true;
  const now = Date.now();
  const previous = recentEvents.get(dedupeKey);
  if (previous !== undefined && now - previous < DEDUPE_WINDOW_MS) return false;
  if (recentEvents.size >= MAX_RECENT_EVENTS) {
    for (const [key, timestamp] of recentEvents) {
      if (now - timestamp >= DEDUPE_WINDOW_MS) recentEvents.delete(key);
    }
  }
  recentEvents.set(dedupeKey, now);
  return true;
}

export function initializeGa4(): void {
  if (typeof window === "undefined") return;
  const gaWindow = window as Ga4Window;
  if (gaWindow.__smaGa4Initialized) return;

  gaWindow.__smaGa4Initialized = true;
  gaWindow.dataLayer = gaWindow.dataLayer ?? [];
  gaWindow.gtag ??= (...args: unknown[]) => {
    gaWindow.dataLayer?.push(args);
  };
  gaWindow.gtag("js", new Date());
  gaWindow.gtag("config", GA4_MEASUREMENT_ID, { send_page_view: false });
}

export function ga4BootstrapScript(): string {
  return `if(!window.__smaGa4Initialized){window.__smaGa4Initialized=true;window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag("js",new Date());window.gtag("config",${JSON.stringify(GA4_MEASUREMENT_ID)},{send_page_view:false});}`;
}

export function trackGa4Event<K extends keyof Ga4EventMap>(
  name: K,
  params: Ga4EventMap[K],
  options: { dedupeKey?: string } = {},
): void {
  try {
    if (typeof window === "undefined") return;
    if (!hasConsent()) return;
    if (!shouldSend(options.dedupeKey)) return;
    initializeGa4();
    const gaWindow = window as Ga4Window;
    gaWindow.gtag?.("event", name, params);
  } catch {
    return;
  }
}

function urlBase(): string {
  return typeof window === "undefined" ? "http://localhost" : window.location.origin;
}

export function getSafePagePath(source?: string | URL): string {
  try {
    const base = urlBase();
    const url =
      source instanceof URL
        ? source
        : new URL(source ?? `${base}/`, base);
    const safeParams = new URLSearchParams();
    url.searchParams.forEach((value, key) => {
      if (ALLOWED_QUERY_KEYS.has(key)) safeParams.set(key, value);
    });
    const query = safeParams.toString();
    return `${url.pathname}${query ? `?${query}` : ""}`;
  } catch {
    return "/";
  }
}

export function getSafePageLocation(source?: string | URL): string {
  try {
    const base = urlBase();
    const url = new URL(source?.toString() ?? `${base}/`, base);
    const safeQuery = getSafePagePath(url).split("?")[1];
    url.search = safeQuery ? `?${safeQuery}` : "";
    url.hash = "";
    return url.toString();
  } catch {
    return "";
  }
}

export function getGa4PageContext(source?: string | URL): Ga4PageContext {
  if (typeof window === "undefined") {
    return { page_path: "/", page_location: "", page_title: "" };
  }
  return {
    page_path: getSafePagePath(source),
    page_location: getSafePageLocation(source),
    page_title: document.title,
  };
}

export function safeWhatsappUrl(href: string): string {
  try {
    const url = new URL(href, urlBase());
    if (url.hostname === "wa.me") return `${url.protocol}//wa.me/`;
    if (url.hostname === "api.whatsapp.com" || url.hostname === "web.whatsapp.com") {
      return `${url.protocol}//${url.hostname}/send`;
    }
    return `${url.protocol}//${url.hostname}/`;
  } catch {
    return "https://wa.me/";
  }
}

export function safeLinkText(value: string | null | undefined, fallback: string): string {
  const text = (value ?? "").trim();
  if (!text || /\d|@/.test(text)) return fallback;
  return text.slice(0, 80);
}
