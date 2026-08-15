import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    const startTime = performance.now();

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
    // 0.0s - 0.5s: Initial calm baseline (all dots small at r = 2.0px)
    // 0.5s - 2.8s: Wave 1 expands from center -> smoothly reveals M shape
    // 2.8s - 4.4s: Hold in 100% exact original vector logo form
    // 4.4s - 6.4s: Wave 2 shrinks from center -> smoothly returns to r = 2.0px
    // 6.4s - 6.8s: Baseline calm before loop repeats
    const CYCLE_DURATION = 6.8;
    const EXPAND_START = 0.5;
    const SHRINK_START = 4.4;
    const WAVE_SPEED = 190.0; // Pixels per second

    const isDark = resolvedTheme === 'dark';

    // 3D Cube Shading Palette for ONLY the smaller background dots:
    // Top face is illuminated from above, Left is mid-tone, Right is shadow
    const getSmallDotFaceColor = (face: CubeFace) => {
      if (isDark) {
        switch (face) {
          case 'top':
            return 'rgba(245, 245, 238, 0.90)'; // Top face: brightest cream variant
          case 'left':
            return 'rgba(245, 245, 238, 0.60)'; // Left face: mid-tone cream variant
          case 'right':
            return 'rgba(245, 245, 238, 0.35)'; // Right face: shadow cream variant
        }
      } else {
        switch (face) {
          case 'top':
            return 'rgba(43, 43, 42, 0.35)'; // Top face: light charcoal variant
          case 'left':
            return 'rgba(43, 43, 42, 0.65)'; // Left face: mid-tone charcoal variant
          case 'right':
            return 'rgba(43, 43, 42, 0.92)'; // Right face: dark charcoal variant
        }
      }
    };

    // Smoothstep easing for distortion-free interpolation
    const smoothStep = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * (3 - 2 * clamped);
    };

    const render = (now: number) => {
      const totalElapsed = (now - startTime) / 1000;
      const cycleTime = totalElapsed % CYCLE_DURATION;
      const dpr = window.devicePixelRatio || 1;

      if (canvas.width !== 512 * dpr || canvas.height !== 512 * dpr) {
        canvas.width = 512 * dpr;
        canvas.height = 512 * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, 512, 512);

      for (let i = 0; i < dotsData.length; i++) {
        const dot = dotsData[i];
        const minR = Math.min(2.0, dot.targetR);
        const deltaR = dot.targetR - minR;

        let currentRadius = minR;
        let isExpanded = false;

        if (cycleTime < EXPAND_START) {
          // Stage 1: Uniform small baseline
          currentRadius = minR;
        } else if (cycleTime >= EXPAND_START && cycleTime < SHRINK_START) {
          // Stage 2: Wave 1 expands from center -> scales to exact targetR
          const waveFront = (cycleTime - EXPAND_START) * WAVE_SPEED;
          const distFromWave = waveFront - dot.dist;

          if (distFromWave <= 0) {
            currentRadius = minR;
          } else {
            const timeSinceArrival = distFromWave / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.45);
            currentRadius = minR + deltaR * progress;
            if (progress > 0.6) isExpanded = true;
          }
        } else {
          // Stage 3: Wave 2 shrinks from center -> returns to minR
          const shrinkWaveFront = (cycleTime - SHRINK_START) * WAVE_SPEED;
          const distFromShrinkWave = shrinkWaveFront - dot.dist;

          if (distFromShrinkWave <= 0) {
            // Holds full size until shrink wave arrives
            currentRadius = dot.targetR;
            isExpanded = true;
          } else {
            const timeSinceArrival = distFromShrinkWave / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.45);
            currentRadius = dot.targetR - deltaR * progress;
            if (progress < 0.4) isExpanded = true;
          }
        }

        // Color Logic:
        // - Bigger dots forming the M shape: ALWAYS 100% full opacity main solid color
        // - ONLY smaller dots: 3 different variants of the theme color matching the 3 cube sides
        if (dot.isMShape && isExpanded && currentRadius > 3.0) {
          ctx.fillStyle = isDark ? '#f5f5ee' : '#2b2b2a'; // 100% Solid Primary
        } else {
          ctx.fillStyle = getSmallDotFaceColor(dot.face); // 3-face cube shading variants
        }

        // Draw dot with 100% exact coordinate
        ctx.beginPath();
        ctx.arc(dot.cx, dot.cy, Math.max(1.0, currentRadius), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [resolvedTheme]);

  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-none mx-auto w-full aspect-square ${className}`}
      style={{ maxWidth: `${size}px`, aspectRatio: '1 / 1' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none aspect-square"
        style={{ aspectRatio: '1 / 1' }}
      />
    </div>
  );
};
