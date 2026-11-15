import type {Metadata} from 'next';
import {SiteChrome,PageHero,PageCta} from '@/components/site-chrome';
import {CartPageClient} from '@/components/shopping-flow';
export const metadata:Metadata={title:'Your Bag',description:'Review your sample Maison Sienna order, adjust quantities and explore checkout.'};
export default function CartPage(){return <SiteChrome><PageHero eyebrow="THE GOOD THINGS YOU CHOSE" title={<>Your little <em>collection.</em></>} description="A few favourites for the table. Adjust the quantities or add another delicious idea." image="/media/table.webp"/><CartPageClient/><PageCta eyebrow="MORE TO DISCOVER" title="There’s always room for one more." href="/menu" cta="BACK TO THE MENU"/></SiteChrome>}
