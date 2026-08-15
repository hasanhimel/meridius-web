import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export const ParallelExecutionSvg: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % 3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const agentSteps = [
    { title: 'Navigating to Stripe Dashboard', time: '1.2s', status: 'Complete' },
    { title: 'Extracting Q3 unpaid enterprise invoices', time: '2.8s', status: 'In progress' },
    { title: 'Drafting follow-ups in local Mail client', time: 'queued', status: 'Queued' },
  ];

  return (
    <div className={`w-full rounded-3xl frosted-glass p-6 sm:p-8 border border-charcoal/[0.12] dark:border-cream/[0.12] overflow-hidden ${className}`}>
      
      {/* Telemetry Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-charcoal/[0.08] dark:border-cream/[0.08] text-xs font-mono text-charcoal-muted dark:text-cream-dim">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
          </div>
          <span className="ml-2 font-semibold text-charcoal dark:text-cream font-mono">macOS Autonomous Execution Space</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Zero Focus Interruption</span>
        </div>
      </div>

      {/* Dual Side-by-Side Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* LEFT: Your Uninterrupted Active Screen */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.08] dark:border-cream/[0.08] relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[8px] font-bold">●</div>
              <span className="text-xs font-mono font-semibold text-charcoal dark:text-cream">Your Active Screen</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-charcoal/[0.05] dark:bg-cream/[0.05] text-charcoal-muted dark:text-cream-dim">
              Mouse Free
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-charcoal/[0.03] dark:bg-cream/[0.03] border border-charcoal/[0.04] dark:border-cream/[0.04]">
              <div className="text-[11px] text-charcoal-dim dark:text-cream-dim mb-1 flex items-center justify-between">
                <span>VS Code · main.tsx</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active typing</span>
              </div>
              <div className="text-charcoal dark:text-cream font-mono text-[11px] flex items-center">
                <span>const [uninterrupted, setFlow] = useState(true);</span>
                <span className="w-1.5 h-3.5 bg-emerald-500 ml-1 animate-pulse" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-charcoal/[0.03] dark:bg-cream/[0.03] border border-charcoal/[0.04] dark:border-cream/[0.04] flex items-center justify-between text-charcoal-muted dark:text-cream-muted">
              <span>Zoom Meeting / Figma Design</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Zero popups</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Meridius Background Computer Use */}
        <div className="p-5 rounded-2xl bg-white/70 dark:bg-white/[0.03] border border-charcoal/[0.14] dark:border-cream/[0.14] relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono font-semibold text-charcoal dark:text-cream">Meridius Agent</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              Step {step + 1} of 3
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {agentSteps.map((s, idx) => {
              const isActive = step === idx;
              const isPast = step > idx;
              return (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? 'bg-charcoal/[0.06] dark:bg-cream/[0.08] border border-emerald-500/30'
                      : 'bg-charcoal/[0.02] dark:bg-cream/[0.02] opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isPast ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : isActive ? (
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-charcoal/20 dark:bg-cream/20 shrink-0" />
                    )}
                    <span className="truncate text-charcoal dark:text-cream">{s.title}</span>
                  </div>
                  <span className="text-[10px] text-charcoal-muted dark:text-cream-dim shrink-0 ml-2">
                    {s.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Sub-bar */}
      <div className="mt-5 pt-4 border-t border-charcoal/[0.08] dark:border-cream/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-charcoal-muted dark:text-cream-dim">
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Local Mac Keychain Auth · No Cloud VM Isolation</span>
        </div>
        <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
          100% Native Desktop Speed
        </div>
      </div>

    </div>
  );
};
