'use client';
import {useEffect,useState} from 'react';
import type {ReactNode} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCart} from './cart-provider';
const nav=[['/about','Our story'],['/menu','The menu'],['/experience','Experience'],['/gallery','Gallery'],['/private-dining','Private dining'],['/contact','Contact']];
export function SiteChrome({children}:{children:ReactNode}){
  const [open,setOpen]=useState(false); const {count}=useCart(); const path=usePathname();
  useEffect(()=>{setOpen(false)},[path]);
  useEffect(()=>{
    if(!open)return;
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(false)};
    document.addEventListener('keydown',key);
    return()=>document.removeEventListener('keydown',key);
  },[open]);
  return <div className="subpage">
    <div className="announcement"><span>MADE FOR THE MOMENTS THAT MATTER</span><span className="announcement-end">A MODERN MEDITERRANEAN TABLE <span className="mini-star">✦</span> OPEN EVERY EVENING</span></div>
    <header className="site-header sub-header">
      <Link className="brand" href="/" aria-label="Maison Sienna home"><span className="brand-top">MAISON</span><span className="brand-main">SIENNA<span className="brand-dot">.</span></span><span className="brand-bottom">KITCHEN <span>◆</span> BAR</span></Link>
      <nav className={'primary-nav'+(open?' nav-open':'')} aria-label="Main navigation">
        {nav.map(([to,label])=><Link key={to} href={to} className={path===to?'is-current':''} onClick={()=>setOpen(false)}>{label}</Link>)}
        <Link className="mobile-only nav-book" href="/reservations" onClick={()=>setOpen(false)}>Reserve a table <span>↗</span></Link>
      </nav>
      <div className="header-actions"><Link className="header-cart" href="/cart" aria-label={'View bag, '+count+' items'}>♧{count>0&&<span className="cart-count">{count}</span>}</Link><Link className="button nav-reserve" href="/reservations">BOOK A TABLE <span>↗</span></Link><button className="menu-trigger" type="button" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(v=>!v)}><span aria-hidden="true">{open?'×':'☰'}</span></button></div>
    </header>
    {open&&<button className="mobile-dim" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <main id="main-content">{children}</main>
    <footer className="footer"><div className="container footer-top"><div><Link className="footer-brand" href="/">MAISON<br/><em>SIENNA.</em></Link><span className="footer-tagline">A LITTLE MORE TIME FOR THE GOOD THINGS.</span><Link className="footer-mini-link" href="/reservations">RESERVE AN EVENING ↗</Link></div><div className="footer-column"><h4>EXPLORE</h4><Link href="/about">Our story</Link><Link href="/menu">The menu</Link><Link href="/experience">Experience</Link><Link href="/gallery">Gallery</Link><Link href="/private-dining">Private dining</Link></div><div className="footer-column"><h4>YOUR VISIT</h4><Link href="/reservations">Reservations</Link><Link href="/cart">Your bag</Link><Link href="/contact">Contact</Link><Link href="/faq">Frequently asked</Link><Link href="/reservations/manage">My demo requests</Link></div><div className="footer-news"><h4>A NOTE FROM US</h4><p>A fictional restaurant concept created for a web design portfolio. No actual restaurant, payment or booking service is connected.</p><span className="footer-flower">✳</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} MAISON SIENNA · PORTFOLIO CONCEPT</span><span><Link href="/privacy">PRIVACY</Link><Link href="/terms">TERMS</Link><Link href="#main-content">BACK TO TOP ↑</Link></span></div></footer>
  </div>;
}
export function PageHero({eyebrow,title,description,image}:{eyebrow:string;title:ReactNode;description:string;image:string}){
  return <section className="page-hero" style={{backgroundImage:'linear-gradient(90deg,rgba(21,18,15,.88),rgba(21,18,15,.49) 58%,rgba(21,18,15,.14)),url('+image+')'}}><div className="container page-hero-content"><p className="eyebrow"><span className="eyebrow-line"/>{eyebrow}</p><h1>{title}</h1><p>{description}</p><div className="page-hero-accent">✳</div></div></section>;
}
export function PageCta({eyebrow,title,href,cta}:{eyebrow:string;title:string;href:string;cta:string}){
  return <section className="page-cta"><div className="container page-cta-inner"><div><span className="eyebrow dark-muted"><span className="eyebrow-line"/>{eyebrow}</span><h2>{title}</h2></div><Link className="button button-dark" href={href}>{cta} <span>↗</span></Link></div></section>;
}
