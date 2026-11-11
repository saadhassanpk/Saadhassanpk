import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maison Sienna | A Modern Mediterranean Table',
  description: 'An editorial restaurant experience celebrating food, warmth and the art of gathering. A Next.js portfolio concept.',
  keywords: ['restaurant website', 'modern Mediterranean', 'restaurant design', 'Next.js portfolio', 'Maison Sienna'],
  openGraph: {
    title: 'Maison Sienna — A Modern Mediterranean Table',
    description: 'An invitation to gather. A beautifully crafted restaurant website concept.',
    type: 'website',
    images: [{ url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80', width: 1200, height: 630, alt: 'Elegant restaurant table' }],
  },
};
export const viewport: Viewport = { themeColor: '#201f1b', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
