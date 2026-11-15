'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {AddButton,BagLink} from './add-button';
import {categories,menu,money} from '@/lib/menu';
export function MenuBrowser(){
  const [category,setCategory]=useState<(typeof categories)[number]>('All');
  const [veg,setVeg]=useState(false);const [query,setQuery]=useState('');
  const shown=useMemo(()=>menu.filter(item=>(category==='All'||item.category===category)&&(!veg||item.vegetarian)&&((item.name+' '+item.ingredients).toLowerCase().includes(query.trim().toLowerCase()))),[category,veg,query]);
  return <section className="container editorial-section"><div className="eyebrow dark-muted"><span className="eyebrow-line"/> MADE TO BE SHARED</div><div className="editorial-head"><h2>Discover your <em>favourites.</em></h2><p>From the first bite to the last little indulgence. Choose a category, search the menu or find something vegetarian.</p></div>
  <div className="menu-toolbar"><div className="menu-tabs" role="group" aria-label="Menu categories">{categories.map(c=><button type="button" key={c} className={category===c?'active':''} aria-pressed={category===c} onClick={()=>setCategory(c)}>{c}</button>)}</div><label className="menu-search"><span className="sr-only">Search menu</span><input type="search" placeholder="Search ingredients or dishes" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="menu-veg"><input type="checkbox" checked={veg} onChange={e=>setVeg(e.target.checked)}/> Vegetarian only</label></div>
  <div className="enhanced-dish-grid" aria-live="polite">{shown.map(item=><article className="enhanced-dish" key={item.id}><Link href={'/menu/'+item.slug} className="enhanced-dish-image"><img src={item.image} alt={item.name} loading="lazy"/>{item.highlight&&<span className="dish-badge">{item.highlight}</span>}</Link><div className="enhanced-dish-body"><span className="dish-type">{item.category}{item.vegetarian?' · Vegetarian':''}</span><div className="enhanced-dish-title"><h3><Link href={'/menu/'+item.slug}>{item.name}</Link></h3><b>{money(item.price)}</b></div><p>{item.ingredients}</p><div className="dish-buttons"><Link className="small-inline-link" href={'/menu/'+item.slug}>VIEW DETAILS ↗</Link><AddButton id={item.id} label="ADD +" className="dish-add-button"/></div></div></article>)}</div>
  {!shown.length&&<div className="empty-state"><h3>Nothing matched that search.</h3><p>Try another ingredient or clear your filters.</p><button className="button button-dark" onClick={()=>{setCategory('All');setQuery('');setVeg(false)}}>SHOW FULL MENU</button></div>}
  <div className="menu-bottom-note"><p>Illustrative menu and pricing · Australian dollars · No real orders processed</p><BagLink/></div></section>;
}
