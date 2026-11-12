'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const FRAME_TOTAL = 540;
const FRAMES_PER_SHEET = 9;
type MenuCategory = 'All' | 'Small plates' | 'From the kitchen' | 'The sweet end';
type Dish = { id: number; name: string; description: string; price: number; category: Exclude<MenuCategory, 'All'>; image: string; note?: string };

const menu: Dish[] = [
  { id: 1, name: 'Heirloom & burrata', description: 'Heritage tomatoes, basil oil, sea salt', price: 22, category: 'Small plates', image: '/studio/plated.png', note: 'THE FAVOURITE' },
  { id: 2, name: 'Crisp artichokes', description: 'Preserved lemon, whipped ricotta', price: 19, category: 'Small plates', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1100&q=86' },
  { id: 3, name: 'Lobster agnolotti', description: 'Brown butter, lemon, fragrant herbs', price: 42, category: 'From the kitchen', image: '/studio/pasta.png', note: 'THE SIGNATURE' },
  { id: 4, name: 'Fire-roasted market fish', description: 'Charred lemon, garden greens, olive oil', price: 46, category: 'From the kitchen', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1100&q=86' },
  { id: 5, name: 'Olive oil & citrus cake', description: 'Mascarpone, orange, pistachio', price: 18, category: 'The sweet end', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1100&q=86' },
  { id: 6, name: 'Chocolate crémeux', description: 'Salted caramel, hazelnut praline', price: 19, category: 'The sweet end', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1100&q=86' },
];
const categories: MenuCategory[] = ['All', 'Small plates', 'From the kitchen', 'The sweet end'];
const fmt = (value: number) => '$' + value.toFixed(0);

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{diagonal ? <><path d="M5 19 19 5"/><path d="M8 5h11v11"/></> : <><path d="M4 12h16"/><path d="m13 5 7 7-7 7"/></>}</svg>;
}
function Bag() {
  return <svg width="21" height="21" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>;
}

function FrameStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frame, setFrame] = useState(0);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const context = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!context) return;
    let mobile = window.matchMedia('(max-width: 720px)').matches;
    let target = 0;
    let drawn = -1;
    let current = 0;
    let raf = 0;
    let alive = true;
    const cache = new Map<string, HTMLImageElement>();
    const requests = new Set<string>();
    const keyFor = (sheet: number) => '/story/' + (mobile ? 'mobile' : 'desktop') + '/s-' + String(sheet + 1).padStart(3, '0') + '.webp';

    const queue = (sheet: number) => {
      if (sheet < 0 || sheet >= 60) return;
      const key = keyFor(sheet);
      if (cache.has(key) || requests.has(key)) return;
      requests.add(key);
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => {
        requests.delete(key);
        if (!alive) return;
        cache.set(key, image);
        if (cache.size > 7) {
          for (const old of cache.keys()) {
            const oldNumber = Number(old.match(/s-(\d+)\.webp/)?.[1] || 0) - 1;
            if (Math.abs(oldNumber - Math.floor(target / FRAMES_PER_SHEET)) > 4) {
              cache.delete(old);
              if (cache.size <= 7) break;
            }
          }
        }
        schedule();
      };
      image.onerror = () => { requests.delete(key); };
      image.src = key;
    };

    const resize = () => {
      mobile = window.matchMedia('(max-width: 720px)').matches;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      drawn = -1;
      schedule();
    };

    const render = () => {
      raf = 0;
      if (!alive) return;
      const difference = target - current;
      if (Math.abs(difference) > .4) {
        current += Math.sign(difference) * Math.min(Math.abs(difference), Math.abs(difference) > 90 ? 50 : Math.max(2, Math.min(14, Math.abs(difference) * .5)));
      } else {
        current = target;
      }
      const index = Math.min(FRAME_TOTAL - 1, Math.max(0, Math.round(current)));
      const sheet = Math.floor(index / FRAMES_PER_SHEET);
      queue(sheet);
      queue(sheet + 1);
      
      queue(sheet - 1);
      
      const image = cache.get(keyFor(sheet));
      if (image && image.complete && image.naturalWidth > 0 && index !== drawn) {
        const tile = index % FRAMES_PER_SHEET;
        const sourceWidth = image.naturalWidth / 3;
        const sourceHeight = image.naturalHeight / 3;
        const cw = canvas.width;
        const ch = canvas.height;
        const scale = Math.max(cw / sourceWidth, ch / sourceHeight);
        const destinationWidth = sourceWidth * scale;
        const destinationHeight = sourceHeight * scale;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, (tile % 3) * sourceWidth, Math.floor(tile / 3) * sourceHeight,
          sourceWidth, sourceHeight, (cw - destinationWidth) / 2, (ch - destinationHeight) / 2,
          destinationWidth, destinationHeight);
        drawn = index;
        setFrame(index);
        setImageReady(true);
      }
      if (Math.abs(current - target) > .3) schedule();
    };
    function schedule() { if (!raf && alive) raf = window.requestAnimationFrame(render); }
    const onScroll = () => {
      const bounds = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      target = Math.min(FRAME_TOTAL - 1, Math.max(0, Math.round((-bounds.top / distance) * (FRAME_TOTAL - 1))));
      const nearTarget = Math.floor(target / FRAMES_PER_SHEET);
      queue(nearTarget); queue(nearTarget - 1); queue(nearTarget + 1);
      schedule();
    };
    const onResize = () => { resize(); onScroll(); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    resize();
    onScroll();
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const progress = frame / (FRAME_TOTAL - 1);
  const chapter = progress < .35 ? 0 : progress < .69 ? 1 : 2;
  const titles = [
    { n: '01 / THE INGREDIENT', top: 'Beauty begins', bottom: 'with simplicity.', desc: 'A good meal starts long before it meets the plate.' },
    { n: '02 / THE ART', top: 'Nothing ordinary.', bottom: 'Nothing rushed.', desc: 'Hands, heart and a little bit of magic.' },
    { n: '03 / THE MOMENT', top: 'Made to savour.', bottom: 'Made to share.', desc: 'Every detail is an invitation to stay.' },
  ];
  const active = titles[chapter];
  return <section className="film-section" id="film" ref={sectionRef} aria-label="540-frame scroll-controlled film" data-frame={frame} data-total-frames={FRAME_TOTAL}>
    <div className="film-sticky">
      <div className="film-poster" />
      <canvas className={'film-canvas' + (imageReady ? ' is-ready' : '')} ref={canvasRef} role="img" aria-label="Cinematic close-up of a gourmet dish, animated by scrolling" />
      <div className="film-topline"><span>SIENNA / A STORY IN 540 FRAMES</span><span>SCROLL TO DIRECT THE FILM</span></div>
      <div className="film-caption-panel" key={chapter}>
        <div className="tiny-label"><span className="dot"/>{active.n}</div>
        <h2>{active.top}<br/><em>{active.bottom}</em></h2>
        <p>{active.desc}</p>
        <div className="film-counter"><span>{String(frame + 1).padStart(3, '0')} / 540</span><div className="film-bar"><i style={{ width: (progress * 100) + '%' }}/></div><span>SCROLL →</span></div>
      </div>
      <div className="film-side-text">ONE FRAME AT A TIME · THE ART OF THE TABLE</div>
    </div>
  </section>;
}

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [category, setCategory] = useState<MenuCategory>('All');
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDone, setBookingDone] = useState(false);
  const [booking, setBooking] = useState({ name: '', email: '', date: '', time: '19:00', guests: '2' });
  const [scrolled, setScrolled] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const filtered = menu.filter(d => category === 'All' || d.category === category);
  const count = Object.values(cart).reduce((sum, n) => sum + n, 0);
  const total = useMemo(() => menu.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0), [cart]);
  const updateCart = (id: number, delta: number) => setCart(prev => {
    const next = { ...prev };
    const qty = Math.max(0, (next[id] || 0) + delta);
    if (qty) next[id] = qty; else delete next[id];
    return next;
  });

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setCartOpen(false); setBookingOpen(false); setMobileMenu(false); }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, []);
  useEffect(() => {
    document.body.style.overflow = cartOpen || bookingOpen || mobileMenu ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [cartOpen, bookingOpen, mobileMenu]);
  const reserve = () => { setBookingDone(false); setBookingOpen(true); setMobileMenu(false); };

  return <>
    <div className="site-root" id="top">
      <div className="top-ticker"><span>A PLACE TO SLOW DOWN</span><span className="ticker-center">THE LONG WAY ROUND ALWAYS TASTES BETTER <b>✳</b> EST. IN OUR IMAGINATION</span><span>OPEN EVERY EVENING</span></div>
      <header className={'header ' + (scrolled ? 'header-scrolled' : '')}>
        <a className="brand" href="#top" onClick={() => setMobileMenu(false)} aria-label="Sienna restaurant home"><span className="brand-symbol">✳</span><span className="brand-name">SIENNA<span className="brand-period">.</span><small>THE HOUSE OF GOOD FOOD</small></span></a>
        <nav className={'nav ' + (mobileMenu ? 'nav-expanded' : '')} aria-label="Primary navigation">
          <a href="#philosophy" onClick={() => setMobileMenu(false)}>The philosophy</a>
          <a href="#film" onClick={() => setMobileMenu(false)}>The film</a>
          <a href="#menu" onClick={() => setMobileMenu(false)}>The menu</a>
          <a href="#visit" onClick={() => setMobileMenu(false)}>Find us</a>
          <button className="nav-mobile-reserve" onClick={reserve}>Reserve a table <Arrow diagonal/></button>
        </nav>
        <div className="header-end"><button className="bag-btn" aria-label={'Open sample cart: ' + count + ' items'} onClick={() => setCartOpen(true)}><Bag/>{count > 0 && <span className="bag-count">{count}</span>}</button><button className="reserve-btn" onClick={reserve}>BOOK A TABLE <Arrow diagonal/></button><button className="mobile-toggle" aria-label={mobileMenu ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenu} onClick={() => setMobileMenu(v => !v)}><span/><span/></button></div>
      </header>
      <main>
        <section className="hero" id="home">
          <div className="hero-left">
            <div className="hero-eyebrow"><span className="short-rule"/> MODERN MEDITERRANEAN DINING</div>
            <div className="hero-copy"><span className="hero-asterisk">✳</span><h1>Come hungry.<br/><em>Leave inspired.</em></h1><p>For slow evenings, second helpings and stories worth staying for. Discover a new kind of gathering place.</p><div className="hero-buttons"><a className="primary-link" href="#film">EXPLORE OUR STORY <Arrow diagonal/></a><button className="underlined-link" onClick={reserve}>RESERVE YOUR EVENING <Arrow/></button></div></div>
            <div className="hero-left-foot"><span>01 — A BETTER KIND OF EVENING</span><a href="#film" aria-label="Scroll to cinema">SCROLL TO EXPLORE <span className="arrow-down">↓</span></a></div>
          </div>
          <div className="hero-right">
            <video className="hero-video" autoPlay muted playsInline loop preload="metadata" poster="/story/hero-poster.jpg" aria-label="Gourmet Mediterranean cuisine in close-up"><source src="/story/hero-film.webm" type="video/webm"/><source src="/story/hero-film.mp4" type="video/mp4"/></video>
            <div className="hero-photo-corner"><span>THE ART OF</span><strong>GOOD FOOD.</strong></div>
            <div className="hero-vertical">SIMPLE INGREDIENTS / UNFORGETTABLE MOMENTS</div>
          </div>
        </section>
        <div className="manifesto-band"><span>THE TABLE IS YOURS</span><i>✳</i><span>CRAFTED WITH CARE</span><i>✳</i><span>EVERYDAY IS AN OCCASION</span><i>✳</i><span>MADE TO SHARE</span></div>
        <section id="philosophy" className="philosophy section-space">
          <div className="section-kicker"><span>001 / THE PHILOSOPHY</span><span>DISCOVER OUR WORLD</span></div>
          <div className="philosophy-grid">
            <h2>Because the<br/><em>best things</em><br/>take time<span className="orange-period">.</span></h2>
            <div className="philosophy-right"><div className="mini-sun">✳</div><p>We believe a table is more than a place to eat. It is where the ordinary becomes something worth remembering.</p><span>HONEST INGREDIENTS. GENEROUS SPIRIT. ALWAYS SOMETHING GOOD ON THE TABLE.</span><a className="round-arrow" href="#film" aria-label="Watch the film"><Arrow diagonal/></a></div>
          </div>
          <div className="philosophy-pictures"><div className="photo-large"><img src="/studio/interior.png" alt="Light filled Mediterranean restaurant interior with sculptural arches" loading="lazy"/><div className="photo-index">01 / OUR SPACE</div></div><div className="photo-small"><img src="/studio/plated.png" alt="Refined Mediterranean dish on a linen table" loading="lazy"/><div className="photo-index">02 / OUR APPROACH</div></div></div>
        </section>
        <FrameStory/>
        <section id="menu" className="menu-section section-space">
          <div className="section-kicker"><span>002 / A TASTE OF SIENNA</span><span>GOOD FOOD, GOOD COMPANY</span></div>
          <div className="menu-title"><h2>Something<br/><em>worth sharing.</em></h2><p>A little seasonal, a little unexpected, always made with care. This is a sample of what could be on the table.</p></div>
          <div className="menu-tab-list" role="group" aria-label="Filter dishes by category">{categories.map(item => <button key={item} className={category === item ? 'selected' : ''} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}<span>{item === 'All' ? String(menu.length).padStart(2, '0') : String(menu.filter(d => d.category === item).length).padStart(2, '0')}</span></button>)}</div>
          <div className="menu-grid">{filtered.map((dish, i) => <article className="dish" key={dish.id}><div className="dish-img-wrap"><img src={dish.image} alt={dish.name} loading="lazy"/>{dish.note && <span className="dish-tag">{dish.note}</span>}<button className="dish-add" aria-label={'Add ' + dish.name + ' to sample order'} onClick={() => updateCart(dish.id, 1)}>+</button></div><div className="dish-meta"><div><span className="dish-type">{dish.category.toUpperCase()}</span><h3>{dish.name}</h3><p>{dish.description}</p></div><span className="dish-price">{fmt(dish.price)}</span></div></article>)}</div>
          <div className="menu-footer"><span>ALL PRICES IN AUD · DEMONSTRATION MENU</span><button onClick={() => setCartOpen(true)}>VIEW YOUR SELECTION ({count}) <Arrow/></button></div>
        </section>
        <section className="interlude"><div className="interlude-content"><div className="interlude-kicker">✳ &nbsp; THE SIENNA WAY</div><h2>For the moments<br/><em>between moments.</em></h2><p>One more glass. One more story. One more reason to stay.</p><button className="light-btn" onClick={reserve}>MAKE A NIGHT OF IT <Arrow diagonal/></button></div><div className="interlude-image"><img src="/studio/interior.png" alt="Beautiful sunlit restaurant interior" loading="lazy"/></div></section>
        <section className="visit section-space" id="visit">
          <div className="section-kicker"><span>003 / YOUR PLACE AT THE TABLE</span><span>THE INVITATION IS OPEN</span></div>
          <div className="visit-grid"><div><h2>The good part<br/><em>starts here.</em></h2><p>Celebrate a milestone or simply make a Tuesday feel special. There is always room for one more at Sienna.</p><button className="primary-link" onClick={reserve}>RESERVE YOUR EVENING <Arrow diagonal/></button></div><div className="visit-notes"><div><span>THE OCCASION</span><strong>Any reason is a<br/>good reason.</strong></div><div><span>THE HOURS</span><strong>Every evening,<br/>from 5:30 pm.</strong></div><div><span>THE LOCATION</span><strong>A fictional restaurant<br/>for a portfolio showcase.</strong></div></div></div>
        </section>
      </main>
      <footer className="footer"><div className="footer-top"><div className="footer-phrase">STAY A LITTLE LONGER. <span>✳</span></div><a href="#top">BACK TO TOP ↑</a></div><div className="footer-brand">SIENNA<span>.</span></div><div className="footer-base"><span>MODERN MEDITERRANEAN / MADE FOR THE MOMENT</span><span>© 2026 SIENNA · FICTIONAL PORTFOLIO CONCEPT</span><span>DESIGNED TO MAKE YOU FEEL SOMETHING.</span></div></footer>
    </div>

    {cartOpen && <div className="overlay" onMouseDown={() => setCartOpen(false)}><aside className="drawer" role="dialog" aria-modal="true" aria-label="Sample order" onMouseDown={event => event.stopPropagation()}><div className="modal-top"><div><span>YOUR SELECTION</span><h2>Good choices.</h2></div><button aria-label="Close cart" onClick={() => setCartOpen(false)}>×</button></div><div className="cart-rows">{count === 0 ? <p className="empty-cart">Nothing here yet. There are plenty of good things to discover.</p> : menu.filter(d => cart[d.id]).map(d => <div key={d.id} className="cart-line"><div><strong>{d.name}</strong><small>{fmt(d.price)} EACH</small></div><div className="qty"><button onClick={() => updateCart(d.id, -1)} aria-label={'Remove ' + d.name}>−</button><span>{cart[d.id]}</span><button onClick={() => updateCart(d.id, 1)} aria-label={'Add ' + d.name}>+</button></div></div>)}</div><div className="drawer-end"><div className="cart-total"><span>SAMPLE TOTAL</span><strong>{fmt(total)}</strong></div><p>Portfolio demonstration only. There is no payment or ordering backend.</p><button className="primary-link" onClick={() => { setCartOpen(false); reserve(); }}>MAKE A RESERVATION <Arrow diagonal/></button></div></aside></div>}
    {bookingOpen && <div className="overlay" onMouseDown={() => setBookingOpen(false)}><div className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={e => e.stopPropagation()}><div className="modal-top"><div><span>AN EVENING AT SIENNA</span><h2 id="booking-title">{bookingDone ? 'See you soon.' : 'Your table awaits.'}</h2></div><button aria-label="Close reservation" onClick={() => setBookingOpen(false)}>×</button></div>{bookingDone ? <div className="booking-confirm"><div className="big-star">✳</div><p>This is a portfolio demonstration. Your form was validated in the browser; no real reservation was made or sent.</p><button className="primary-link" onClick={() => setBookingOpen(false)}>BACK TO SIENNA <Arrow/></button></div> : <form className="booking-form" onSubmit={event => { event.preventDefault(); setBookingDone(true); }}><label>YOUR NAME<input name="name" type="text" value={booking.name} maxLength={80} required autoComplete="name" placeholder="Your full name" onChange={e => setBooking(b => ({ ...b, name: e.target.value }))}/></label><label>EMAIL ADDRESS<input name="email" type="email" value={booking.email} maxLength={120} required autoComplete="email" placeholder="you@example.com" onChange={e => setBooking(b => ({ ...b, email: e.target.value }))}/></label><div className="form-2"><label>THE DATE<input name="date" type="date" min={today} value={booking.date} required onChange={e => setBooking(b => ({ ...b, date: e.target.value }))}/></label><label>DINING TIME<select name="time" value={booking.time} onChange={e => setBooking(b => ({ ...b, time: e.target.value }))}>{['17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t => <option key={t} value={t}>{t}</option>)}</select></label></div><label>NUMBER OF GUESTS<select name="guests" value={booking.guests} onChange={e => setBooking(b => ({ ...b, guests: e.target.value }))}>{Array.from({ length: 8 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}</select></label><button type="submit" className="primary-link">PREVIEW RESERVATION <Arrow diagonal/></button><p>Demonstration form only. No details are transmitted or stored.</p></form>}</div></div>}
  </>;
}
