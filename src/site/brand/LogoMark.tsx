import { forwardRef, useCallback, useEffect, useId, useRef } from 'react';
import { SHADED_DOTS, LOGO_BOX, MAX_DIST } from './logo';

/**
 * The official Meridius mark: 127 dots in one flat colour, exactly as the
 * macOS app ships it (Assets.xcassets/MeridiusLogo). Optional ripple from the
 * apex on hover.
 *
 * Each circle carries data-d (0..1, distance from the apex) so motion code
 * can assemble the mark from the centre outward.
 */

/** Per-variant strengths for the deboss filter. */
const DEBOSS = {
  key: { lip: 1, shade: '#435a8c', shadeOpacity: 0.95, glint: 0, depth: 3 },
  light: { lip: 0.35, shade: '#0b2a6b', shadeOpacity: 0.6, glint: 0, depth: 4 },
  dark: { lip: 0.9, shade: '#000000', shadeOpacity: 0, glint: 0.5, depth: 4 },
} as const;

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
  /**
   * Press the dots into the surface, lit from above:
   *  - 'key':   dots the colour of a pale keycap; shadowed upper wall, white lip.
   *  - 'light': white dots; a cool shadow falls inside each hole's upper wall.
   *  - 'dark':  black dots; light catches each hole's lower wall.
   */
  deboss?: false | 'key' | 'light' | 'dark';
}

export const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(function LogoMark(
  { size = 28, className, ripple = false, accentM = false, title, tight = false, deboss = false },
  ref,
) {
  const innerRef = useRef<SVGSVGElement | null>(null);
  const rafRef = useRef(0);

  const setRefs = useCallback(
    (node: SVGSVGElement | null) => {
      innerRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
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

  const filterId = `deboss-${useId().replace(/:/g, '')}`;
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
      {deboss ? (
        <defs>
          {/* Units are the logo's own (dots are r 2–10). Three optional layers:
              an outer lip below each hole, a shadow on its upper inner wall
              and a glint on its lower inner wall. */}
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feOffset in="SourceAlpha" dy="2.2" result="down" />
            <feComposite in="down" in2="SourceAlpha" operator="out" result="lipEdge" />
            <feGaussianBlur in="lipEdge" stdDeviation="0.6" result="lipSoft" />
            <feFlood floodColor="#ffffff" floodOpacity={DEBOSS[deboss].lip} />
            <feComposite in2="lipSoft" operator="in" result="lip" />
            <feOffset in="SourceAlpha" dy={DEBOSS[deboss].depth} result="drop" />
            <feGaussianBlur in="drop" stdDeviation="1.5" result="dropSoft" />
            <feComposite in="SourceAlpha" in2="dropSoft" operator="out" result="wall" />
            <feFlood floodColor={DEBOSS[deboss].shade} floodOpacity={DEBOSS[deboss].shadeOpacity} />
            <feComposite in2="wall" operator="in" result="shade" />
            <feOffset in="SourceAlpha" dy={-DEBOSS[deboss].depth} result="rise" />
            <feGaussianBlur in="rise" stdDeviation="1.4" result="riseSoft" />
            <feComposite in="SourceAlpha" in2="riseSoft" operator="out" result="floor" />
            <feFlood floodColor="#ffffff" floodOpacity={DEBOSS[deboss].glint} />
            <feComposite in2="floor" operator="in" result="glint" />
            <feMerge>
              <feMergeNode in="lip" />
              <feMergeNode in="SourceGraphic" />
              <feMergeNode in="shade" />
              <feMergeNode in="glint" />
            </feMerge>
          </filter>
        </defs>
      ) : null}
      <g filter={deboss ? `url(#${filterId})` : undefined}>
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
          />
        ))}
      </g>
    </svg>
  );
});
