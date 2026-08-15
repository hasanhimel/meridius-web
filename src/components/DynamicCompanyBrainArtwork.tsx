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
      tools: 'VS Code · Git · Terminal',
      x: 120,
      y: 45,
      stream: 'Code commits, test logs & PR context',
      detail: 'Local Mac instance indexes active codebase commits and build outputs without exposing private repository write keys.',
    },
    {
      id: 1,
      title: 'Product & Design',
      tools: 'Figma · Linear · Notion',
      x: 310,
      y: 45,
      stream: 'Live specs, roadmaps & canvas components',
      detail: 'Synthesizes active project tickets with design systems and user journey flows across teammates in real-time.',
    },
    {
      id: 2,
      title: 'Growth & Sales',
      tools: 'HubSpot · Analytics · CRM',
      x: 490,
      y: 45,
      stream: 'Customer signals & pipeline updates',
      detail: 'Extracts customer engagement data and pipeline changes directly from authenticated browser sessions.',
    },
    {
      id: 3,
      title: 'Operations & Finance',
      tools: 'Stripe · QuickBooks · Docs',
      x: 680,
      y: 45,
      stream: 'Invoices, payroll & billing events',
      detail: 'Reconciles payment schedules and vendor invoices locally on Mac with zero cloud token exposure.',
    },
  ];

  // Meridius Brain Target at the Bottom
  const brainCx = 400;
  const brainCy = 350;

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
            Inflowing Stream Active
          </span>
          <span>·</span>
          <span>Local Mac Keychain Auth</span>
        </div>
      </div>

      {/* SVG Canvas with Soft Curvy Converging Conduits */}
      <div className="relative w-full aspect-[800/440] max-w-4xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Glowing filter */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Ambient Radial Gradient at Bottom Brain */}
            <radialGradient id="brainField" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient Brain Glow Field at Bottom */}
          <circle cx={brainCx} cy={brainCy} r="150" fill="url(#brainField)" />

          {/* Concentric Synthesis Rings around Meridius Brain */}
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
          {/* SOFT CURVY CONVERGING CONDUITS (TOP SOURCES -> BOTTOM BRAIN) */}
          {/* ============================================================ */}
          {sources.map((src) => {
            const isCurrent = activeSource === src.id;
            const sourceBottomY = src.y + 35;
            const targetY = brainCy - 40;

            // Soft S-curve Bézier control points
            const ctrlX1 = src.x;
            const ctrlY1 = sourceBottomY + 110;
            const ctrlX2 = brainCx + (src.x - brainCx) * 0.15;
            const ctrlY2 = targetY - 70;

            const pathD = `M ${src.x} ${sourceBottomY} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${brainCx} ${targetY}`;

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
                  filter="url(#softGlow)"
                />

                {/* Flowing Data Energy Packet traveling downward */}
                <circle r="4" fill="#10b981" filter="url(#softGlow)">
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
          {/* TOP TIER: 4 DISTRIBUTED INFORMATION SOURCES */}
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
                {/* Source Box */}
                <rect
                  x={src.x - 75}
                  y={src.y - 25}
                  width="150"
                  height="60"
                  rx="14"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500/15" : "text-white dark:text-void"}
                  stroke={isCurrent ? "#10b981" : "currentColor"}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                />

                {/* Status Dot */}
                <circle
                  cx={src.x - 55}
                  cy={src.y - 4}
                  r="4"
                  fill={isCurrent ? "#10b981" : "currentColor"}
                  className={isCurrent ? "" : "text-charcoal-dim dark:text-cream-dim"}
                />

                {/* Source Title & Subtitle */}
                <text
                  x={src.x - 42}
                  y={src.y}
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[11.5px]"
                >
                  {src.title}
                </text>
                <text
                  x={src.x}
                  y={src.y + 18}
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[8.5px]"
                >
                  {src.tools}
                </text>

                {/* Bottom Source Output Port */}
                <circle cx={src.x} cy={src.y + 35} r="3.5" fill={isCurrent ? "#10b981" : "currentColor"} className="text-charcoal-dim dark:text-cream-dim" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* BOTTOM TIER: CENTRAL MERIDIUS COMPANY BRAIN */}
          {/* ============================================================ */}
          <g className="cursor-pointer">
            {/* Outer Pulsing Aura */}
            <rect
              x="250"
              y={brainCy - 35}
              width="300"
              height="70"
              rx="20"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.6"
            >
              <animate
                attributeName="opacity"
                values="0.3;0.8;0.3"
                dur="3s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Core Brain Container */}
            <rect
              x="250"
              y={brainCy - 35}
              width="300"
              height="70"
              rx="20"
              fill="currentColor"
              className="text-white dark:text-void"
              stroke="currentColor"
              strokeWidth="2"
            />

            {/* Brain Central Logo Mark */}
            <circle cx="295" cy={brainCy} r="18" fill="currentColor" className="text-charcoal dark:text-cream" />
            <text x="295" y={brainCy + 5} textAnchor="middle" className="fill-cream dark:fill-charcoal font-brand font-extrabold text-[14px]">
              M
            </text>

            {/* Brain Labels */}
            <text x="328" y={brainCy - 5} className="fill-charcoal dark:fill-cream font-display font-semibold text-[14px]">
              Meridius Company Brain
            </text>
            <text x="328" y={brainCy + 14} className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[9.5px] font-semibold">
              ● Continuously Acquiring & Synthesizing Context
            </text>

            {/* Top Inflow Port */}
            <circle cx={brainCx} cy={brainCy - 35} r="4.5" fill="#10b981" filter="url(#softGlow)" />
          </g>

        </svg>
      </div>

      {/* Interactive Context Inspector Bar */}
      <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
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
