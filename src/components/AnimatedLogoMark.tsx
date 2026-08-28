import React, { useEffect, useRef, useCallback } from 'react';
import { LOGO_DOTS, LogoDot } from '../data/logoDots';
import { useTheme } from '../context/ThemeContext';

interface AnimatedLogoMarkProps {
  className?: string;
  size?: number;
}

type CubeFace = 'top' | 'left' | 'right';

interface ProcessedDot extends LogoDot {
  dist: number;
  targetR: number;
  isMShape: boolean;
  face: CubeFace;
}

export const AnimatedLogoMark: React.FC<AnimatedLogoMarkProps> = ({
  className = '',
  size = 520,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  
  // Track wave animation timing - strictly null until tapped
  const waveStartTimeRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef<boolean>(false);

  const triggerWave = useCallback(() => {
    hasTriggeredRef.current = true;
    waveStartTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    const handleTap = () => {
      triggerWave();
    };

    window.addEventListener('meridius:logo-tap', handleTap);
    return () => {
      window.removeEventListener('meridius:logo-tap', handleTap);
    };
  }, [triggerWave]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;

    // Center apex of the 3D cube where the 3 faces meet
    const originX = 259.0;
    const originY = 258.14;

    // Classify all 127 exact dots into the 3 Isometric Cube Faces (Top, Left, Right)
    const dotsData: ProcessedDot[] = LOGO_DOTS.map((dot: LogoDot) => {
      const dx = dot.cx - originX;
      const dy = dot.cy - originY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const isMShape = dot.r >= 3.5; // Dots that form the bold M shape

      // Isometric 30-degree boundary lines from the central apex (259.0, 258.14)
      const lineLeft = originY + 0.57735 * (dot.cx - originX);
      const lineRight = originY - 0.57735 * (dot.cx - originX);

      let face: CubeFace = 'top';
      if (dot.cy < lineLeft - 2.0 && dot.cy < lineRight - 2.0) {
        face = 'top';
      } else if (dot.cx <= originX) {
        face = 'left';
      } else {
        face = 'right';
      }

      return {
        cx: dot.cx,
        cy: dot.cy,
        r: dot.r,
        targetR: dot.r,
        dist,
        isMShape,
        face,
      };
    });

    // Timeline Configuration (in seconds):
    // 0.0s - 2.0s: Water drop ripple expands from center -> smoothly creates the M shape
    // 2.0s - 17.0s: Consistent hold in 100% exact M shape form (15 seconds hold)
    // 17.0s - 19.5s: Wave gently shrinks from center -> returns to r = 2.0px
    // 19.5s - 20.0s: Brief baseline calm before loop repeats
    const HOLD_DURATION = 15.0; // 15s consistent hold
    const SHRINK_START = 2.0 + HOLD_DURATION; // 17.0s
    const CYCLE_DURATION = SHRINK_START + 2.7; // 19.7s
    const WAVE_SPEED = 195.0; // Pixels per second

    const isDark = resolvedTheme === 'dark';

    // 3D Cube Shading Palette for ONLY the smaller background dots:
    const getSmallDotFaceColor = (face: CubeFace) => {
      if (isDark) {
        switch (face) {
          case 'top':
            return 'rgba(245, 245, 238, 0.90)';
          case 'left':
            return 'rgba(245, 245, 238, 0.60)';
          case 'right':
            return 'rgba(245, 245, 238, 0.35)';
        }
      } else {
        switch (face) {
          case 'top':
            return 'rgba(43, 43, 42, 0.35)';
          case 'left':
            return 'rgba(43, 43, 42, 0.65)';
          case 'right':
            return 'rgba(43, 43, 42, 0.92)';
        }
      }
    };

    // Smoothstep easing for distortion-free interpolation
    const smoothStep = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * (3 - 2 * clamped);
    };

    const drawFrame = (now: number) => {
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== 512 * dpr || canvas.height !== 512 * dpr) {
        canvas.width = 512 * dpr;
        canvas.height = 512 * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, 512, 512);

      const isWaveActive = hasTriggeredRef.current && waveStartTimeRef.current !== null;
      // Guarantee non-negative totalElapsed to eliminate any clock skew flash
      const rawElapsed = isWaveActive ? (now - waveStartTimeRef.current!) / 1000 : 0;
      const totalElapsed = Math.max(0, rawElapsed);
      const cycleTime = isWaveActive ? totalElapsed % CYCLE_DURATION : 0;

      for (let i = 0; i < dotsData.length; i++) {
        const dot = dotsData[i];
        const minR = Math.min(2.0, dot.targetR);
        const deltaR = dot.targetR - minR;

        let currentRadius = minR;
        let isExpanded = false;

        if (!isWaveActive || totalElapsed <= 0) {
          // Strictly calm baseline: all dots at minR (2.0px), never bold M-shape
          currentRadius = minR;
          isExpanded = false;
        } else if (cycleTime < SHRINK_START) {
          // Stage 1: Wave expands outward from center -> scales to targetR
          const waveFront = cycleTime * WAVE_SPEED;
          const distFromWave = waveFront - dot.dist;

          if (distFromWave <= 0) {
            currentRadius = minR;
            isExpanded = false;
          } else {
            const timeSinceArrival = distFromWave / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.42);
            currentRadius = minR + deltaR * progress;
            if (progress > 0.6) isExpanded = true;
          }
        } else {
          // Stage 2: Wave shrinks from center -> returns to minR
          const shrinkWaveFront = (cycleTime - SHRINK_START) * WAVE_SPEED;
          const distFromShrinkWave = shrinkWaveFront - dot.dist;

          if (distFromShrinkWave <= 0) {
            currentRadius = dot.targetR;
            isExpanded = true;
          } else {
            const timeSinceArrival = distFromShrinkWave / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.42);
            currentRadius = dot.targetR - deltaR * progress;
            if (progress < 0.4) isExpanded = true;
          }
        }

        // Color Logic: ONLY bold primary when triggered and expanded past 3.0px
        if (isWaveActive && dot.isMShape && isExpanded && currentRadius > 3.0) {
          ctx.fillStyle = isDark ? '#f5f5ee' : '#2b2b2a'; // 100% Solid Primary
        } else {
          ctx.fillStyle = getSmallDotFaceColor(dot.face);
        }

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.cx, dot.cy, Math.max(1.0, currentRadius), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    // Draw baseline immediately synchronously on mount
    drawFrame(performance.now());

    const render = (now: number) => {
      drawFrame(now);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [resolvedTheme]);

  return (
    <div
      className={`relative flex items-center justify-center select-none cursor-pointer mx-auto w-full aspect-square ${className}`}
      style={{ maxWidth: `${size}px`, aspectRatio: '1 / 1' }}
      onClick={triggerWave}
      title="Click to trigger Meridius wave"
    >
      <canvas
        id="hero-animated-logo"
        ref={canvasRef}
        className="w-full h-full block aspect-square"
        style={{ aspectRatio: '1 / 1' }}
      />
    </div>
  );
};
