import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from '../motion';

export interface DemoProps {
  /** False while the demo is off screen: its timeline pauses. */
  playing: boolean;
  /** Called once when the scripted run finishes. */
  onDone?: () => void;
  /** 0..1 as the run plays, for the tab's progress bar. */
  onProgress?: (p: number) => void;
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Runs a demo as one GSAP timeline. `build` adds tweens and `tl.call(...)`
 * steps; the timeline pauses while `playing` is false. Under reduced motion it
 * jumps straight to the end state, so every step still lands.
 * `runKey` restarts the run when it changes.
 */
export function useDemo(build: (tl: gsap.core.Timeline) => void, { playing, onDone, onProgress }: DemoProps, runKey: unknown = 0) {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const cbs = useRef({ onDone, onProgress });
  cbs.current = { onDone, onProgress };

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      onUpdate: () => cbs.current.onProgress?.(tl.progress()),
      onComplete: () => cbs.current.onDone?.(),
    });
    build(tl);
    tlRef.current = tl;
    if (reducedMotion()) tl.progress(1, false);
    return () => {
      tl.kill();
      tlRef.current = null;
    };
    // The run is rebuilt only when runKey changes, not when build changes.
  }, [runKey]);

  useLayoutEffect(() => {
    const tl = tlRef.current;
    if (!tl || reducedMotion()) return;
    if (playing) tl.play();
    else tl.pause();
  }, [playing, runKey]);

  return tlRef;
}

/** A step counter that timelines advance with `tl.call(() => go(n))`. */
export function useStep(initial = 0) {
  const [step, setStep] = useState(initial);
  return [step, setStep] as const;
}
