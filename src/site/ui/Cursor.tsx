import { forwardRef, useId, useImperativeHandle, useRef } from 'react';
import { gsap } from '../motion';

/**
 * Meridius's software cursor, its shape ported from the macOS app
 * (Core/ComputerUse/SoftwareCursorGlyphRenderer.swift): the traced rounded
 * arrow with a white outline, a 0.82 squeeze on click, and a tilt toward the
 * direction it travels. On the site it wears the primary button's finish: the
 * same blue gradient, a pale sheen from the lower right and a blue glow.
 * One size everywhere.
 *
 * The path is in the trace's own units with the tip moved to (0, 0); the group
 * turns it so the neutral pose points straight up, as on screen.
 */
const ARROW =
  'M65.5 0.9C55 3.6 46.5 10.6 42.2 19.8L39.5 421.5L42.8 428.2C51 445 70.9 451.5 87.6 443L94.4 439.5L129.2 395.5C148.4 371.3 171.2 342.4 180 331.4C191 317.5 197.4 310.3 200.7 308.1C210.1 301.8 207.5 302 295.6 302C378.2 302 382.4 301.8 390.1 298C402.2 291.8 409.9 275.5 407.1 261.9C404.3 248.7 414.6 257.4 245.5 125.8C160.8 59.9 89.2 4.8 86.5 3.5C81 0.8 70.7 -0.5 65.5 0.9Z';

/** Height of the arrow on screen, in px. The same everywhere on the site. */
const ARROW_PX = 17;
/** viewBox half-size: room for the arrow at any rotation around its tip. */
const HALF = 480;
const BOX_PX = ((HALF * 2) / 452) * ARROW_PX;
/** The trace's tip, and the turn that makes it point straight up. */
const TIP = { x: 65.5, y: 0.9 };
const NEUTRAL_TURN = 24.5;
/** 1.4pt stroke at the app's scale, in trace units. */
const STROKE = (1.4 * 452) / 20.6;

export function CursorGlyph({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox={`${-HALF} ${-HALF} ${HALF * 2} ${HALF * 2}`} width={BOX_PX} height={BOX_PX} aria-hidden="true">
      <defs>
        {/* The button's two layers: a deep blue body lit from the upper left… */}
        <radialGradient id={`${id}-b`} cx="0.1" cy="0.17" r="1.15">
          <stop offset="0" stopColor="#1e82e0" />
          <stop offset="1" stopColor="#1c38ea" />
        </radialGradient>
        {/* …and a pale sheen rising from the lower right. */}
        <radialGradient id={`${id}-s`} cx="0.66" cy="0.82" r="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={`rotate(${NEUTRAL_TURN}) translate(${-TIP.x} ${-TIP.y})`}>
        <path d={ARROW} fill={`url(#${id}-b)`} stroke="#fff" strokeWidth={STROKE} strokeLinejoin="round" />
        <path d={ARROW} fill={`url(#${id}-s)`} />
      </g>
    </svg>
  );
}

export interface CursorHandle {
  /** The element to move: animate its `left` / `top` (percent of the stage). */
  el: HTMLDivElement | null;
  /** Adds a move to (x%, y%) to a timeline, tilting toward the heading. */
  moveTo: (tl: gsap.core.Timeline, x: number, y: number, duration?: number, at?: gsap.Position) => void;
  /** Adds a click (squeeze plus ripple) to a timeline. */
  click: (tl: gsap.core.Timeline, at?: gsap.Position) => void;
  /** Places the cursor without animating. */
  set: (x: number, y: number) => void;
}

/**
 * A positioned cursor for a demo stage. The stage must be position: relative;
 * coordinates are percentages of it, so the scene scales with the layout.
 */
export const Cursor = forwardRef<CursorHandle, { x: number; y: number; label?: string }>(function Cursor({ x, y, label }, ref) {
  const outer = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLSpanElement>(null);
  const pos = useRef({ x, y });

  useImperativeHandle(ref, () => ({
    get el() {
      return outer.current;
    },
    set(nx, ny) {
      pos.current = { x: nx, y: ny };
      gsap.set(outer.current, { left: `${nx}%`, top: `${ny}%` });
    },
    moveTo(tl, nx, ny, duration = 0.9, at) {
      // Moves are added in order, so the position tracked here is where the
      // cursor will be when this move starts.
      const tilt = gsap.utils.clamp(-28, 28, (nx - pos.current.x) * 1.4);
      tl.add(
        gsap
          .timeline()
          .to(outer.current, { left: `${nx}%`, top: `${ny}%`, duration, ease: 'power3.inOut' }, 0)
          .to(body.current, { rotate: tilt, duration: duration * 0.45, ease: 'power2.out' }, 0)
          .to(body.current, { rotate: 0, duration: duration * 0.7, ease: 'elastic.out(1, 0.55)' }, duration * 0.55),
        at
      );
      pos.current = { x: nx, y: ny };
    },
    click(tl, at) {
      tl.add(
        gsap
          .timeline()
          .to(body.current, { scale: 0.82, duration: 0.09, ease: 'power2.in' })
          .to(body.current, { scale: 1, duration: 0.24, ease: 'back.out(3)' })
          .fromTo(ring.current, { scale: 0.2, opacity: 0.55 }, { scale: 1, opacity: 0, duration: 0.5, ease: 'power2.out' }, 0.05),
        at
      );
    },
  }));

  return (
    <div ref={outer} className="m-cur" style={{ left: `${x}%`, top: `${y}%` }} aria-hidden="true">
      <span ref={ring} className="m-cur__ring" />
      <div ref={body} className="m-cur__body">
        <CursorGlyph />
      </div>
      {label ? <span className="m-cur__label">{label}</span> : null}
    </div>
  );
});
