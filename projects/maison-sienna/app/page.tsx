'use client';

import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';

const filmFrames = 540;
const filmFps = 25;
const assets = '/media';

type Category = 'All' | 'Small plates' | 'From the fire' | 'Something sweet';
type Dish = { name: string; note: string; price: number; category: Exclude<Category,'All'>; image: string; signature?: boolean; vegetarian?: boolean };
const categories: Category[] = ['All','Small plates','From the fire','Something sweet'];
const dishes: Dish[] = [
  {name:'Whipped burrata', note:'Heirloom tomatoes, basil, aged balsamic', price:19, category:'Small plates', image:'burrata', vegetarian:true, signature:true},
  {name:'Golden arancini', note:'Wild mushroom, pecorino, truffle aioli', price:18, category:'Small plates', image:'table', vegetarian:true},
  {name:'Saffron pappardelle', note:'Slow tomato, stracciatella, sweet basil', price:35, category:'From the fire', image:'pasta', vegetarian:true, signature:true},
  {name:'Market fish, flame kissed', note:'Preserved lemon, green herbs, olive oil', price:43, category:'From the fire', image:'seafood', signature:true},
  {name:'Slow-roasted lamb', note:'Smoked aubergine, pomegranate, mint', price:47, category:'From the fire', image:'grill'},
  {name:'Dark chocolate & sea salt', note:'Velvet crémeux, cultured cream, cacao', price:18, category:'Something sweet', image:'dessert', vegetarian:true},
];

