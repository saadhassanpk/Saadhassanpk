'use client';
import {useEffect,useState} from 'react';
const images=[
  {src:'/media/hero-room.webp',title:'An evening worth lingering over',category:'The space'},
  {src:'/media/table.webp',title:'Made for the table',category:'The food'},
  {src:'/media/interior.webp',title:'A warm welcome',category:'The space'},
  {src:'/media/chef.webp',title:'The hands behind the plates',category:'The craft'},
  {src:'/media/pasta.webp',title:'Comfort, considered',category:'The food'},
  {src:'/media/grill.webp',title:'The warmth of the fire',category:'The food'},
  {src:'/media/seafood.webp',title:'Market-fresh inspiration',category:'The food'},
  {src:'/media/dessert.webp',title:'A sweet ending',category:'The food'},
];
export function GalleryBrowser(){
  const [open,setOpen]=useState<number|null>(null);const [filter,setFilter]=useState('All');
  const visible=images.map((v,i)=>({...v,index:i})).filter(v=>filter==='All'||v.category===filter);
  useEffect(()=>{if(open===null)return;const key=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpen(null);if(e.key==='ArrowRight')setOpen(i=>i===null?i:(i+1)%images.length);if(e.key==='ArrowLeft')setOpen(i=>i===null?i:(i+images.length-1)%images.length);};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[open]);
  return <section className="container editorial-section"><div className="menu-tabs gallery-tabs" role="group" aria-label="Photo categories">{['All','The food','The space','The craft'].map(t=><button type="button" key={t} aria-pressed={filter===t} onClick={()=>setFilter(t)} className={filter===t?'active':''}>{t}</button>)}</div><div className="gallery-mosaic">{visible.map(({src,title,category,index})=><button className="gallery-photo" key={src} onClick={()=>setOpen(index)} aria-label={'View photo: '+title}><img src={src} alt={title} loading="lazy"/><span><small>{category}</small><strong>{title}</strong><i aria-hidden="true">↗</i></span></button>)}</div>
  {open!==null&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={()=>setOpen(null)}><button className="lightbox-close" aria-label="Close photo" onClick={()=>setOpen(null)}>×</button><button className="lightbox-prev" aria-label="Previous photo" onClick={e=>{e.stopPropagation();setOpen((open+images.length-1)%images.length)}}>‹</button><div className="lightbox-main" onClick={e=>e.stopPropagation()}><img src={images[open].src} alt={images[open].title}/><div><small>{images[open].category}</small><p>{images[open].title}</p><small>{open+1} / {images.length}</small></div></div><button className="lightbox-next" aria-label="Next photo" onClick={e=>{e.stopPropagation();setOpen((open+1)%images.length)}}>›</button></div>}
  </section>;
}
