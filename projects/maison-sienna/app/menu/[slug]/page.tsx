import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {SiteChrome,PageCta} from '@/components/site-chrome';
import {AddButton} from '@/components/add-button';
import {menu,money,itemBySlug} from '@/lib/menu';
export function generateStaticParams(){return menu.map(item=>({slug:item.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=itemBySlug(slug);return {title:item?item.name:'Dish not found',description:item?.ingredients||'Explore our menu'};}
export default async function DishPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;const item=itemBySlug(slug);if(!item)notFound();
  return <SiteChrome><div className="container breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/menu">Menu</Link><span>/</span><span>{item.name}</span></div><section className="container dish-detail"><div className="dish-detail-photo"><img src={item.image} alt={item.name}/></div><div className="dish-detail-copy"><div className="eyebrow dark-muted"><span className="eyebrow-line"/>{item.category.toUpperCase()}</div><h1>{item.name}</h1><p className="dish-lead">{item.description}</p><div className="detail-rule"/><h3>What&apos;s on the plate</h3><p>{item.ingredients}</p>{item.vegetarian&&<p className="detail-pill">Vegetarian</p>}<div className="detail-price"><strong>{money(item.price)}</strong><span>Illustrative sample price · AUD</span></div><AddButton id={item.id} label="ADD TO YOUR BAG"/><Link href="/menu" className="text-link dark-link">← BACK TO THE MENU</Link></div></section><PageCta eyebrow="AN INVITATION" title="Make a night of it." href="/reservations" cta="PLAN AN EVENING"/></SiteChrome>;
}
