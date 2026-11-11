import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://maison-sienna-restaurant.vercel.app'),
  title: 'Sienna | Come Hungry. Leave Inspired.',
  description: 'Modern Mediterranean dining reimagined. A cinematic, scroll-directed, 540-frame restaurant portfolio experience.',
  keywords: ['Sienna restaurant', 'restaurant portfolio', 'Mediterranean dining', 'Next.js', 'scrollytelling', '540-frame film'],
  openGraph: {
    title: 'Sienna — Come Hungry. Leave Inspired.',
    description: 'An editorial restaurant experience built around genuine 4K-source cinematic footage.',
    siteName: 'Sienna',
    type: 'website',
    images: [{url: '/story/hero-poster.jpg', width: 1920, height: 1080, alt: 'Sienna restaurant — gourmet dining'}],
  },
  twitter: {card: 'summary_large_image', images: ['/story/hero-poster.jpg']},
};
export const viewport: Viewport = { themeColor: '#f6f3eb', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
