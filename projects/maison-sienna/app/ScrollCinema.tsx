'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const chapters = [
  { eyebrow: '01 / THE FIRE', title: <>Every good evening<br /><em>begins with a spark.</em></>, detail: 'Where fire, flavour and feeling come together.' },
  { eyebrow: '02 / THE CRAFT', title: <>Made slowly.<br /><em>Made with care.</em></>, detail: 'The small details are what make it memorable.' },
  { eyebrow: '03 / THE TABLE', title: <>The best moments<br /><em>are shared.</em></>, detail: 'A warm table. Something wonderful on every plate.' },
];

export default function ScrollCinema() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const [progress, setProgress] = useState(0);
  const [canScrub, setCanScrub] = useState(false);
  const [failed, setFailed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const update = useCallback(() => {
    rafRef.current = 0;
    const section = sectionRef.current;
    if (!section) return;
    const bounds = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const position = Math.min(1, Math.max(0, -bounds.top / travel));
    setProgress((previous) => Math.abs(previous - position) > 0.0015 ? position : previous);
    const video = videoRef.current;
    if (!reduceMotion && video && video.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(video.duration) && video.duration > 0) {
      const nextTime = Math.max(0, Math.min(video.duration - 0.04, position * video.duration));
      if (Math.abs(video.currentTime - nextTime) > 0.06) {
        try { video.currentTime = nextTime; } catch { /* Unavailable seek range: keep poster. */ }
      }
    }
  }, [reduceMotion]);

  useEffect(() => {
    setReduceMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const onScroll = () => { if (!rafRef.current) rafRef.current = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [update]);

  const chapter = Math.min(2, Math.floor(progress * 3));
  return (
    <section className="sienna-cinema" ref={sectionRef} aria-label="Discover our kitchen" id="kitchen-film">
      <div className="sienna-cinema-sticky">
        <div className="sienna-cinema-poster" role="img" aria-label="Chef preparing a delicious Mediterranean meal" />
        {!failed && !reduceMotion && <video
          ref={videoRef}
          className={`sienna-cinema-video ${canScrub ? 'is-ready' : ''}`}
          src="/media/story-540-2k.mp4"
          preload="auto"
          muted
          playsInline
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
          onLoadedMetadata={() => { setCanScrub(true); update(); }}
          onError={() => setFailed(true)}
        />}
        <div className="sienna-cinema-overlay" />
        <div className="sienna-cinema-top container"><span>MAISON SIENNA</span><span>AN OPEN KITCHEN, AN OPEN INVITATION</span></div>
        <div className="sienna-cinema-copy container" key={chapter}>
          <span className="sienna-cinema-eyebrow"><i /> {chapters[chapter].eyebrow}</span>
          <h2>{chapters[chapter].title}</h2>
          <p>{chapters[chapter].detail}</p>
        </div>
        <div className="sienna-cinema-footer container">
          <span>THE ART OF TAKING YOUR TIME</span>
          <div className="sienna-cinema-track" aria-label="Film progress"><span style={{ width: `${progress * 100}%` }} /></div>
          <span>SCROLL TO EXPLORE</span>
        </div>
      </div>
    </section>
  );
}