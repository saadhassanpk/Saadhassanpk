import type {Metadata} from 'next';
import {PageHero,PageCta,SiteChrome} from '@/components/site-chrome';
import {MenuBrowser} from '@/components/menu-browser';
export const metadata:Metadata={title:'The Menu',description:'Discover the thoughtfully crafted Mediterranean-inspired sample menu at Maison Sienna.'};
export default function MenuPage(){return <SiteChrome><PageHero eyebrow="THE MAISON SIENNA MENU" title={<>Something <em>delicious awaits.</em></>} description="Seasonal inspiration. Honest ingredients. Plates made for the people around your table." image="/media/table.webp"/><MenuBrowser/><PageCta eyebrow="STAY A LITTLE LONGER" title="An evening is best shared." href="/reservations" cta="PLAN YOUR VISIT"/></SiteChrome>}
