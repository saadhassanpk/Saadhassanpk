import type {Metadata} from 'next';
import {SiteChrome,PageHero} from '@/components/site-chrome';
import {ReservationManager} from '@/components/demo-forms';
export const metadata:Metadata={title:'Saved Reservation Previews',robots:{index:false,follow:false}};
export default function ManagePage(){return <SiteChrome><PageHero eyebrow="YOUR LITTLE PLANS" title={<>Made for <em>your evening.</em></>} description="View, cancel or remove reservation previews stored on this device." image="/media/hero-room.webp"/><ReservationManager/></SiteChrome>}
