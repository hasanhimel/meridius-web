"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'motion/react';

interface Position {
  x: number;
  y: number;
}

export interface SoftwareCursorProps {
  onIntroComplete?: () => void;
  skipIntro?: boolean;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

// Exact raw Bézier path from SoftwareCursorGlyphRenderer-new.swift
// Mapped from bounding box (minX: 39.5, minY: -0.5, width: 375.1, height: 452.0)
const CURSOR_SVG_PATH =
  'M 65.5 0.9 ' +
  'C 55.0 3.6, 46.5 10.6, 42.2 19.8 ' +
  'L 39.5 421.5 ' +
  'L 42.8 428.2 ' +
  'C 51.0 445.0, 70.9 451.5, 87.6 443.0 ' +
  'L 94.4 439.5 ' +
  'L 129.2 395.5 ' +
  'C 148.4 371.3, 171.2 342.4, 180.0 331.4 ' +
  'C 191.0 317.5, 197.4 310.3, 200.7 308.1 ' +
  'C 210.1 301.8, 207.5 302.0, 295.6 302.0 ' +
  'C 378.2 302.0, 382.4 301.8, 390.1 298.0 ' +
  'C 402.2 291.8, 409.9 275.5, 407.1 261.9 ' +
  'C 404.3 248.7, 414.6 257.4, 245.5 125.8 ' +
  'C 160.8 59.9, 89.2 4.8, 86.5 3.5 ' +
  'C 81.0 0.8, 70.7 -0.5, 65.5 0.9 Z';

// Source geometry constants from SoftwareCursorGlyphRenderer-new.swift
const SOURCE_MIN_X = 39.5;
const SOURCE_MIN_Y = -0.5;
const SOURCE_WIDTH = 375.1;
const SOURCE_HEIGHT = 452.0;

// Scaled pointer size for balanced compact elegance
export const POINTER_WIDTH = 14.5;
export const POINTER_HEIGHT = 17.47;

// Traced tip (Apex) sits ~6.931% across width and ~0.31% across height
export const TIP_OFFSET_X = 0.06931 * POINTER_WIDTH; // 1.005px
export const TIP_OFFSET_Y = 0.0031 * POINTER_HEIGHT; // 0.054px

// Geometric Spine Alignment:
// Apex tip is at (65.5, 0.9), Crotch joint is at (200.7, 308.1).
// Vector from Crotch -> Apex in source space: dx = -135.2, dy = -307.2
// Spine angle = atan2(-307.2, -135.2) = -113.75936°
// Adding SPINE_OFFSET_DEG to curve tangent aligns BOTH Apex and Crotch on the curve line!
const SPINE_OFFSET_DEG = 113.75936;

// Fixed orientation angles for scrolling:
// Upward in screen space (-Y, -90°): -90° + 113.75936° = 23.75936°
// Downward in screen space (+Y, +90°): 90° + 113.75936° = 203.75936°
const SCROLL_UP_ANGLE = -90 + SPINE_OFFSET_DEG;
const SCROLL_DOWN_ANGLE = 90 + SPINE_OFFSET_DEG;

// Continuous Entry Motion Path from cursor-entry-motion.json / cursor-entry-motion.svg
const ENTRY_MOTION_PATH_D =
  'M 860 900 ' +
  'C 830 1010, 720 1165, 555 1218 ' +
  'C 390 1270, 215 1198, 190 1035 ' +
  'C 160 850, 285 735, 485 702 ' +
  'C 650 675, 805 660, 970 622 ' +
  'C 1160 578, 1360 500, 1480 390 ' +
  'C 1585 294, 1595 176, 1510 105 ' +
  'C 1415 25, 1245 45, 1125 95 ' +
  'C 980 155, 900 265, 890 380 ' +
  'C 878 510, 920 625, 1025 700 ' +
  'C 1110 762, 1215 786, 1320 785 ' +
  'C 1370 785, 1405 778, 1445 770';

// Native Meridius Software Cursor Glyph component matching SoftwareCursorGlyphRenderer-new.swift
export const MeridiusCursorGlyph: React.FC = () => {
  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        width: `${POINTER_WIDTH}px`,
        height: `${POINTER_HEIGHT}px`,
        transform: 'translateZ(0)',
        WebkitTransform: 'translateZ(0)',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
      }}
    >
      {/* Dynamic ambient fog wake matching Swift drawFog */}
      <div
        className="absolute -top-3 -left-3 w-10 h-10 rounded-full pointer-events-none opacity-25 mix-blend-screen"
        style={{
          background:
            'radial-gradient(circle, rgba(97, 92, 89, 0.35) 0%, rgba(110, 105, 102, 0.18) 50%, transparent 75%)',
          filter: 'blur(3px)',
        }}
      />

      {/* Razor-sharp Retina Vector rendering across Safari, Chrome, Firefox */}
      <svg
        viewBox={`${SOURCE_MIN_X} ${SOURCE_MIN_Y} ${SOURCE_WIDTH} ${SOURCE_HEIGHT}`}
        width={POINTER_WIDTH}
        height={POINTER_HEIGHT}
        className="w-full h-full block"
        style={{
          overflow: 'visible',
          filter: 'drop-shadow(0px 1.8px 2.2px rgba(0, 0, 0, 0.28)) drop-shadow(0px 0.8px 1px rgba(0, 0, 0, 0.12))',
          WebkitFilter: 'drop-shadow(0px 1.8px 2.2px rgba(0, 0, 0, 0.28)) drop-shadow(0px 0.8px 1px rgba(0, 0, 0, 0.12))',
          shapeRendering: 'geometricPrecision',
        }}
      >
        <path
          d={CURSOR_SVG_PATH}
          fill="#1f1f24"
          stroke="rgba(255, 255, 255, 0.96)"
          strokeWidth="30.73"
          strokeLinejoin="round"
          strokeLinecap="round"
          shapeRendering="geometricPrecision"
          className="dark:fill-[#141416] dark:stroke-[#ffffff]"
        />
      </svg>
    </div>
  );
};

