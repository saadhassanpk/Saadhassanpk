import type {Metadata} from 'next';
import {SiteChrome,PageHero,PageCta} from '@/components/site-chrome';
import {GalleryBrowser} from '@/components/gallery-browser';
export const metadata:Metadata={title:'Gallery',description:'Explore the visual world of Maison Sienna: Mediterranean-inspired dining, food and interiors.'};
export default function GalleryPage(){return <SiteChrome><PageHero eyebrow="LITTLE MOMENTS, BEAUTIFULLY KEPT" title={<>A glimpse of <em>the good life.</em></>} description="An editorial collection of what makes an evening memorable — from the first plate to the last conversation." image="/media/dinner.webp"/><GalleryBrowser/><PageCta eyebrow="YOUR SEAT IS WAITING" title="See you at the table." href="/reservations" cta="PLAN A VISIT"/></SiteChrome>}
