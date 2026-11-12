# Maison Sienna — A Mediterranean Kitchen & Bar

An original, cinematic restaurant portfolio experience built with **Next.js 16, React 19 and TypeScript**.

**Live production site:** https://maison-sienna-restaurant.vercel.app/

## Experience

- Bespoke, responsive editorial interface: ivory, deep forest, warm brass and oversized refined serif typography.
- Full-screen **2K (2048×1080) video hero**, seven seconds, looping silently with a self-hosted poster fallback.
- **540-frame 2K scroll-controlled film**, 21.6 seconds at 25fps, with three distinct chapter transitions. Scrolling forward/backward seeks to the matching decoded video frame; the website does not display developer metrics or frame counts.
- Ten locally hosted high-resolution food and interior photographs from Unsplash, requested at 2560px width and stored as WebP.
- Interactive six-dish menu with category filters, selection drawer, quantity controls and pricing.
- Reservation-preference modal with date, guests, time, contact details and review summary. **It does not send or confirm real reservations.**
- Accessible semantics, keyboard dismissal, reduced-motion fallback, image alt text and OpenGraph metadata.

## Media production / provenance

All video and photography shipped by the site is stored under `public/media/` and served by Vercel rather than hotlinked from third-party servers.

- Hero and chapter one source: [Pexels 4926203](https://www.pexels.com/video/4926203/) — 4096×2160, ~12 seconds.
- Chapters two and three: [Pexels 6823282](https://www.pexels.com/video/6823282/) — 4096×2160, 29 seconds.
- **Film:** three 7.2-second sequences encoded at 2048×1080, 25fps, totaling exactly 540 video frames (verified by `ffprobe` in GitHub Actions).
- **Photos:** the ten Unsplash source IDs and download commands are recorded in [`.github/workflows/maison-sienna-assets.yml`](../../.github/workflows/maison-sienna-assets.yml). Images are requested at 2560px width; the resulting WebP files are committed under `public/media/`.
- [Pexels licence](https://www.pexels.com/license/) and [Unsplash licence](https://unsplash.com/license/) permit free use of these assets in commercial and personal projects, subject to their restrictions. Do not imply pictured people, brands or venues endorse this fictional restaurant.

The older `scripts/prepare-assets.mjs` is **not part of the current production build**; the replacement source-controlled 2K media is produced by the GitHub Actions workflow above. Higgsfield video generation was unavailable under the connected Free plan for this particular build. No Higgsfield-generated footage is claimed.

## Development

Node.js 22.x, npm:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run start
```

Project root (within the GitHub profile repository): `projects/maison-sienna`. Vercel's Root Directory points there, with `main` as the production branch. Assets are committed, so routine development/builds do not need to download original stock footage.

## Verification

- Production build: Vercel READY; TypeScript compilation passed (12 November 2026).
- Desktop browser QA: hero video movement, scrollytelling visuals, images, navigation, menu filtering, selection drawer and reservation modal observed functioning; no blocking visual issues reported.
- **Mobile browser viewport has not been independently verified.** Responsive CSS breakpoints exist, but do not treat that as a completed mobile QA pass.

## Scope

This is a fictional portfolio restaurant. The UI is client-presentable, but pricing, brand, restaurant identity, menu and reservation preferences are illustrative. No backend booking, payment processing, emails or inventory service is connected. Integrate an actual restaurant's operational services before commercial launch.
