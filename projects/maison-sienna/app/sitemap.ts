import type {MetadataRoute} from 'next';
import {menu} from '@/lib/menu';
export default function sitemap():MetadataRoute.Sitemap{const base='https://maison-sienna-restaurant.vercel.app';return ['','/about','/menu','/experience','/gallery','/private-dining','/reservations','/contact','/faq','/privacy','/terms',...menu.map(i=>'/menu/'+i.slug)].map(url=>({url:base+url,changeFrequency:'monthly' as const,priority:url===''?1:0.7}))}
