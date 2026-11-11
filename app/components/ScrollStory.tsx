'use client';

import { useEffect, useRef, useState } from 'react';

const beats = [
  { eyebrow: '01 / THE ORIGIN', title: 'It starts with the simplest things.', copy: 'A flame. Fresh ingredients. The patience to let every flavour find its place.' },
  { eyebrow: '02 / THE CRAFT', title: 'Every detail, made with intention.', copy: 'A little theatre from the kitchen, a little magic in the making.' },
  { eyebrow: '03 / THE TABLE', title: 'The best moments are shared.', copy: 'Where one more conversation turns into an entire evening.' },
  { eyebrow: '04 / THE INVITATION', title: 'And the story continues with you.', copy: 'Pull up a chair. There is always room for another beautiful memory.' },
];

const STORY_VIDEO = 'https://videos.pexels.com/video-files/852375/852375-hd_1920_1080_24fps.mp4';
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=2000&q=85';

export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const durationRef = useRef(8);
  const targetRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    const handlePreference = () => setReduced(media.matches);
    media.addEventListener('change', handlePreference);
    return () => media.removeEventListener('change', handlePreference);
  }, []);

  useEffect(() => {
    let scrollFrame = 0;
    let seekFrame = 0;
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section || reduced) return;

    // Seeking rather than continuous playback makes the film advance in either
    // direction with the visitor's scroll, without relying on an animation library.
    const update = () => {
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - window.innerHeight);
      const amount = Math.max(0, Math.min(1, -rect.top / distance));
      targetRef.current = amount;
      setProgress((prev) => Math.abs(prev - amount) > 0.001 ? amount : prev);
      scrollFrame = 0;
    };
    const requestUpdate = () => {
      if (scrollFrame === 0) scrollFrame = requestAnimationFrame(update);
    };
    const seek = () => {
      const duration = Math.max(.1, durationRef.current - .04);
      const desired = duration * targetRef.current;
      if (video.readyState >= 1 && Math.abs(video.currentTime - desired) > 0.045 && !video.seeking) {
        try { video.currentTime = desired; } catch { /* unseekable external source: keep poster */ }
      }
      seekFrame = requestAnimationFrame(seek);
    };
    const loaded = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) durationRef.current = video.duration;
      video.pause();
      setReady(true);
      requestUpdate();
    };
    video.addEventListener('loadedmetadata', loaded);
    video.addEventListener('canplay', loaded, { once: true });
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();
    seekFrame = requestAnimationFrame(seek);
    return () => {
      cancelAnimationFrame(scrollFrame);
      cancelAnimationFrame(seekFrame);
      video.removeEventListener('loadedmetadata', loaded);
      video.removeEventListener('canplay', loaded);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, [reduced]);

  const active = Math.min(3, Math.floor(progress * 4));
  return (
    <section ref={sectionRef} className="cinematic-story" id="cinematic" aria-label="Scroll driven film about our kitchen">
      <div className="cinematic-sticky">
        <div className="cinematic-fallback" style={{ backgroundImage: `url('${FALLBACK_IMAGE}')` }} />
        {!reduced && !videoError && <video
          ref={videoRef}
          className={`cinematic-video ${ready ? 'is-ready' : ''}`}
          muted playsInline preload="auto"
          poster={FALLBACK_IMAGE}
          onError={() => setVideoError(true)}
          aria-hidden="true"
        >
          <source src={STORY_VIDEO} type="video/mp4" />
        </video>}
        <div className="cinematic-shade" />
        <div className="cinematic-inner container">
          <div className="cinematic-topline"><span>THE ART OF GATHERING</span><span>SCROLL-DRIVEN FILM <span aria-hidden="true">✳</span></span></div>
          <div className="cinematic-narrative" key={reduced ? 'reduced' : active}>
            <div className="eyebrow"><span className="eyebrow-line" />{beats[active].eyebrow}</div>
            <h2>{beats[active].title}</h2>
            <p>{beats[active].copy}</p>
          </div>
          <div className="cinematic-progress"><span className="cinematic-instruction">SCROLL TO DIRECT THE FILM</span><span className="cinematic-track"><span style={{ width: `${Math.round(progress * 100)}%` }} /></span><span className="cinematic-percent">{String(Math.round(progress * 100)).padStart(2, '0')}%</span></div>
          {videoError && <span className="cinematic-video-note">Visual storytelling fallback · video currently unavailable</span>}
        </div>
      </div>
    </section>
  );
}
