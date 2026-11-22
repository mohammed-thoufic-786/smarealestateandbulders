# SMA Real Estate & Builders — Real Estate Platform for Tamil Nadu

A public real-estate website for SMA Real Estate & Builders, built with **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS**. It publishes exactly three official SMA properties sourced from the supplied brochures, with no accounts or sign-in.

---

## Highlights

- **Official catalogue only** — KURUNJI GARDEN, K.M.B GARDEN and S.M.A GARDEN. No demo listings or placeholder prices.
- **Original brochure assets** — extracted layout and site images served from `public/properties/`, with the source PDFs kept alongside them.
- **Layout viewer** — zoom, pan, reset and fullscreen controls for each original approved layout.
- **Enquiries & site visits** — validated, rate-limited forms that save real records with the correct property association.
- **Local persistence** — without MongoDB, submissions are written to `data/enquiries.json` and `data/site-visits.json` so they survive restarts.
- **Design system** — Black + Gold ultra-luxury palette with rich black dark sections, antique gold accents, cream light sections, #EDEDED typography on dark surfaces and warm gold borders; Playfair Display + Inter typography, motion and accessible components.
- **SEO** — per-page metadata, sitemap, robots, JSON-LD and semantic markup.
- **Security** — server-side Zod validation, rate limiting, no secrets in the client.

---

## Getting started

Requirements: **Node.js 20+** (developed on 24) and npm.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. No database or API keys are required to browse; the site serves the bundled official catalogue immediately. Configure Resend for enquiry emails.

> On Windows PowerShell, if `npm.ps1` is blocked by the execution policy, use `npm.cmd` / `npx.cmd`.

---

## Scripts

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start the dev server (Turbopack)             |
| `npm run build`       | Production build                             |
| `npm run start`       | Run the production build                     |
| `npm run lint`        | ESLint (flat config, `eslint-config-next`)   |
| `npm run typecheck`   | TypeScript, no emit                          |
| `npm run test`        | Vitest unit tests                            |
| `npm run test:watch`  | Vitest in watch mode                         |
| `npm run test:e2e`    | Playwright end-to-end tests (needs a build)  |
| `npm run test:e2e:ui` | Playwright interactive UI mode               |
| `npm run seed`        | Seed MongoDB from the official catalogue     |

---

## Environment variables

Copy `.env.example` to `.env.local` and fill in values as needed.

- **`MONGODB_URI`** — leave empty for local JSON persistence. Set it (e.g. MongoDB Atlas) to read and write through Mongoose.
- **`NEXT_PUBLIC_SITE_URL`** — canonical URL used for SEO metadata and the sitemap.
- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** — click-to-chat number; defaults to `9150128777`.
- **`NEXT_PUBLIC_FACEBOOK_URL` / `NEXT_PUBLIC_INSTAGRAM_URL`** — footer social links.
- **`NEXT_PUBLIC_BUSINESS_EMAIL`** — public business email shown on the site.
- **`RESEND_API_KEY` / `EMAIL_FROM`** — required for enquiry and site-visit emails. `EMAIL_FROM` must be a sender verified in Resend.
- **`ADMIN_EMAIL`** — admin copy recipient; falls back to `NEXT_PUBLIC_BUSINESS_EMAIL`.
- Other optional integrations are documented inline in `.env.example`.

---

## How data works

The data layer lives in `src/lib/data/`.

- **Official catalogue.** `properties.ts` is the single source of truth for the three SMA properties. It uses exact brochure locations, official approval text, public image paths and `price: 0` (displayed as "Price on request"). No coordinates are stored, so the site shows location text instead of an unverified map.
- **Without MongoDB.** `repository.ts` serves the official catalogue and persists leads/site visits to local JSON files under `data/` (gitignored). Server-side route handlers canonicalise the property ID so a submission cannot be attached to the wrong property.
- **With MongoDB.** Set `MONGODB_URI` and run `npm run seed`. The same repository functions read and write through Mongoose models (`src/lib/db/models.ts`).

Pages never hardcode property data.

### Notifications

`src/lib/notifications.ts` sends email (Resend REST API) and WhatsApp (Meta Graph API) messages for leads and site visits. It is dependency-free and never throws:

