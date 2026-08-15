import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowDown } from 'lucide-react';

export const DynamicCompanyBrainArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeSource, setActiveSource] = useState<number>(0);
  const [tick, setTick] = useState(0);

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
      x: 120,
      y: 50,
      targetX: 335,
      targetY: 316,
      stream: 'Code commits, test logs & PR context',
      detail: 'Local Mac instance indexes active codebase commits and build outputs without exposing private repository write keys.',
    },
    {
      id: 1,
      title: 'Product & Design',
      tools: 'Figma · Linear',
      x: 310,
      y: 50,
      targetX: 375,
      targetY: 304,
      stream: 'Live specs, roadmaps & canvas components',
      detail: 'Synthesizes active project tickets with design systems and user journey flows across teammates in real-time.',
    },
    {
      id: 2,
      title: 'Growth & Sales',
      tools: 'HubSpot · CRM',
      x: 490,
      y: 50,
      targetX: 425,
      targetY: 304,
      stream: 'Customer signals & pipeline updates',
      detail: 'Extracts customer engagement data and pipeline changes directly from authenticated browser sessions.',
    },
    {
      id: 3,
      title: 'Operations & Finance',
      tools: 'Stripe · QuickBooks',
      x: 680,
      y: 50,
      targetX: 465,
      targetY: 316,
      stream: 'Invoices, payroll & billing events',
      detail: 'Reconciles payment schedules and vendor invoices locally on Mac with zero cloud token exposure.',
    },
  ];

  // Meridius Brain Circular Center
  const brainCx = 400;
  const brainCy = 350;
  const brainRadius = 48;

  return (
    <div className={`w-full rounded-3xl frosted-glass p-6 sm:p-8 border border-charcoal/[0.12] dark:border-cream/[0.12] overflow-hidden relative ${className}`}>
      
      {/* Top Telemetry Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono gap-2">
        <div className="flex items-center gap-2 text-charcoal dark:text-cream font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>CONTINUOUS CONTEXT ACQUISITION MESH</span>
        </div>
        <div className="flex items-center gap-3 text-charcoal-muted dark:text-cream-dim text-[11px]">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <ArrowDown className="w-3.5 h-3.5" />
            4 Distributed Circular Nodes Active
          </span>
          <span>·</span>
          <span>Local Mac Keychain Auth</span>
        </div>
      </div>

      {/* SVG Canvas with Circular Nodes and Soft Curvy Conduits */}
      <div className="relative w-full aspect-[800/440] max-w-4xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Glowing filter */}
            <filter id="circleGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ambient Radial Gradient at Bottom Brain */}
            <radialGradient id="brainField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Brain Glow Field at Bottom */}
          <circle cx={brainCx} cy={brainCy} r="160" fill="url(#brainField)" />

          {/* Concentric Synthesis Rings around Circular Meridius Brain */}
          <circle
            cx={brainCx}
            cy={brainCy}
            r="80"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.06] dark:text-cream/[0.06]"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx={brainCx}
            cy={brainCy}
            r="120"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.04] dark:text-cream/[0.04]"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          {/* ============================================================ */}
          {/* CURVY CONDUITS CONNECTING CIRCULAR NODES */}
          {/* ============================================================ */}
          {sources.map((src) => {
            const isCurrent = activeSource === src.id;
            const sourceBottomY = src.y + 30;

            // Soft S-curve Bézier to separate targetX/targetY port on Circular Meridius Node
            const ctrlY1 = sourceBottomY + 90;
            const ctrlY2 = src.targetY - 80;

            const pathD = `M ${src.x} ${sourceBottomY} C ${src.x} ${ctrlY1}, ${src.targetX} ${ctrlY2}, ${src.targetX} ${src.targetY}`;

            return (
              <g key={src.id}>
                {/* Background Soft Track */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  className={isCurrent ? "text-emerald-500/40" : "text-charcoal/[0.12] dark:text-cream/[0.12]"}
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                />

                {/* Animated Streaming Pulse Stream Downward */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                  strokeDasharray="10 24"
                  strokeDashoffset={tick * 2}
                  opacity={isCurrent ? "0.9" : "0.4"}
                  filter="url(#circleGlow)"
                />

                {/* Flowing Data Energy Packet */}
                <circle r="4" fill="#10b981" filter="url(#circleGlow)">
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
          {/* TOP TIER: 4 CIRCULAR DEPARTMENT NODES */}
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
                {/* Outer Ring on Active */}
                {isCurrent && (
                  <circle
                    cx={src.x}
                    cy={src.y}
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                )}

                {/* Circular Node Base */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="30"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500/20" : "text-white dark:text-void"}
                  stroke={isCurrent ? "#10b981" : "currentColor"}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                />

                {/* Node Center Dot */}
                <circle
                  cx={src.x}
                  cy={src.y}
                  r="12"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500" : "text-charcoal dark:text-cream"}
                />

                {/* Node Index Number inside center */}
                <text
                  x={src.x}
                  y={src.y + 4}
                  textAnchor="middle"
                  className={isCurrent ? "fill-white dark:fill-void font-mono font-bold text-[9px]" : "fill-cream dark:fill-charcoal font-mono font-bold text-[9px]"}
                >
                  0{src.id + 1}
                </text>

                {/* Node Titles Below Circle */}
                <text
                  x={src.x}
                  y={src.y + 50}
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[11.5px]"
                >
                  {src.title}
                </text>
                <text
                  x={src.x}
                  y={src.y + 64}
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9px]"
                >
                  {src.tools}
                </text>

                {/* Bottom Source Output Port */}
                <circle cx={src.x} cy={src.y + 30} r="3.5" fill={isCurrent ? "#10b981" : "currentColor"} className="text-charcoal-dim dark:text-cream-dim" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* BOTTOM TIER: CIRCULAR MERIDIUS COMPANY BRAIN HUB */}
          {/* ============================================================ */}
          <g className="cursor-pointer">
            {/* Outer Pulsing Circular Aura */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r={brainRadius + 14}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="58;64;58"
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
              strokeWidth="2.5"
            />

            {/* Inner Core Circle */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r="34"
              fill="currentColor"
              className="text-charcoal dark:text-cream"
              filter="url(#circleGlow)"
            />

            {/* Brain Central M Mark */}
            <text
              x={brainCx}
              y={brainCy - 2}
              textAnchor="middle"
              className="fill-cream dark:fill-charcoal font-brand font-extrabold text-[18px] select-none"
            >
              M
            </text>
            <text
              x={brainCx}
              y={brainCy + 14}
              textAnchor="middle"
              className="fill-cream/80 dark:fill-charcoal/80 font-mono text-[8px] font-semibold tracking-wider select-none"
            >
              BRAIN
            </text>

            {/* Brain Title Below Circle */}
            <text
              x={brainCx}
              y={brainCy + 72}
              textAnchor="middle"
              className="fill-charcoal dark:fill-cream font-display font-semibold text-[13px]"
            >
              Meridius Company Brain
            </text>
            <text
              x={brainCx}
              y={brainCy + 86}
              textAnchor="middle"
              className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[9.5px] font-semibold"
            >
              ● Continuously Acquiring & Synthesizing Context
            </text>

            {/* 4 Distinct Top Inflow Ports on the Circular Perimeter */}
            {sources.map((src) => {
              const isCurrent = activeSource === src.id;
              return (
                <circle
                  key={`port-${src.id}`}
                  cx={src.targetX}
                  cy={src.targetY}
                  r="4"
                  fill={isCurrent ? "#10b981" : "currentColor"}
                  className={isCurrent ? "" : "text-charcoal-dim dark:text-cream-dim"}
                  filter="url(#circleGlow)"
                />
              );
            })}
          </g>

        </svg>
      </div>

      {/* Interactive Context Inspector Bar */}
      <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 border border-emerald-500/20">
            0{sources[activeSource].id + 1}
          </div>
          <div>
            <div className="font-display font-semibold text-xs sm:text-sm text-charcoal dark:text-cream">
              {sources[activeSource].title} Stream · <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-normal">{sources[activeSource].stream}</span>
            </div>
            <div className="text-xs text-charcoal-muted dark:text-cream-muted font-sans mt-0.5 max-w-xl">
              {sources[activeSource].detail}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shrink-0 self-start sm:self-auto px-3.5 py-2 rounded-full bg-emerald-500/10">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Local Context Synthesized</span>
        </div>
      </div>

    </div>
  );
};
