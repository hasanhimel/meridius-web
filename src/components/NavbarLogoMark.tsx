import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { LOGO_DOTS } from '../data/logoDots';

interface NavbarLogoMarkProps {
  className?: string;
  size?: number;
}

export const NavbarLogoMark: React.FC<NavbarLogoMarkProps> = ({
  className = '',
  size = 40,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!isHovered) {
      // Reset all SVG circles to exact default vector radii
      LOGO_DOTS.forEach((dot, index) => {
        const circle = circleRefs.current[index];
        if (circle) {
          circle.setAttribute('r', dot.r.toString());
        }
      });
      return;
    }

    // Animation configuration on hover
    const originX = 259.0;
    const originY = 258.14;
    const dotsWithDist = LOGO_DOTS.map((dot) => {
      const dx = dot.cx - originX;
      const dy = dot.cy - originY;
      return {
        ...dot,
        dist: Math.sqrt(dx * dx + dy * dy),
        minR: Math.min(2.0, dot.r),
        deltaR: dot.r - Math.min(2.0, dot.r),
      };
    });

    let animId: number;
    const startTime = performance.now();
    const EXPAND_START = 0.05;
    const CYCLE_DURATION = 3.2;
    const WAVE_SPEED = 240.0;

    const smoothStep = (t: number) => {
      const clamped = Math.max(0, Math.min(1, t));
      return clamped * clamped * (3 - 2 * clamped);
    };

    const animate = (now: number) => {
      const totalElapsed = (now - startTime) / 1000;
      const cycleTime = totalElapsed % CYCLE_DURATION;

      for (let i = 0; i < dotsWithDist.length; i++) {
        const dot = dotsWithDist[i];
        const circle = circleRefs.current[i];
        if (!circle) continue;

        let currentRadius = dot.minR;

        if (cycleTime < EXPAND_START) {
          currentRadius = dot.minR;
        } else if (cycleTime < 2.0) {
          const waveFront = (cycleTime - EXPAND_START) * WAVE_SPEED;
          const distFromWave = waveFront - dot.dist;

          if (distFromWave <= 0) {
            currentRadius = dot.minR;
          } else {
            const timeSinceArrival = distFromWave / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.4);
            currentRadius = dot.minR + dot.deltaR * progress;
          }
        } else {
          const shrinkFront = (cycleTime - 2.0) * WAVE_SPEED;
          const distFromShrink = shrinkFront - dot.dist;
          if (distFromShrink <= 0) {
            currentRadius = dot.r;
          } else {
            const timeSinceArrival = distFromShrink / WAVE_SPEED;
            const progress = smoothStep(timeSinceArrival / 0.4);
            currentRadius = dot.r - dot.deltaR * progress;
          }
        }

        circle.setAttribute('r', Math.max(1.0, currentRadius).toFixed(2));
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isHovered]);

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.25 : 1,
        y: isHovered ? -1 : 0,
      }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className={`relative flex items-center justify-center cursor-pointer select-none shrink-0 text-charcoal dark:text-cream ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Pure Vector SVG - Perfectly rounded vector circles at 100% full opacity */}
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        className="w-full h-full block overflow-visible pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {LOGO_DOTS.map((dot, index) => (
          <circle
            key={index}
            ref={(el) => {
              circleRefs.current[index] = el;
            }}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="currentColor"
          />
        ))}
      </svg>
    </motion.div>
  );
};
