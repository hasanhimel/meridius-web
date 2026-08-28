"use client";

import { motion, useSpring } from "motion/react";
import { FC, JSX, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export interface SmoothCursorProps {
  cursor?: JSX.Element;
  springConfig?: {
    damping: number;
    stiffness: number;
    mass: number;
    restDelta: number;
  };
}

// Source geometry constants from SoftwareCursorGlyphRenderer-new.swift
const SOURCE_MIN_X = 39.5;
const SOURCE_MIN_Y = -0.5;
const SOURCE_WIDTH = 375.1;
const SOURCE_HEIGHT = 452.0;

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

const DefaultCursorSVG: FC = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={17.09527}
      height={20.6}
      viewBox={`${SOURCE_MIN_X} ${SOURCE_MIN_Y} ${SOURCE_WIDTH} ${SOURCE_HEIGHT}`}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="smooth-meridius-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="1.8" stdDeviation="1.75" floodColor="#000000" floodOpacity="0.28" />
          <feDropShadow dx="0" dy="0.9" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.12" />
        </filter>
      </defs>
      <path
        d={CURSOR_SVG_PATH}
        fill="#1f1f24"
        stroke="rgba(255, 255, 255, 0.96)"
        strokeWidth="30.73"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter="url(#smooth-meridius-shadow)"
      />
    </svg>
  );
};

export function SmoothCursor({
  cursor = <DefaultCursorSVG />,
  springConfig = {
    damping: 45,
    stiffness: 400,
    mass: 1,
    restDelta: 0.001,
  },
}: SmoothCursorProps) {
  const [, setIsMoving] = useState(false);
  const lastMousePos = useRef<Position>({ x: 0, y: 0 });
  const velocity = useRef<Position>({ x: 0, y: 0 });
  const lastUpdateTime = useRef(Date.now());
  const previousAngle = useRef(0);
  const accumulatedRotation = useRef(0);

  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);
  const rotation = useSpring(0, {
    ...springConfig,
    damping: 60,
    stiffness: 300,
  });
  const scale = useSpring(1, {
    ...springConfig,
    stiffness: 500,
    damping: 35,
  });

  useEffect(() => {
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
      updateVelocity(currentPos);

      const speed = Math.sqrt(
        Math.pow(velocity.current.x, 2) + Math.pow(velocity.current.y, 2),
      );

      cursorX.set(currentPos.x);
      cursorY.set(currentPos.y);

      if (speed > 0.1) {
        const currentAngle =
          Math.atan2(velocity.current.y, velocity.current.x) * (180 / Math.PI) +
          90;

        let angleDiff = currentAngle - previousAngle.current;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        accumulatedRotation.current += angleDiff;
        rotation.set(accumulatedRotation.current);
        previousAngle.current = currentAngle;

        scale.set(0.95);
        setIsMoving(true);

        const timeout = setTimeout(() => {
          scale.set(1);
          setIsMoving(false);
        }, 150);

        return () => clearTimeout(timeout);
      }
    };

    let rafId: number;
    const throttledMouseMove = (e: MouseEvent) => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        smoothMouseMove(e);
        rafId = 0;
      });
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
      document.body.style.cursor = "auto";
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cursorX, cursorY, rotation, scale]);

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        rotate: rotation,
        scale: scale,
        zIndex: 100,
        pointerEvents: "none",
        willChange: "transform",
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
    >
      {cursor}
    </motion.div>
  );
}
