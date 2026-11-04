import { LOGO_DOTS, type LogoDot } from '../../data/logoDots';

/**
 * Geometry of the Meridius mark: 127 dots on an isometric lattice inside a
 * pointy-top hexagon, read as a cube (top / left / right faces) with a bold M
 * on the two lower faces. Shared by every rendering of the mark so the site never
 * drifts from the real logo.
 */

export type Face = 'top' | 'left' | 'right';

export interface ShadedDot extends LogoDot {
  face: Face;
  isM: boolean;
  /** Distance from the cube apex, used to stagger assemble/ripple effects. */
  dist: number;
}

/** Cube apex, where the three faces meet (logo units, 512 viewBox). */
export const APEX = { x: 259.0, y: 258.14 } as const;

/** Bounding box of the hexagon in logo units. Height/width ≈ 2/√3. */
export const LOGO_BOX = { x: 102, y: 77, w: 314, h: 360 } as const;

export const SHADED_DOTS: ShadedDot[] = LOGO_DOTS.map((dot) => {
  const dx = dot.cx - APEX.x;
  const dy = dot.cy - APEX.y;
  const lineLeft = APEX.y + 0.57735 * dx;
  const lineRight = APEX.y - 0.57735 * dx;
  let face: Face;
  if (dot.cy < lineLeft - 2 && dot.cy < lineRight - 2) face = 'top';
  else face = dot.cx <= APEX.x ? 'left' : 'right';
  return { ...dot, face, isM: dot.r >= 3.5, dist: Math.hypot(dx, dy) };
});

export const MAX_DIST = Math.max(...SHADED_DOTS.map((d) => d.dist));
