import React, { useState, useEffect } from 'react';
import { ArrowDown, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DynamicCompanyBrainArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [tick, setTick] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const sources = [
    {
      id: 0,
      title: 'Engineering',
      tools: 'VS Code · Git · Terminal',
      x: 105,
      y: 110,
    },
    {
      id: 1,
      title: 'Product & Design',
      tools: 'Figma · Linear · Specs',
      x: 335,
      y: 110,
    },
    {
      id: 2,
      title: 'Growth & Sales',
      tools: 'HubSpot · CRM · Analytics',
      x: 565,
      y: 110,
    },
    {
      id: 3,
      title: 'Operations & Finance',
      tools: 'Stripe · QuickBooks · Docs',
      x: 795,
      y: 110,
    },
  ];

  // Meridius Brain Circular Center
  const brainCx = 450;
  const brainCy = 290;
  const brainRadius = 46;
  const convergencePointY = brainCy - brainRadius; // 244

  // Theme-tailored stroke & glow colors
  const primaryStroke = isDark ? 'rgba(245, 245, 238, 0.85)' : 'rgba(43, 43, 42, 0.85)';
  const ambientGlowColor = isDark ? 'rgba(245, 245, 238, 0.15)' : 'rgba(43, 43, 42, 0.12)';
  const pulseColor = isDark ? '#F5F5EE' : '#2B2B2A';

  return (
    <div className={`w-full rounded-3xl frosted-glass p-6 sm:p-8 border border-charcoal/[0.12] dark:border-cream/[0.12] overflow-hidden relative ${className}`}>
      
      {/* Top Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono gap-2">
        <div className="flex items-center gap-2 text-charcoal dark:text-cream font-semibold">
          <span className="w-2 h-2 rounded-full bg-charcoal dark:bg-cream animate-ping" />
          <span>CONTINUOUS CONTEXT ACQUISITION MESH</span>
        </div>
        <div className="flex items-center gap-3 text-charcoal-muted dark:text-cream-dim text-[11px]">
          <span className="flex items-center gap-1 text-charcoal dark:text-cream font-semibold">
            <ArrowDown className="w-3.5 h-3.5" />
            4 Distributed Channels Active
          </span>
          <span>·</span>
          <span>Local Mac Keychain Auth</span>
        </div>
      </div>

      {/* SVG Canvas with Generous Spacing and Zero Text Overlap */}
      <div className="relative w-full aspect-[900/400] max-w-4xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 900 400"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Theme-Adaptive Soft Glow filter */}
            <filter id="themeGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ambient Radial Gradient matching Theme */}
            <radialGradient id="themeBrainField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={ambientGlowColor} />
              <stop offset="100%" stopColor={ambientGlowColor} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Brain Glow Field at Bottom */}
          <circle cx={brainCx} cy={brainCy} r="140" fill="url(#themeBrainField)" />

          {/* Concentric Synthesis Rings around Circular Meridius Brain */}
          <circle
            cx={brainCx}
            cy={brainCy}
            r="70"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.08] dark:text-cream/[0.08]"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx={brainCx}
            cy={brainCy}
            r="105"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.05] dark:text-cream/[0.05]"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          {/* ============================================================ */}
          {/* CURVY CONDUITS CONVERGING SMOOTHLY TO APEX POINT */}
          {/* ============================================================ */}
          {sources.map((src) => {
            const sourceBottomY = src.y + 26;

            // Soft S-curve Bézier converging into single point (brainCx, convergencePointY)
            const ctrlY1 = sourceBottomY + 55;
            const ctrlY2 = convergencePointY - 55;

            const pathD = `M ${src.x} ${sourceBottomY} C ${src.x} ${ctrlY1}, ${brainCx} ${ctrlY2}, ${brainCx} ${convergencePointY}`;

            return (
              <g key={src.id}>
                {/* Background Soft Track */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  className="text-charcoal/[0.12] dark:text-cream/[0.12]"
                  strokeWidth="1.5"
                />

                {/* Animated Streaming Pulse Stream Downward */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={primaryStroke}
                  strokeWidth="1.75"
                  strokeDasharray="10 24"
                  strokeDashoffset={tick * 2}
                  opacity="0.65"
                  filter="url(#themeGlow)"
                />

                {/* Flowing Data Energy Packet */}
                <circle r="3.5" fill={pulseColor} filter="url(#themeGlow)">
                  <animateMotion
                    path={pathD}
                    dur={`${2.2 + src.id * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* TOP TIER: 4 CIRCULAR NODES WITH DEDICATED UNOBSTRUCTED TEXT */}
          {/* ============================================================ */}
          {sources.map((src) => {
            return (
              <g key={`source-${src.id}`}>
                {/* 1. NODE TITLE - Positioned with ample vertical clearance */}
                <text
                  x={src.x}
                  y="36"
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[13px]"
                >
                  {src.title}
                </text>

                {/* 2. NODE SUB-NAME / TOOLS - Clearly separated below title */}
                <text
                  x={src.x}
                  y="54"
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9.5px]"
                >
                  {src.tools}
                </text>

                {/* 3. CIRCULAR NODE BASE (at y = 110, completely clear of text) */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="26"
                  fill="currentColor"
                  className="text-white dark:text-void"
                  stroke="currentColor"
                  strokeWidth="1.75"
                />

                {/* 4. NODE CENTER ACCENT DOT */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="11"
                  fill="currentColor"
                  className="text-charcoal dark:text-cream"
                />

                {/* 5. NODE INDEX NUMBER */}
                <text
                  x={src.x}
                  y={src.y + 3.5}
                  textAnchor="middle"
                  className="fill-cream dark:fill-charcoal font-mono font-bold text-[8.5px]"
                >
                  0{src.id + 1}
                </text>

                {/* 6. BOTTOM OUTPUT PORT */}
                <circle cx={src.x} cy={src.y + 26} r="3" fill="currentColor" className="text-charcoal dark:text-cream" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* BOTTOM TIER: CIRCULAR MERIDIUS COMPANY BRAIN HUB */}
          {/* ============================================================ */}
          <g>
            {/* Outer Pulsing Circular Aura */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r={brainRadius + 12}
              fill="none"
              stroke="currentColor"
              className="text-charcoal/30 dark:text-cream/30"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            >
              <animate
                attributeName="r"
                values={`${brainRadius + 10};${brainRadius + 16};${brainRadius + 10}`}
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core Circular Brain Body */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r={brainRadius}
              fill="currentColor"
              className="text-white dark:text-void"
              stroke="currentColor"
              strokeWidth="2"
            />

            {/* Inner Core Circle */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r="32"
              fill="currentColor"
              className="text-charcoal dark:text-cream"
              filter="url(#themeGlow)"
            />

            {/* Brain Central M Mark */}
            <text
              x={brainCx}
              y={brainCy - 2}
              textAnchor="middle"
              className="fill-cream dark:fill-charcoal font-brand font-extrabold text-[17px] select-none"
            >
              M
            </text>
            <text
              x={brainCx}
              y={brainCy + 13}
              textAnchor="middle"
              className="fill-cream/80 dark:fill-charcoal/80 font-mono text-[7.5px] font-semibold tracking-wider select-none"
            >
              BRAIN
            </text>

            {/* Brain Title Below Circle */}
            <text
              x={brainCx}
              y={brainCy + 66}
              textAnchor="middle"
              className="fill-charcoal dark:fill-cream font-display font-semibold text-[12.5px]"
            >
              Meridius Company Brain
            </text>
            <text
              x={brainCx}
              y={brainCy + 80}
              textAnchor="middle"
              className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9px]"
            >
              Continuously Acquiring & Synthesizing Context
            </text>

            {/* Single Apex Inflow Port on the Circular Perimeter */}
            <circle
              cx={brainCx}
              cy={convergencePointY}
              r="4.5"
              fill={pulseColor}
              filter="url(#themeGlow)"
            />
          </g>

        </svg>
      </div>

      {/* Unified Architecture Summary Footer */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors text-xs">
        <div className="flex items-center gap-3">
          <Shield className="w-4 h-4 text-charcoal dark:text-cream shrink-0" />
          <span className="text-charcoal-muted dark:text-cream-muted font-sans">
            Each team member's Meridius instance runs locally on macOS, synthesizing cross-functional intelligence while private credentials never leave their machine.
          </span>
        </div>

        <div className="text-[11px] font-mono text-charcoal dark:text-cream shrink-0 self-start sm:self-auto px-3.5 py-1.5 rounded-full bg-charcoal/[0.06] dark:bg-cream/[0.08] border border-charcoal/[0.08] dark:border-cream/[0.08]">
          Multiplayer Agent Mesh
        </div>
      </div>

    </div>
  );
};
