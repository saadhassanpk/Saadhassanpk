import type {Metadata} from 'next';
import {SiteChrome,PageHero} from '@/components/site-chrome';
import {OrderConfirmation} from '@/components/demo-forms';
export const metadata:Metadata={title:'Order Preview',robots:{index:false,follow:false}};
export default function ConfirmationPage(){return <SiteChrome><PageHero eyebrow="A LOVELY CHOICE" title={<>A little more <em>to look forward to.</em></>} description="Your interactive sample order journey, complete." image="/media/table.webp"/><OrderConfirmation/></SiteChrome>}
