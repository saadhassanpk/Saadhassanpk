'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Category = 'All' | 'To begin' | 'The mains' | 'Something sweet';
type Dish = { id: number; name: string; subtitle: string; category: Exclude<Category, 'All'>; price: number; image: string; tag?: string; vegetarian?: boolean };
type Booking = { name: string; email: string; date: string; time: string; guests: string };

const img = (id: string, w: number = 1000) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
const photos = {
  hero: img('photo-1414235077428-338989a2e8c0', 2000),
  interior: img('photo-1517248135467-4c7edcad34c4', 1450),
  story: img('photo-1559339352-11d035aa65de', 1050),
  chef: img('photo-1577219491135-ce391730fb2c', 1050),
  reserve: img('photo-1511795409834-ef04bbd61622', 1700),
};
const dishes: Dish[] = [
  { id: 1, name: 'Burrata & Heirloom', subtitle: 'Sweet tomato, basil oil, aged balsamic', category: 'To begin', price: 19, vegetarian: true, tag: 'A guest favourite', image: img('photo-1608897013039-887f21d8c804', 760) },
  { id: 2, name: 'Crispy Calamari', subtitle: 'Lemon aioli, parsley, charred citrus', category: 'To begin', price: 22, image: img('photo-1559847844-5315695dadae', 760) },
  { id: 3, name: 'Wild Mushroom Arancini', subtitle: 'Truffle cream, parmesan, fresh herbs', category: 'To begin', price: 18, vegetarian: true, image: img('photo-1547592180-85f173990554', 760) },
  { id: 4, name: 'Saffron Pappardelle', subtitle: 'Slow tomato, pecorino, basil, olive oil', category: 'The mains', price: 34, vegetarian: true, tag: 'Signature', image: img('photo-1473093226795-af9932fe5856', 760) },
  { id: 5, name: 'Wood-Fired Market Fish', subtitle: 'Preserved lemon, garden greens, beurre blanc', category: 'The mains', price: 42, image: img('photo-1519708227418-c8fd9a32b7a2', 760) },
  { id: 6, name: 'Slow-Braised Lamb', subtitle: 'Smoked aubergine, pomegranate, mint', category: 'The mains', price: 46, tag: 'Chef’s pick', image: img('photo-1544025162-d76694265947', 760) },
  { id: 7, name: 'Citrus Olive Oil Cake', subtitle: 'Whipped mascarpone, orange, pistachio', category: 'Something sweet', price: 17, vegetarian: true, image: img('photo-1488477181946-6428a0291777', 760) },
  { id: 8, name: 'Dark Chocolate Crémeux', subtitle: 'Salted caramel, cocoa nib, vanilla', category: 'Something sweet', price: 18, vegetarian: true, image: img('photo-1551024506-0bccd828d307', 760) },
];
const categories: Category[] = ['All', 'To begin', 'The mains', 'Something sweet'];
const times = ['17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];
const money = (n: number) => `$${n.toFixed(2)}`;
const today = () => { const d = new Date(); const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return local.toISOString().slice(0, 10); };

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  if (name === 'arrow') return <svg {...shared}><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
  if (name === 'arrow-up') return <svg {...shared}><path d="M5 19 19 5M7 5h12v12" /></svg>;
  if (name === 'menu') return <svg {...shared}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
  if (name === 'close') return <svg {...shared}><path d="M5 5l14 14M19 5 5 19" /></svg>;
  if (name === 'plus') return <svg {...shared}><path d="M12 5v14M5 12h14" /></svg>;
  if (name === 'minus') return <svg {...shared}><path d="M5 12h14" /></svg>;
  if (name === 'bag') return <svg {...shared}><path d="M5 8h14l1 13H4L5 8ZM9 9V6a3 3 0 0 1 6 0v3" /></svg>;
  if (name === 'calendar') return <svg {...shared}><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M8 3v4M16 3v4M3 10h18" /></svg>;
  if (name === 'clock') return <svg {...shared}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" /></svg>;
  if (name === 'users') return <svg {...shared}><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m1 3a5 5 0 0 1 3 5" /></svg>;
  if (name === 'check') return <svg {...shared}><path d="m5 12 5 5L20 7" /></svg>;
  if (name === 'instagram') return <svg {...shared}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>;
  return <svg {...shared}><circle cx="12" cy="12" r="9" /></svg>;
}


