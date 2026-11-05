/**
 * The MERIDIUS wordmark, set in the geometric lettering of Cursor's wordmark
 * (cursor.com/brand): R, U and S are its letterforms; E (its C plus a bar),
 * I (its stem), D (its stem and O curve) and M (two arches sharing a stem)
 * are built from the same parts. 278.8 units tall; fill is currentColor.
 */

const U = 'M275.75,4.61h56.07v164.76c0,41.09,18.82,60.3,62.99,60.3s62.99-19.2,62.99-60.3V4.61h56.07v176.28c0,59.91-38.02,97.94-119.06,97.94s-119.06-38.41-119.06-98.32V4.61Z';
const C = 'M139.03,4.61h90.64v49.93h-87.57c-47.24,0-84.11,27.27-84.11,84.88s36.87,84.88,84.11,84.88h87.57v49.93h-94.48c-79.12,0-135.19-46.48-135.19-134.82S59.91,4.61,139.03,4.61Z';
const R =
  'M806.9,81.04c0,29.96-17.28,53-40.33,62.99v.77c24.2,3.46,36.49,20.74,36.87,44.17l1.15,85.26h-56.07l-1.15-76.04c-.38-16.9-10.37-27.27-30.34-27.27h-93.33v103.31h-56.07V4.61h154.78c50.7,0,84.49,25.73,84.49,76.43h0ZM750.45,88.72c0-23.04-12.29-35.72-35.33-35.72h-91.41v71.43h92.17c21.12,0,34.57-12.67,34.57-35.72h0Z';
const S =
  'M1018.9,195.49c0-19.2-12.29-27.27-30.72-28.8l-62.22-5.76c-53.77-4.99-81.81-26.12-81.81-77.2S878.72,4.61,928.26,4.61h137.49v48.39h-133.65c-19.2,0-31.49,9.99-31.49,29.19s12.67,28.42,31.88,29.96l63.37,5.38c48.01,4.22,79.5,26.12,79.5,77.58s-33.41,79.12-80.65,79.12h-143.64v-48.39h138.26c18.05,0,29.57-12.29,29.57-30.34h0Z';
/* D narrowed to U's 238-unit width, keeping the 56.07 stem and 49.93 bar. */
const D = 'M0,4.61H110C190,4.61 238,58 238,139.42S190,274.23 110,274.23H0ZM56.07,54.54V224.3H106C152,224.3 182,193 182,139.42S152,54.54 106,54.54Z';

/* M: two narrow arches sharing the middle stem, so it reads about 1.4 times
   a regular letter instead of nearly twice. Same stem and bar weights as U. */
const STEM = 56.07;
const BAR = 49.93;
const BASE = 274.23;
function arch(x: number, w: number) {
  const rx = w / 2;
  const ry = rx * 0.85;
  const irx = rx - STEM;
  const iry = ry - BAR;
  const k = 0.5523;
  const cx = x + rx;
  const top = 0;
  return [
    `M${x},${BASE}V${top + ry}`,
    `C${x},${top + ry * (1 - k)} ${cx - rx * k},${top} ${cx},${top}`,
    `C${cx + rx * k},${top} ${x + w},${top + ry * (1 - k)} ${x + w},${top + ry}`,
    `V${BASE}H${x + w - STEM}V${top + ry}`,
    `C${x + w - STEM},${top + ry - iry * k} ${cx + irx * k},${top + BAR} ${cx},${top + BAR}`,
    `C${cx - irx * k},${top + BAR} ${x + STEM},${top + ry - iry * k} ${x + STEM},${top + ry}`,
    `V${BASE}Z`,
  ].join('');
}
const ARCH = 193;
const M = arch(0, ARCH) + arch(ARCH - STEM, ARCH);
const I = 'M0,4.61h56.07v269.62H0Z';

/* Left edge of each letter, with Cursor's ~46-unit spacing. Widths: M 330,
   E 230, R 239, I 56, D 238, U 238, S 222. */
const X = { M: 0, E: 376, R: 651.67, I1: 936.94, D: 1039.01, I2: 1323.01, U: 1425.08, S: 1709.2 };
const WIDTH = 1930.8;
const HEIGHT = 278.84;

export function Wordmark({ height = 16, className, title }: { height?: number; className?: string; title?: string }) {
  return (
    <svg
      className={className}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      height={height}
      width={(height * WIDTH) / HEIGHT}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <path d={M} transform={`translate(${X.M} 0)`} />
      {/* E: C with a middle bar */}
      <g transform={`translate(${X.E} 0)`}>
        <path d={C} />
        <rect x="40" y="114.5" width="165" height="49.93" />
      </g>
      <path d={R} transform={`translate(${X.R - 567.63} 0)`} />
      <path d={I} transform={`translate(${X.I1} 0)`} />
      <path d={D} transform={`translate(${X.D} 0)`} fillRule="evenodd" />
      <path d={I} transform={`translate(${X.I2} 0)`} />
      <path d={U} transform={`translate(${X.U - 275.75} 0)`} />
      <path d={S} transform={`translate(${X.S - 844.15} 0)`} />
    </svg>
  );
}
