import React, { useState, useEffect } from 'react';
import { GitBranch, CheckCircle2 } from 'lucide-react';

export const DynamicCompanyBrainArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [activeBranch, setActiveBranch] = useState<number>(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const branches = [
    {
      id: 0,
      title: 'Engineering',
      app: 'VS Code & Terminal',
      x: 110,
      subTask: 'CI/CD & Git Sync',
      detail: 'Syncing local repo commits & test logs without cloud repo write access.',
      status: 'Active · 4 files synced',
    },
    {
      id: 1,
      title: 'Product & Design',
      app: 'Figma & Linear',
      x: 300,
      subTask: 'Roadmap Synthesis',
      detail: 'Synthesizing feature specs with live Figma canvas components.',
      status: 'Active · 12 specs mapped',
    },
    {
      id: 2,
      title: 'Growth & Sales',
      app: 'HubSpot & Analytics',
      x: 500,
      subTask: 'Pipeline Enrichment',
      detail: 'Autonomous lead qualification & CRM updates in local browser sessions.',
      status: 'Active · 28 leads updated',
    },
    {
      id: 3,
      title: 'Operations & Finance',
      app: 'Stripe & QuickBooks',
      x: 690,
      subTask: 'Invoice Reconciliation',
      detail: 'Matching bank deposits with pending invoices via local desktop sessions.',
      status: 'Active · 100% balanced',
    },
  ];

  return (
    <div className={`w-full rounded-3xl frosted-glass p-6 sm:p-8 border border-charcoal/[0.12] dark:border-cream/[0.12] overflow-hidden relative ${className}`}>
      
      {/* Header Telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono gap-2">
        <div className="flex items-center gap-2 text-charcoal dark:text-cream font-semibold">
          <GitBranch className="w-4 h-4 text-emerald-500" />
          <span>STRUCTURED SYNC TOPOLOGY · HIERARCHICAL TREE</span>
        </div>
        <div className="flex items-center gap-3 text-charcoal-muted dark:text-cream-dim text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            4 Federated Branches
          </span>
          <span>·</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Zero Centralized Secrets</span>
        </div>
      </div>

      {/* SVG Structured Tree Architecture Diagram */}
      <div className="relative w-full aspect-[800/440] max-w-4xl mx-auto flex items-center justify-center my-2">
        <svg
          viewBox="0 0 800 440"
          className="w-full h-full overflow-visible select-none"
        >
          <defs>
            {/* Glowing filter */}
            <filter id="treeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ============================================================ */}
          {/* TREE CONDUIT PATHS (ORTHOGONAL BUS ARCHITECTURE) */}
          {/* ============================================================ */}
          
          {/* Central Trunk Drop from Root */}
          <line
            x1="400"
            y1="75"
            x2="400"
            y2="135"
            stroke="currentColor"
            className="text-charcoal/[0.15] dark:text-cream/[0.15]"
            strokeWidth="2"
          />

          {/* Horizontal Distribution Bus */}
          <line
            x1="110"
            y1="135"
            x2="690"
            y2="135"
            stroke="currentColor"
            className="text-charcoal/[0.15] dark:text-cream/[0.15]"
            strokeWidth="2"
          />

          {/* Vertical Branch Drops & Sub-Drops */}
          {branches.map((b) => {
            const isCurrent = activeBranch === b.id;
            const fullPathD = `M 400 75 L 400 135 L ${b.x} 135 L ${b.x} 190 L ${b.x} 265 L ${b.x} 320`;

            return (
              <g key={b.id}>
                {/* Branch vertical drop to middle node */}
                <line
                  x1={b.x}
                  y1="135"
                  x2={b.x}
                  y2="190"
                  stroke="currentColor"
                  className={isCurrent ? "text-emerald-500/50" : "text-charcoal/[0.15] dark:text-cream/[0.15]"}
                  strokeWidth="2"
                />

                {/* Branch vertical drop to sub-node */}
                <line
                  x1={b.x}
                  y1="245"
                  x2={b.x}
                  y2="320"
                  stroke="currentColor"
                  className={isCurrent ? "text-emerald-500/50" : "text-charcoal/[0.15] dark:text-cream/[0.15]"}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Animated Light Pulse along this branch's path */}
                <path
                  d={fullPathD}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={isCurrent ? "2.5" : "1.5"}
                  strokeDasharray="8 24"
                  strokeDashoffset={-tick * 2}
                  opacity={isCurrent ? "0.9" : "0.35"}
                  filter="url(#treeGlow)"
                />

                {/* Flowing Energy Packet */}
                <circle r="3.5" fill="#10b981" filter="url(#treeGlow)">
                  <animateMotion
                    path={fullPathD}
                    dur={`${2.2 + b.id * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* LEVEL 1: ROOT NODE (SHARED COMPANY BRAIN) */}
          {/* ============================================================ */}
          <g className="cursor-pointer">
            {/* Root Outer Pill */}
            <rect
              x="270"
              y="20"
              width="260"
              height="55"
              rx="16"
              fill="currentColor"
              className="text-white dark:text-void"
              stroke="currentColor"
              strokeWidth="2"
            />
            <rect
              x="270"
              y="20"
              width="260"
              height="55"
              rx="16"
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
              strokeDasharray="6 6"
              opacity="0.6"
            />

            {/* Root Icon */}
            <circle cx="305" cy="47.5" r="16" fill="currentColor" className="text-charcoal dark:text-cream" />
            <text x="305" y="52" textAnchor="middle" className="fill-cream dark:fill-charcoal font-brand font-extrabold text-[12px]">
              M
            </text>

            {/* Root Title */}
            <text x="335" y="42" className="fill-charcoal dark:fill-cream font-display font-semibold text-[13px]">
              Shared Company Brain
            </text>
            <text x="335" y="58" className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9.5px]">
              Central Autonomous Context Mesh
            </text>

            {/* Port indicator */}
            <circle cx="400" cy="75" r="4" fill="#10b981" />
          </g>

          {/* ============================================================ */}
          {/* LEVEL 2: DEPARTMENT BRANCHES */}
          {/* ============================================================ */}
          {branches.map((b) => {
            const isCurrent = activeBranch === b.id;
            return (
              <g
                key={`tier2-${b.id}`}
                className="cursor-pointer transition-all duration-200"
                onClick={() => setActiveBranch(b.id)}
                onMouseEnter={() => setActiveBranch(b.id)}
              >
                {/* Node Box */}
                <rect
                  x={b.x - 80}
                  y="190"
                  width="160"
                  height="55"
                  rx="14"
                  fill="currentColor"
                  className={isCurrent ? "text-emerald-500/10" : "text-white dark:text-void"}
                  stroke={isCurrent ? "#10b981" : "currentColor"}
                  strokeWidth={isCurrent ? "2" : "1.5"}
                />

                {/* Node Text */}
                <text
                  x={b.x}
                  y="213"
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-display font-semibold text-[11.5px]"
                >
                  {b.title}
                </text>
                <text
                  x={b.x}
                  y="230"
                  textAnchor="middle"
                  className="fill-charcoal-muted dark:fill-cream-dim font-mono text-[9px]"
                >
                  {b.app}
                </text>

                {/* Top and Bottom Ports */}
                <circle cx={b.x} cy="190" r="3.5" fill={isCurrent ? "#10b981" : "currentColor"} className="text-charcoal-dim dark:text-cream-dim" />
                <circle cx={b.x} cy="245" r="3.5" fill={isCurrent ? "#10b981" : "currentColor"} className="text-charcoal-dim dark:text-cream-dim" />
              </g>
            );
          })}

          {/* ============================================================ */}
          {/* LEVEL 3: LOCAL SUB-AGENT TASKS */}
          {/* ============================================================ */}
          {branches.map((b) => {
            const isCurrent = activeBranch === b.id;
            return (
              <g
                key={`tier3-${b.id}`}
                className="cursor-pointer"
                onClick={() => setActiveBranch(b.id)}
                onMouseEnter={() => setActiveBranch(b.id)}
              >
                {/* Sub-node Box */}
                <rect
                  x={b.x - 75}
                  y="320"
                  width="150"
                  height="48"
                  rx="10"
                  fill="currentColor"
                  className={isCurrent ? "text-charcoal/[0.05] dark:text-cream/[0.08]" : "text-white/60 dark:text-white/[0.02]"}
                  stroke={isCurrent ? "#10b981" : "currentColor"}
                  strokeWidth="1"
                  strokeDasharray={isCurrent ? "none" : "3 3"}
                />

                {/* Sub-node Text */}
                <text
                  x={b.x}
                  y="341"
                  textAnchor="middle"
                  className="fill-charcoal dark:fill-cream font-mono font-medium text-[10px]"
                >
                  {b.subTask}
                </text>
                <text
                  x={b.x}
                  y="355"
                  textAnchor="middle"
                  className="fill-emerald-600 dark:fill-emerald-400 font-mono text-[8.5px]"
                >
                  ● Local Native Agent
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Branch Inspection Footer */}
      <div className="mt-4 p-4 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0">
            0{branches[activeBranch].id + 1}
          </div>
          <div>
            <div className="font-display font-semibold text-xs sm:text-sm text-charcoal dark:text-cream">
              {branches[activeBranch].title} Branch · <span className="font-mono text-xs text-charcoal-muted dark:text-cream-dim">{branches[activeBranch].app}</span>
            </div>
            <div className="text-xs text-charcoal-muted dark:text-cream-muted font-sans mt-0.5 max-w-xl">
              {branches[activeBranch].detail}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shrink-0 self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-500/10">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{branches[activeBranch].status}</span>
        </div>
      </div>

    </div>
  );
};
