import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:'Maison Sienna | A Mediterranean Kitchen & Bar',
  description:'A table worth staying for. An intimate Mediterranean-inspired restaurant experience, honest cooking and beautiful evenings.',
  keywords:['Mediterranean dining','restaurant','fine dining','seasonal dining','Maison Sienna'],
  openGraph:{title:'Maison Sienna — An Evening to Remember',description:'Good food. Great company. A little more time for both.',images:[{url:'/media/interior.webp',width:2560,height:1707,alt:'Warm Maison Sienna-inspired dining room'}],type:'website'},
  twitter:{card:'summary_large_image'},
  robots:{index:true,follow:true}
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}</body></html>;
}