- With `RESEND_API_KEY` + `EMAIL_FROM` set, emails are delivered. If delivery fails, the enquiry is still saved and the response reports `emailSent: false` for monitoring.
- The admin email includes customer name, mobile, email, interested property, property location and enquiry details.
- With `WHATSAPP_ACCESS_TOKEN` + `WHATSAPP_PHONE_NUMBER_ID` set, WhatsApp messages are delivered; otherwise they are skipped.
- `ADMIN_EMAIL` (or legacy `ADMIN_NOTIFICATION_EMAIL`) receives a copy of every lead/enquiry.

---

## Project structure

```
src/
  app/
    (site)/            Public site (home, buy, property/[slug], locations,
                       faq, about, contact, privacy, terms)
    api/               Route handlers: leads, site-visits, newsletter
    sitemap.ts robots.ts not-found.tsx
  components/
    ui/                Primitives (button, badge, input, modal, popover, …)
    layout/            Navbar, footer, logo, page header, newsletter
    property/          Card, listing view, layout viewer, map, enquiry …
    leads/ home/       Enquiry forms and home sections
  lib/
    data/              properties.ts, site-content.ts, repository.ts, lead-store.ts
    db/                connect.ts, models.ts
    business-config.ts email-templates.ts submission-dedupe.ts
    constants.ts types.ts utils.ts validation.ts site.ts
tests/                 Vitest unit tests
e2e/                   Playwright end-to-end tests
scripts/seed.ts        MongoDB seed script
playwright.config.ts   Playwright config (starts its own server on port 3100)
public/properties/     Original brochure images and PDFs for the 3 properties
```

---

## Testing

```bash
npm run test        # Unit tests for validation, search, matching, notifications,
                    # official catalogue and enquiry persistence
npm run typecheck   # Strict TypeScript
npm run lint        # ESLint

npm run build && npm run test:e2e   # Playwright end-to-end suite
```

The E2E suite boots the production build on its own dedicated port (`3100` by default, override with `E2E_PORT`) so it never clashes with a dev server on `3000`. It covers the home page, official catalogue, layout viewer, URL-driven filters, WhatsApp/social links and enquiry submission.

---

## Deployment

### Vercel (recommended)

1. Push the repository to GitHub/GitLab.
2. Import the project in Vercel — the Next.js preset is detected automatically.
3. Add environment variables (`NEXT_PUBLIC_SITE_URL`, and `MONGODB_URI` if using a DB).
4. Deploy. Build command `npm run build`, output handled by Vercel.

> For persistent enquiries on a serverless host, configure `MONGODB_URI`. The local JSON store is intended for single-server deployments.

### Self-hosted (Node)

```bash
npm ci
npm run build
npm run start   # serves on PORT (default 3000)
```

Run behind a reverse proxy (Nginx/Caddy) with TLS. The `data/` directory must be writable if you rely on local persistence. For multi-instance deployments, use MongoDB and back rate limiting with Redis or the database instead of the in-memory store.

### Database

Create a MongoDB Atlas cluster (or any MongoDB 6+), set `MONGODB_URI`, then `npm run seed` to load the three official properties.

---

## Security notes

- All API inputs are validated server-side with **Zod**; endpoints are rate limited per IP.
- Property IDs for leads and site visits are resolved from the official catalogue on the server.
- The site is fully public — there are no accounts, sessions or protected routes.
- Never commit `.env.local` or the generated `data/` files. Only `NEXT_PUBLIC_*` values reach the browser.

---

## Continuous integration

`.github/workflows/ci.yml` runs on every push and pull request to `main`/`master`:
**lint → typecheck → unit tests → production build**, then a separate **Playwright e2e** job that installs Chromium and runs the suite against the build.

---

## Notes & limitations

- Prices are intentionally stored as `0` and shown as "Price on request" because the supplied brochures do not state prices.
- No latitude/longitude was supplied for any property, so third-party map embeds are not used.
- Layout and site images are the original extracted brochure assets; they are not redrawings.
- Enquiries without MongoDB are stored locally in a single process; configure MongoDB for shared, durable storage.

---

© SMA Real Estate & Builders. Built for Tamil Nadu.
