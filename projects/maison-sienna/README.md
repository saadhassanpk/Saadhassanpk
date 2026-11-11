# Maison Sienna — Restaurant Website Concept

A premium, responsive **Next.js 16 / React 19 / TypeScript** portfolio website for a **fictional** contemporary Mediterranean restaurant.

## Features

- Rich editorial landing page, immersive photographic hero, warm neutral palette and responsive typography
- Mobile navigation and keyboard-accessible overlays
- Interactive menu filtering with vegetarian selection
- Functional sample cart with quantity editing, subtotal and no real payment processing
- Reservation enquiry **demo** with form validation and a clear no-booking confirmation
- Responsive mobile/tablet/desktop layouts, micro-interactions, page metadata and OpenGraph preview
- No server credentials, no database required and no fake ordering or booking integrations

## Run locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000. For a production compile run `npm run build` followed by `npm start`.

## Deploy to Vercel

1. Push the folder to a GitHub repository.
2. In Vercel, choose **Add New → Project → Import Git Repository**.
3. Select the repository. If this project is nested in a larger repository, configure **Root Directory** as the folder containing `package.json`.
4. Framework preset **Next.js**, then **Deploy**.

No environment variables are needed.

## Content and image notes

Maison Sienna is an original **portfolio demonstration**, not a trading restaurant. Menu items/prices and reservation interactions are fictional. The site must not be used to collect genuine reservations or payments until a verified backend is implemented.

Remote editorial photographs are displayed from `images.unsplash.com` and are governed by the [Unsplash License](https://unsplash.com/license). The project does not copy a live restaurant's brand or website. Photo references can be replaced in `app/page.tsx` before commercial use.

## Technology

Next.js App Router · React 19 · TypeScript · CSS (no component library needed)
