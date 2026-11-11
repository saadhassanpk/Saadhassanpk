# Maison Sienna — Cinematic Restaurant Website

A fictional Mediterranean restaurant portfolio project, built in **Next.js 16**, **React 19**, **TypeScript** and custom responsive CSS.

## Features

- Full-bleed cinematic restaurant video background on the hero.
- **Scroll-directed film section:** scroll position controls the playback position of an actual food video; reverse scrolling runs footage backwards. The chapter includes 4 storytelling beats and a progress indicator. A poster image appears if the remote video is blocked or unavailable.
- Editorial visual design and responsive mobile navigation.
- Filterable 8-dish sample menu, vegetarian filter, sample order drawer with subtotal.
- Reservation form demo, with validation and explicit notice that no actual bookings are made.
- SEO/social metadata, semantic markup, reduced-motion and keyboard support.

## Tech

Next.js 16.4.6 / React 19 / TypeScript / custom CSS. No animation UI frameworks, paid APIs, payment provider or backend.

## Running locally

```bash
npm install
npm run dev
```

For production:

```bash
npm run typecheck
npm run build
npm start
```

## Deploy with Vercel

Import the repository in Vercel, choose `Next.js` as framework, and deploy using the production branch holding the website source.

## Media and source notes

This demo uses third-party hosted **Pexels MP4** videos (not pre-extracted JPEG frame files), with direct seek on scroll and Unsplash static imagery. The page does **not** bundle or redistribute the third-party videos. Because third-party URLs can change, replace the demo sources with owned/cleared footage before production use, and consider hosting optimized MP4/WebM renditions on your own CDN.

- Hero video source: `https://videos.pexels.com/video-files/3196236/3196236-hd_1920_1080_25fps.mp4`
- Scroll narrative video source: `https://videos.pexels.com/video-files/852375/852375-hd_1920_1080_24fps.mp4`
- Pexels license: https://www.pexels.com/license/
- Unsplash license: https://unsplash.com/license

**This is a portfolio demo, not an actual restaurant.** Menus/prices are illustrative; reservations and checkout do not contact any business or server.
