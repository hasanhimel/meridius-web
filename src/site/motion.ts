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

/** Wraps each word of an element's text in a span, keeping inner elements. */
function splitWords(el: HTMLElement): HTMLElement[] {
  if (el.dataset.split) return Array.from(el.querySelectorAll<HTMLElement>('.m-word'));
  el.dataset.split = '1';
  const words: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = (child.textContent ?? '').split(/(\s+)/);
        const frag = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(part));
          else {
            const span = document.createElement('span');
            span.className = 'm-word';
            span.textContent = part;
            frag.appendChild(span);
            words.push(span);
          }
        });
        child.parentNode?.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE) walk(child);
    });
  };
  walk(el);
  return words;
}

/**
 * Entrances, in the manner of a calm product page:
 *  - [data-reveal="words"]: a heading's words fade up out of a light blur,
 *    one after another.
 *  - [data-reveal]: a block rises 20px out of an 8px blur.
 *  - [data-reveal="pop"]: a UI card rises and settles from 96% scale.
 * Each element reveals when it enters the viewport; elements entering
 * together are staggered. Content above the fold on load is left alone, and
 * nothing is hidden under reduced motion.
 */
export function setupReveals(root: HTMLElement) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    const all = gsap.utils.toArray<HTMLElement>('[data-reveal]', root);
    const fold = window.innerHeight * 0.92;
    const pending = all.filter((el) => el.getBoundingClientRect().top > fold);
    const words = new Map<HTMLElement, HTMLElement[]>();

    pending.forEach((el) => {
      const kind = el.dataset.reveal;
      if (kind === 'words') {
        const w = splitWords(el);
        words.set(el, w);
        gsap.set(w, { opacity: 0, y: 10, filter: 'blur(6px)' });
      } else if (kind === 'pop') {
        gsap.set(el, { opacity: 0, y: 40, scale: 0.96, filter: 'blur(8px)', transformOrigin: '50% 100%' });
      } else {
        gsap.set(el, { opacity: 0, y: 20, filter: 'blur(8px)' });
      }
    });

    let queue: HTMLElement[] = [];
    let raf = 0;
    const flush = () => {
      raf = 0;
      const batch = queue.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top || a.getBoundingClientRect().left - b.getBoundingClientRect().left);
      queue = [];
      batch.forEach((el, i) => {
        const delay = i * 0.1;
        const w = words.get(el);
        if (w) {
          gsap.to(w, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out', stagger: 0.045, delay, clearProps: 'filter' });
        } else if (el.dataset.reveal === 'pop') {
          gsap.to(el, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', delay, clearProps: 'filter,transform' });
        } else {
          gsap.to(el, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out', delay, clearProps: 'filter,transform' });
        }
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          queue.push(entry.target as HTMLElement);
        });
        if (queue.length && !raf) raf = requestAnimationFrame(flush);
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0 }
    );
    pending.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      gsap.set(pending, { clearProps: 'opacity,transform,filter' });
      words.forEach((w) => gsap.set(w, { clearProps: 'opacity,transform,filter' }));
    };
  });
  return () => mm.revert();
}
