import { useLayoutEffect, useRef } from 'react';
import { hero } from '../content';
import { MacStory } from '../ui/MacStory';
import { gsap, MOTION_OK } from '../motion';

/**
 * A noon sky. "Meridius" comes from the meridian, the line the sun crosses at
 * its highest point; the dotted arc is that path, with the sun on it.
 */
function Sky() {
  return (
    <div className="m-sky" aria-hidden="true">
      <svg className="m-sky__arc" viewBox="0 0 1440 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="m-sun" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#fff" />
            <stop offset="0.42" stopColor="#fff" />
            <stop offset="0.55" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path
          d="M -100 900 Q 720 -120 1540 900"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="0.1 14"
        />
        <circle cx="1094" cy="496" r="150" fill="url(#m-sun)" opacity="0.9" />
        <circle cx="1094" cy="496" r="300" fill="url(#m-sun)" opacity="0.25" />
      </svg>
      <span className="m-cloud" style={{ left: '-6%', top: '58%', width: '34%', height: '16%' }} />
      <span className="m-cloud" style={{ left: '14%', top: '66%', width: '26%', height: '12%' }} />
      <span className="m-cloud" style={{ right: '-8%', top: '60%', width: '36%', height: '15%' }} />
      <span className="m-cloud" style={{ right: '18%', top: '70%', width: '24%', height: '10%' }} />
      <span className="m-cloud" style={{ left: '35%', top: '78%', width: '30%', height: '12%' }} />
    </div>
  );
}

export function Hero({ onRequest }: { onRequest: () => void }) {
  const rootRef = useRef<HTMLElement>(null);
  const shotRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const shot = shotRef.current;
    if (!root || !shot) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const lines = root.querySelectorAll('.m-hero__title span, .m-hero__sentence, .m-hero__actions');
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from(lines, { y: 26, opacity: 0, filter: 'blur(8px)', duration: 1.1, stagger: 0.09 }).from(shot, { y: 70, opacity: 0, duration: 1.4 }, 0.35);
      // A light lift as the shot scrolls by.
      gsap.fromTo(
        shot,
        { scale: 0.97 },
        { scale: 1, ease: 'none', scrollTrigger: { trigger: shot, start: 'top bottom', end: 'top 30%', scrub: true } }
      );
      return () => tl.kill();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="m-hero" aria-labelledby="hero-title">
      <Sky />
      <div className="m-wrap">
        <h1 id="hero-title" className="m-hero__title">
          {hero.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        <p className="m-hero__sentence">{hero.sentence}</p>
        <div className="m-hero__actions">
          <button type="button" className="m-btn m-btn--blue" onClick={onRequest}>
            {hero.primary}
          </button>
        </div>
        <div className="m-hero__shot">
          <MacStory ref={shotRef} />
        </div>
      </div>
    </section>
  );
}