export const SoftwareCursor: React.FC<SoftwareCursorProps> = ({
  onIntroComplete,
  skipIntro = false,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isAdminPath = typeof window !== 'undefined' && window.location.pathname.toLowerCase().startsWith('/admin');
  const shouldSkipIntro = skipIntro || isAdminPath;

  // Motion springs matching SmoothCursor physics for user interaction
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 55,
    stiffness: 320,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 480,
    damping: 35,
  });

  // State refs for physics calculations
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);
  const isIntroActiveRef = useRef(!shouldSkipIntro);
  const hasTappedLogoRef = useRef(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastScrollY = useRef(0);
  const hasInitializedPosRef = useRef(false);

  // Check touch capabilities
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
  }, []);

  // Update intro state if route changes
  useEffect(() => {
    if (shouldSkipIntro) {
      isIntroActiveRef.current = false;
    }
  }, [shouldSkipIntro]);

  // Helper to rotate to any target angle via the shortest rotation arc
  const rotateToAngle = useCallback(
    (targetAngle: number) => {
      let angleDiff = targetAngle - previousAngle.current;
      while (angleDiff > 180) angleDiff -= 360;
      while (angleDiff < -180) angleDiff += 360;
      accumulatedRotation.current += angleDiff;
      rotation.set(accumulatedRotation.current);
      previousAngle.current = targetAngle;
    },
    [rotation]
  );

  // Helper to locate hero logo middle dot
  const getHeroLogoTargetPos = useCallback((): Position => {
    const heroCanvas = document.getElementById('hero-animated-logo') as HTMLCanvasElement | null;
    if (heroCanvas) {
      const rect = heroCanvas.getBoundingClientRect();
      return {
        x: rect.left + (259.0 / 512.0) * rect.width,
        y: rect.top + (258.14 / 512.0) * rect.height,
      };
    }
    return {
      x: window.innerWidth * 0.72,
      y: window.innerHeight * 0.46,
    };
  }, []);

  // 1. INTRO FLIGHT ANIMATION ALONG EXACT SVG PATH (Collinear Apex & Crotch Alignment)
  // Only runs on main visitor pages (skipped on /admin)
  useEffect(() => {
    if (isTouchDevice || shouldSkipIntro) return;

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', ENTRY_MOTION_PATH_D);
    const totalLength = pathElement.getTotalLength();

    const ENTRY_DURATION = 4200; // 4.2 seconds smooth flight matching cursor-entry-motion-demo.html
    let animId: number;
    let startTime: number | null = null;

    // Ease-in-out function matching cursor-entry-motion-demo.html
    const easeInOut = (t: number) => {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    };

    const initialPos = pathElement.getPointAtLength(0);
    const initScaleX = window.innerWidth / 2047;
    const initScaleY = window.innerHeight / 1535;
    cursorX.jump(initialPos.x * initScaleX);
    cursorY.jump(initialPos.y * initScaleY);
    lastMousePos.current = { x: initialPos.x * initScaleX, y: initialPos.y * initScaleY };

    const animateEntry = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / ENTRY_DURATION);
      const easedProgress = easeInOut(rawProgress);

      const currentDistance = easedProgress * totalLength;
      const pt = pathElement.getPointAtLength(currentDistance);
      const ptNext = pathElement.getPointAtLength(Math.min(totalLength, currentDistance + 2));

      const scaleX = window.innerWidth / 2047;
      const scaleY = window.innerHeight / 1535;
      const targetLogo = getHeroLogoTargetPos();

      const endRawX = 1445 * scaleX;
      const endRawY = 770 * scaleY;
      const deltaX = targetLogo.x - endRawX;
      const deltaY = targetLogo.y - endRawY;

      // Screen mapped coordinates converging smoothly on the logo middle dot
      const posX = pt.x * scaleX + easedProgress * deltaX;
      const posY = pt.y * scaleY + easedProgress * deltaY;

      // Direct zero-lag position update during flight
      cursorX.jump(posX);
      cursorY.jump(posY);

      // Tangent velocity heading along the entry motion curve
      const tangentDx = (ptNext.x - pt.x) * scaleX;
      const tangentDy = (ptNext.y - pt.y) * scaleY;
      const speed = Math.sqrt(tangentDx * tangentDx + tangentDy * tangentDy);

      if (speed > 0.005) {
        // Collinear Alignment: Both the Apex Tip and the Crotch Joint lie on the motion curve line
        const tangentAngle = Math.atan2(tangentDy, tangentDx) * (180 / Math.PI);
        const currentAngle = tangentAngle + SPINE_OFFSET_DEG;
        rotateToAngle(currentAngle);
        scale.set(0.96);
      }

      if (rawProgress < 1 && isIntroActiveRef.current) {
        animId = requestAnimationFrame(animateEntry);
      } else {
        // Arrived visually and physically at the middle dot of the big animated logo!
        cursorX.jump(targetLogo.x);
        cursorY.jump(targetLogo.y);
        scale.set(1);

        // ONLY trigger the logo wave propagation at the exact moment the cursor taps the middle dot
        if (!hasTappedLogoRef.current) {
          hasTappedLogoRef.current = true;
          window.dispatchEvent(new CustomEvent('meridius:logo-tap'));
        }

        isIntroActiveRef.current = false;
        if (onIntroComplete) onIntroComplete();
      }
    };

    animId = requestAnimationFrame(animateEntry);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isTouchDevice, shouldSkipIntro, cursorX, cursorY, scale, getHeroLogoTargetPos, onIntroComplete, rotateToAngle]);

  // 2. INTERACTIVE VISITOR & ADMIN CURSOR TRACKING WITH UI ELEMENT & SCROLL AWARENESS
  useEffect(() => {
    if (isTouchDevice) return;

    lastScrollY.current = window.scrollY;

    const updateVelocity = (currentPos: Position) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTime.current;

      if (deltaTime > 0) {
        velocity.current = {
          x: (currentPos.x - lastMousePos.current.x) / deltaTime,
          y: (currentPos.y - lastMousePos.current.y) / deltaTime,
        };
      }

      lastUpdateTime.current = currentTime;
      lastMousePos.current = currentPos;
    };

    const smoothMouseMove = (e: MouseEvent) => {
      const currentPos = { x: e.clientX, y: e.clientY };

      // Initialize cursor position on first mouse movement (especially for admin without intro flight)
      if (!hasInitializedPosRef.current && (shouldSkipIntro || !isIntroActiveRef.current)) {
        cursorX.jump(currentPos.x);
        cursorY.jump(currentPos.y);
        lastMousePos.current = currentPos;
        hasInitializedPosRef.current = true;
      }

      // Update velocity and track mouse position
      updateVelocity(currentPos);

      // Take control of position when intro is completed or skipped
      if (!isIntroActiveRef.current || shouldSkipIntro) {
        const speed = Math.sqrt(
          Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2)
        );

        cursorX.set(currentPos.x);
        cursorY.set(currentPos.y);

        // If not actively scrolling, handle UI element interaction and movement orientation
        if (!isScrollingRef.current) {
          // Check for UI Element Awareness under the cursor
          const el = document.elementFromPoint(currentPos.x, currentPos.y);
          const interactiveEl = el?.closest(
            'button, a, input, textarea, select, [role="button"], [role="tab"], .frosted-glass-pill, .cursor-btn-primary, .cursor-pointer, [data-interactive], form'
          ) as HTMLElement | null;

          if (interactiveEl) {
            // UI Element Aware: calculate direction to center of the hovered interactive element
            const rect = interactiveEl.getBoundingClientRect();
            const targetCenterX = rect.left + rect.width / 2;
            const targetCenterY = rect.top + rect.height / 2;
            const dx = targetCenterX - currentPos.x;
            const dy = targetCenterY - currentPos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist > 2) {
              const elementAngle = Math.atan2(dy, dx) * (180 / Math.PI) + SPINE_OFFSET_DEG;
              rotateToAngle(elementAngle);
            }

            // Magnetic scale awareness
            const isTextInput =
              interactiveEl.tagName === 'INPUT' ||
              interactiveEl.tagName === 'TEXTAREA';
            scale.set(isTextInput ? 0.92 : 1.16);
          } else if (speed > 0.1) {
            // Normal flight velocity orientation
            const currentAngle =
              Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
              SPINE_OFFSET_DEG;
            rotateToAngle(currentAngle);
            scale.set(0.95);

            const timeout = setTimeout(() => {
              scale.set(1);
            }, 150);

            return () => clearTimeout(timeout);
          }
        }
      }
    };

    // SCROLLING AWARENESS: Apex pointer points strictly UP when scrolling up, DOWN when scrolling down
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 1) return;

      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      if (e.deltaY > 0) {
        // Scrolling downward -> apex points downward
        rotateToAngle(SCROLL_DOWN_ANGLE);
        scale.set(1.08);
      } else {
        // Scrolling upward -> apex points upward
        rotateToAngle(SCROLL_UP_ANGLE);
        scale.set(1.08);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        scale.set(1);
      }, 200);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      lastScrollY.current = currentScrollY;

      if (Math.abs(delta) < 2) return;

      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      if (delta > 0) {
        // Scrolling downward -> apex points downward
        rotateToAngle(SCROLL_DOWN_ANGLE);
        scale.set(1.08);
      } else {
        // Scrolling upward -> apex points upward
        rotateToAngle(SCROLL_UP_ANGLE);
        scale.set(1.08);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
        scale.set(1);
      }, 200);
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    const handleMouseDown = () => {
      scale.set(0.85); // Crisp tactile click depression
    };

    const handleMouseUp = () => {
      scale.set(1);
    };

    document.body.style.cursor = 'none';
    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scroll', handleScroll);
      document.body.style.cursor = 'auto';
      if (rafId) cancelAnimationFrame(rafId);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [isTouchDevice, shouldSkipIntro, cursorX, cursorY, scale, rotateToAngle]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <motion.div
      style={{
        position: 'fixed',
        left: cursorX,
        top: cursorY,
        translateX: `-${TIP_OFFSET_X}px`,
        translateY: `-${TIP_OFFSET_Y}px`,
        transformOrigin: `${TIP_OFFSET_X}px ${TIP_OFFSET_Y}px`,
        rotate: rotation,
        scale: scale,
        zIndex: 999999,
        pointerEvents: 'none',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        transformStyle: 'preserve-3d',
        WebkitTransformStyle: 'preserve-3d',
      }}
    >
      <MeridiusCursorGlyph />
    </motion.div>
  );
};
