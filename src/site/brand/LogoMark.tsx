import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { SHADED_DOTS, FACE_ALPHA, LOGO_BOX, MAX_DIST } from './logo';

/**
 * The Meridius mark, redrawn from its exact 127-dot geometry.
 * New treatment: cube shading per face (top / left / right), the M at full
 * ink, and an optional ripple from the apex on hover.
 *
 * Each circle carries data-d (0..1, distance from the apex) so motion code
 * can assemble the mark from the centre outward.
 */

interface LogoMarkProps {
  size?: number | string;
  className?: string;
  /** Ripple from the apex on pointer hover. */
  ripple?: boolean;
  /** Paint the M in the accent colour. */
  accentM?: boolean;
  title?: string;
  /** No padding around the hexagon (for overlays that must match the dither canvas). */
  tight?: boolean;
}

export const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(function LogoMark(
  { size = 28, className, ripple = false, accentM = false, title, tight = false },
  ref
) {
  const innerRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef(0);

  const setRefs = useCallback(
    (node: SVGSVGElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  const runRipple = useCallback(() => {
    const svg = innerRef.current;
    if (!svg || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    cancelAnimationFrame(rafRef.current);
    const circles = Array.from(svg.querySelectorAll<SVGCircleElement>('circle'));
    const t0 = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = (now - t0) / duration;
      for (const c of circles) {
        const d = Number(c.dataset.d);
        const base = Number(c.dataset.r);
        const wave = Math.max(0, 1 - Math.abs(t * 1.4 - d) * 4);
        c.setAttribute('r', (base * (1 + wave * 0.55)).toFixed(2));
      }
      if (t < 1.1) rafRef.current = requestAnimationFrame(tick);
      else for (const c of circles) c.setAttribute('r', c.dataset.r!);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const pad = tight ? 0 : 4;
  return (
    <svg
      ref={setRefs}
      viewBox={`${LOGO_BOX.x - pad} ${LOGO_BOX.y - pad} ${LOGO_BOX.w + pad * 2} ${LOGO_BOX.h + pad * 2}`}
      width={size}
      height={typeof size === 'number' ? (size * (LOGO_BOX.h + pad * 2)) / (LOGO_BOX.w + pad * 2) : undefined}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      onPointerEnter={ripple ? runRipple : undefined}
      overflow="visible"
    >
      {title ? <title>{title}</title> : null}
      {SHADED_DOTS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          data-r={d.r}
          data-d={(d.dist / MAX_DIST).toFixed(3)}
          data-m={d.isM ? '1' : undefined}
          fill={d.isM && accentM ? 'var(--accent)' : 'currentColor'}
          fillOpacity={d.isM ? 1 : FACE_ALPHA[d.face]}
        />
      ))}
    </svg>
  );
});
