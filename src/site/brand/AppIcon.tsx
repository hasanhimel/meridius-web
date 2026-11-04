import type { ReactNode } from 'react';
import { LogoMark } from './LogoMark';

/**
 * The Meridius mark on a soft keycap: a pale raised tile that melts into the
 * page, with the dots pressed into its face. Everything scales from `size`
 * (font-size drives the em-based bevel and glow), so one style serves the
 * 26px nav mark and the 176px closing tile.
 *
 * `lit` swaps the engraved glyph for a glowing white one; `children` replaces
 * the mark with another glyph on the same keycap.
 */
export function AppIcon({
  size = 28,
  className,
  ripple = false,
  lit = false,
  children,
}: {
  size?: number;
  className?: string;
  ripple?: boolean;
  lit?: boolean;
  children?: ReactNode;
}) {
  return (
    <span
      className={`m-appmark${lit ? ' m-appmark--lit' : ''}${size >= 64 ? ' m-appmark--deep' : ''}${className ? ` ${className}` : ''}`}
      style={{ width: size, height: size, fontSize: size }}
      aria-hidden="true"
    >
      {children ?? <LogoMark size={size * 0.64} ripple={ripple} deboss={size >= 64} />}
    </span>
  );
}