const cinematicVideo = 'https://videos.pexels.com/video-files/3196297/3196297-hd_1920_1080_25fps.mp4';

function ScrollFilm() {
  const stage = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let wanted = 0;
    const update = () => {
      raf = 0;
      if (!stage.current) return;
      const rect = stage.current.getBoundingClientRect();
      const scrollable = Math.max(1, rect.height - window.innerHeight);
      const t = Math.min(1, Math.max(0, -rect.top / scrollable));
      wanted = t;
      setProgress(old => Math.abs(old - t) > .002 ? t : old);
      const element = video.current;
      if (element && element.readyState >= 2 && Number.isFinite(element.duration) && element.duration > 0) {
        const nextTime = t * Math.max(0, element.duration - 0.05);
        if (Math.abs(element.currentTime - nextTime) > .07) element.currentTime = nextTime;
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onReady = () => { setLoaded(true); update(); };
    const element = video.current;
    element?.addEventListener('loadedmetadata', onReady);
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    update();
    return () => {
      if (raf) cancelAnimationFrame(raf);
      element?.removeEventListener('loadedmetadata',onReady);
      window.removeEventListener('scroll',onScroll);
      window.removeEventListener('resize',onScroll);
    };
  }, []);
  return <section ref={stage} className="scroll-film" aria-label="Cinematic restaurant storytelling" id="film">
    <div className="film-sticky">
      <div className="film-backdrop" />
      {!failed && <video ref={video} className="film-video" src={cinematicVideo} muted playsInline preload="auto" poster={photos.chef} onError={() => setFailed(true)} aria-hidden="true" />}
      <div className="film-shade" />
      <div className="film-top"><span>MAISON SIENNA / A CINEMATIC JOURNEY</span><span>SCROLL TO DIRECT THE FILM</span></div>
      <div className="film-chapter" key={progress < .33 ? 'a' : progress < .67 ? 'b' : 'c'}>
        <span className="film-kicker">{progress < .33 ? 'CHAPTER ONE / THE FIRE' : progress < .67 ? 'CHAPTER TWO / THE CRAFT' : 'CHAPTER THREE / THE TABLE'}</span>
        <h2>{progress < .33 ? <>It begins<br/><em>with fire.</em></> : progress < .67 ? <>Made slowly.<br/><em>Made with soul.</em></> : <>Every plate<br/><em>tells a story.</em></>}</h2>
        <p>{progress < .33 ? 'A little heat. A lot of heart.' : progress < .67 ? 'A celebration of the hands that make it.' : 'And the people who share it.'}</p>
      </div>
      <div className="film-bottom"><span>AN INVITATION TO SLOW DOWN</span><div className="film-meter"><span style={{width:`${progress * 100}%`}}/></div><span>{String(Math.max(1, Math.ceil(progress*100))).padStart(2,'0')} / 100</span></div>
      {(!loaded || failed) && <span className="film-availability" aria-live="polite">{failed ? 'Photography fallback • Film temporarily unavailable' : 'Loading cinematic film…'}</span>}
    </div>
  </section>;
}