function Icon({ name, size = 18 }: { name:'arrow'|'arrow-up'|'instagram'|'close'|'menu'|'plus'|'minus'|'chevron'|'check'|'play'|'sun'|'clock'|'spark'; size?:number }) {
  const common = {width:size,height:size,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.5,strokeLinecap:'round' as const,strokeLinejoin:'round' as const,'aria-hidden':true as const};
  if(name==='arrow')return <svg {...common}><path d="M3 12h18m-7-7 7 7-7 7"/></svg>;
  if(name==='arrow-up')return <svg {...common}><path d="M5 19 19 5M8 5h11v11"/></svg>;
  if(name==='menu')return <svg {...common}><path d="M3 8h18M3 16h18"/></svg>;
  if(name==='close')return <svg {...common}><path d="M5 5l14 14M19 5 5 19"/></svg>;
  if(name==='plus')return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
  if(name==='minus')return <svg {...common}><path d="M5 12h14"/></svg>;
  if(name==='chevron')return <svg {...common}><path d="m6 9 6 6 6-6"/></svg>;
  if(name==='check')return <svg {...common}><path d="m4 12 5 5L20 6"/></svg>;
  if(name==='play')return <svg {...common}><path d="m9 5 10 7-10 7z"/></svg>;
  if(name==='clock')return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></svg>;
  if(name==='spark')return <svg {...common}><path d="M12 2v20M2 12h20M5 5l14 14M19 5 5 19"/></svg>;
  if(name==='instagram')return <svg {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
  return <svg {...common}><circle cx="12" cy="12" r="8"/></svg>;
}

const chapterInfo = [
  {eyebrow:'THE BEGINNING', number:'01', headline:<>It begins<br/>with <em>fire.</em></>, body:'Some things are worth taking the time to get right.'},
  {eyebrow:'THE RITUAL', number:'02', headline:<>Made by hand.<br/><em>Made with soul.</em></>, body:'Thoughtful ingredients, an open flame, and a little intuition.'},
  {eyebrow:'THE MOMENT', number:'03', headline:<>The best part?<br/><em>Being together.</em></>, body:'Good food has a way of bringing us closer.'}
];

function ScrollCinema() {
  const wrap = useRef<HTMLElement>(null);
  const film = useRef<HTMLVideoElement>(null);
  const animation = useRef(0);
  const [chapter, setChapter] = useState(0);
  const [progress, setProgress] = useState(0);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(prefersReducedMotion);
    const update = () => {
      animation.current = 0;
      const box = wrap.current;
      if (!box) return;
      const rect = box.getBoundingClientRect();
      const range = Math.max(1, rect.height - window.innerHeight);
      const p = Math.max(0, Math.min(1, -rect.top / range));
      const index = Math.min(filmFrames - 1, Math.round(p * (filmFrames - 1)));
      setProgress(previous => Math.abs(previous-p) > .002 ? p : previous);
      setChapter(Math.min(2,Math.floor(index / 180)));
      const media = film.current;
      if (media && !prefersReducedMotion && media.readyState >= 1 && Number.isFinite(media.duration) && media.duration > 0) {
        const seek = Math.min(media.duration-.04, index/filmFps);
        if (Math.abs(media.currentTime-seek) > .055) media.currentTime=seek;
      }
    };
    const onScroll = () => {if (!animation.current) animation.current=requestAnimationFrame(update);};
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',onScroll);
    const media=film.current;
    const loaded=()=>{setVideoReady(true);update();};
    media?.addEventListener('loadedmetadata',loaded);
    update();
    return ()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);media?.removeEventListener('loadedmetadata',loaded);if(animation.current)cancelAnimationFrame(animation.current);};
  },[]);

  return <section className="cinema" ref={wrap} id="experience" aria-label="The Maison Sienna experience">
    <div className="cinema-sticky">
      <div className="cinema-still" aria-hidden="true" />
      {!reduced && !videoFailed && <video className="cinema-video" ref={film} src={`${assets}/story-540-2k.mp4`} poster={`${assets}/hero-poster.jpg`} preload="auto" muted playsInline onError={()=>setVideoFailed(true)} aria-hidden="true" />}
      <div className="cinema-vignette" />
      <div className="cinema-sup"><span>THE MAISON SIENNA EXPERIENCE</span><span>AN INVITATION TO SLOW DOWN</span></div>
      <div className="cinema-copy" key={chapter}>
        <p className="eyebrow light"><span className="eyebrow-line" /> {chapterInfo[chapter].eyebrow}</p>
        <h2>{chapterInfo[chapter].headline}</h2>
        <p className="cinema-description">{chapterInfo[chapter].body}</p>
      </div>
      <div className="cinema-index"><span>{chapterInfo[chapter].number} <span className="cinema-muted">/ 03</span></span><div className="cinema-progress" aria-hidden="true"><span style={{transform:`scaleX(${progress})`}}/></div><span className="cinema-scroll-hint">KEEP SCROLLING <span className="down-arrow">↓</span></span></div>
      {!videoReady && !videoFailed && !reduced && <span className="visually-hidden" aria-live="polite">Preparing the dining experience</span>}
    </div>
  </section>;
}

const today = () => new Date().toLocaleDateString('en-CA');

