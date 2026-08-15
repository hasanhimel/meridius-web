import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const DynamicCompanyBrainArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeSource, setActiveSource] = useState<number>(0);
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
      tools: 'VS Code · Git',
      x: 75,
      y: 75,
      stream: 'Code commits, test logs & PR context',
      detail: 'Local Mac instance indexes active codebase commits and build outputs without exposing private repository write keys.',
    },
    {
      id: 1,
      title: 'Product & Design',
      tools: 'Figma · Linear',
      x: 290,
      y: 75,
      stream: 'Live specs, roadmaps & canvas components',
      detail: 'Synthesizes active project tickets with design systems and user journey flows across teammates in real-time.',
    },
    {
      id: 2,
      title: 'Growth & Sales',
      tools: 'HubSpot · CRM',
      x: 570,
      y: 75,
      stream: 'Customer signals & pipeline updates',
      detail: 'Extracts customer engagement data and pipeline changes directly from authenticated browser sessions.',
    },
    {
      id: 3,
      title: 'Operations & Finance',
      tools: 'Stripe · QuickBooks',
      x: 785,
      y: 75,
      stream: 'Invoices, payroll & billing events',
      detail: 'Reconciles payment schedules and vendor invoices locally on Mac with zero cloud token exposure.',
    },
  ];

  // Meridius Brain Circular Center (closer vertically)
  const brainCx = 430;
  const brainCy = 270;
  const brainRadius = 46;
  const convergencePointY = brainCy - brainRadius; // 224

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
            4 Distributed Channels
          </span>
          <span>·</span>
          <span>Local Mac Keychain Auth</span>
        </div>
      </div>

      {/* SVG Canvas with Wider Spread and Closer Meridius Node */}
      <div className="relative w-full aspect-[860/380] max-w-4xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 860 380"
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
          {/* CURVY CONDUITS CONVERGING TO ONE POINT */}
          {/* ============================================================ */}
          {sources.map((src) => {
            const isCurrent = activeSource === src.id;
            const sourceBottomY = src.y + 28;

            // Soft S-curve Bézier converging into single point (brainCx, convergencePointY)
            const ctrlY1 = sourceBottomY + 60;
            const ctrlY2 = convergencePointY - 60;

            const pathD = `M ${src.x} ${sourceBottomY} C ${src.x} ${ctrlY1}, ${brainCx} ${ctrlY2}, ${brainCx} ${convergencePointY}`;

            return (
              <g key={src.id}>
                {/* Background Soft Track */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  className={isCurrent ? "text-charcoal/40 dark:text-cream/40" : "text-charcoal/[0.12] dark:text-cream/[0.12]"}
                  strokeWidth={isCurrent ? "2" : "1.25"}
                />

                {/* Animated Streaming Pulse Stream Downward in Theme Color */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={primaryStroke}
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                  strokeDasharray="10 24"
                  strokeDashoffset={tick * 2}
                  opacity={isCurrent ? "0.95" : "0.45"}
                  filter="url(#themeGlow)"
                />

                {/* Flowing Data Energy Packet in Theme Color */}
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
          {/* TOP TIER: 4 CIRCULAR NODES WITH NAMES AT THE TOP */}
          {/* ============================================================ */}
          {sources.map((src) => {
            const isCurrent = activeSource === src.id;
            return (
              <g
                key={`source-${src.id}`}
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => setActiveSource(src.id)}
                onMouseEnter={() => setActiveSource(src.id)}
              >
                {/* 1. NODE NAMES & TOOLS LOCATED AT THE TOP */}
                <text
                  x={src.x}
                  y={src.y - 36}
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[12px]"
                >
                  {src.title}
                </text>
                <text
                  x={src.x}
                  y={src.y - 22}
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9px]"
                >
                  {src.tools}
                </text>

                {/* 2. OUTER ACTIVE RING */}
                {isCurrent && (
                  <circle
                    cx={src.x}
                    cy={src.y}
                    r="34"
                    fill="none"
                    stroke="currentColor"
                    className="text-charcoal/60 dark:text-cream/60"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                )}

                {/* 3. CIRCULAR NODE BASE */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="26"
                  fill="currentColor"
                  className={isCurrent ? "text-charcoal/10 dark:text-cream/10" : "text-white dark:text-void"}
                  stroke="currentColor"
                  strokeWidth="1.75"
                />

                {/* 4. NODE CENTER DOT */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="11"
                  fill="currentColor"
                  className={isCurrent ? "text-charcoal dark:text-cream" : "text-charcoal/80 dark:text-cream/80"}
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
          {/* BOTTOM TIER: CIRCULAR MERIDIUS COMPANY BRAIN HUB (CLOSER) */}
          {/* ============================================================ */}
          <g className="cursor-pointer">
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

      {/* Interactive Context Inspector Bar */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-charcoal/10 dark:bg-cream/10 text-charcoal dark:text-cream flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-charcoal/20 dark:border-cream/20">
            0{sources[activeSource].id + 1}
          </div>
          <div>
            <div className="font-display font-semibold text-xs sm:text-sm text-charcoal dark:text-cream">
              {sources[activeSource].title} Stream · <span className="font-mono text-xs text-charcoal-muted dark:text-cream-dim font-normal">{sources[activeSource].stream}</span>
            </div>
            <div className="text-xs text-charcoal-muted dark:text-cream-muted font-sans mt-0.5 max-w-xl">
              {sources[activeSource].detail}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-charcoal dark:text-cream flex items-center gap-1.5 shrink-0 self-start sm:self-auto px-3.5 py-2 rounded-full bg-charcoal/[0.06] dark:bg-cream/[0.08] border border-charcoal/[0.08] dark:border-cream/[0.08]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Local Context Synthesized</span>
        </div>
      </div>

    </div>
  );
};
