# Maison Sienna — Mediterranean Restaurant Portfolio

A responsive restaurant website built with **Next.js 16, React 19 and TypeScript**.

**Live website:** https://maison-sienna-restaurant.vercel.app/

## Website experience

- Elegant, responsive restaurant design retaining the original ivory, cream, espresso and warm-sand visual identity.
- Hero uses a **locally hosted high-resolution restaurant interior photo** instead of an autoplay video; the text remains readable with an integrated gradient overlay.
- Food, venue and chef photography served locally from `public/media/` in WebP format, not hotlinked to external services.
- Original editorial typography, navigation, menu cards, hero layout and reservation UI.
- Interactive sample menu with category filters, item selection and cart preview.
- Reservation preference form for the fictional restaurant; **this is a demo and does not send or confirm real bookings**.
- Smooth normal page scrolling. **No scroll-controlled video, frame-by-frame animation or autoplay hero video.**
- Accessible alt text, keyboard escape handling and responsive CSS.

## Local development

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Within the GitHub profile repo, the project root is `projects/maison-sienna`. The Vercel project is linked to `main` with that root directory.

## Media and usage

The website's images were sourced from Unsplash and copied into this repository at high resolution. Respect the [Unsplash licence](https://unsplash.com/license/) when reusing the project.

This is a portfolio concept: the brand, menu and prices are illustrative. The booking form, order/cart and contact information must be integrated with real services before being offered to restaurant customers.
