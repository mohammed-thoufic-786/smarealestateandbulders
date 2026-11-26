# Analytics documentation

## Configuration

- Measurement ID: `G-8653TRZ6EN`
- Loader: `next/script` with `strategy="afterInteractive"` in `src/components/analytics/google-analytics.tsx`.
- Consent: GA4 loads only after `sma-analytics-consent === "accepted"`.
- Automatic page views: disabled with `send_page_view: false` in `gtag("config", ...)`.
- Manual page views: emitted by `GoogleAnalytics` via `usePathname()` and `useSearchParams()`.
- Initialization guard: `window.__smaGa4Initialized` plus a dedupe map in `src/lib/ga4.ts`.
- No Google Tag Manager is used.
- Clarity and Meta Pixel remain optional and env-driven; this document covers GA4 only.

## Architecture

- `src/lib/ga4.ts` is the only place that calls `gtag`.
- `trackGa4Event<K>(name, params, options)` is typed against `Ga4EventMap`.
- `src/components/analytics/analytics-click-tracker.tsx` mounts one delegated document click listener and translates `data-analytics-*` attributes into GA4 events.
- `src/components/analytics/property-view-tracker.tsx` emits `view_property` once per property page load/navigation.
- `getGa4PageContext()` supplies sanitized `page_path`, `page_location`, and `page_title`.
- Query strings are allowlisted. Free-text `q` and unknown parameters are removed before sending to GA4.
- WhatsApp numbers/messages, phone numbers, email addresses, and form field values are never sent to GA4.
- Events use `transport_type: "beacon"` where they may precede navigation.

## Events

### `page_view`

Triggered on initial load and App Router client navigation.

Parameters:
- `page_path`: sanitized path plus allowlisted filters.
- `page_location`: sanitized absolute URL.
- `page_title`: `document.title`.

Automatic GA4 page views are disabled to prevent duplicates.

### `whatsapp_click`

Triggered by every WhatsApp/wa.me/api.whatsapp.com link, plus valid contact-form and site-visit-form submissions that open WhatsApp. Form submissions are WhatsApp handoffs, not confirmed sends.

Parameters:
- `link_url`: sanitized WhatsApp origin/path only; never includes the number or message.
- `link_text`: safe button label; digits and `@` are redacted.
- `page_path`, `page_location`, `page_title`
- `button_location`: `floating`, `header`, `footer`, `faq`, `property_card`, `property_detail`, `property_mobile_bar`, `home_final_cta`, `listing_empty_state`, `location_page`, `location_empty_state`, `property_type_empty_state`, `contact_form`, `site_visit_form`, or `page`.
- `property_id`, `property_name`, `property_location`, `property_category`: only where available.
- `form_id`: `contact_form` or `site_visit_form` for form handoffs.

### `phone_call_click`

Triggered by every `tel:` link.

Parameters:
- `link_url`: always `tel:`; the phone number is omitted.
- `link_text`: safe generic label such as `Call`.
- `page_path`, `page_location`, `page_title`, `button_location`.

### `email_click`

Triggered by every `mailto:` link.

Parameters:
- `link_url`: always `mailto:`; the email address is omitted.
- `link_text`: safe generic label such as `Email`.
- `page_path`, `page_location`, `page_title`, `button_location`.

### `view_property`

Triggered once on each property detail page.

Parameters:
- `property_id`
- `property_name`
- `property_location`
- `property_category`
- `page_path`, `page_location`, `page_title`

### `select_content`

Triggered only on meaningful CTAs tagged with `data-analytics-event="select_content"`.

Known `content_id` values:
- `view_properties`
- `explore_locations`
- `contact_us`
- `get_directions`
- `property_details`
- `brochure`
- `site_visit`
- `explore_property_type`
- `explore_location`

Parameters:
- `content_id`, optional `content_name`, `content_category`, `content_type`
- `property_id`, `property_name`, `property_location`, `property_category` where available
- `page_path`, `page_location`, `page_title`, `button_location`

Ordinary navigation links, filters, pagination, and in-page anchors are not instrumented.

### `generate_lead`

Currently emitted only after the newsletter API returns a successful response. It is not emitted for contact or site-visit forms because those forms only open WhatsApp and have no server-confirmed submission signal.

Parameters:
- `form_id: "newsletter"`
- `form_location: "footer"`
- `lead_source: "newsletter"`
- `submission_status: "confirmed"`
- `content_name: "Newsletter subscription"`
- `page_path`, `page_location`, `page_title`

## Enhanced Measurement

- GA4 Enhanced Measurement may already collect outbound clicks and file downloads.
- Custom tracking is intentionally not added for ordinary social links or the actual PDF brochure link to avoid duplicates.
- Verify Enhanced Measurement settings in the GA4 admin UI for the property.

## Testing

Local production checks:

```bash
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
npm.cmd run test:e2e
```

Browser check:
1. Accept analytics consent.
2. Confirm one `gtag/js` loader script and one GA4 config command.
3. Confirm one `page_view` on load and one additional `page_view` after navigating to `/buy`.
4. Click a WhatsApp link and confirm `whatsapp_click` with no phone number or message in parameters.
5. Click a `tel:` link and confirm `phone_call_click` with `link_url: "tel:"`.
6. Click a `mailto:` link and confirm `email_click` with `link_url: "mailto:"`.
7. Open a property detail page and confirm one `view_property`.
8. Submit the newsletter form successfully and confirm one `generate_lead`.
9. Decline consent in a fresh browser context and confirm no GA4 script, config, or events.

## Adding future tracking

1. Add a new typed event and parameter shape to `Ga4EventMap` in `src/lib/ga4.ts`.
2. Call `trackGa4Event` from a small component utility or add a `data-analytics-*` attribute handled by `AnalyticsClickTracker`.
3. Never pass raw form values, names, phone numbers, email addresses, message bodies, full WhatsApp URLs, or unfiltered query strings.
4. Add a `dedupeKey` for user actions that can fire more than once.
5. Keep consent gating in `trackGa4Event`; do not call `gtag` directly from components.

## Suggested GA4 Key Events

Mark these as Key Events in GA4 if they match business goals:
- `generate_lead`
- `whatsapp_click` when `button_location` is `property_detail`, `property_mobile_bar`, `contact_form`, or `site_visit_form`
- `phone_call_click`
- `view_property` as an engagement signal, not necessarily a conversion