export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [vegetarian, setVegetarian] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingSent, setBookingSent] = useState(false);
  const [booking, setBooking] = useState<Booking>({ name: '', email: '', date: '', time: '19:00', guests: '2' });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 36); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { setBookingOpen(false); setCartOpen(false); setMobileNav(false); } }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, []);
  useEffect(() => { document.body.style.overflow = bookingOpen || cartOpen || mobileNav ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [bookingOpen, cartOpen, mobileNav]);

  const visible = dishes.filter((d) => (activeCategory === 'All' || d.category === activeCategory) && (!vegetarian || d.vegetarian));
  const cartCount = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const cartTotal = useMemo(() => dishes.reduce((sum, dish) => sum + (cart[dish.id] || 0) * dish.price, 0), [cart]);
  const selected = dishes.filter((d) => cart[d.id] > 0);
  const changeQty = (id: number, delta: number) => setCart((current) => { const next = { ...current }; const qty = Math.max(0, (current[id] || 0) + delta); if (qty === 0) delete next[id]; else next[id] = qty; return next; });
  const startBooking = () => { setBookingSent(false); setBookingOpen(true); setMobileNav(false); };
  const navClick = () => setMobileNav(false);

  return (
    <>
      <div className="announcement"><span>MADE FOR THE MOMENTS THAT MATTER</span><span className="announcement-end">A MODERN MEDITERRANEAN TABLE <span className="mini-star">✦</span> OPEN EVERY EVENING</span></div>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#home" onClick={navClick} aria-label="Maison Sienna home"><span className="brand-top">MAISON</span><span className="brand-main">SIENNA<span className="brand-dot">.</span></span><span className="brand-bottom">KITCHEN <span>◆</span> BAR</span></a>
        <nav className={`primary-nav ${mobileNav ? 'nav-open' : ''}`} aria-label="Main navigation">
          <a href="#story" onClick={navClick}>Our story</a><a href="#menu" onClick={navClick}>The menu</a><a href="#experience" onClick={navClick}>The experience</a><a href="#visit" onClick={navClick}>Visit us</a>
          <button className="mobile-only nav-book" onClick={startBooking}>Reserve a table <Icon name="arrow" /></button>
        </nav>
        <div className="header-actions"><button className="header-cart" aria-label={`Open sample order, ${cartCount} items`} onClick={() => setCartOpen(true)}><Icon name="bag" size={20}/>{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</button><button onClick={startBooking} className="button nav-reserve">BOOK A TABLE <Icon name="arrow-up" size={14}/></button><button className="menu-trigger" aria-label={mobileNav ? 'Close menu' : 'Open menu'} aria-expanded={mobileNav} onClick={() => setMobileNav(v => !v)}><Icon name={mobileNav ? 'close' : 'menu'} size={25}/></button></div>
      </header>

      <main>
        <section className="hero" id="home"><div className="hero-photo" style={{ backgroundImage: `url('${photos.hero}')` }} />
          <video className="hero-video" autoPlay muted playsInline loop preload="metadata" poster={photos.hero} aria-hidden="true">
            <source src="https://videos.pexels.com/video-files/3196236/3196236-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video><div className="hero-video-shade" />
          <div className="hero-content container"><div className="eyebrow hero-eyebrow"><span className="eyebrow-line"/> WHERE THE EVENING UNFOLDS</div><h1>A little more<br/>time for <em>the good</em><br/>things in life.</h1><p>A celebration of honest ingredients, generous tables and the simple pleasure of being together.</p><div className="hero-actions"><button className="button button-sand" onClick={startBooking}>RESERVE YOUR TABLE <Icon name="arrow-up" size={17}/></button><a className="text-link hero-link" href="#menu">DISCOVER OUR MENU <Icon name="arrow" size={19}/></a></div></div>
          <div className="hero-side">THE ART OF GATHERING — EST. IN THE IMAGINATION</div>
          <div className="hero-bottom container"><div className="scroll-cue"><span className="scroll-line"/> SCROLL TO EXPLORE</div><span className="hero-pagination">01 <span>/</span> 04</span></div>
        </section>
        <ScrollFilm />
        <section className="availability-bar"><div className="container availability-inner"><div className="availability-title"><span className="starburst">✳</span><span>YOUR SEAT AT<br/><strong>OUR TABLE</strong></span></div><div className="availability-input"><Icon name="calendar" size={19}/><div><label htmlFor="hero-date">CHOOSE A DATE</label><input id="hero-date" type="date" min={today()} value={booking.date} onChange={(e) => setBooking(b => ({...b,date:e.target.value}))} /></div></div><div className="availability-input"><Icon name="clock" size={19}/><div><label htmlFor="hero-time">DINING TIME</label><select id="hero-time" value={booking.time} onChange={(e) => setBooking(b => ({...b,time:e.target.value}))}>{times.map(t => <option value={t} key={t}>{t}</option>)}</select></div></div><div className="availability-input"><Icon name="users" size={19}/><div><label htmlFor="hero-guests">YOUR PARTY</label><select id="hero-guests" value={booking.guests} onChange={(e) => setBooking(b => ({...b,guests:e.target.value}))}>{Array.from({length:8},(_,i) => i+1).map(n => <option value={n} key={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}</select></div></div><button className="button availability-button" onClick={startBooking}>FIND A TABLE <Icon name="arrow" size={17}/></button></div></section>


        <section id="story" className="story-section section-pad"><div className="container story-grid"><div className="story-heading"><div className="eyebrow muted"><span className="eyebrow-line"/> HELLO, AND WELCOME</div><h2>Good food.<br/><em>Better together.</em></h2><div className="story-decoration">✳</div></div><div className="story-copy"><p className="lead">A place where the plates are meant to be shared, the wine flows freely, and there&apos;s always room for one more.</p><p>Inspired by the sun-drenched tables of the Mediterranean, Maison Sienna brings a little of that feeling home. Honest cooking, thoughtful details, and food that makes you slow down.</p><a className="text-link dark-link" href="#experience">GET TO KNOW US <Icon name="arrow" size={18}/></a></div></div><div className="container story-photo-grid"><div className="story-image story-image-main"><img src={photos.story} alt="Warm, inviting restaurant dining space" loading="lazy"/><span className="image-index">01 / THE SPACE</span></div><div className="story-image story-image-small"><img src={photos.chef} alt="Chef thoughtfully preparing a dish" loading="lazy"/><span className="image-index">02 / THE CRAFT</span></div><div className="story-stamp"><span>MADE WITH</span><b>♥</b><span>MADE TO SHARE</span></div></div></section>

        <section id="menu" className="menu-section section-pad"><div className="container"><div className="menu-top"><div><div className="eyebrow dark-muted"><span className="eyebrow-line"/> FROM OUR KITCHEN</div><h2>Consider this<br/>your <em>invitation.</em></h2></div><div className="menu-intro"><p>Seasonal favourites, familiar flavours, unexpected little moments. There&apos;s something for every appetite.</p><span>ALL PRICES IN AUD · SAMPLE MENU</span></div></div><div className="menu-controls"><div className="menu-tabs" role="group" aria-label="Menu categories">{categories.map(category => <button key={category} className={activeCategory === category ? 'active' : ''} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><label className="veg-filter"><input type="checkbox" checked={vegetarian} onChange={e => setVegetarian(e.target.checked)}/><span className="filter-square">{vegetarian && <Icon name="check" size={12}/>}</span> VEGETARIAN ONLY</label></div><div className="dish-grid">{visible.length ? visible.map(d => <article className="dish-card" key={d.id}><div className="dish-photo"><img src={d.image} alt={d.name} loading="lazy"/>{d.tag && <span className="dish-badge">{d.tag}</span>}<button onClick={() => changeQty(d.id,1)} aria-label={`Add ${d.name} to sample order`} className="dish-add"><Icon name="plus" size={21}/></button></div><div className="dish-copy"><div className="dish-name-row"><h3>{d.name}</h3><span>{money(d.price)}</span></div><p>{d.subtitle}</p><div className="dish-foot"><span>{d.category.toUpperCase()}</span>{d.vegetarian && <span className="veg-dot">● VEGETARIAN</span>}</div></div></article>) : <div className="empty-menu">No dishes match this filter. Try another category.</div>}</div><div className="menu-note"><span>✳</span><p>Food made with care, served without fuss.<br/><small>Menu and pricing are illustrative, for this portfolio concept.</small></p><button onClick={() => setCartOpen(true)} className="text-link dark-link">VIEW SAMPLE ORDER ({cartCount}) <Icon name="arrow" size={17}/></button></div></div></section>

        <section className="quote-strip"><div className="container quote-inner"><span className="quote-flower">✳</span><blockquote>“The best memories are made<br/>when we&apos;re not watching the clock.”</blockquote><span className="quote-small">AT MAISON SIENNA, YOU&apos;RE ALWAYS WELCOME TO STAY A WHILE.</span></div></section>

        <section id="experience" className="experience-section"><div className="experience-photo"><img src={photos.interior} alt="An intimate restaurant interior with warm lighting" loading="lazy"/><div className="experience-photo-label">A PLACE TO MAKE YOURSELF AT HOME <span>↗</span></div></div><div className="experience-content"><div className="eyebrow"><span className="eyebrow-line"/> MORE THAN A MEAL</div><h2>Come as you are.<br/><em>Stay a little longer.</em></h2><p>Some places you come to eat. Others you come to feel something. We hope ours feels a little like a second home.</p><div className="value-list"><div><span>01</span><div><h3>Made with intention</h3><p>Good ingredients, thoughtful techniques, nothing unnecessary.</p></div></div><div><span>02</span><div><h3>Always room for more</h3><p>Big conversations, shared plates and unhurried evenings.</p></div></div><div><span>03</span><div><h3>A little everyday magic</h3><p>Warm light, beautiful music and the joy of simply being here.</p></div></div></div><button onClick={startBooking} className="text-link light-link">MAKE AN EVENING OF IT <Icon name="arrow" size={19}/></button></div></section>

        <section id="visit" className="reservation-section" style={{backgroundImage:`linear-gradient(90deg,rgba(24,24,20,.84),rgba(24,24,20,.65)),url('${photos.reserve}')`}}><div className="container reservation-content"><span className="section-symbol">✳</span><div className="eyebrow centered"><span className="eyebrow-line"/> YOUR NEXT FAVOURITE EVENING</div><h2>We saved you<br/><em>a seat.</em></h2><p>Come for dinner. Stay for the stories.</p><button className="button button-sand" onClick={startBooking}>BOOK A TABLE <Icon name="arrow-up" size={17}/></button><span className="reservation-disclaimer">DEMONSTRATION ONLY — NO REAL RESERVATIONS</span></div></section>
      </main>
      <footer className="footer"><div className="container footer-top"><div><a className="footer-brand" href="#home">MAISON<br/><em>SIENNA.</em></a><span className="footer-tagline">A LITTLE MORE TIME FOR THE GOOD THINGS.</span></div><div className="footer-column"><h4>EXPLORE</h4><a href="#story">Our story</a><a href="#menu">The menu</a><a href="#experience">Experience</a><button onClick={startBooking}>Reservations</button></div><div className="footer-column"><h4>GOOD TO KNOW</h4><span>Modern Mediterranean cuisine</span><span>Fictional dining concept</span><span>Not a real restaurant location</span><span>Australian dollar sample prices</span></div><div className="footer-news"><h4>GOOD THINGS TAKE TIME</h4><p>A crafted concept for a modern neighbourhood restaurant.</p><span className="footer-flower">✳</span></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} MAISON SIENNA. PORTFOLIO CONCEPT.</span><span>DESIGNED TO FEEL LIKE A WARM WELCOME. <a href="#home">BACK TO TOP ↑</a></span></div></footer>

      {mobileNav && <button className="mobile-dim" aria-label="Close mobile navigation" onClick={() => setMobileNav(false)}/>}
      {cartOpen && <div className="overlay" onMouseDown={(e) => {if (e.target === e.currentTarget) setCartOpen(false);}}><aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Sample order"><div className="drawer-header"><div><span className="eyebrow dark-muted">A LITTLE SOMETHING FOR LATER</span><h2>Your order <em>preview.</em></h2></div><button className="icon-close" onClick={() => setCartOpen(false)} aria-label="Close sample order"><Icon name="close" size={22}/></button></div><div className="drawer-body">{selected.length ? selected.map(d => <div className="cart-item" key={d.id}><img src={d.image} alt=""/><div><h3>{d.name}</h3><p>{money(d.price)}</p><div className="qty-controls"><button aria-label={`Remove one ${d.name}`} onClick={() => changeQty(d.id,-1)}><Icon name="minus" size={14}/></button><span>{cart[d.id]}</span><button aria-label={`Add one ${d.name}`} onClick={() => changeQty(d.id,1)}><Icon name="plus" size={14}/></button></div></div><b>{money(d.price * cart[d.id])}</b></div>) : <div className="cart-empty"><span>✳</span><h3>Nothing here just yet.</h3><p>Take a look at the menu and add something delicious to this sample order.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>EXPLORE THE MENU <Icon name="arrow" /></button></div>}</div><div className="drawer-footer"><div className="subtotal"><span>Sample subtotal</span><strong>{money(cartTotal)}</strong></div><p>This is a design demo. Items are not purchased or submitted to a restaurant.</p><button className="button button-dark full-width" onClick={() => {setCartOpen(false);startBooking();}}>EXPLORE RESERVATIONS <Icon name="arrow" /></button>{cartCount > 0 && <button className="clear-button" onClick={() => setCart({})}>Clear sample order</button>}</div></aside></div>}
      {bookingOpen && <div className="overlay modal-overlay" onMouseDown={(e) => {if(e.target === e.currentTarget) setBookingOpen(false);}}><section className="booking-modal" role="dialog" aria-modal="true" aria-label="Reservation demonstration"><button className="icon-close booking-close" onClick={() => setBookingOpen(false)} aria-label="Close reservation form"><Icon name="close" size={22}/></button>{bookingSent ? <div className="booking-success"><span className="success-icon"><Icon name="check" size={36}/></span><div className="eyebrow dark-muted">DEMONSTRATION COMPLETE</div><h2>Lovely choice,<br/><em>{booking.name.split(' ')[0]}.</em></h2><p>You&apos;ve completed the reservation <strong>preview</strong> for {booking.guests} {booking.guests === '1' ? 'guest' : 'guests'} on {booking.date} at {booking.time}.</p><div className="demo-alert">No reservation was submitted or saved. This is a fictional portfolio demonstration.</div><button className="button button-dark full-width" onClick={() => setBookingOpen(false)}>BACK TO THE WEBSITE <Icon name="arrow"/></button></div> : <><div className="booking-heading"><div className="eyebrow dark-muted"><span className="eyebrow-line"/> A LITTLE SPACE FOR YOU</div><h2>Let&apos;s make<br/><em>a date.</em></h2><p>A thoughtfully designed reservation form — demo interactions only.</p></div><form className="booking-form" onSubmit={(e) => {e.preventDefault();setBookingSent(true);}}><div className="form-grid"><label>Your name <input required maxLength={80} autoComplete="name" placeholder="Full name" value={booking.name} onChange={e => setBooking(b => ({...b,name:e.target.value}))}/></label><label>Email address <input required type="email" maxLength={150} autoComplete="email" placeholder="you@example.com" value={booking.email} onChange={e => setBooking(b => ({...b,email:e.target.value}))}/></label><label>Dining date <input required type="date" min={today()} value={booking.date} onChange={e => setBooking(b => ({...b,date:e.target.value}))}/></label><label>Dining time <select required value={booking.time} onChange={e => setBooking(b => ({...b,time:e.target.value}))}>{times.map(t => <option key={t} value={t}>{t}</option>)}</select></label><label className="span-2">Party size <select required value={booking.guests} onChange={e => setBooking(b => ({...b,guests:e.target.value}))}>{Array.from({length:8},(_,i)=>i+1).map(n => <option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}</select></label></div><p className="form-note">Your details remain in this browser session. Nothing is sent to a server.</p><button type="submit" className="button button-dark full-width">PREVIEW RESERVATION <Icon name="arrow"/></button></form></>}</section></div>}
    </>
  );
}
