import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisonData = [
    {
      feature: 'Zero Window & Focus Interruptions',
      desc: 'Never forces background apps on top of your active screen while you work',
      meridius: { val: 'Guaranteed', ok: true },
      codex: { val: 'Often pops to foreground', ok: false },
      claude: { val: 'Takes over entire display', ok: false },
      coasty: { val: 'Isolated in Cloud VM', ok: 'neutral' },
    },
    {
      feature: 'Cursor Stays 100% Free',
      desc: 'Your mouse pointer is never hijacked or disabled during task execution',
      meridius: { val: 'Always Free', ok: true },
      codex: { val: 'Free, but focus breaks', ok: 'neutral' },
      claude: { val: 'Hijacked completely', ok: false },
      coasty: { val: 'N/A (Cloud VM)', ok: 'neutral' },
    },
    {
      feature: 'Real Logins & Native Mac Apps',
      desc: 'Works directly with your actual installed apps, sessions, and Keychain',
      meridius: { val: 'Native & Logged-in', ok: true },
      codex: { val: 'Native & Logged-in', ok: true },
      claude: { val: 'Native & Logged-in', ok: true },
      coasty: { val: 'Disconnected Fresh VM', ok: false },
    },
    {
      feature: 'Private Local Model Support',
      desc: 'Option to run offline with Ollama/LM Studio without streaming visual data to cloud',
      meridius: { val: 'Local + Cloud', ok: true },
      codex: { val: 'ChatGPT Only', ok: false },
      claude: { val: 'Anthropic Only', ok: false },
      coasty: { val: 'Cloud Loop Only', ok: false },
    },
    {
      feature: 'Execution Speed & Token Efficiency',
      desc: 'Precise direct action without burning massive tokens on constant screenshots',
      meridius: { val: 'Fast & Token Efficient', ok: true },
      codex: { val: 'Standard', ok: 'neutral' },
      claude: { val: 'Heavy visual loop', ok: false },
      coasty: { val: 'High token burn on screenshots', ok: false },
    },
  ];

  return (
    <section id="comparison" className="py-16 sm:py-24 border-t border-charcoal/[0.08] dark:border-cream/[0.08] bg-cream dark:bg-void transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <div className="text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider mb-2">
            Comparison
          </div>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl md:text-4xl text-charcoal dark:text-cream tracking-tight mb-3 sm:mb-4">
            How Meridius compares.
          </h2>
          <p className="text-charcoal-muted dark:text-cream-muted text-sm sm:text-base leading-relaxed">
            Existing computer-use tools solve one piece and break another. Meridius delivers true parallel execution on your real Mac.
          </p>
        </div>

        {/* Responsive Comparison Table */}
        <div className="overflow-x-auto rounded-2xl frosted-glass border border-charcoal/[0.08] dark:border-cream/[0.08] shadow-sm mb-8">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-charcoal/[0.08] dark:border-cream/[0.08] bg-white/40 dark:bg-white/[0.02]">
                <th className="py-4 px-6 text-xs font-mono text-charcoal-muted dark:text-cream-dim uppercase tracking-wider w-[36%]">
                  Capability / Outcome
                </th>
                <th className="py-4 px-6 text-xs font-mono font-semibold text-charcoal dark:text-cream tracking-wider w-[22%] bg-charcoal/[0.03] dark:bg-cream/[0.03]">
                  Meridius
                </th>
                <th className="py-4 px-5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[14%]">
                  Codex
                </th>
                <th className="py-4 px-5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[14%]">
                  Claude Cowork
                </th>
                <th className="py-4 px-5 text-xs font-mono text-charcoal-muted dark:text-cream-dim tracking-wider w-[14%]">
                  Coasty AI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/[0.06] dark:divide-cream/[0.06] text-xs sm:text-sm font-sans">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/30 dark:hover:bg-white/[0.01] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-charcoal dark:text-cream mb-0.5 font-display">
                      {row.feature}
                    </div>
                    <div className="text-xs text-charcoal-muted dark:text-cream-dim leading-relaxed">
                      {row.desc}
                    </div>
                  </td>

                  {/* Meridius Column */}
                  <td className="py-4 px-6 bg-charcoal/[0.03] dark:bg-cream/[0.03]">
                    <div className="inline-flex items-center gap-1.5 font-semibold text-charcoal dark:text-cream">
                      <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{row.meridius.val}</span>
                    </div>
                  </td>

                  {/* Codex */}
                  <td className="py-4 px-5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1.5">
                      {row.codex.ok === true ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : row.codex.ok === false ? (
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span>{row.codex.val}</span>
                    </div>
                  </td>

                  {/* Claude */}
                  <td className="py-4 px-5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1.5">
                      {row.claude.ok === true ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      )}
                      <span>{row.claude.val}</span>
                    </div>
                  </td>

                  {/* Coasty */}
                  <td className="py-4 px-5 text-charcoal-muted dark:text-cream-muted">
                    <div className="flex items-center gap-1.5">
                      {row.coasty.ok === true ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      ) : row.coasty.ok === false ? (
                        <X className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span>{row.coasty.val}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Quick Summary Banner */}
        <div className="p-6 rounded-2xl frosted-glass border border-charcoal/20 dark:border-cream/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-semibold text-base text-charcoal dark:text-cream mb-1">
              The only tool that keeps both your screen free and your real logins intact.
            </h4>
            <p className="text-xs sm:text-sm text-charcoal-muted dark:text-cream-muted font-sans">
              No watching cursors move, no unexpected window popups, and no cloud VM compromises.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
