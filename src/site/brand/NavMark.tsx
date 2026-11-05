import { LogoMark } from './LogoMark';

/**
 * The brand mark on its own, no tile: white over the sky, black on a white
 * bar. Either way the dots look pressed into the surface. In white, a cool
 * shadow sits inside each dot's upper edge; in black, light catches each
 * dot's lower edge.
 */
export function NavMark({
  size = 30,
  tone = 'dark',
  ripple = false,
  flat = false,
}: {
  size?: number;
  tone?: 'light' | 'dark';
  ripple?: boolean;
  /** Crisp dots with no pressed-in shading, for busy or blurred grounds. */
  flat?: boolean;
}) {
  return (
    <span className="m-navmark" data-tone={tone} aria-hidden="true">
      <LogoMark size={size} ripple={ripple} deboss={flat ? false : tone} />
    </span>
  );
}
