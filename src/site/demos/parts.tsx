import type { CSSProperties, ReactNode } from 'react';
import { CheckIcon } from '../ui/icons';

/** A Mac window inside a demo stage. Position and size in em. */
export function Win({
  title,
  style,
  className,
  dark,
  scan,
  children,
}: {
  title?: ReactNode;
  style?: CSSProperties;
  className?: string;
  dark?: boolean;
  /** Draws Meridius's reading highlight around the window. */
  scan?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className={`d-win ${dark ? 'd-win--dark' : ''} ${className ?? ''}`} style={style} data-scan={scan}>
      <div className="d-win__bar">
        <i />
        <i />
        <i />
        {title ? <span>{title}</span> : null}
      </div>
      <div className="d-win__body">{children}</div>
    </div>
  );
}

/** A status dot: spinning while working, a tick when done. */
export function Status({ done }: { done: boolean }) {
  return (
    <span className="d-status" data-done={done}>
      {done ? <CheckIcon /> : <span className="d-spin" />}
    </span>
  );
}

/** Shows children once `on` is true, with a soft rise. */
export function Appear({ on, children, className, style }: { on: boolean; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`d-appear ${className ?? ''}`} data-on={on} style={style}>
      {children}
    </div>
  );
}
