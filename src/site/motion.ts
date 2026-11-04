import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Motion foundation for the landing page.
 *  - GSAP + ScrollTrigger for scroll-linked and entrance motion.
 *  - Lenis for light smoothing (lerp 0.12): off on touch devices and under
 *    reduced motion, so native scrolling is never replaced there.
 * Everything is set up inside gsap.matchMedia so that, with reduced motion,
 * the finished state is simply what renders.
 */

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export const REDUCED = '(prefers-reduced-motion: reduce)';
export const MOTION_OK = '(prefers-reduced-motion: no-preference)';

let lenis: Lenis | null = null;

export function getLenis() {
  return lenis;
}

export function startSmoothScroll(): () => void {
  const touch = window.matchMedia('(pointer: coarse)').matches;
  const reduced = window.matchMedia(REDUCED).matches;
  if (touch || reduced) return () => undefined;

  lenis = new Lenis({ lerp: 0.12, wheelMultiplier: 1, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (time: number) => lenis?.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(tick);
    lenis?.destroy();
    lenis = null;
  };
}

/** Scroll to an in-page anchor, through Lenis when it is running. */
export function scrollToId(id: string, offset = -68) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 });
  else {
    const reduced = window.matchMedia(REDUCED).matches;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: reduced ? 'auto' : 'smooth' });
  }
}

/**
 * Entrances: within each [data-section], elements marked [data-reveal] rise
 * 24px and fade in once, staggered 80ms in document order, when the section
 * enters the viewport. Driven by IntersectionObserver so it fires however the
 * page gets there (wheel, keyboard, anchor jump). Content above the fold on
 * load is never hidden, and nothing is hidden under reduced motion.
 */
export function setupReveals(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const sections = gsap.utils.toArray<HTMLElement>('[data-section]', root);
    const pending = new Map<Element, HTMLElement[]>();
    sections.forEach((section) => {
      const items = gsap.utils.toArray<HTMLElement>('[data-reveal]', section);
      if (!items.length) return;
      if (section.getBoundingClientRect().top < window.innerHeight * 0.9) return;
      gsap.set(items, { opacity: 0, y: 24 });
      pending.set(section, items);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const items = pending.get(entry.target);
          if (!items) return;
          pending.delete(entry.target);
          io.unobserve(entry.target);
          gsap.to(items, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, overwrite: true });
        });
      },
      { rootMargin: '0px 0px -18% 0px', threshold: 0 }
    );
    pending.forEach((_, section) => io.observe(section));
    return () => {
      io.disconnect();
      pending.forEach((items) => gsap.set(items, { clearProps: 'opacity,transform' }));
    };
  });
  return () => mm.revert();
}
