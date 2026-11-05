import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { NavMark } from './brand/NavMark';
import { Wordmark } from './brand/Wordmark';
import { nav } from './content';
import { setupReveals, startSmoothScroll, scrollToId, ScrollTrigger } from './motion';
import { Hero } from './sections/Hero';
import { Capabilities } from './sections/Capabilities';
import { OwnDisplay } from './sections/OwnDisplay';
import { Contrast } from './sections/Contrast';
import { Principles } from './sections/Principles';
import { AccessDialog, type AccessDialogHandle } from './access/AccessDialog';
import { Privacy } from './sections/Privacy';
import { Faq } from './sections/Faq';
import { Closing } from './sections/Closing';
import { Footer } from './sections/Footer';
import './site.css';

/** Old paths from the previous site, mapped to the new sections. */
const ROUTE_ANCHORS: Record<string, string> = {
  '/product': 'capabilities',
  '/capabilities': 'capabilities',
  '/how-it-works': 'display',
  '/comparison': 'faq',
  '/sync': 'faq',
  '/vision': 'faq',
  '/mcp': 'principles',
  '/integrations': 'principles',
  '/privacy': 'privacy',
  '/recall': 'capabilities',
  '/faq': 'faq',
  '/access': 'access',
};

export function Landing() {
  const rootRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<AccessDialogHandle>(null);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  // Request access opens the form where the visitor already is.
  const requestAccess = useCallback(() => {
    setMenu(false);
    dialogRef.current?.open();
  }, []);

  // The phone menu closes on Escape and on a wider screen.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false);
    const mq = window.matchMedia('(min-width: 761px)');
    const onWide = () => mq.matches && setMenu(false);
    window.addEventListener('keydown', onKey);
    mq.addEventListener('change', onWide);
    return () => {
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener('change', onWide);
    };
  }, [menu]);

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

  // The bar takes its colour from what is under it: white and clear over a
  // blue sky (the hero above the Mac, the closing sky and the footer glass),
  // a frosted bar with dark ink over the white sections.
  useEffect(() => {
    const NAV_LINE = 32; // the bar's vertical middle
    const blueBands = (): [number, number][] => {
      const bands: [number, number][] = [];
      const hero = document.querySelector('.m-hero');
      const shot = document.querySelector('.m-hero__shot');
      if (hero && shot) bands.push([hero.getBoundingClientRect().top, shot.getBoundingClientRect().top]);
      const closing = document.querySelector('.m-closing');
      if (closing) {
        const r = closing.getBoundingClientRect();
        // Its sky starts white and is blue from about a sixth of the way down.
        bands.push([r.top + r.height * 0.16, r.bottom]);
      }
      const footer = document.querySelector('.m-footer');
      if (footer) {
        const r = footer.getBoundingClientRect();
        bands.push([r.top, r.bottom]);
      }
      return bands;
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const overBlue = blueBands().some(([top, bottom]) => top <= NAV_LINE && NAV_LINE < bottom);
      setSolid(!overBlue);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div ref={rootRef} className="m-site">
      <header className="m-nav" data-solid={solid || menu} data-menu={menu}>
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
            <NavMark size={30} tone={solid || menu ? 'dark' : 'light'} ripple />
            <Wordmark height={15} className="m-wordmark" />
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
          <button
            type="button"
            className="m-nav__menu"
            aria-expanded={menu}
            aria-controls="m-nav-sheet"
            aria-label={menu ? 'Close menu' : 'Open menu'}
            onClick={() => setMenu((m) => !m)}
          >
            <span />
            <span />
          </button>
        </div>
        <div id="m-nav-sheet" className="m-nav__sheet" hidden={!menu}>
          <ul>
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setMenu(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <main id="top">
        <Hero onRequest={requestAccess} />
        <Contrast />
        <Capabilities />
        <OwnDisplay />
        <Principles />
        <Privacy />
        <Faq />
        <Closing ref={emailRef} />
      </main>
      <Footer onRequest={requestAccess} />
      <AccessDialog ref={dialogRef} />
    </div>
  );
}