export default function Home(){
  const [scrolled,setScrolled]=useState(false);
  const [mobileOpen,setMobileOpen]=useState(false);
  const [bookingOpen,setBookingOpen]=useState(false);
  const [bookStage,setBookStage]=useState<'form'|'summary'>('form');
  const [menuFilter,setMenuFilter]=useState<Category>('All');
  const [menuOpen,setMenuOpen]=useState(false);
  const [meal, setMeal]=useState<Record<string,number>>({});
  const [booking,setBooking]=useState({date:'',time:'19:00',guests:'2',name:'',email:''});
  const [heroFailed,setHeroFailed]=useState(false);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>70);
    onScroll();window.addEventListener('scroll',onScroll,{passive:true});return()=>window.removeEventListener('scroll',onScroll);
  },[]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape'){setBookingOpen(false);setMenuOpen(false);setMobileOpen(false);}};
    window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey);
  },[]);
  useEffect(()=>{
    document.body.style.overflow=bookingOpen||menuOpen||mobileOpen?'hidden':'';
    return()=>{document.body.style.overflow='';};
  },[bookingOpen,menuOpen,mobileOpen]);
  useEffect(()=>{
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}});
    },{threshold:.13});
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    return()=>observer.disconnect();
  },[menuFilter]);
  const visible=useMemo(()=>dishes.filter(d=>menuFilter==='All'||d.category===menuFilter),[menuFilter]);
  const cartCount=Object.values(meal).reduce((n,v)=>n+v,0);
  const total=dishes.reduce((sum,d)=>sum+(meal[d.name]||0)*d.price,0);
  const updateMeal=(name:string,change:number)=>setMeal(prev=>{const next={...prev};const q=Math.max(0,(next[name]||0)+change);if(q)next[name]=q;else delete next[name];return next;});
  const openBooking=()=>{setBookStage('form');setBookingOpen(true);setMobileOpen(false);};
  const closeMenu=()=>setMobileOpen(false);
  const onBook=(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setBookStage('summary');};

  return <>
    <div className="announcement"><span>EVENINGS MADE UNFORGETTABLE</span><span>GOOD FOOD. GOOD COMPANY. NO HURRY.</span></div>
    <header className={`header ${scrolled?'header-dark':''}`}>
      <a href="#top" onClick={closeMenu} className="logotype" aria-label="Maison Sienna home"><span className="logotype-top">MAISON</span><strong>SIENNA<span className="logotype-stop">.</span></strong><span className="logotype-bottom">KITCHEN &amp; BAR</span></a>
      <nav className={`desktop-nav ${mobileOpen?'nav-mobile-active':''}`} aria-label="Main menu">
        <a href="#about" onClick={closeMenu}>Our story</a><a href="#experience" onClick={closeMenu}>The experience</a><a href="#menu" onClick={closeMenu}>Food &amp; drink</a><a href="#visit" onClick={closeMenu}>The table</a>
        <button className="mobile-reserve" onClick={openBooking}>RESERVE A TABLE <Icon name="arrow-up"/></button>
      </nav>
      <div className="header-actions"><button className="order-trigger" onClick={()=>setMenuOpen(true)} aria-label={`Open menu selections, ${cartCount} items`}>THE MENU {cartCount>0&&<i>{cartCount}</i>}</button><button className="button button-line header-book" onClick={openBooking}>BOOK A TABLE <Icon name="arrow-up" size={15}/></button><button className="menu-toggle" aria-label={mobileOpen?'Close menu':'Open menu'} aria-expanded={mobileOpen} onClick={()=>setMobileOpen(x=>!x)}><Icon name={mobileOpen?'close':'menu'} size={27}/></button></div>
    </header>

    <main>
      <section className="hero" id="top">
        <div className="hero-poster" />
        {!heroFailed&&<video className="hero-video" autoPlay muted loop playsInline poster={`${assets}/hero-poster.jpg`} preload="metadata" onError={()=>setHeroFailed(true)} aria-hidden="true"><source src={`${assets}/hero-fire-2k.mp4`} type="video/mp4" /></video>}
        <div className="hero-shade" />
        <div className="hero-vertical">MAISON SIENNA — A MEDITERRANEAN AFFAIR</div>
        <div className="hero-content shell">
          <div className="hero-kicker"><span className="star-symbol">✳</span><span>WELCOME TO MAISON SIENNA</span><span className="kicker-rule"/></div>
          <h1>An evening<br/>to <em>remember.</em></h1>
          <p>The glow of the fire. A table full of good things. And nowhere else you need to be.</p>
          <div className="hero-cta"><button className="button button-copper" onClick={openBooking}>FIND YOUR TABLE <Icon name="arrow-up" size={18}/></button><a href="#about" className="link-text">STEP INSIDE <Icon name="arrow" size={17}/></a></div>
        </div>
        <div className="hero-bottom shell"><span>CRAFTED FOR THE MOMENTS THAT MATTER</span><a href="#about" className="scroll-down" aria-label="Scroll to our story"><span className="scroll-wheel">↓</span><span>SCROLL TO EXPLORE</span></a><span>01 / 05</span></div>
      </section>

      <div className="marquee"><div className="marquee-inner">SAVOUR THE MOMENT <b>✳</b> STAY A LITTLE LONGER <b>✳</b> SOMETHING WORTH SHARING <b>✳</b> SAVOUR THE MOMENT <b>✳</b> STAY A LITTLE LONGER <b>✳</b></div></div>

      <section className="intro-section" id="about"><div className="shell intro-grid">
        <div className="intro-text reveal"><div className="eyebrow"><span className="eyebrow-line"/> OUR PHILOSOPHY</div><h2>A seat at<br/>a table <em>worth<br/>staying for.</em></h2><p className="intro-lead">Life moves fast. Dinner shouldn&apos;t.</p><p>We believe the most beautiful moments happen when the phone stays in your pocket, the wine is poured slowly and the plates keep finding their way around the table.</p><p>Inspired by the sun-soaked coasts of the Mediterranean, made for wherever good company finds you.</p><a className="inline-arrow" href="#experience">DISCOVER THE EXPERIENCE <span className="round-arrow"><Icon name="arrow-up"/></span></a></div>
        <div className="intro-visual reveal"><div className="intro-image-main"><img src={`${assets}/interior.webp`} alt="An intimate, warm Mediterranean-inspired restaurant dining room" loading="lazy" decoding="async"/><span className="photo-label">A PLACE TO BELONG</span></div><div className="intro-image-small"><img src={`${assets}/burrata.webp`} alt="Seasonal Mediterranean food plated with care" loading="lazy" decoding="async"/></div><div className="round-stamp" aria-hidden="true"><span>THE ART OF<br/>SLOW DINING</span><b>✳</b></div></div>
      </div></section>

      <ScrollCinema />

      <section className="menu-section" id="menu"><div className="shell">
        <div className="menu-heading reveal"><div><div className="eyebrow"><span className="eyebrow-line"/> FROM THE KITCHEN</div><h2>Good things<br/><em>take time.</em></h2></div><div className="menu-heading-aside"><span>SEASONAL. GENEROUS. UNCOMPLICATED.</span><p>Food made with intention. Ingredients treated with respect. Every dish, an invitation to share.</p><a href="#menu-grid" className="inline-arrow">EXPLORE THE MENU <span className="round-arrow"><Icon name="arrow-up"/></span></a></div></div>
        <div className="feature-dishes"><article className="feature-card feature-card-large reveal"><img src={`${assets}/seafood.webp`} alt="Fresh roasted fish, prepared with herbs and citrus" loading="lazy" decoding="async"/><span className="feature-scrim"/><span className="feature-count">01 / SIGNATURE</span><div><span className="feature-label">STRAIGHT FROM THE FLAME</span><h3>Simply beautiful<br/><em>from the first bite.</em></h3></div></article><article className="feature-card feature-card-small reveal"><img src={`${assets}/pasta.webp`} alt="Beautifully plated pasta, handcrafted with seasonal ingredients" loading="lazy" decoding="async"/><span className="feature-scrim"/><span className="feature-count">02 / HANDMADE</span><div><span className="feature-label">A LITTLE COMFORT</span><h3>Made by hand.<br/><em>Made with love.</em></h3></div></article></div>
        <div className="menu-list-wrap reveal" id="menu-grid"><div className="menu-nav" role="group" aria-label="Menu categories">{categories.map(c=><button key={c} type="button" className={menuFilter===c?'selected':''} aria-pressed={menuFilter===c} onClick={()=>setMenuFilter(c)}>{c}</button>)}</div><div className="menu-list">{visible.map((dish,i)=><div className="menu-item" key={dish.name}><div className="menu-item-number">{String(i+1).padStart(2,'0')}</div><div className="menu-item-photo"><img src={`${assets}/${dish.image}.webp`} loading="lazy" decoding="async" alt={dish.name}/></div><div className="menu-item-content"><div className="menu-item-title">{dish.name} {dish.signature&&<span className="signature-icon">✳</span>}</div><p>{dish.note}</p></div><span className="menu-item-price">${dish.price}</span><button type="button" className="item-add" onClick={()=>updateMeal(dish.name,1)} aria-label={`Add ${dish.name} to your selection`}><Icon name="plus" size={20}/></button></div>)}</div><div className="menu-list-end"><span>Thoughtfully prepared, always best shared.</span><button type="button" className="inline-arrow" onClick={()=>setMenuOpen(true)}>YOUR SELECTION ({cartCount}) <span className="round-arrow"><Icon name="arrow-up"/></span></button></div></div>
      </div></section>

      <section className="midquote"><div className="midquote-photo"/><div className="midquote-tint"/><div className="shell midquote-content reveal"><span className="eyebrow light"><span className="eyebrow-line"/> THE BEAUTY OF SLOWING DOWN</span><p>“The best memories<br/>are made <em>around<br/>a table.</em>”</p><span className="midquote-bottom">WE&apos;LL SAVE YOU A SEAT.</span></div></section>

      <section className="experience-section"><div className="shell experience-grid"><div className="experience-photo reveal"><img src={`${assets}/table.webp`} alt="A warm, beautifully set dining table" loading="lazy" decoding="async"/><div className="experience-photo-tag">GOOD FOOD. BETTER COMPANY.</div></div><div className="experience-copy reveal"><div className="eyebrow"><span className="eyebrow-line"/> COME AS YOU ARE</div><h2>More than<br/>a <em>meal.</em></h2><p>Some nights call for a little something special. Others just need good friends, a shared plate and one more story.</p><p>Whatever brings you in, we&apos;ll make it a night worth remembering.</p><div className="experience-attributes"><div><Icon name="spark" size={25}/><span>THE LITTLE DETAILS</span><p>Warm lights, generous plates and a welcome that feels like home.</p></div><div><Icon name="sun" size={24}/><span>THE GOLDEN HOUR</span><p>Follow the glow, find your people and settle in.</p></div></div></div></div></section>

      <section className="reserve-section" id="visit"><div className="reserve-photo"/><div className="reserve-shade"/><div className="reserve-inner shell reveal"><div className="eyebrow light"><span className="eyebrow-line"/> SOMETHING TO LOOK FORWARD TO</div><h2>There&apos;s always<br/><em>room for one more.</em></h2><p>Your next great night starts with a seat at our table.</p><button type="button" className="button button-copper button-large" onClick={openBooking}>EXPLORE A RESERVATION <Icon name="arrow-up" size={20}/></button></div></section>
    </main>

    <footer className="footer"><div className="shell"><div className="footer-top"><div><a className="footer-logo" href="#top">MAISON<br/><strong>SIENNA.</strong></a><p>Good food. Great people.<br/>And a little more time for both.</p></div><div className="footer-col"><span>EXPLORE</span><a href="#about">Our story</a><a href="#experience">The experience</a><a href="#menu">The menu</a><a href="#visit">Reservations</a></div><div className="footer-col"><span>FOLLOW ALONG</span><a href="#top">Moments from Maison</a><a href="#menu">Seasonal favourites</a><a href="#visit">Join us for the evening</a></div><div className="footer-mark" aria-hidden="true">✳</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MAISON SIENNA.</span><span>AN EVENING WELL SPENT.</span><a href="#top">BACK TO TOP ↑</a></div></div></footer>

    {bookingOpen&&<div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)setBookingOpen(false)}}><section className="modal-card booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><button className="modal-close" onClick={()=>setBookingOpen(false)} aria-label="Close"><Icon name="close" size={22}/></button>{bookStage==='form'?<><span className="eyebrow"><span className="eyebrow-line"/> YOUR EVENING STARTS HERE</span><h2 id="booking-title">A table <em>for you.</em></h2><p className="modal-subtitle">Tell us how you&apos;d like to spend your evening.</p><form onSubmit={onBook} className="booking-form"><label>Your date<input type="date" min={today()} required value={booking.date} onChange={e=>setBooking(b=>({...b,date:e.target.value}))}/></label><div className="form-columns"><label>Time<select value={booking.time} onChange={e=>setBooking(b=>({...b,time:e.target.value}))}>{['17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t=><option key={t} value={t}>{t}</option>)}</select></label><label>Guests<select value={booking.guests} onChange={e=>setBooking(b=>({...b,guests:e.target.value}))}>{Array.from({length:10},(_,i)=>i+1).map(n=><option value={n} key={n}>{n} {n===1?'guest':'guests'}</option>)}</select></label></div><label>Your name<input required maxLength={90} value={booking.name} placeholder="Full name" onChange={e=>setBooking(b=>({...b,name:e.target.value}))}/></label><label>Email address<input type="email" required maxLength={140} value={booking.email} placeholder="you@example.com" onChange={e=>setBooking(b=>({...b,email:e.target.value}))}/></label><button className="button button-dark" type="submit">REVIEW MY EVENING <Icon name="arrow-up" size={17}/></button></form></>:<div className="booking-summary"><span className="summary-star">✳</span><h2 id="booking-title">An evening<br/><em>to look forward to.</em></h2><p>{booking.name}, here are your dining preferences.</p><dl><div><dt>WHEN</dt><dd>{booking.date} at {booking.time}</dd></div><div><dt>YOUR TABLE</dt><dd>{booking.guests} {booking.guests==='1'?'guest':'guests'}</dd></div><div><dt>EMAIL</dt><dd>{booking.email}</dd></div></dl><p className="reservation-disclaimer">Your preferences are saved on this screen only. A reservation has not been submitted or confirmed.</p><button className="button button-dark" onClick={()=>setBookStage('form')}>EDIT DETAILS <Icon name="arrow"/></button></div>}</section></div>}

    {menuOpen&&<div className="drawer-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setMenuOpen(false)}}><aside className="selection-drawer" role="dialog" aria-modal="true" aria-labelledby="selection-heading"><div className="drawer-head"><span className="eyebrow"><span className="eyebrow-line"/> YOUR FAVOURITES</span><button onClick={()=>setMenuOpen(false)} aria-label="Close menu"><Icon name="close" size={25}/></button></div><h2 id="selection-heading">A little taste<br/><em>of what&apos;s to come.</em></h2><p className="drawer-intro">Save a few favourites while you explore the menu.</p>{cartCount===0?<div className="drawer-empty"><span>✳</span><p>Your table is waiting for something delicious.</p><button className="button button-dark" onClick={()=>{setMenuOpen(false);document.querySelector('#menu')?.scrollIntoView({behavior:'smooth'});}}>DISCOVER THE MENU <Icon name="arrow"/></button></div>:<><div className="drawer-items">{dishes.filter(d=>meal[d.name]>0).map(d=><div className="drawer-item" key={d.name}><img src={`${assets}/${d.image}.webp`} alt={d.name}/><div><h3>{d.name}</h3><span>${d.price} each</span><div className="qty"><button onClick={()=>updateMeal(d.name,-1)} aria-label={`Remove one ${d.name}`}><Icon name="minus" size={15}/></button><span>{meal[d.name]}</span><button onClick={()=>updateMeal(d.name,1)} aria-label={`Add one ${d.name}`}><Icon name="plus" size={15}/></button></div></div></div>)}</div><div className="drawer-total"><span>YOUR MENU ESTIMATE</span><strong>${total}</strong></div><p className="drawer-footnote">Your selections are for browsing only and are not an order.</p><button className="button button-dark" onClick={()=>{setMenuOpen(false);openBooking();}}>PLAN YOUR EVENING <Icon name="arrow-up"/></button></>}</aside></div>}
  </>;
}