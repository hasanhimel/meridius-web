import React, { useState, useEffect } from 'react';

export const DynamicCompanyBrainArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeNode, setActiveNode] = useState<number>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const nodes = [
    {
      id: 0,
      title: 'Engineering Node',
      subtitle: 'Local Terminal & IDE',
      role: 'Codebase & CI/CD',
      cx: 140,
      cy: 90,
      packet: 'Syncing PR #142 context...',
    },
    {
      id: 1,
      title: 'Product & Design Node',
      subtitle: 'Figma & Linear',
      role: 'Spec & Roadmap',
      cx: 560,
      cy: 90,
      packet: 'Merging user feedback loops...',
    },
    {
      id: 2,
      title: 'Growth & Ops Node',
      subtitle: 'Stripe & HubSpot',
      role: 'CRM & Pipeline',
      cx: 140,
      cy: 310,
      packet: 'Reconciling billing anomalies...',
    },
    {
      id: 3,
      title: 'Leadership Node',
      subtitle: 'Notes & Strategy',
      role: 'Company Directives',
      cx: 560,
      cy: 310,
      packet: 'Distributing quarterly goals...',
    },
  ];

  // Center Coordinates
  const brainCx = 350;
  const brainCy = 200;

  return (
    <div className={`w-full rounded-3xl frosted-glass p-6 sm:p-8 border border-charcoal/[0.12] dark:border-cream/[0.12] overflow-hidden relative ${className}`}>
      
      {/* Top Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono gap-2">
        <div className="flex items-center gap-2 text-charcoal dark:text-cream font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>MERIDIUS SYNC MESH · LIVE TOPOLOGY</span>
        </div>
        <div className="flex items-center gap-4 text-charcoal-muted dark:text-cream-dim text-[11px]">
          <span>4 Connected Nodes</span>
          <span>·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">0 Cloud Credentials Exposed</span>
        </div>
      </div>

      {/* SVG Interactive Canvas */}
      <div className="relative w-full aspect-[700/400] max-w-3xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 700 400"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>

            <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </radialGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Glow Field */}
          <circle cx={brainCx} cy={brainCy} r="140" fill="url(#brainGlow)" />

          {/* Concentric Rotating Orbital Rings */}
          <circle
            cx={brainCx}
            cy={brainCy}
            r="80"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.08] dark:text-cream/[0.08]"
            strokeWidth="1"
            strokeDasharray="4 6"
          />
          <circle
            cx={brainCx}
            cy={brainCy}
            r="115"
            fill="none"
            stroke="currentColor"
            className="text-charcoal/[0.05] dark:text-cream/[0.05]"
            strokeWidth="1"
            strokeDasharray="8 8"
          />

          {/* Dynamic Animated Connecting Conduits */}
          {nodes.map((node) => {
            // Cubic bezier control points
            const isLeft = node.cx < brainCx;
            const ctrlX1 = isLeft ? node.cx + 90 : node.cx - 90;
            const ctrlY1 = node.cy;
            const ctrlX2 = isLeft ? brainCx - 70 : brainCx + 70;
            const ctrlY2 = brainCy;
            const pathD = `M ${node.cx} ${node.cy} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${brainCx} ${brainCy}`;

            const isCurrent = activeNode === node.id;

            return (
              <g key={node.id}>
                {/* Background Track Line */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="currentColor"
                  className={isCurrent ? "text-emerald-500/40 dark:text-emerald-400/40" : "text-charcoal/[0.12] dark:text-cream/[0.12]"}
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                />

                {/* Animated Light Pulse Stream */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="10 30"
                  strokeDashoffset={-tick * 2}
                  opacity={isCurrent ? "0.9" : "0.4"}
                  filter="url(#glow)"
                />

                {/* Animated Energy Particle Traveling On Path */}
                <circle r="4" fill="#10b981" filter="url(#glow)">
                  <animateMotion
                    path={pathD}
                    dur={`${2.4 + node.id * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* CENTRAL COMPANY BRAIN NUCLEUS */}
          {/* ============================================================ */}
          <g className="cursor-pointer">
            {/* Outer Pulsing Ring */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r="48"
              fill="currentColor"
              className="text-emerald-500/10"
            >
              <animate
                attributeName="r"
                values="46;52;46"
                dur="3s"
                repeatCount="indefinite"
              />
            </circle>

            {/* Core Brain Hexagon / Circle */}
            <circle
              cx={brainCx}
              cy={brainCy}
              r="38"
              fill="currentColor"
              className="text-charcoal dark:text-cream"
              filter="url(#glow)"
            />

            {/* Core Logo Mark / Brain Icon */}
            <text
              x={brainCx}
              y={brainCy - 4}
              textAnchor="middle"
              className="fill-cream dark:fill-charcoal font-brand font-extrabold text-[15px] select-none"
            >
              M
            </text>
            <text
              x={brainCx}
              y={brainCy + 12}
              textAnchor="middle"
              className="fill-cream/80 dark:fill-charcoal/80 font-mono text-[8px] font-semibold tracking-wider select-none"
            >
              BRAIN
            </text>
          </g>

          {/* ============================================================ */}
          {/* 4 PERIPHERAL TEAM AGENT NODES */}
          {/* ============================================================ */}
          {nodes.map((node) => {
            const isCurrent = activeNode === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer transition-transform hover:scale-105"
                onMouseEnter={() => setActiveNode(node.id)}
              >
                {/* Node Outer Halo on active */}
                {isCurrent && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="34"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                )}

                {/* Node Outer Circle */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="26"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500/20" : "text-white dark:text-void"}
                  stroke="currentColor"
                  strokeWidth="2"
                />

                {/* Node Center Dot */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r="10"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500" : "text-charcoal dark:text-cream"}
                />

                {/* Node Labels */}
                <text
                  x={node.cx}
                  y={node.cy > brainCy ? node.cy + 42 : node.cy - 34}
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[11px]"
                >
                  {node.title}
                </text>
                <text
                  x={node.cx}
                  y={node.cy > brainCy ? node.cy + 55 : node.cy - 21}
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9px]"
                >
                  {node.subtitle}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Live Node Context Card */}
      <div className="mt-4 p-4 rounded-2xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
            0{nodes[activeNode].id + 1}
          </div>
          <div>
            <div className="font-display font-semibold text-xs sm:text-sm text-charcoal dark:text-cream">
              {nodes[activeNode].title} · <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">{nodes[activeNode].role}</span>
            </div>
            <div className="text-xs text-charcoal-muted dark:text-cream-dim font-mono mt-0.5">
              Live Activity: <span className="text-charcoal dark:text-cream">{nodes[activeNode].packet}</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-charcoal-muted dark:text-cream-dim flex items-center gap-1.5 self-start sm:self-auto shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Local Mac Keychain Auth</span>
        </div>
      </div>

    </div>
  );
};
