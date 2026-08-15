import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Zero Window Popups',
      meridius: { val: 'Guaranteed', ok: true },
      codex: { val: 'Pops into focus', ok: false },
      claude: { val: 'Full takeover', ok: false },
      coasty: { val: 'Cloud VM only', ok: 'neutral' },
      openwork: { val: 'Takes over screen', ok: false },
      hermes: { val: 'Focus collision', ok: false },
    },
    {
      feature: 'Cursor Stays 100% Free',
      meridius: { val: 'Always Free', ok: true },
      codex: { val: 'Focus breaks', ok: 'neutral' },
      claude: { val: 'Hijacked', ok: false },
      coasty: { val: 'Isolated VM', ok: 'neutral' },
      openwork: { val: 'Hijacked', ok: false },
      hermes: { val: 'Free', ok: true },
    },
    {
      feature: 'Real Logins & Native Apps',
      meridius: { val: 'Your Mac Apps', ok: true },
      codex: { val: 'Your Mac Apps', ok: true },
      claude: { val: 'Your Mac Apps', ok: true },
      coasty: { val: 'Fresh Cloud VM', ok: false },
      openwork: { val: 'Isolated Browser', ok: false },
      hermes: { val: 'Your Mac Apps', ok: true },
    },
    {
      feature: 'Local Privacy & Model Choice',
      meridius: { val: 'Local + Cloud', ok: true },
      codex: { val: 'ChatGPT Only', ok: false },
      claude: { val: 'Anthropic Only', ok: false },
      coasty: { val: 'Cloud Only', ok: false },
      openwork: { val: 'Cloud Only', ok: false },
      hermes: { val: 'Cloud API', ok: false },
    },
    {
      feature: 'Speed & Token Efficiency',
      meridius: { val: 'High Efficiency', ok: true },
      codex: { val: 'Standard', ok: 'neutral' },
      claude: { val: 'Heavy visual loop', ok: false },
      coasty: { val: 'High token burn', ok: false },
      openwork: { val: 'Heavy visual loop', ok: false },
      hermes: { val: 'Standard', ok: 'neutral' },
    },
  ];

  return (
    <section id="comparison" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header (OpenWork-style, concise) */}
        <div className="max-w-2xl mb-8 sm:mb-10">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Comparison · Open Ecosystem
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3">
            How Meridius compares.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Parallel desktop execution on your actual Mac without window takeovers or cloud VM compromises.
          </p>
        </div>

        {/* Concise Responsive Comparison Table */}
        <div className="overflow-x-auto rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] shadow-sm mb-6">
          <table className="w-full text-left border-collapse min-w-[780px]">
            <thead>
              <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-white/40 dark:bg-white/[0.02]">
                <th className="py-3.5 px-5 text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider w-[24%]">
                  Capability
                </th>
                <th className="py-3.5 px-4 text-xs font-mono font-semibold text-charcoal dark:text-cream tracking-wider w-[16%] bg-charcoal/[0.03] dark:bg-cream/[0.03]">
                  Meridius
                </th>
                <th className="py-3.5 px-3.5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[12%]">
                  Codex
                </th>
                <th className="py-3.5 px-3.5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[12%]">
                  Claude Cowork
                </th>
                <th className="py-3.5 px-3.5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[12%]">
                  Coasty
                </th>
                <th className="py-3.5 px-3.5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[12%]">
                  OpenWork
                </th>
                <th className="py-3.5 px-3.5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[12%]">
                  Hermes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06] text-xs font-sans">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-charcoal dark:text-cream font-display">
                    {row.feature}
                  </td>

                  {/* Meridius Column */}
                  <td className="py-3.5 px-4 bg-charcoal/[0.03] dark:bg-cream/[0.03]">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-charcoal dark:text-cream">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{row.meridius.val}</span>
                    </div>
                  </td>

                  {/* Codex */}
                  <td className="py-3.5 px-3.5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1">
                      {renderIcon(row.codex.ok)}
                      <span className="truncate">{row.codex.val}</span>
                    </div>
                  </td>

                  {/* Claude */}
                  <td className="py-3.5 px-3.5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1">
                      {renderIcon(row.claude.ok)}
                      <span className="truncate">{row.claude.val}</span>
                    </div>
                  </td>

                  {/* Coasty */}
                  <td className="py-3.5 px-3.5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1">
                      {renderIcon(row.coasty.ok)}
                      <span className="truncate">{row.coasty.val}</span>
                    </div>
                  </td>

                  {/* OpenWork */}
                  <td className="py-3.5 px-3.5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1">
                      {renderIcon(row.openwork.ok)}
                      <span className="truncate">{row.openwork.val}</span>
                    </div>
                  </td>

                  {/* Hermes */}
                  <td className="py-3.5 px-3.5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1">
                      {renderIcon(row.hermes.ok)}
                      <span className="truncate">{row.hermes.val}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

function renderIcon(ok: boolean | string) {
  if (ok === true) {
    return <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
  }
  if (ok === false) {
    return <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />;
  }
  return <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
}
