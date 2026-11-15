import type {Metadata} from 'next';
import {SiteChrome,PageHero} from '@/components/site-chrome';
import {CheckoutForm} from '@/components/demo-forms';
import {CheckoutSummary} from '@/components/shopping-flow';
export const metadata:Metadata={title:'Demo Checkout',description:'Complete an interactive sample order workflow without real payment.' ,robots:{index:false,follow:false}};
export default function CheckoutPage(){return <SiteChrome><PageHero eyebrow="FINISHING TOUCHES" title={<>One more <em>lovely thing.</em></>} description="Review your selections and complete a safe, payment-free checkout preview." image="/media/dinner.webp"/><section className="container editorial-section two-column-content"><CheckoutForm/><CheckoutSummary/></section></SiteChrome>}
