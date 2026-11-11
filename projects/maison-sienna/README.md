# Sienna — The House of Good Food

A portfolio-grade **Next.js 16 / React 19 / TypeScript** restaurant experience, fully redesigned around editorial visual design and an original **540-frame** scroll-driven film.

**Live website:** https://maison-sienna-restaurant.vercel.app/

## Features

- Fully redesigned contemporary Mediterranean restaurant experience, light ivory / deep olive / terracotta palette
- True 540-frame scroll-directed sequence: 540 consecutive frames extracted from **a verified 4096×2160 25fps source**, not artificially repeated frames or seeking a compressed video
- Desktop: 60 three-by-three WebP frame-sheets, **1280×675 per frame**, 3840×2025 source sprite image
- Mobile: 60 portrait-cropped three-by-three sheets, **540×960 per frame**, avoiding landscape upscaling to a portrait viewport
- Canvas drawing with animation-frame scheduling, direction reversal, nearby sheet prefetching and bounded cache
- Autoplay hero film from a separate 4K source, delivered as optimized **1080p WebM + MP4**
- Three **original Higgsfield-generated** restaurant images integrated in the page and hosted as local assets
- Filterable six-item sample menu, responsive image cards, working client-side sample cart, keyboard-dismissable demo booking dialog
- Search and social metadata, image alt text and clear demo-only disclaimer (no live bookings or payment backend)

## Local development

Node.js 22.x:

```bash
npm install
npm run dev
```

`predev` and `prebuild` automatically run `scripts/prepare-assets.mjs`. For production:

```bash
npm run build
npm run start
```

The generation script downloads two 4K licensed Pexels MP4s and three Higgsfield originals, extracts exactly **540 source frames** into 60 desktop and 60 mobile WebP contact sheets, produces an 8-second 1080p hero MP4 + VP9 WebM, and writes assets to `public/story` and `public/studio`.

**Important:** Build-time network access is needed to download the listed original media. A network failure fails the build loudly instead of deploying broken links. Assets are then served from your own Vercel deployment; visitors do not have to fetch the source media remotely. The generated binary assets are intentionally not stored in Git.

## Media provenance

- Higgsfield-generated original restaurant/food images: three successful `z_image` jobs in the owner's connected Higgsfield workspace (11 November 2026). Film generation on the Free plan was restricted; do not represent the film as Higgsfield-generated video.
- Scrollytelling source: [Pexels video 7243902](https://www.pexels.com/video/7243902/) — source 4096×2160, 25fps, 24.58 seconds; first 540 genuine frames (21.6 seconds of original footage).
- Hero source: [Pexels video 7243905](https://www.pexels.com/video/7243905/) — 4096×2160, 25fps, cut to an 8-second HD loop.

The fictional brand Sienna has no physical address, real payment checkout, reservation backend or operational opening-hours guarantee. All prices and restaurant details are demonstration content.
