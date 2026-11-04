import { useId } from 'react';
import { LogoMark } from './LogoMark';

/**
 * The nav mark: the Meridius dots in white on a blue halftone tile. The ground
 * is a fine screen of light dots that thickens toward the lower left, where it
 * turns to crosses, and deepens to saturated blue in the lower right.
 */
export function NavMark({ size = 30, ripple = false }: { size?: number; ripple?: boolean }) {
  const id = useId().replace(/:/g, '');
  return (
    <span className="m-navmark" style={{ width: size, height: size }} aria-hidden="true">
      <svg className="m-navmark__ground" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#5b9cec" />
            <stop offset="0.55" stopColor="#4a8fe8" />
            <stop offset="1" stopColor="#1f74ea" />
          </linearGradient>
          <pattern id={`${id}-d`} width="3.4" height="3.4" patternUnits="userSpaceOnUse">
            <circle cx="1.7" cy="1.7" r="0.62" fill="#dceaff" />
          </pattern>
          <pattern id={`${id}-x`} width="3.4" height="3.4" patternUnits="userSpaceOnUse">
            <path d="M0.9 0.9 2.5 2.5M2.5 0.9 0.9 2.5" stroke="#e8f1ff" strokeWidth="0.5" strokeLinecap="round" />
          </pattern>
          <radialGradient id={`${id}-dm`} cx="0.3" cy="0.25" r="0.9">
            <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.7" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id={`${id}-xm`} cx="0.15" cy="0.9" r="0.6">
            <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id={`${id}-mdm`}>
            <rect width="100" height="100" fill={`url(#${id}-dm)`} />
          </mask>
          <mask id={`${id}-mxm`}>
            <rect width="100" height="100" fill={`url(#${id}-xm)`} />
          </mask>
        </defs>
        <rect width="100" height="100" fill={`url(#${id}-g)`} />
        <rect width="100" height="100" fill={`url(#${id}-d)`} mask={`url(#${id}-mdm)`} />
        <rect width="100" height="100" fill={`url(#${id}-x)`} mask={`url(#${id}-mxm)`} />
      </svg>
      <LogoMark size={size * 0.66} ripple={ripple} className="m-navmark__mark" />
    </span>
  );
}
