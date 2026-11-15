import type {Metadata} from 'next';
import Link from 'next/link';
import {SiteChrome,PageHero,PageCta} from '@/components/site-chrome';
export const metadata:Metadata={title:'Frequently Asked Questions',description:'Answers about the Maison Sienna restaurant portfolio, sample menu, reservations and ordering.'};
const faqs=[
  ['Is Maison Sienna a real restaurant?','No. Maison Sienna is an original restaurant website design concept built for a software development portfolio. There is no operating venue or real dining location.'],
  ['Can I book a table?','You can complete the interactive reservation preview and manage it on the same device. Your preferences are not sent to a real restaurant and no table is held.'],
  ['Can I place an order?','You can add sample dishes to your bag, edit quantities and complete the checkout demonstration. No food is prepared or delivered, and no payment is taken.'],
  ['Are the menu and prices real?','No. Dishes, descriptions and AUD prices are illustrative. They are included to demonstrate a realistic restaurant ordering interface.'],
  ['Where are my form details stored?','Reservation, order and enquiry previews are stored in your browser’s local storage. They are not submitted to a backend or shared with restaurant staff.'],
  ['How do I delete saved reservation previews?','Visit the My demo requests page, where you can cancel or remove saved reservation previews from this browser. You can also clear site data in browser settings.'],
  ['Can this design be customised for a real restaurant?','Yes. The Next.js site is built to be adapted with a real menu, venue details, brand imagery, secure payment provider and genuine reservation platform. Those operational integrations are not active in this portfolio concept.'],
];
export default function FaqPage(){return <SiteChrome><PageHero eyebrow="A LITTLE HELP ALONG THE WAY" title={<>Good questions.<br/><em>Thoughtful answers.</em></>} description="Everything you need to know about this restaurant concept and its interactive features." image="/media/hero-room.webp"/><section className="container editorial-section faq-section"><div className="editorial-head"><h2>The details <em>that matter.</em></h2><p>Answers about the restaurant experience and how this demonstration works.</p></div>{faqs.map(([q,a])=><details className="faq-item" key={q}><summary>{q}<span aria-hidden="true">+</span></summary><p>{a}</p></details>)}<div className="faq-links"><Link href="/privacy">PRIVACY ↗</Link><Link href="/terms">TERMS ↗</Link><Link href="/contact">CONTACT ↗</Link></div></section><PageCta eyebrow="READY TO EXPLORE?" title="Find something wonderful." href="/menu" cta="SEE THE MENU"/></SiteChrome>}
