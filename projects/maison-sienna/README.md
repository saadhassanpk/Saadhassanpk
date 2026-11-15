# Maison Sienna — Multi-page Restaurant Portfolio

**Live URL:** https://maison-sienna-restaurant.vercel.app/

A fully navigable, responsive fictional restaurant website created with Next.js 16, React 19 and TypeScript. Original ivory, sand, espresso and editorial typography are preserved from the approved homepage design. All video and scroll-frame animation is intentionally removed.

## Pages

- `/` — home, restaurant overview, sample menu, quick add-to-bag, booking CTA
- `/about` — restaurant story and hospitality values
- `/menu` — searchable and filterable complete menu
- `/menu/[slug]` — eight individual dish pages, built at compile time
- `/experience` — kitchen, space and hospitality editorial
- `/gallery` — category filters and keyboard-accessible lightbox
- `/private-dining` — events concept and validated private dining enquiry form
- `/reservations` — validated booking-preference form and confirmation preview
- `/reservations/manage` — view, cancel or remove saved booking previews
- `/contact` — enquiry form and useful links
- `/cart` — persistent cart, quantity adjustments, totals and clearing
- `/checkout` — payment-free demo checkout with validation
- `/order-confirmation` — itemised saved demo receipt and reference
- `/faq`, `/privacy`, `/terms` — FAQs and clear terms for fictional demo
- `sitemap.xml`, `robots.txt`, custom `not-found` page

## How it works

The product is a **complete interactive portfolio demonstration**. The cart survives refresh and navigation. Reservations, enquiries and sample orders are validated and stored **only in the visitor's own browser localStorage**. They can be reviewed in the UI. No actual table inventory, restaurants, staff, payments, emails or real-time availability is connected. No fake confirmation of a real purchase or booking is displayed. This distinction is visible near all relevant forms.

Self-hosted WebP photography from existing `public/media/` is retained; there are no hero videos or scroll-scrubbing sequences. The original homepage's visual identity and layout are maintained.

## Run locally

Node 22:

```sh
npm install
npm run typecheck
npm run build
npm run dev
```

Vercel project root: `projects/maison-sienna`. Production branch: `main`. Git push triggers an automatic deployment. No paid services, API keys, or database credentials are required to run the interactive demo.

## Before real restaurant use

This portfolio must not be represented as an operational venue. A real restaurant launch requires its real identity/location/menu and explicit decisions about booking provider, transactional email, privacy, orders/payments and fulfilment. Those are intentionally **not simulated as real transactions**.
