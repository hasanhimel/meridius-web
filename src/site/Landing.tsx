import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LogoMark } from './brand/LogoMark';
import { nav } from './content';
import { setupReveals, startSmoothScroll, scrollToId, ScrollTrigger } from './motion';
import { Hero } from './sections/Hero';
import { How } from './sections/How';
import { Recall } from './sections/Recall';
import { Calm } from './sections/Calm';
import { Privacy } from './sections/Privacy';
import { Faq } from './sections/Faq';
import { Closing } from './sections/Closing';
import { Footer } from './sections/Footer';
import './site.css';

/** Old paths from the previous site, mapped to the new sections. */
const ROUTE_ANCHORS: Record<string, string> = {
  '/product': 'how',
  '/how-it-works': 'how',
  '/comparison': 'faq',
  '/sync': 'faq',
  '/vision': 'faq',
  '/mcp': 'calm',
  '/integrations': 'calm',
  '/privacy': 'privacy',
  '/recall': 'recall',
  '/faq': 'faq',
  '/access': 'access',
};

export function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const [solid, setSolid] = useState(false);

  const requestAccess = useCallback(() => {
    scrollToId('access', -80);
    // Focus once the scroll settles so the page doesn't jump.
    window.setTimeout(() => emailRef.current?.focus({ preventScroll: true }), 1000);
  }, []);

  useLayoutEffect(() => {
    const stopSmooth = startSmoothScroll();
    const stopReveals = rootRef.current ? setupReveals(rootRef.current) : () => undefined;
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      stopReveals();
      stopSmooth();
    };
  }, []);

  // Deep links from the old site (/product, /mcp …) and in-page anchors.
  useEffect(() => {
    const target = ROUTE_ANCHORS[window.location.pathname.toLowerCase()] ?? window.location.hash.slice(1);
    if (target) window.setTimeout(() => scrollToId(target), 250);

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href')!.slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      history.replaceState(null, '', `#${id}`);
      scrollToId(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Transparent over the sky; a frosted white bar once the page scrolls.
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={rootRef} className="m-site">
      <header className="m-nav" data-solid={solid}>
        <div className="m-wrap m-nav__inner">
          <a
            href="#top"
            className="m-nav__brand"
            aria-label="Meridius, back to top"
            onClick={(e) => {
              e.preventDefault();
              scrollToId('top', 0);
            }}
          >
            <LogoMark size={24} ripple />
            Meridius
          </a>
          <nav aria-label="Sections">
            <ul className="m-nav__links">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" className="m-btn m-btn--blue m-btn--sm m-nav__cta" onClick={requestAccess}>
            Request access
          </button>
        </div>
      </header>

      <main id="top">
        <Hero onRequest={requestAccess} />
        <How />
        <Recall />
        <Calm />
        <Privacy />
        <Faq />
        <Closing ref={emailRef} />
      </main>
      <Footer onRequest={requestAccess} />
    </div>
  );
}
