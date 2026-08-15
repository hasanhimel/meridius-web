import React from 'react';

export const ParallelExecutionSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl frosted-glass p-5 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono text-charcoal-muted dark:text-cream-dim">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 font-semibold text-charcoal dark:text-cream">macOS Parallel Workflows</span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
          Active · Uninterrupted
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Your Work Panel */}
        <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-charcoal dark:text-cream">Your Active Screen</span>
            <span className="text-[10px] font-mono text-charcoal-muted dark:text-cream-dim">Cursor 100% Free</span>
          </div>
          <div className="space-y-2 text-xs text-charcoal-muted dark:text-cream-muted font-mono">
            <div className="p-2 rounded-lg bg-charcoal/[0.04] dark:bg-cream/[0.04] flex items-center justify-between">
              <span>Writing code in VS Code</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="p-2 rounded-lg bg-charcoal/[0.04] dark:bg-cream/[0.04] flex items-center justify-between">
              <span>Figma Design & Browser</span>
              <span className="text-charcoal-dim dark:text-cream-dim">Focused</span>
            </div>
          </div>
        </div>

        {/* Meridius Execution Panel */}
        <div className="p-4 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.12] dark:border-cream/[0.12] relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-semibold text-charcoal dark:text-cream">Meridius Agent</span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Autonomous</span>
          </div>
          <div className="space-y-2 text-xs text-charcoal-muted dark:text-cream-muted font-mono">
            <div className="p-2 rounded-lg bg-charcoal/[0.04] dark:bg-cream/[0.04] flex items-center justify-between">
              <span className="truncate">Extracting Stripe invoicing data</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Step 4/5</span>
            </div>
            <div className="p-2 rounded-lg bg-charcoal/[0.04] dark:bg-cream/[0.04] flex items-center justify-between">
              <span className="truncate">Updating HubSpot CRM deals</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Done</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CompanyBrainSyncSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full rounded-2xl frosted-glass p-6 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between pb-3 mb-6 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono text-charcoal-muted dark:text-cream-dim">
        <span className="font-semibold text-charcoal dark:text-cream">Meridius Sync · Multiplayer Mesh</span>
        <span className="px-2 py-0.5 rounded-full bg-charcoal/10 dark:bg-cream/10 text-charcoal dark:text-cream">
          Distributed Brain
        </span>
      </div>

      <div className="relative py-4 flex flex-col items-center justify-center">
        {/* Central Company Brain Node */}
        <div className="relative z-10 p-4 sm:p-5 rounded-2xl frosted-glass border border-charcoal/30 dark:border-cream/30 shadow-lg text-center max-w-xs mb-8">
          <div className="w-8 h-8 rounded-full bg-charcoal dark:bg-cream text-cream dark:text-charcoal mx-auto flex items-center justify-center font-bold text-xs mb-2">
            M
          </div>
          <div className="font-display font-semibold text-sm text-charcoal dark:text-cream">
            Shared Company Brain
          </div>
          <div className="text-[11px] text-charcoal-muted dark:text-cream-dim mt-0.5">
            Unified project state & autonomous coordination
          </div>
        </div>

        {/* 3 Teammate Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-center">
          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <div className="font-display font-semibold text-xs text-charcoal dark:text-cream">Engineering</div>
            <div className="text-[10px] font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Local Native Instance</div>
          </div>

          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <div className="font-display font-semibold text-xs text-charcoal dark:text-cream">Product & Ops</div>
            <div className="text-[10px] font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Local Native Instance</div>
          </div>

          <div className="p-3 rounded-xl bg-white/60 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08]">
            <div className="font-display font-semibold text-xs text-charcoal dark:text-cream">Growth & Sales</div>
            <div className="text-[10px] font-mono text-charcoal-muted dark:text-cream-dim mt-0.5">Local Native Instance</div>
          </div>
        </div>
      </div>
    </div>
  );
};
