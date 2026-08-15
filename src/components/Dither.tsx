import { Renderer, Program, Mesh, Color, Triangle } from 'ogl';
import React, { useEffect, useRef, useMemo, useCallback } from 'react';

export interface DitherProps extends React.HTMLAttributes<HTMLDivElement> {
  waveSpeed?: number;
  waveFrequency?: number;
  waveAmplitude?: number;
  waveColor?: [number, number, number] | string;
  colorNum?: number;
  pixelSize?: number;
  disableAnimation?: boolean;
  enableMouseInteraction?: boolean;
  mouseRadius?: number;
  dpr?: number;
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
varying vec2 vUv;

uniform float time;
uniform vec2 resolution;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform float enableMouseInteraction;
uniform float mouseRadius;
uniform float pixelSize;
uniform float colorNum;

const float bayerMatrix8x8[64] = float[64](
  0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
  32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
  8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
  40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
  2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
  34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
  10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
  42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

// High-Performance Smooth Liquid Wave Synthesis
float smoothWaves(vec2 p, float t) {
  float freq = waveFrequency * 0.45;
  vec2 p2 = p * freq;
  
  float v1 = sin(p2.x * 1.8 + t * 0.8 + sin(p2.y * 1.4 + t * 0.4));
  float v2 = cos(p2.y * 2.0 - t * 0.7 + cos(p2.x * 1.5 - t * 0.35));
  float v3 = sin(length(p2 * 1.2) * 1.6 - t * 0.95);
  
  return (v1 + v2 + v3 + 3.0) / 6.0;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= resolution.x / resolution.y;

  float t = time * (waveSpeed * 18.0);
  float f = smoothWaves(p, t);

  if (enableMouseInteraction > 0.5) {
    vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
    mouseNDC.x *= resolution.x / resolution.y;
    float dist = length(p - mouseNDC);
    float effect = 1.0 - smoothstep(0.0, mouseRadius * 1.2, dist);
    f += 0.35 * effect;
  }

  // 8x8 Bayer Dither calculation
  vec2 scaledCoord = floor(gl_FragCoord.xy / pixelSize);
  int x = int(mod(scaledCoord.x, 8.0));
  int y = int(mod(scaledCoord.y, 8.0));
  float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;

  float stepVal = 1.0 / (colorNum - 1.0);
  float val = f + threshold * stepVal;
  val = clamp(val - 0.15, 0.0, 1.0);
  float dithered = floor(val * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);

  // Discard 100% of unlit background pixels so background is completely transparent
  if (dithered <= 0.05) {
    discard;
  }

  // Render visible dither wave particles clearly with theme color
  gl_FragColor = vec4(waveColor, dithered);
}
`;

function parseColor(c: [number, number, number] | string): [number, number, number] {
  if (Array.isArray(c)) return c;
  let h = c.replace('#', '').trim();
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const num = parseInt(h.slice(0, 6), 16);
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

export default function Dither({
  waveSpeed = 0.04,
  waveFrequency = 5.8,
  waveAmplitude = 0.37,
  waveColor = [0.3137254901960784, 0.3137254901960784, 0.3137254901960784],
  colorNum = 4,
  pixelSize = 2.5,
  disableAnimation = false,
  enableMouseInteraction = true,
  mouseRadius = 0.3,
  dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2),
  className,
  style,
  ...rest
}: DitherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const smoothMouseRef = useRef({ x: -1000, y: -1000 });
  const rafRef = useRef<number>(0);

  const colorVec = useMemo(() => parseColor(waveColor), [waveColor]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const ctn = containerRef.current;
    if (!ctn) return;
    const rect = ctn.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: rect.height - (e.clientY - rect.top)
    };
  }, []);

  useEffect(() => {
    const ctn = containerRef.current;
    if (!ctn) return;

    const renderer = new Renderer({ dpr, alpha: true, premultipliedAlpha: false });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new Float32Array([gl.canvas.width, gl.canvas.height]) },
        waveSpeed: { value: waveSpeed },
        waveFrequency: { value: waveFrequency },
        waveAmplitude: { value: waveAmplitude },
        waveColor: { value: new Color(colorVec[0], colorVec[1], colorVec[2]) },
        mousePos: { value: new Float32Array([smoothMouseRef.current.x, smoothMouseRef.current.y]) },
        enableMouseInteraction: { value: enableMouseInteraction ? 1 : 0 },
        mouseRadius: { value: mouseRadius },
        pixelSize: { value: pixelSize },
        colorNum: { value: colorNum }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!ctn || !renderer) return;
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.resolution.value = new Float32Array([gl.canvas.width, gl.canvas.height]);
    }

    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(ctn);
    resize();

    const update = (t: number) => {
      rafRef.current = requestAnimationFrame(update);

      if (!disableAnimation) {
        program.uniforms.time.value = t * 0.001;
      }

      if (enableMouseInteraction) {
        smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.1;
        smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.1;
        program.uniforms.mousePos.value = new Float32Array([
          smoothMouseRef.current.x * dpr,
          smoothMouseRef.current.y * dpr
        ]);
      }

      renderer.render({ scene: mesh });
    };

    rafRef.current = requestAnimationFrame(update);
    ctn.appendChild(gl.canvas);

    if (enableMouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      if (enableMouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (gl.canvas.parentElement === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [
    dpr,
    disableAnimation,
    enableMouseInteraction,
    waveSpeed,
    waveFrequency,
    waveAmplitude,
    colorVec,
    colorNum,
    mouseRadius,
    pixelSize,
    handleMouseMove
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden pointer-events-none select-none ${className || ''}`}
      style={style}
      {...rest}
    />
  );
}
